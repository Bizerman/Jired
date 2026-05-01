import React from 'react';
import PropTypes from 'prop-types';
import { useRouteMatch } from 'react-router-dom';
import { Draggable } from 'react-beautiful-dnd';
import { IssueTypeIcon, IssuePriorityIcon } from 'shared/components';
import { IssueLink, Issue, Title, Bottom, IssueId, Assignees, AssigneeAvatar, IssueCheckbox, MultiDragBadge } from './Styles';

const ProjectBoardListIssue = ({ projectUsers, issue, index, isSelected, onIssueSelect, selectedCount }) => {
  const match = useRouteMatch();
  const assignees = issue.userIds.map(userId => projectUsers.find(user => user.id === userId));

  const handleCheckboxClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onIssueSelect(issue.id, e.ctrlKey || e.metaKey);
  };

  const handleCardClick = (e) => {
    e.stopPropagation();
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      onIssueSelect(issue.id, true);
    } else {
      // Сбрасываем выделение только если кликнули по НЕвыделенной карточке
      if (!isSelected) {
        onIssueSelect(issue.id, false);
      }
    }
  };

  return (
    <Draggable draggableId={issue.id.toString()} index={index}>
      {(provided, snapshot) => (
        <IssueLink
          to={`${match.url}/issues/${issue.id}`}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={handleCardClick}
          data-issue-id={issue.id}
        >
          <Issue isBeingDragged={snapshot.isDragging && !snapshot.isDropAnimating} isSelected={isSelected}>
            {snapshot.isDragging && isSelected && selectedCount > 1 && (
              <MultiDragBadge>{selectedCount}</MultiDragBadge>
            )}
            <IssueCheckbox
              type="checkbox"
              checked={isSelected}
              onClick={handleCheckboxClick}
              onChange={() => {}}
              aria-label="Select issue"
            />
            <Title>{issue.title}</Title>
            <Bottom>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <IssueTypeIcon type={issue.type} />
                <IssuePriorityIcon priority={issue.priority} top={-1} left={4} />
                <IssueId>LP-{issue.id}</IssueId>
              </div>
              <Assignees>
                {assignees.map(user => (
                  <AssigneeAvatar key={user.id} size={22} avatarUrl={user.avatarUrl} name={user.name} />
                ))}
              </Assignees>
            </Bottom>
          </Issue>
        </IssueLink>
      )}
    </Draggable>
  );
};

ProjectBoardListIssue.propTypes = {
  projectUsers: PropTypes.array.isRequired,
  issue: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  isSelected: PropTypes.bool,
  onIssueSelect: PropTypes.func.isRequired,
  selectedCount: PropTypes.number,
};

export default ProjectBoardListIssue;