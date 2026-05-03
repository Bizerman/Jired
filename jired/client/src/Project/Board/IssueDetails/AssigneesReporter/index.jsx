import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Select, Avatar } from 'shared/components';
import { SectionTitle } from '../Styles';

const propTypes = {
  issue: PropTypes.object.isRequired,
  projectUsers: PropTypes.array.isRequired,
  updateIssue: PropTypes.func.isRequired,
};

const ProjectBoardIssueDetailsAssigneesReporter = ({ issue, projectUsers, updateIssue }) => {
  const assignee = issue.assigned_to;
  const author = issue.author;

  const userOptions = [
    { value: '', label: 'Unassigned' },
    ...projectUsers.map(u => ({ value: u.id, label: u.name })),
  ];

  const handleAssigneeChange = (userId) => {
    const id = userId === '' ? null : Number(userId);
    updateIssue({ assigned_to_id: id });
  };

  return (
    <Fragment>
      <SectionTitle>Assignee</SectionTitle>
      <Select
        variant="empty"
        dropdownWidth={343}
        withClearValue
        value={assignee?.id || ''}
        options={userOptions}
        onChange={handleAssigneeChange}
        renderValue={({ value }) => {
          if (!value) return <div>Unassigned</div>;
          const user = projectUsers.find(u => u.id === Number(value));
          return (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Avatar size={20} avatarUrl={user?.avatarUrl} name={user?.name} />
              {user?.name}
            </div>
          );
        }}
        renderOption={({ value, label }) => {
          if (!value) return <div>Unassigned</div>;
          const user = projectUsers.find(u => u.id === Number(value));
          return (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Avatar size={20} avatarUrl={user?.avatarUrl} name={user?.name} />
              {label}
            </div>
          );
        }}
      />

      <SectionTitle>Reporter</SectionTitle>
      {author ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Avatar size={20} avatarUrl={author.avatarUrl} name={author.name} />
          {author.name}
        </div>
      ) : (
        <div>Unknown</div>
      )}
    </Fragment>
  );
};

ProjectBoardIssueDetailsAssigneesReporter.propTypes = propTypes;
export default ProjectBoardIssueDetailsAssigneesReporter;