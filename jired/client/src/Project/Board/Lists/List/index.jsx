import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Droppable } from 'react-beautiful-dnd';
import { intersection } from 'lodash';
import { IssueStatusCopy, IssueStatusToName } from 'shared/constants/issues';
import Issue from './Issue';
import { List, Title, StatusBadge, IssuesCount, Issues, DragPlaceholder } from './Styles';

const statusBadgeColors = {
  backlog:    { bg: '#e8e1e1', textColor: '#5e3f3f' },
  selected:   { bg: '#fde8e8', textColor: '#ad1e1e' },
  inprogress: { bg: '#fde8e8', textColor: '#ad1e1e' },
  done:       { bg: '#e4fcef', textColor: '#0B875B' },
};

// Вспомогательные функции фильтрации и сортировки
const filterIssues = (projectIssues, filters, currentUserId) => {
  const { searchTerm, userIds, myOnly, recent } = filters;
  let issues = projectIssues;
  if (searchTerm) issues = issues.filter(issue => issue.title.toLowerCase().includes(searchTerm.toLowerCase()));
  if (userIds.length > 0) issues = issues.filter(issue => intersection(issue.userIds, userIds).length > 0);
  if (myOnly && currentUserId) issues = issues.filter(issue => issue.userIds.includes(currentUserId));
  if (recent) issues = issues.filter(issue => moment(issue.updatedAt).isAfter(moment().subtract(3, 'days')));
  return issues;
};

const getSortedListIssues = (issues, status) =>
  issues.filter(issue => issue.statusKey === status);

const formatIssuesCount = (allListIssues, filteredListIssues) => {
  if (allListIssues.length !== filteredListIssues.length) {
    return `${filteredListIssues.length} of ${allListIssues.length}`;
  }
  return allListIssues.length;
};

const ProjectBoardList = ({
  status, project, filters, currentUserId, selectedIssueIds,
  onIssueSelect, hiddenIssueIds, priorities,draggingSourceStatus  
}) => {
  const filteredIssues = filterIssues(project.issues, filters, currentUserId);
  const filteredListIssues = getSortedListIssues(filteredIssues, status)
    .filter(issue => !hiddenIssueIds.has(issue.id));
  const allListIssues = getSortedListIssues(project.issues, status);
  const badgeColors = statusBadgeColors[status] || { bg: '#e8e1e1', textColor: '#725757' };

   return (
    <Droppable droppableId={status}>
      {(provided, snapshot) => {
        // Подсветка только для межколоночного переноса
        const isCrossColumnDragOver = snapshot.isDraggingOver && draggingSourceStatus !== status;

        return (
          <List isDraggingOver={isCrossColumnDragOver}>
            <Title>
              <StatusBadge bg={badgeColors.bg} textColor={badgeColors.textColor}>
                {IssueStatusCopy[status]}
              </StatusBadge>
              <IssuesCount>{formatIssuesCount(allListIssues, filteredListIssues)}</IssuesCount>
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