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
  groups, onGroupsChange, updateAllIssues, fetchProject
}) => {
  const { currentUserId } = useCurrentUser();
  const [selectedIssueIds, setSelectedIssueIds] = useState(new Set());
  const [hiddenIssueIds, setHiddenIssueIds] = useState(new Set());
  
  // Единое состояние свернутости/развернутости групп (переживает перемещение между статусами)
  const [expandedGroups, setExpandedGroups] = useState({});
  const toggleGroup = useCallback((groupId) => {
    setExpandedGroups(prev => ({ ...prev, [groupId]: !prev[groupId] }));
  }, []);

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

  const handleDragUpdate = useCallback((update) => {
    if (!update.destination) {
      setDraggedOverStatus(null);
      return;
    }
    setDraggedOverStatus(getStatusFromDroppableId(update.destination.droppableId));
  }, []);

  const handleDragEnd = useCallback(async (result) => {
    setDraggedOverStatus(null);
    setDraggingSourceStatus(null);
    setHiddenIssueIds(new Set());

    const { draggableId, destination, source, type } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const authToken = getStoredAuthToken();
    if (type === 'GROUP') {
      const [_, sourceStatus, groupId] = draggableId.split('::');
      const destStatus = getStatusFromDroppableId(destination.droppableId);
      
            // Перемещение внутри одной колонки (сортировка групп)
      if (sourceStatus === destStatus) {
        let updatedGroups = [...(groups || [])];
        const visibleGroups = updatedGroups.filter(g =>
          project.issues.some(i => i.statusKey === sourceStatus && g.tasks.includes(i.id))
        );
        
        const movedGroup = visibleGroups[source.index];
        const targetGroup = visibleGroups[destination.index];

        if (movedGroup && targetGroup) {
          const globalSourceIdx = updatedGroups.findIndex(g => g.id === movedGroup.id);
          updatedGroups.splice(globalSourceIdx, 1);
          
          const globalDestIdx = updatedGroups.findIndex(g => g.id === targetGroup.id);
          const insertPos = source.index < destination.index ? globalDestIdx + 1 : globalDestIdx;
          
          updatedGroups.splice(insertPos, 0, movedGroup);
          if (onGroupsChange) onGroupsChange(updatedGroups);
        }
        return;
      }

      // Перемещение группы в другой статус
      const newStatusName = IssueStatusToName[destStatus];
      const newStatusId = project.statuses.find(s => s.name === newStatusName)?.id;
      if (!newStatusId) return;

      const allIssues = [...project.issues];
      const sourceGroupTasks = allIssues.filter(i =>
        i.statusKey === sourceStatus &&
        groups?.find(g => g.id.toString() === groupId)?.tasks.includes(i.id)
      );

      if (sourceGroupTasks.length === 0) return;
      const idsToUpdate = sourceGroupTasks.map(i => i.id);

      // Оптимистично меняем статусы задач
      sourceGroupTasks.forEach(issue => {
        issue.statusKey = destStatus;
        issue.status_id = newStatusId;
        issue.updatedAt = new Date().toISOString();
      });

      // Удаляем задачи из текущих позиций
      let updatedIssues = allIssues.filter(i => !idsToUpdate.includes(i.id));

      // Вставляем задачи в целевой статус на нужную позицию
      const destStatusIssues = updatedIssues.filter(i => i.statusKey === destStatus);
      const insertAtIndex = Math.min(destination.index, destStatusIssues.length);
      updatedIssues = [
        ...updatedIssues.filter(i => i.statusKey !== destStatus),
        ...destStatusIssues.slice(0, insertAtIndex),
        ...sourceGroupTasks,
        ...destStatusIssues.slice(insertAtIndex)
      ];

      if (updateAllIssues) updateAllIssues(updatedIssues);

      // Обновляем порядок групп: удаляем группу из старого массива и вставляем в нужное место
      const updatedGroups = [...(groups || [])];
      const movedGroup = updatedGroups.find(g => g.id.toString() === groupId);
      if (movedGroup) {
        const filteredGroups = updatedGroups.filter(g => g.id !== movedGroup.id);
        const destStatusGroups = filteredGroups.filter(g =>
          project.issues.some(i => i.statusKey === destStatus && g.tasks.includes(i.id))
        );
        const insertGroupPos = Math.min(destination.index, destStatusGroups.length);
        const globalInsertPos = filteredGroups.findIndex(g => g === destStatusGroups[insertGroupPos]) ?? filteredGroups.length;
        filteredGroups.splice(globalInsertPos, 0, movedGroup);
        if (onGroupsChange) onGroupsChange(filteredGroups);
      }

      // Сохраняем изменения на сервере
      if (authToken) {
        try {
          await Promise.all(idsToUpdate.map(id => {
            const params = new URLSearchParams();
            params.append('issue[status_id]', newStatusId);
            return axios.put(`/redmine/issues/${id}.json`, params, {
              headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'X-Redmine-API-Key': authToken },
            });
          }));
          if (fetchProject) {
           fetchProject(`/projects/${project.id}.json?include=issues`);
          }
        } catch (error) {
          console.error('Group update failed', error);
        }
      }
      return;
    }

    // ЛОГИКА ПЕРЕТАСКИВАНИЯ ЗАДАЧ
    const issueId = Number(draggableId);
    const sourceStatusKey = getStatusFromDroppableId(source.droppableId);
    const destStatusKey = getStatusFromDroppableId(destination.droppableId);
    const sourceGroupId = source.droppableId.split('::')[1] || 'ungrouped';
    const destGroupId = destination.droppableId.split('::')[1] || 'ungrouped';

    const isMulti = selectedIssueIds.size > 0 && selectedIssueIds.has(issueId);
    const movingIds = isMulti ? Array.from(selectedIssueIds) : [issueId];
    
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

    if (sourceStatusKey !== destStatusKey && authToken) {
      try {
        await Promise.all(movingIds.map(id => {
          const params = new URLSearchParams();
          params.append('issue[status_id]', newStatusId);
          return axios.put(`/redmine/issues/${id}.json`, params, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'X-Redmine-API-Key': authToken },
          });
        }));
        if (fetchProject) {
          fetchProject(`/projects/${project.id}.json?include=issues`);
        }
      } catch (error) {
        console.error('Mass update failed', error);
      }
    }
    const doneStatus = project.statuses.find(s => s.is_closed);
    if (doneStatus && destStatusKey === 'done' && authToken) {
    checkBlockersAndSubtasks(movingIds, authToken).then((blockedTasks) => {
      if (blockedTasks.length > 0) {
        if (fetchProject) {
          fetchProject(`/projects/${project.id}.json?include=issues`);
        }
        toast.error(`Cannot complete: ${blockedTasks.join(', ')}`);
      }
    }).catch(e => {
      toast.error('Unable to verify blockers/subtasks');
    });
  }
}, [project, selectedIssueIds, groups, onGroupsChange, updateAllIssues, fetchProject]);
  const checkBlockersAndSubtasks = async (taskIds, authToken) => {
    const blockedTasks = [];
    for (const id of taskIds) {
      try {
        const { data: issueData } = await axios.get(`/redmine/issues/${id}.json?include=relations`, {
          headers: { 'X-Redmine-API-Key': authToken, 'Cache-Control': 'no-cache' },
        });
        const relations = issueData.issue.relations || [];
        for (const rel of relations) {
          const isBlocked = (rel.relation_type === 'blocks' && rel.issue_to_id === id) ||
                            (rel.relation_type === 'blocked_by' && rel.issue_from_id === id);
          if (isBlocked) {
            const blockerId = rel.relation_type === 'blocks' ? rel.issue_id : rel.issue_to_id;
            const { data: blockerData } = await axios.get(`/redmine/issues/${blockerId}.json`, {
              headers: { 'X-Redmine-API-Key': authToken, 'Cache-Control': 'no-cache' },
            });
            if (!blockerData.issue.status?.is_closed) {
              blockedTasks.push(`#${id} (blocked by #${blockerId})`);
            }
          }
        }
        const { data: childrenData } = await axios.get(`/redmine/issues.json?parent_id=${id}&status_id=*`, {
          headers: { 'X-Redmine-API-Key': authToken },
        });
        const openChildren = (childrenData.issues || []).filter(child => !child.status?.is_closed);
        if (openChildren.length > 0) {
          blockedTasks.push(`#${id} (${openChildren.length} open subtasks)`);
        }
      } catch (e) {
        console.error('Background check failed', e);
      }
    }
    return blockedTasks;
  };
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
              isDragOver={isDragOver}
              groups={groups}
              expandedGroups={expandedGroups}
              toggleGroup={toggleGroup}
            />
          );
        })}
      </Lists>
    </DragDropContext>
  );
};

export default ProjectBoardLists;