import React, { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import styled, { css } from 'styled-components';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { intersection } from 'lodash';
import { IssueStatus, IssueStatusToName, IssueStatusCopy } from 'shared/constants/issues';
import { IssueTypeIcon, Icon } from 'shared/components';
import { color, font, mixin } from 'shared/utils/styles';
import Issue from './Issue';
import { List, Title, StatusBadge, IssuesCount, Issues, DragPlaceholder } from './Styles';
import { useLanguage } from 'context/LanguageContext';

// === СТИЛИ КАРТОЧКИ ГРУППЫ ===
const GroupCardContainer = styled.div`
  background: #fff;
  border-radius: 5px;
  margin-bottom: 10px;
  overflow: hidden;
  border: 1px solid ${color.borderLightest};
  transition: border 0.15s, box-shadow 0.15s;
  min-height: 86px;
  ${mixin.clickable}
  &:hover {
    background: #f9f9f9;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
  ${props =>
    props.isDragging &&
    css`
      transform: rotate(2deg);
      box-shadow: 0 10px 30px rgba(173, 30, 30, 0.15);
      border-color: #AD1E1E;
    `}
`;
const GroupCheckIcon = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 3px;
  background: #E34A4A;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: white;
  font-size: 10px;
`;
const GroupHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 12.5px 13.75px;
  padding-bottom: ${p => p.isExpanded ? '12.5px' : '0'};
  cursor: pointer;
  &:active {
    cursor: grabbing;
  }
`;

const GroupName = styled.p`
  ${font.regular}
  font-size: 17.5px;
  color: ${color.textMedium};
  padding-bottom: 12.5px;
  text-align: left;
  line-height: 1.4;
  margin: 0;
  flex: 1;
`;

const GroupBottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 13.75px 12.5px 13.75px;
`;

const GroupId = styled.div`
  ${font.regular}
  font-size: 15px;
  color: ${color.textMedium};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const GroupTaskCount = styled.span`
  font-size: 15px;
  color: ${color.textMedium};
  margin-left: auto;
`;

// Остальные стили (statusBadgeColors, statusKeyMap и т.д.)
const statusBadgeColors = {
  backlog:    { bg: '#e8e1e1', textColor: '#5e3f3f' },
  inprogress: { bg: '#fde8e8', textColor: '#ad1e1e' },
  done:       { bg: '#e4fcef', textColor: '#0B875B' },
};

const statusKeyMap = { backlog: 'backlog', inprogress: 'inProgress', done: 'done' };

const filterIssues = (projectIssues, filters, currentUserId) => {
  const { searchTerm, userIds, myOnly, recent } = filters;
  let issues = projectIssues;
  if (searchTerm) issues = issues.filter(issue => issue.title.toLowerCase().includes(searchTerm.toLowerCase()));
  if (userIds.length > 0) issues = issues.filter(issue => intersection(issue.userIds, userIds).length > 0);
  if (myOnly && currentUserId) issues = issues.filter(issue => issue.userIds.includes(currentUserId));
  if (recent) issues = issues.filter(issue => moment(issue.updatedAt).isAfter(moment().subtract(1, 'days')));
  if (filters.showOnlyDone) issues = issues.filter(issue => issue.statusKey === IssueStatus.DONE);
  return issues;
};

const getSortedListIssues = (issues, status) =>
  issues.filter(issue => issue.statusKey === status);

const ProjectBoardList = ({
  status, project, filters, currentUserId, selectedIssueIds,
  onIssueSelect, hiddenIssueIds, priorities, isDragOver, groups
}) => {
  const { t } = useLanguage();
  const [expandedGroups, setExpandedGroups] = useState({});

  const filteredIssues = filterIssues(project.issues, filters, currentUserId);
  const allListIssues = getSortedListIssues(filteredIssues, status)
    .filter(issue => !hiddenIssueIds.has(issue.id));
  const fullStatusIssues = getSortedListIssues(project.issues, status);

  const badgeColors = statusBadgeColors[status] || { bg: '#e8e1e1', textColor: '#725757' };
  const statusTitle = t(statusKeyMap[status] || status);

  const totalCount = fullStatusIssues.length;
  const visibleCount = allListIssues.length;
  const countText = totalCount === visibleCount ? totalCount : `${visibleCount} ${t('of')} ${totalCount}`;

  const ungroupedIssues = allListIssues.filter(i => !groups?.some(g => g.tasks.includes(i.id)));

  const groupData = (groups || []).map(g => ({
    ...g,
    issues: allListIssues.filter(i => g.tasks.includes(i.id))
  }));

  const visibleGroups = groupData.filter(g => g.issues.length > 0);

  const toggleGroup = (groupId) => {
    setExpandedGroups(prev => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  return (
    <List isDraggingOver={isDragOver}>
      <Title>
        <StatusBadge bg={badgeColors.bg} textColor={badgeColors.textColor}>
          {statusTitle}
        </StatusBadge>
        <IssuesCount>{countText}</IssuesCount>
      </Title>

      {/* Зона для свободных задач (без групп) */}
      <Droppable droppableId={`${status}::ungrouped`} type="TASK">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {ungroupedIssues.map((issue, index) => (
              <Issue
                key={issue.id}
                projectUsers={project.users}
                issue={issue}
                index={index}
                isSelected={selectedIssueIds.has(issue.id)}
                onIssueSelect={onIssueSelect}
                selectedCount={selectedIssueIds.size}
                priorities={priorities}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {/* Зона для групп */}
      <Droppable droppableId={`group-zone::${status}`} type="GROUP">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{ minHeight: '40px' }}
          >
            {visibleGroups.map((group, index) => {
              const isExpanded = expandedGroups[group.id] !== false;
              return (
                <Draggable key={group.id} draggableId={`group::${status}::${group.id}`} index={index}>
                  {(provided, snapshot) => (
                    <GroupCardContainer
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      isDragging={snapshot.isDragging}
                    >
                      <div
                        {...provided.dragHandleProps}
                        onClick={() => toggleGroup(group.id)}
                        style={{ display: 'flex', flexDirection: 'column', flex: 1 }}
                      >
                        {/* Заголовок группы (всегда показывается) */}
                        <GroupHeader isExpanded={isExpanded}>
                          <GroupName>{group.name}</GroupName>
                        </GroupHeader>

                        {/* Нижняя строка с информацией о группе — только в свёрнутом состоянии */}
                        {!isExpanded && (
                          <GroupBottom>
                            <GroupId>
                              <GroupCheckIcon>
                                <Icon type="issues" size={10} color="#fff" style={{ height: '65%' }} />
                              </GroupCheckIcon>
                              <span>GROUP-{group.id}</span>
                            </GroupId>
                            <GroupTaskCount>
                              {group.issues.length}
                            </GroupTaskCount>
                          </GroupBottom>
                        )}
                      </div>

                      {/* Раскрытая часть с задачами — только в развернутом состоянии */}
                      {isExpanded && (
                        <Droppable droppableId={`${status}::${group.id}`} type="TASK">
                          {(provided, snap) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              style={{
                                minHeight: '20px',
                                padding: '8px',
                                background: snap.isDraggingOver ? '#F4F5F7' : 'transparent',
                                transition: 'background 0.2s ease'
                              }}
                            >
                              {group.issues.map((issue, i) => (
                                <Issue
                                  key={issue.id}
                                  projectUsers={project.users}
                                  issue={issue}
                                  index={i}
                                  isSelected={selectedIssueIds.has(issue.id)}
                                  onIssueSelect={onIssueSelect}
                                  selectedCount={selectedIssueIds.size}
                                  priorities={priorities}
                                />
                              ))}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      )}
                    </GroupCardContainer>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </List>
  );
};

export default ProjectBoardList;