import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { DragDropContext } from 'react-beautiful-dnd';
import axios from 'axios';
import useApi from 'shared/hooks/api';
import useCurrentUser from 'shared/hooks/currentUser';
import { getStoredAuthToken } from 'shared/utils/authToken';
import { IssueStatus, IssueStatusToName } from 'shared/constants/issues';
import List from './List';
import { Lists } from './Styles';
import toast from 'shared/utils/toast';

const ProjectBoardLists = ({ project, filters, updateLocalProjectIssues, moveIssueInList, moveIssuesInColumn, showOnlyDone}) => {
  const { currentUserId } = useCurrentUser();
  const [selectedIssueIds, setSelectedIssueIds] = useState(new Set());
  const [hiddenIssueIds, setHiddenIssueIds] = useState(new Set());
  const [draggingSourceStatus, setDraggingSourceStatus] = useState(null);

  const handleIssueSelect = (issueId, multi) => {
    setSelectedIssueIds(prev => {
      const newSet = new Set(prev);
      if (multi) {
        if (newSet.has(issueId)) newSet.delete(issueId);
        else newSet.add(issueId);
      } else {
        newSet.clear();
        newSet.add(issueId);
      }
      return newSet;
    });
  };

  const handleIssueDrop = useCallback(async (result, currentHidden) => {
    const { draggableId, destination, source } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const issueId = Number(draggableId);
    const sourceStatusKey = source.droppableId;
    const destStatusKey = destination.droppableId;

    // --- Перемещение внутри одной колонки ---
    if (sourceStatusKey === destStatusKey) {
      const isMulti = selectedIssueIds.size > 1 && selectedIssueIds.has(issueId);

      if (!isMulti) {
        moveIssueInList(sourceStatusKey, source.index, destination.index);
        return;
      }

      // МУЛЬТИ-ПЕРЕМЕЩЕНИЕ
      const allColIssues = project.issues.filter(i => i.statusKey === sourceStatusKey);

      // ID выбранных задач, которые находятся в этой колонке
      const movingIds = new Set(
        Array.from(selectedIssueIds).filter(id => allColIssues.some(i => i.id === id))
      );

      // Задачи, которые остаются на месте (не выделены)
      const staticItems = allColIssues.filter(i => !movingIds.has(i.id));

      // Выделенные задачи с сохранением их текущего порядка в колонке
      const movingItems = allColIssues.filter(i => movingIds.has(i.id));

      // Видимый порядок (без скрытых) нужен для вычисления, куда вставлять
      const visibleOrder = allColIssues.filter(i => !currentHidden.has(i.id));

      // Определяем, перед каким static-элементом вставить блок movingItems
      let insertBefore = staticItems.length; // по умолчанию в конец
      if (destination.index < visibleOrder.length) {
        // Смотрим, какой элемент сейчас находится на позиции destination.index в видимом списке
        const targetVisible = visibleOrder[destination.index];
        // Если это static-элемент, вставляем перед ним
        if (!movingIds.has(targetVisible.id)) {
          insertBefore = staticItems.findIndex(i => i.id === targetVisible.id);
        } else {
          // Если это moving-элемент, ищем следующий за ним static
          // (ситуация маловероятна, т.к. moving скрыты, но обработаем)
          for (let i = destination.index; i < visibleOrder.length; i++) {
            if (!movingIds.has(visibleOrder[i].id)) {
              insertBefore = staticItems.findIndex(s => s.id === visibleOrder[i].id);
              break;
            }
          }
        }
      }

      // Новый порядок колонки
      const newColOrder = [
        ...staticItems.slice(0, insertBefore),
        ...movingItems,
        ...staticItems.slice(insertBefore),
      ];

      moveIssuesInColumn(sourceStatusKey, newColOrder.map(i => i.id));
      return;
    }

    // --- Перемещение между колонками ---
    const newStatusKey = destination.droppableId;
    const statusName = IssueStatusToName[newStatusKey];
    if (!statusName) return;

    const newStatusId = project.statuses.find(s => s.name === statusName)?.id;
    if (!newStatusId) return;

    const authToken = getStoredAuthToken();
    if (!authToken) return;

    const isMulti = selectedIssueIds.size > 0 && selectedIssueIds.has(issueId);
    const idsToUpdate = isMulti ? Array.from(selectedIssueIds) : [issueId];

    const oldStatuses = {};
    idsToUpdate.forEach(id => {
      const issue = project.issues.find(i => i.id === id);
      if (issue) oldStatuses[id] = { statusKey: issue.statusKey, status_id: issue.status_id };
    });

    // Оптимистичное обновление (визуальное)
    idsToUpdate.forEach(id => {
    updateLocalProjectIssues(id, {
      statusKey: newStatusKey,
      status_id: newStatusId,
      updatedAt: new Date().toISOString(),
    });
  });

    // Проверка блокировок перед реальным сохранением
    if (newStatusKey === IssueStatus.DONE) {
      for (const id of idsToUpdate) {
        try {
          const { data: issueData } = await axios.get(
            `/redmine/issues/${id}.json?include=relations`,
            { headers: { 'X-Redmine-API-Key': authToken } }
          );
          const relations = issueData.issue.relations || [];
          for (const rel of relations) {
            const isBlocked =
              (rel.relation_type === 'blocks' && rel.issue_to_id === id) ||
              (rel.relation_type === 'blocked_by' && rel.issue_from_id === id);
            if (isBlocked) {
              // Определяем ID задачи-блокиратора
              const blockerId = rel.relation_type === 'blocks' ? rel.issue_id : rel.issue_to_id;
              // Запрашиваем статус блокиратора
              const { data: blockerData } = await axios.get(
                `/redmine/issues/${blockerId}.json`,
                { headers: { 'X-Redmine-API-Key': authToken } }
              );
              const blockerStatus = blockerData.issue.status?.name;
              if (blockerStatus !== 'Done') {
                toast.error(`Task #${id} is blocked by #${blockerId} (${blockerStatus}). Complete it first.`);
                // Откатываем все перемещённые задачи
                idsToUpdate.forEach(uid => {
                  if (oldStatuses[uid]) {
                    updateLocalProjectIssues(uid, oldStatuses[uid]);
                  }
                });
                return; // прерываем операцию
              }
            }
          }
        } catch (e) {
          console.error(e);
          toast.error('Unable to verify blockers');
          // Откатываем при ошибке
          idsToUpdate.forEach(uid => {
            if (oldStatuses[uid]) {
              updateLocalProjectIssues(uid, oldStatuses[uid]);
            }
          });
          return;
        }
      }
    }

    // Если проверка пройдена, сохраняем на сервере
    try {
      await Promise.all(idsToUpdate.map(id => {
        const params = new URLSearchParams();
        params.append('issue[status_id]', newStatusId);
        return axios.put(`/redmine/issues/${id}.json`, params, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-Redmine-API-Key': authToken,
          },
        });
      }));
    } catch (error) {
      console.error('Mass update failed', error);
      // Откат при неудачном запросе
      idsToUpdate.forEach(id => {
        if (oldStatuses[id]) {
          updateLocalProjectIssues(id, oldStatuses[id]);
        }
      });
    }
  }, [project, selectedIssueIds, updateLocalProjectIssues, moveIssueInList, moveIssuesInColumn]);

  const [{ data: prioritiesData }] = useApi.get('/enumerations/issue_priorities.json');
  const priorities = prioritiesData?.issue_priorities || [];

  const handleBeforeDragStart = useCallback((start) => {
    setDraggingSourceStatus(start.source.droppableId);
    const draggedIssueId = Number(start.draggableId);
    if (selectedIssueIds.has(draggedIssueId) && selectedIssueIds.size > 1) {
      const idsToHide = new Set(selectedIssueIds);
      idsToHide.delete(draggedIssueId);
      setHiddenIssueIds(idsToHide);
    }
  }, [selectedIssueIds]);

  const handleDragEnd = useCallback((result) => {
    handleIssueDrop(result, hiddenIssueIds);
    setHiddenIssueIds(new Set());
    setDraggingSourceStatus(null);
  }, [handleIssueDrop, hiddenIssueIds]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (e.target.closest('[data-testid^="modal:"]')) return;
      if (e.target.closest('[data-issue-id]')) return;
      setSelectedIssueIds(new Set());
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <DragDropContext
      onDragStart={handleBeforeDragStart}
      onDragEnd={handleDragEnd}
    >
      <Lists>
        {Object.values(IssueStatus).map(status => (
          <List
            key={status}
            status={status}
            project={project}
            filters={{ ...filters, showOnlyDone }}
            currentUserId={currentUserId}
            selectedIssueIds={selectedIssueIds}
            onIssueSelect={handleIssueSelect}
            hiddenIssueIds={hiddenIssueIds}
            priorities={priorities}
            draggingSourceStatus={draggingSourceStatus}
          />
        ))}
      </Lists>
    </DragDropContext>
  );
};

export default ProjectBoardLists;