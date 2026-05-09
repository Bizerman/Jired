import React, { useState } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import Issue from '../List/Issue';  // ваш компонент карточки задачи
import { GroupContainer, GroupHeader, GroupTasks, CollapseIcon } from './Styles'; // новые стили

const GroupItem = ({ group, issues, priorities, projectUsers, provided, snapshot, isCollapsed, onToggle }) => {
  return (
    <GroupContainer ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
      <GroupHeader onClick={() => onToggle(group.id)}>
        <CollapseIcon>{isCollapsed ? '▶' : '▼'}</CollapseIcon>
        <span>{group.name} ({group.tasks.length})</span>
      </GroupHeader>
      {!isCollapsed && (
        <Droppable droppableId={`group:${group.id}`} type="TASK">
          {(providedGroup) => (
            <GroupTasks ref={providedGroup.innerRef} {...providedGroup.droppableProps}>
              {group.tasks.map((taskId, index) => {
                const task = issues.find(i => i.id === taskId);
                if (!task) return null;
                return (
                  <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{ ...provided.draggableProps.style, opacity: snapshot.isDragging ? 0.5 : 1 }}
                      >
                        <Issue
                          projectUsers={projectUsers}
                          issue={task}
                          index={index}
                          isSelected={false} // по необходимости
                          onIssueSelect={() => {}}
                          selectedCount={0}
                          priorities={priorities}
                        />
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {providedGroup.placeholder}
            </GroupTasks>
          )}
        </Droppable>
      )}
    </GroupContainer>
  );
};

const GroupedList = ({
  status,
  project,
  filters,
  currentUserId,
  selectedIssueIds,
  onIssueSelect,
  hiddenIssueIds,
  priorities,
  groups,
  updateLocalProjectIssues,
}) => {
  const [collapsedGroups, setCollapsedGroups] = useState(new Set());

  const { ungrouped, groups: statusGroups } = buildGroupedItems(status, project.issues, groups);

  const toggleCollapse = (groupId) => {
    setCollapsedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) newSet.delete(groupId);
      else newSet.add(groupId);
      return newSet;
    });
  };

  return (
    <Droppable droppableId={`status:${status}`} type="TASK">
      {(provided, snapshot) => (
        <List isDraggingOver={snapshot.isDraggingOver}>
          <Title>...</Title>   {/* сохраните заголовок со счётчиком */}
          <Issues ref={provided.innerRef} {...provided.droppableProps}>
            {/* Группы */}
            {statusGroups.map((group, index) => (
              <GroupItem
                key={group.id}
                group={group}
                issues={project.issues}
                priorities={priorities}
                projectUsers={project.users}
                isCollapsed={collapsedGroups.has(group.id)}
                onToggle={toggleCollapse}
              />
            ))}
            {/* Несгруппированные задачи */}
            {ungrouped.map((issue, index) => (
              <Draggable key={issue.id} draggableId={issue.id.toString()} index={index + statusGroups.length}>
                {(provided, snapshot) => (
                  <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                    <Issue
                      projectUsers={project.users}
                      issue={issue}
                      index={index}
                      isSelected={selectedIssueIds.has(issue.id)}
                      onIssueSelect={onIssueSelect}
                      selectedCount={selectedIssueIds.size}
                      priorities={priorities}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </Issues>
        </List>
      )}
    </Droppable>
  );
};