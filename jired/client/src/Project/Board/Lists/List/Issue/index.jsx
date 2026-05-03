import React from 'react';
import PropTypes from 'prop-types';
import { useRouteMatch } from 'react-router-dom';
import { Draggable } from 'react-beautiful-dnd';
import { IssueTypeIcon } from 'shared/components';
import {
  IssueLink, Issue, Title, Bottom, IssueId,
  Assignees, AssigneeAvatar, IssueCheckbox,
  MultiDragBadge, PriorityIcon,
} from './Styles';

// Импорт SVG-иконок приоритетов
import veryHighIcon from '../../../../../App/assets/imgs/very-high-priority-icon.svg';
import highIcon     from '../../../../../App/assets/imgs/high-priority-icon.svg';
import mediumIcon   from '../../../../../App/assets/imgs/medium-priority-icon.svg';
import lowIcon      from '../../../../../App/assets/imgs/low-priority-icon.svg';

// Сопоставление названий приоритетов с иконками и размерами
const priorityIconMap = {
  'low':       { src: lowIcon,      size: '1.5rem' },
  'medium':    { src: mediumIcon,   size: '1rem'   },
  'high':      { src: highIcon,     size: '1.5rem' },
  'critical':  { src: veryHighIcon, size: '1.5rem' },
};

// Функция для поиска иконки по приоритету (принимает issue и массив приоритетов)
const getPriorityMeta = (issue, priorities) => {
  // Берём id приоритета из вложенного объекта (Redmine API) или flat-поля
  const priorityId = issue?.priority?.id || issue?.priority_id;
  if (!priorityId || !priorities?.length) return null;

  // Находим объект приоритета по id
  const priorityObj = priorities.find(p => p.id === priorityId);
  if (!priorityObj || !priorityObj.name) return null;

  // Приводим имя к нижнему регистру
  const name = priorityObj.name.toLowerCase();

  // Точное совпадение
  if (priorityIconMap[name]) return priorityIconMap[name];

  // Поиск по частичному вхождению (например, "Normal" -> "medium")
  for (const [key, meta] of Object.entries(priorityIconMap)) {
    if (name.includes(key)) return meta;
  }

  // Иначе возвращаем null (можно запасную иконку)
  return priorityIconMap['medium'];
};

const ProjectBoardListIssue = ({
  projectUsers,
  issue,
  index,
  isSelected,
  onIssueSelect,
  selectedCount,
  projectIdentifier,
  priorities, // ← новый пропс
}) => {
  const match = useRouteMatch();
  const assignees = issue.userIds.map(
    userId => projectUsers.find(user => user.id === userId)
  );

  // Формируем ключ задачи: PROJECTKEY-123
  const issueKey = projectIdentifier
    ? `${projectIdentifier}-${issue.id}`
    : `ISSUE-${issue.id}`;

  // Получаем данные для отображения иконки
  const priorityMeta = getPriorityMeta(issue, priorities);

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
    } else if (!isSelected) {
      onIssueSelect(issue.id, false);
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
          <Issue
            isBeingDragged={snapshot.isDragging && !snapshot.isDropAnimating}
            isSelected={isSelected}
          >
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
              {/* Левая часть: иконка типа + ключ задачи */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <IssueTypeIcon type={issue.type} />
                <IssueId>{issueKey}</IssueId>
              </div>

              {/* Правая часть: приоритет (иконка) и аватары исполнителей */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {priorityMeta ? (
                  <PriorityIcon
                    src={priorityMeta.src}
                    alt={`Priority ${issue.priority?.name || ''}`}
                    style={{ width: priorityMeta.size, height: priorityMeta.size }}
                  />
                ) : (
                  <span style={{ fontSize: '0.8rem', color: '#999' }}>–</span>
                )}
                <Assignees>
                  {assignees.map(user => (
                    <AssigneeAvatar
                      key={user.id}
                      size={22}
                      avatarUrl={user.avatarUrl}
                      name={user.name}
                    />
                  ))}
                </Assignees>
              </div>
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
  projectIdentifier: PropTypes.string,
  priorities: PropTypes.array, // новый пропс
};

export default ProjectBoardListIssue;