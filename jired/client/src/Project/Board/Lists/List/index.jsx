import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Droppable } from 'react-beautiful-dnd';
import { intersection } from 'lodash';
import { IssueStatusCopy, IssueStatusToName, IssueStatus } from 'shared/constants/issues';
import Issue from './Issue';
import { List, Title, StatusBadge, IssuesCount, Issues, DragPlaceholder } from './Styles';
import { useLanguage } from 'context/LanguageContext'; // ← импорт

const statusBadgeColors = {
  backlog:    { bg: '#e8e1e1', textColor: '#5e3f3f' },
  inprogress: { bg: '#fde8e8', textColor: '#ad1e1e' },
  done:       { bg: '#e4fcef', textColor: '#0B875B' },
};

const statusKeyMap = {
  backlog: 'backlog',
  inprogress: 'inProgress',
  done: 'done',
};

const filterIssues = (projectIssues, filters, currentUserId) => {
  const { searchTerm, userIds, myOnly, recent } = filters;
  let issues = projectIssues;
  if (searchTerm) issues = issues.filter(issue => issue.title.toLowerCase().includes(searchTerm.toLowerCase()));
  if (userIds.length > 0) issues = issues.filter(issue => intersection(issue.userIds, userIds).length > 0);
  if (myOnly && currentUserId) issues = issues.filter(issue => issue.userIds.includes(currentUserId));
  if (recent) issues = issues.filter(issue => moment(issue.updatedAt).isAfter(moment().subtract(1, 'days')));
  if (filters.showOnlyDone) {
    issues = issues.filter(issue => issue.statusKey === IssueStatus.DONE);
  }
  return issues;
};

const getSortedListIssues = (issues, status) =>
  issues.filter(issue => issue.statusKey === status);

const ProjectBoardList = ({
  status, project, filters, currentUserId, selectedIssueIds,
  onIssueSelect, hiddenIssueIds, priorities, draggingSourceStatus  
}) => {
  const { t } = useLanguage();
  const filteredIssues = filterIssues(project.issues, filters, currentUserId);
  const filteredListIssues = getSortedListIssues(filteredIssues, status)
    .filter(issue => !hiddenIssueIds.has(issue.id));
  const allListIssues = getSortedListIssues(project.issues, status);
  const badgeColors = statusBadgeColors[status] || { bg: '#e8e1e1', textColor: '#725757' };

  const statusTitle = t(statusKeyMap[status] || status);
  const totalCount = allListIssues.length;
  const visibleCount = filteredListIssues.length;

  const countText = totalCount === visibleCount
    ? totalCount
    : `${visibleCount} ${t('of')} ${totalCount}`;

  return (
    <Droppable droppableId={status}>
      {(provided, snapshot) => {
        const isCrossColumnDragOver = snapshot.isDraggingOver && draggingSourceStatus !== status;
        return (
          <List isDraggingOver={isCrossColumnDragOver}>
            <Title>
              <StatusBadge bg={badgeColors.bg} textColor={badgeColors.textColor}>
                {statusTitle}
              </StatusBadge>
              <IssuesCount>{countText}</IssuesCount>
            </Title>
            <Issues ref={provided.innerRef} {...provided.droppableProps}>
              {filteredListIssues.map((issue, index) => (
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
            </Issues>
          </List>
        );
      }}
    </Droppable>
  );
};

export default ProjectBoardList;