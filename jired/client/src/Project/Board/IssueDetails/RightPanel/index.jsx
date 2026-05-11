import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import axios from 'axios';
import Icon from 'shared/components/Icon';
import { Avatar } from 'shared/components';
import { useLanguage } from 'context/LanguageContext';
import api from 'shared/utils/api';
import toast from 'shared/utils/toast';
import { getStoredAuthToken } from 'shared/utils/authToken';
import userIconSrc from '../../../../App/assets/imgs/user-icon.svg';
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
  EditInput,
  EditSelect,
  EditActions,
  EditButton,
  UserAvatarWrapper,
  UnassignedIcon,
  PriorityIcon,
} from './Styles';

// SVG-иконки приоритетов
const priorityIconMap = {
  'low':       { src: require('../../../../App/assets/imgs/low-priority-icon.svg').default,      size: '1.5rem' },
  'medium':    { src: require('../../../../App/assets/imgs/medium-priority-icon.svg').default,   size: '1rem'   },
  'high':      { src: require('../../../../App/assets/imgs/high-priority-icon.svg').default,     size: '1.5rem' },
  'critical':  { src: require('../../../../App/assets/imgs/very-high-priority-icon.svg').default, size: '1.5rem' },
};

const getPriorityMeta = (issue, priorities) => {
  const priorityId = issue?.priority?.id || issue?.priority_id;
  if (!priorityId || !priorities?.length) return null;
  const priorityObj = priorities.find(p => p.id === priorityId);
  if (!priorityObj || !priorityObj.name) return null;
  const name = priorityObj.name.toLowerCase();
  if (priorityIconMap[name]) return priorityIconMap[name];
  for (const [key, meta] of Object.entries(priorityIconMap)) {
    if (name.includes(key)) return meta;
  }
  return priorityIconMap['medium'];
};

const RightPanel = ({
  issue,
  projectUsers,
  statuses,
  priorities,
  updateIssue,
  isEditing,
  pendingChanges,
  updatePendingChanges,
  onSave,
  onCancel,
  onEnableEditing,
  currentUser,
  onAttachmentUploaded,   // новый пропс – вызывается после успешной загрузки файла
}) => {
  const { t } = useLanguage();
  const [collapsed, setCollapsed] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [hideEmpty, setHideEmpty] = useState(false);
  const [selectedAssignee, setSelectedAssignee] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isEditing) {
      const currentId = issue.assigned_to?.id || null;
      setSelectedAssignee(currentId);
    }
  }, [isEditing, issue.assigned_to]);

  const createdFromNow = moment(issue.created_on).fromNow();
  const updatedFromNow = moment(issue.updated_on).fromNow();

  const priorityId = pendingChanges.priority_id || issue.priority?.id;
  const priorityName = priorities.find(p => p.id === priorityId)?.name || '—';
  const currentStatusName = statuses.find(s => s.id === (pendingChanges.status_id || issue.status?.id))?.name || t('status');
  const effectiveAssigneeId = isEditing
    ? (pendingChanges.assigned_to_id !== undefined ? pendingChanges.assigned_to_id : issue.assigned_to?.id)
    : (issue.assigned_to?.id);

  const assigneeUserFromList = effectiveAssigneeId ? projectUsers.find(u => u.id === effectiveAssigneeId) : null;
  const assigneeUser = assigneeUserFromList
    || (currentUser && currentUser.id === effectiveAssigneeId ? currentUser : null);
  const reporterUser = projectUsers.find(u => u.id === issue.author?.id) || issue.author;

  const estimatedHours = pendingChanges.estimated_hours ?? issue.estimated_hours ?? 0;
  const doneRatio = pendingChanges.done_ratio ?? issue.done_ratio ?? 0;
  const timeTrackingStr = estimatedHours > 0 ? `${estimatedHours}h / ${doneRatio}%` : t('noEstimate');

  const effectivePriorityId = pendingChanges.priority_id || issue.priority?.id || issue.priority_id;
  const priorityMeta = getPriorityMeta({ priority: { id: effectivePriorityId } }, priorities);

  const handleAttachClick = () => {
      if (isEditing) return;                     // в режиме редактирования не прикрепляем
      fileInputRef.current?.click();
    };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // Шаг 1: загружаем файл и получаем токен
      const formData = new FormData();
      formData.append('file', file);

      const uploadResponse = await fetch('/redmine/uploads.json', {
        method: 'POST',
        headers: {
          'X-Redmine-API-Key': getStoredAuthToken() || '',
          // Content-Type автоматически multipart/form-data
        },
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json().catch(() => ({}));
        throw new Error(errorData?.errors?.join(', ') || errorData?.error || `Upload failed with status ${uploadResponse.status}`);
      }

      const data = await uploadResponse.json();
      const token = data?.upload?.token;
      if (!token) throw new Error('No upload token');

      // Шаг 2: прикрепляем токен к задаче
      await api.put(`/issues/${issue.id}.json`, {
        issue: {
          uploads: [{ token, filename: file.name, content_type: file.type }],
        },
      });

      toast.success(t('fileUploaded'));
      if (onAttachmentUploaded) onAttachmentUploaded();
    } catch (err) {
      console.error(err);
      toast.error(err.message || t('uploadFailed'));
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };


  const renderUser = (user) => {
    if (!user) {
      return (
        <UnassignedIcon>
          <img src={userIconSrc} alt="" />
        </UnassignedIcon>
      );
    }
    return (
      <UserAvatarWrapper>
        <Avatar name={user.name} avatarUrl={user.avatarUrl} size={24} />
      </UserAvatarWrapper>
    );
  };

  return (
    <RightPanelContainer>
      <ActionButtons>
        <div style={{ position: 'relative' }}>
          <StatusButton onClick={() => isEditing && setStatusDropdownOpen(!statusDropdownOpen)}>
            {currentStatusName}
            {isEditing && <Icon type="chevron-down" size={14} />}
          </StatusButton>
          {isEditing && statusDropdownOpen && (
            <StatusDropdown>
              {statuses.map(status => (
                <StatusDropdownItem
                  key={status.id}
                  onClick={() => {
                    updatePendingChanges('status_id', status.id);
                    setStatusDropdownOpen(false);
                  }}
                >
                  {status.name}
                </StatusDropdownItem>
              ))}
            </StatusDropdown>
          )}
        </div>
        {/* Кнопка Attach с реальной загрузкой */}
        <label style={{ display: 'inline-flex' }}>
          <AttachButton type="button" onClick={handleAttachClick} disabled={uploading}>
            <Icon type="attach" size={18} />
            {uploading ? t('uploading') : t('attach')}
          </AttachButton>
          <input
            ref={fileInputRef}
            type="file"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </label>
      </ActionButtons>

      <DetailsCard>
        <DetailsCardHeader>
          <span>{t('details')}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {!isEditing && (
              <button className="gear-btn" onClick={onEnableEditing} title={t('editFields')}>
                <Icon type="settings" size={16} />
              </button>
            )}
            {!isEditing && (
              <button className="gear-btn" onClick={() => setCollapsed(!collapsed)}>
                <Icon type={collapsed ? 'chevron-down' : 'chevron-up'} size={16} />
              </button>
            )}
          </div>
        </DetailsCardHeader>

        {!collapsed && (
          <DetailsCardBody>
            <DetailField>
              <DetailLabel>{t('assigneeLabel')}</DetailLabel>
              {isEditing ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {renderUser(assigneeUser)}
                  <EditSelect
                    value={selectedAssignee === null ? '' : (selectedAssignee ?? '')}
                    onChange={(e) => {
                      const newId = e.target.value === '' ? null : Number(e.target.value);
                      setSelectedAssignee(newId);
                      updatePendingChanges('assigned_to_id', newId);
                    }}
                  >
                    <option value="">{t('unassigned')}</option>
                    {projectUsers.map(user => (
                      <option key={user.id} value={user.id}>{user.name}</option>
                    ))}
                    {currentUser && !projectUsers.some(u => u.id === currentUser.id) && (
                      <option key={currentUser.id} value={currentUser.id}>
                        {currentUser.name}
                      </option>
                    )}
                  </EditSelect>
                </div>
              ) : (
                <DetailValue>
                  {renderUser(assigneeUser)}
                  <span>{assigneeUser?.name || t('unassigned')}</span>
                </DetailValue>
              )}
            </DetailField>

            <DetailField>
              <DetailLabel>{t('reporter')}</DetailLabel>
              <DetailValue>
                {renderUser(reporterUser)}
                <span>{reporterUser?.name || '—'}</span>
              </DetailValue>
            </DetailField>

            <DetailField>
              <DetailLabel>{t('priorityLabel')}</DetailLabel>
              {isEditing ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {priorityMeta && (
                    <PriorityIcon
                      src={priorityMeta.src}
                      alt=""
                      style={{ width: priorityMeta.size, height: priorityMeta.size }}
                    />
                  )}
                  <EditSelect
                    value={pendingChanges.priority_id || issue.priority?.id || ''}
                    onChange={(e) => updatePendingChanges('priority_id', Number(e.target.value))}
                  >
                    {priorities.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </EditSelect>
                </div>
              ) : (
                <DetailValue>
                  {priorityMeta && (
                    <PriorityIcon
                      src={priorityMeta.src}
                      alt=""
                      style={{ width: priorityMeta.size, height: priorityMeta.size }}
                    />
                  )}
                  <span>{priorityName}</span>
                </DetailValue>
              )}
            </DetailField>

            {(!hideEmpty || issue.start_date) && (
              <DetailField>
                <DetailLabel>{t('startDateLabel')}</DetailLabel>
                {isEditing ? (
                  <EditInput
                    type="date"
                    value={pendingChanges.start_date || issue.start_date || ''}
                    onChange={(e) => updatePendingChanges('start_date', e.target.value)}
                  />
                ) : (
                  <DetailValue>{issue.start_date || t('none')}</DetailValue>
                )}
              </DetailField>
            )}

            {(!hideEmpty || issue.due_date) && (
              <DetailField>
                <DetailLabel>{t('dueDateLabel')}</DetailLabel>
                {isEditing ? (
                  <EditInput
                    type="date"
                    value={pendingChanges.due_date || issue.due_date || ''}
                    onChange={(e) => updatePendingChanges('due_date', e.target.value)}
                  />
                ) : (
                  <DetailValue>{issue.due_date || t('none')}</DetailValue>
                )}
              </DetailField>
            )}

            {(!hideEmpty || (issue.estimated_hours && issue.estimated_hours > 0)) && (
              <DetailField>
                <DetailLabel>{t('timeTracking')}</DetailLabel>
                {isEditing ? (
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <EditInput
                      type="number"
                      min="0"
                      step="0.5"
                      placeholder={t('originalEstimate')}
                      value={pendingChanges.estimated_hours ?? issue.estimated_hours ?? ''}
                      onChange={(e) => updatePendingChanges('estimated_hours', Number(e.target.value))}
                      style={{ width: 80 }}
                    />
                    <EditInput
                      type="number"
                      min="0"
                      max="100"
                      placeholder="%"
                      value={pendingChanges.done_ratio ?? issue.done_ratio ?? ''}
                      onChange={(e) => updatePendingChanges('done_ratio', Number(e.target.value))}
                      style={{ width: 60 }}
                    />
                  </div>
                ) : (
                  <DetailValue>{timeTrackingStr}</DetailValue>
                )}
              </DetailField>
            )}

            {!isEditing && (
              <HideEmptyButton onClick={() => setHideEmpty(!hideEmpty)}>
                {hideEmpty ? t('showEmptyFields') : t('hideEmptyFields')}
              </HideEmptyButton>
            )}
          </DetailsCardBody>
        )}
      </DetailsCard>

      {isEditing && (
        <EditActions>
          <EditButton primary onClick={onSave}>{t('save')}</EditButton>
          <EditButton onClick={onCancel}>{t('cancelEdit')}</EditButton>
        </EditActions>
      )}

      {!isEditing && (
        <Timestamps>
          <div>{t('created')} {createdFromNow}</div>
          <div>{t('updated')} {updatedFromNow}</div>
        </Timestamps>
      )}
    </RightPanelContainer>
  );
};

export default RightPanel;