import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Select, IssuePriorityIcon } from 'shared/components'; // если IssuePriorityIcon работает по имени приоритета
import { SectionTitle } from '../Styles';
import { Priority, Label } from './Styles';

const propTypes = {
  issue: PropTypes.object.isRequired,
  priorities: PropTypes.array.isRequired,   // [{id, name, is_default}]
  updateIssue: PropTypes.func.isRequired,
};

const ProjectBoardIssueDetailsPriority = ({ issue, priorities, updateIssue }) => {
  const priorityOptions = priorities.map(p => ({
    value: p.id,
    label: p.name,
  }));

  const handleChange = (priorityId) => {
    updateIssue({ priority_id: priorityId });
  };

  const renderPriorityItem = (priorityId, isValue) => {
    const priority = priorities.find(p => p.id === priorityId);
    const name = priority?.name?.toLowerCase() || 'medium';
    return (
      <Priority isValue={isValue}>
        <IssuePriorityIcon priority={name} />
        <Label>{priority?.name || 'Medium'}</Label>
      </Priority>
    );
  };

  return (
    <Fragment>
      <SectionTitle>Priority</SectionTitle>
      <Select
        variant="empty"
        withClearValue={false}
        dropdownWidth={343}
        value={issue.priority?.id}
        options={priorityOptions}
        onChange={handleChange}
        renderValue={({ value }) => renderPriorityItem(value, true)}
        renderOption={({ value }) => renderPriorityItem(value)}
      />
    </Fragment>
  );
};

ProjectBoardIssueDetailsPriority.propTypes = propTypes;
export default ProjectBoardIssueDetailsPriority;