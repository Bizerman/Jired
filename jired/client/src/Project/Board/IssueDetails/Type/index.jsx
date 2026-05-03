import React from 'react';
import PropTypes from 'prop-types';
import { IssueTypeIcon, Select } from 'shared/components';
import { TypeButton, Type, TypeLabel } from './Styles';

const propTypes = {
  issue: PropTypes.object.isRequired,
  trackers: PropTypes.array.isRequired,   // [{id, name}]
  updateIssue: PropTypes.func.isRequired,
};

const ProjectBoardIssueDetailsType = ({ issue, trackers, updateIssue }) => {
  const currentTrackerName = issue.tracker?.name || 'Task';
  const trackerOptions = trackers.map(t => ({
    value: t.id,
    label: t.name,
    // можно добавить иконку, но пока используем IssueTypeIcon по имени
  }));

  // Преобразуем имя трекера в локальный тип для иконки (task, bug, story)
  const mapTrackerToType = (name) => {
    if (!name) return 'task';
    const n = name.toLowerCase();
    if (n.includes('bug')) return 'bug';
    if (n.includes('story')) return 'story';
    return 'task';
  };

  const handleChange = (trackerId) => {
    updateIssue({ tracker_id: trackerId });
  };

  return (
    <Select
      variant="empty"
      dropdownWidth={150}
      withClearValue={false}
      name="tracker"
      value={issue.tracker?.id}
      options={trackerOptions}
      onChange={handleChange}
      renderValue={({ value }) => {
        const tracker = trackers.find(t => t.id === value);
        const type = mapTrackerToType(tracker?.name);
        return (
          <TypeButton variant="empty" icon={<IssueTypeIcon type={type} />}>
            {`${tracker?.name || 'Task'}-${issue.id}`}
          </TypeButton>
        );
      }}
      renderOption={({ value }) => {
        const tracker = trackers.find(t => t.id === value);
        const type = mapTrackerToType(tracker?.name);
        return (
          <Type>
            <IssueTypeIcon type={type} top={1} />
            <TypeLabel>{tracker?.name}</TypeLabel>
          </Type>
        );
      }}
    />
  );
};

ProjectBoardIssueDetailsType.propTypes = propTypes;
export default ProjectBoardIssueDetailsType;