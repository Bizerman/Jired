import React, { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Icon from 'shared/components/Icon';
import {
  RightPanelContainer,
  ActionButtons,
  AttachButton,
  StatusButton,
  StatusDropdown,
  StatusDropdownItem,
  DetailsCard,
  DetailsCardHeader,
  DetailsCardBody,
  DetailField,
  DetailLabel,
  DetailValue,
  HideEmptyButton,
  Timestamps,
} from './Styles';

const RightPanel = ({ issue, projectUsers, statuses, priorities, updateIssue }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);

  const createdFromNow = moment(issue.created_on).fromNow();
  const updatedFromNow = moment(issue.updated_on).fromNow();

  const priorityName = priorities.find(p => p.id === issue.priority?.id)?.name || '—';

  const estimatedHours = issue.estimated_hours ?? 0;
  const doneRatio = issue.done_ratio ?? 0;
  const timeTrackingStr = estimatedHours > 0 ? `${estimatedHours}h / ${doneRatio}%` : 'No estimate';

  const currentStatusName = issue.status?.name || 'Status';

  return (
    <RightPanelContainer>
      {/* Статус + Attach */}
      <ActionButtons>
        <div style={{ position: 'relative' }}>
          <StatusButton onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}>
            {currentStatusName}
            <Icon type="chevron-down" size={14} />
          </StatusButton>
          {statusDropdownOpen && (
            <StatusDropdown>
              {statuses.map(status => (
                <StatusDropdownItem
                  key={status.id}
                  onClick={() => {
                    updateIssue({ status_id: status.id });
                    setStatusDropdownOpen(false);
                  }}
                >
                  {status.name}
                </StatusDropdownItem>
              ))}
            </StatusDropdown>
          )}
        </div>
        <AttachButton>
          <Icon type="attach" size={18} />
          Attach
        </AttachButton>
      </ActionButtons>

      {/* Панель Details */}
      <DetailsCard>
        <DetailsCardHeader>
          <span>Details</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button className="icon-btn" title="Edit fields">
              <Icon type="settings" size={16} />
            </button>
            <button className="icon-btn" onClick={() => setCollapsed(!collapsed)}>
              <Icon type={collapsed ? 'chevron-down' : 'chevron-up'} size={16} />
            </button>
          </div>
        </DetailsCardHeader>

        {!collapsed && (
          <DetailsCardBody>
            <DetailField>
              <DetailLabel>Assignee</DetailLabel>
              <DetailValue>{issue.assigned_to?.name || 'Unassigned'}</DetailValue>
            </DetailField>
            <DetailField>
              <DetailLabel>Reporter</DetailLabel>
              <DetailValue>{issue.author?.name || '—'}</DetailValue>
            </DetailField>
            <DetailField>
              <DetailLabel>Priority</DetailLabel>
              <DetailValue>{priorityName}</DetailValue>
            </DetailField>
            <DetailField>
              <DetailLabel>Start date</DetailLabel>
              <DetailValue>{issue.start_date || 'None'}</DetailValue>
            </DetailField>
            <DetailField>
              <DetailLabel>Due date</DetailLabel>
              <DetailValue>{issue.due_date || 'None'}</DetailValue>
            </DetailField>
            <DetailField>
              <DetailLabel>Time tracking</DetailLabel>
              <DetailValue>{timeTrackingStr}</DetailValue>
            </DetailField>
            <HideEmptyButton>Hide empty fields</HideEmptyButton>
          </DetailsCardBody>
        )}
      </DetailsCard>

      <Timestamps>
        <div>Created {createdFromNow}</div>
        <div>Updated {updatedFromNow}</div>
      </Timestamps>
    </RightPanelContainer>
  );
};

RightPanel.propTypes = {
  issue: PropTypes.object.isRequired,
  projectUsers: PropTypes.array.isRequired,
  statuses: PropTypes.array.isRequired,
  priorities: PropTypes.array.isRequired,
  updateIssue: PropTypes.func.isRequired,
};

export default RightPanel;