import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Select, Icon } from 'shared/components';
import { SectionTitle } from '../Styles';
import { Status } from './Styles';

const propTypes = {
  issue: PropTypes.object.isRequired,
  statuses: PropTypes.array.isRequired,   // [{id, name}]
  updateIssue: PropTypes.func.isRequired,
};

const ProjectBoardIssueDetailsStatus = ({ issue, statuses, updateIssue }) => {
  const currentStatusName = issue.status?.name || '';

  const statusOptions = statuses.map(s => ({
    value: s.id,
    label: s.name,
  }));

  const handleChange = (statusId) => {
    updateIssue({ status_id: statusId });
  };

  return (
    <Fragment>
      <Select
        variant="empty"
        dropdownWidth={343}
        withClearValue={false}
        value={issue.status?.id}
        options={statusOptions}
        onChange={handleChange}
        renderValue={({ value }) => {
          const status = statuses.find(s => s.id === value);
          return (
            <Status isValue color={status?.name.toLowerCase()}>
              <div>{status?.name || 'Unknown'}</div>
              <Icon type="chevron-down" size={18} />
            </Status>
          );
        }}
        renderOption={({ value }) => {
          const status = statuses.find(s => s.id === value);
          return (
            <Status color={status?.name.toLowerCase()}>
              {status?.name}
            </Status>
          );
        }}
      />
    </Fragment>
  );
};

ProjectBoardIssueDetailsStatus.propTypes = propTypes;
export default ProjectBoardIssueDetailsStatus;