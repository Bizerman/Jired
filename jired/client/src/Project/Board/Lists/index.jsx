import React, { useState, useCallback, useEffect  } from 'react'; // ← добавлен useCallback
import PropTypes from 'prop-types';
import { DragDropContext } from 'react-beautiful-dnd';
import axios from 'axios';
import useCurrentUser from 'shared/hooks/currentUser';
import { getStoredAuthToken } from 'shared/utils/authToken';
import { IssueStatus, IssueStatusToName } from 'shared/constants/issues';
import List from './List';
import { Lists } from './Styles';

const ProjectBoardLists = ({ project, filters, updateLocalProjectIssues }) => {
  const { currentUserId } = useCurrentUser();
  const [selectedIssueIds, setSelectedIssueIds] = useState(new Set());
  const [hiddenIssueIds, setHiddenIssueIds] = useState(new Set());

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

  const handleIssueDrop = async ({ draggableId, destination, source }) => {
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const issueId = Number(draggableId);
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

    idsToUpdate.forEach(id => {
      updateLocalProjectIssues(id, { statusKey: newStatusKey, status_id: newStatusId });
    });

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
      idsToUpdate.forEach(id => {
        if (oldStatuses[id]) {
          updateLocalProjectIssues(id, oldStatuses[id]);
        }
      });
    }
  };

  const handleBeforeDragStart = useCallback((start) => {
    const draggedIssueId = Number(start.draggableId);
    if (selectedIssueIds.has(draggedIssueId) && selectedIssueIds.size > 1) {
      const idsToHide = new Set(selectedIssueIds);
      idsToHide.delete(draggedIssueId);
      setHiddenIssueIds(idsToHide);
    }
  }, [selectedIssueIds]);

  const handleDragEnd = useCallback((result) => {
    setHiddenIssueIds(new Set());
    handleIssueDrop(result);
  }, [handleIssueDrop, selectedIssueIds]); // handleIssueDrop лучше тоже обернуть в useCallback при необходимости

  useEffect(() => {
    const handleClickOutside = (e) => {
      // Не реагируем, если клик внутри модального окна (по testid, начинающемуся на "modal:")
      if (e.target.closest('[data-testid^="modal:"]')) {
        return;
      }
      // Если кликнули по карточке или её содержимому — не сбрасываем
      if (e.target.closest('[data-issue-id]')) {
        return;
      }
      // Во всех остальных случаях убираем выделение
      setSelectedIssueIds(new Set());
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []); // пустой массив зависимостей — вешаем один раз
  return (
    <DragDropContext onDragStart={handleBeforeDragStart} onDragEnd={handleDragEnd}>
      <Lists>
        {Object.values(IssueStatus).map(status => (
          <List
            key={status}
            status={status}
            project={project}
            filters={filters}
            currentUserId={currentUserId}
            selectedIssueIds={selectedIssueIds}
            onIssueSelect={handleIssueSelect}
            hiddenIssueIds={hiddenIssueIds}
          />
        ))}
      </Lists>
    </DragDropContext>
  );
};

export default ProjectBoardLists;