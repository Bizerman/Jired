import React, { useState, useCallback, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import axios from 'axios';
import useApi from 'shared/hooks/api';
import useCurrentUser from 'shared/hooks/currentUser';
import { getStoredAuthToken } from 'shared/utils/authToken';
import { IssueStatus, IssueStatusToName } from 'shared/constants/issues';
import List from './List';
import { Lists } from './Styles';
import toast from 'shared/utils/toast';

const ProjectBoardLists = ({
  project, filters, updateLocalProjectIssues,
  moveIssueInList, moveIssuesInColumn, showOnlyDone,
  groups, onGroupsChange, updateAllIssues
}) => {
  const { currentUserId } = useCurrentUser();
  const [selectedIssueIds, setSelectedIssueIds] = useState(new Set());
  const [hiddenIssueIds, setHiddenIssueIds] = useState(new Set());
  
  // Состояния для правильной подсветки
  const [draggingSourceStatus, setDraggingSourceStatus] = useState(null);
  const [draggedOverStatus, setDraggedOverStatus] = useState(null);

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

  // Получаем статус из составного ID (task-zone::status::group или group-zone::status)
  const getStatusFromDroppableId = (droppableId) => {
    if (!droppableId) return null;
    if (droppableId.startsWith('group-zone::')) return droppableId.split('::')[1];
    return droppableId.split('::')[0];
  };

  const handleBeforeDragStart = useCallback((start) => {
    const sourceStatus = getStatusFromDroppableId(start.source.droppableId);
    setDraggingSourceStatus(sourceStatus);
    
    if (start.type !== 'GROUP') {
      const draggedIssueId = Number(start.draggableId);
      if (selectedIssueIds.has(draggedIssueId) && selectedIssueIds.size > 1) {
        const idsToHide = new Set(selectedIssueIds);
        idsToHide.delete(draggedIssueId);
        setHiddenIssueIds(idsToHide);
      }
    }
  }, [selectedIssueIds]);

  // Срабатывает каждый раз, когда мы проводим мышкой над новой зоной
  const handleDragUpdate = useCallback((update) => {
    if (!update.destination) {
      setDraggedOverStatus(null);
      return;
    }
    setDraggedOverStatus(getStatusFromDroppableId(update.destination.droppableId));
  }, []);

  const handleDragEnd = useCallback(async (result) => {
    setDraggedOverStatus(null); // Сбрасываем подсветку
    setDraggingSourceStatus(null);
    setHiddenIssueIds(new Set());

    const { draggableId, destination, source, type } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const authToken = getStoredAuthToken();

    // === ЛОГИКА ПЕРЕТАСКИВАНИЯ ГРУППЫ ===
    if (type === 'GROUP') {
      const [_, sourceStatus, groupId] = draggableId.split('::');
      const destStatus = getStatusFromDroppableId(destination.droppableId);
      
      if (sourceStatus === destStatus) return; // Игнорируем сортировку групп внутри колонки

      const newStatusName = IssueStatusToName[destStatus];
      const newStatusId = project.statuses.find(s => s.name === newStatusName)?.id;
      if (!newStatusId) return;

      let allIssues = [...project.issues];
      
      // Находим все задачи этой группы в исходной колонке
      const groupTasksInSource = allIssues.filter(i => 
        i.statusKey === sourceStatus && 
        groups?.find(g => g.id.toString() === groupId)?.tasks.includes(i.id)
      );

      if (groupTasksInSource.length === 0) return;
      const idsToUpdate = groupTasksInSource.map(i => i.id);

      // Оптимистично меняем статусы
      groupTasksInSource.forEach(issue => {
        issue.statusKey = destStatus;
        issue.status_id = newStatusId;
        issue.updatedAt = new Date().toISOString();
      });

      // Перемещаем в конец списка (при слиянии они сами сгруппируются)
      allIssues = allIssues.filter(i => !idsToUpdate.includes(i.id));
      allIssues.push(...groupTasksInSource);
      
      if (updateAllIssues) updateAllIssues(allIssues);

      // Массовое сохранение на сервере
      if (authToken) {
        try {
          await Promise.all(idsToUpdate.map(id => {
            const params = new URLSearchParams();
            params.append('issue[status_id]', newStatusId);
            return axios.put(`/redmine/issues/${id}.json`, params, {
              headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'X-Redmine-API-Key': authToken },
            });
          }));
        } catch (error) {
          console.error('Group update failed', error);
        }
      }
      return;
    }

    // === ЛОГИКА ПЕРЕТАСКИВАНИЯ ЗАДАЧ (ТВОЯ СТАРАЯ ЛОГИКА) ===
    const issueId = Number(draggableId);
    const sourceStatusKey = getStatusFromDroppableId(source.droppableId);
    const destStatusKey = getStatusFromDroppableId(destination.droppableId);
    const sourceGroupId = source.droppableId.split('::')[1] || 'ungrouped';
    const destGroupId = destination.droppableId.split('::')[1] || 'ungrouped';

    const isMulti = selectedIssueIds.size > 0 && selectedIssueIds.has(issueId);
    const movingIds = isMulti ? Array.from(selectedIssueIds) : [issueId];

    // 1. Обновляем принадлежность к группам
    let updatedGroups = groups ? [...groups] : [];
    if (sourceGroupId !== destGroupId) {
      if (sourceGroupId !== 'ungrouped') {
        updatedGroups = updatedGroups.map(g =>
          g.id.toString() === sourceGroupId ? { ...g, tasks: g.tasks.filter(id => !movingIds.includes(id)) } : g
        );
      }
      if (destGroupId !== 'ungrouped') {
        updatedGroups = updatedGroups.map(g =>
          g.id.toString() === destGroupId ? { ...g, tasks: [...g.tasks, ...movingIds] } : g
        );
      }
      if (onGroupsChange) onGroupsChange(updatedGroups);
    }

    // 2. Глобальное позиционирование
    let allIssues = [...project.issues];
    const movingIssues = allIssues.filter(i => movingIds.includes(i.id));
    allIssues = allIssues.filter(i => !movingIds.includes(i.id));

    const newStatusName = IssueStatusToName[destStatusKey];
    const newStatusId = project.statuses.find(s => s.name === newStatusName)?.id;

    movingIssues.forEach(issue => {
      if (sourceStatusKey !== destStatusKey) {
        issue.statusKey = destStatusKey;
        issue.status_id = newStatusId;
        issue.updatedAt = new Date().toISOString();
      }
    });

    const targetDroppableItems = allIssues.filter(i => {
      if (i.statusKey !== destStatusKey) return false;
      if (destGroupId === 'ungrouped') return !updatedGroups.some(g => g.tasks.includes(i.id));
      const group = updatedGroups.find(g => g.id.toString() === destGroupId);
      return group && group.tasks.includes(i.id);
    });

    let insertGlobalIndex = allIssues.length;
    if (destination.index < targetDroppableItems.length) {
      const targetItem = targetDroppableItems[destination.index];
      insertGlobalIndex = allIssues.findIndex(i => i.id === targetItem.id);
    } else if (targetDroppableItems.length > 0) {
      const lastItem = targetDroppableItems[targetDroppableItems.length - 1];
      insertGlobalIndex = allIssues.findIndex(i => i.id === lastItem.id) + 1;
    } else {
      const lastOfStatus = allIssues.findLastIndex(i => i.statusKey === destStatusKey);
      insertGlobalIndex = lastOfStatus !== -1 ? lastOfStatus + 1 : allIssues.length;
    }

    allIssues.splice(insertGlobalIndex, 0, ...movingIssues);
    if (updateAllIssues) updateAllIssues(allIssues);

    // 3. Сохранение на сервере
    if (sourceStatusKey !== destStatusKey && authToken) {
      try {
        await Promise.all(movingIds.map(id => {
          const params = new URLSearchParams();
          params.append('issue[status_id]', newStatusId);
          return axios.put(`/redmine/issues/${id}.json`, params, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'X-Redmine-API-Key': authToken },
          });
        }));
      } catch (error) {
        console.error('Mass update failed', error);
      }
    }
  }, [project, selectedIssueIds, groups, onGroupsChange, updateAllIssues]);

  const [{ data: prioritiesData }] = useApi.get('/enumerations/issue_priorities.json');
  const priorities = prioritiesData?.issue_priorities || [];

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
      onDragUpdate={handleDragUpdate} 
      onDragEnd={handleDragEnd}
    >
      <Lists>
        {Object.values(IssueStatus).map(status => {
          // Вычисляем, подсвечивать ли колонку (если мы над ней и это не источник)
          const isDragOver = draggedOverStatus === status && draggingSourceStatus !== status;

          return (
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
              isDragOver={isDragOver} // <-- Передаем состояние
              groups={groups}
            />
          );
        })}
      </Lists>
    </DragDropContext>
  );
};

export default ProjectBoardLists;