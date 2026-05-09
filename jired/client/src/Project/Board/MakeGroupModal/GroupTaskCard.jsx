import React from 'react';
import PropTypes from 'prop-types';
import { IssueTypeIcon } from 'shared/components';
import {
  CardWrapper, Title, Bottom, IssueId,
  Assignees, AssigneeAvatar, PriorityIcon,
} from './Styles';

import veryHighIcon from '../../../App/assets/imgs/very-high-priority-icon.svg';
import highIcon     from '../../../App/assets/imgs/high-priority-icon.svg';
import mediumIcon   from '../../../App/assets/imgs/medium-priority-icon.svg';
import lowIcon      from '../../../App/assets/imgs/low-priority-icon.svg';

const priorityIconMap = {
  'low':       { src: lowIcon,      size: '1.5rem' },
  'medium':    { src: mediumIcon,   size: '1rem'   },
  'high':      { src: highIcon,     size: '1.5rem' },
  'critical':  { src: veryHighIcon, size: '1.5rem' },
};

const getPriorityMeta = (issue, priorities) => {
  const priorityId = issue?.priority_id ?? issue?.priority?.id;
  if (!priorityId || !priorities?.length) return null;
  const priorityObj = priorities.find(p => p.id === priorityId);
  if (!priorityObj || !priorityObj.name) return null;
  const name = priorityObj.name.toLowerCase();
  if (priorityIconMap[name]) return priorityIconMap[name];
  for (const [key, meta] of Object.entries(priorityIconMap)) {
    if (name.includes(key)) return meta;
  }
  return null;
};

const GroupTaskCard = ({ task, projectUsers, priorities }) => {
  const assignees = (task.userIds || [])
    .map(userId => projectUsers.find(user => user.id === userId))
    .filter(Boolean);

  const priorityMeta = getPriorityMeta(task, priorities);

  return (
    <CardWrapper>
      <Title>{task.title || task.subject}</Title>
      <Bottom>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <IssueTypeIcon type={task.type || 'task'} />
          <IssueId>TASK-{task.id}</IssueId>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {priorityMeta ? (
            <PriorityIcon
              src={priorityMeta.src}
              alt="priority"
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
    </CardWrapper>
  );
};

export default GroupTaskCard;