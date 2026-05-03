import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import api from 'shared/utils/api';
import toast from 'shared/utils/toast';
import { PageError, Button, CopyLinkButton } from 'shared/components';
import { IssueStatus } from 'shared/constants/issues';
import Loader from './Loader';
import Type from './Type';
import Delete from './Delete';
import RightPanel from './RightPanel';
import LeftPanel from './LeftPanel';
import { TopActions, TopActionsRight, Content } from './Styles';

const ProjectBoardIssueDetails = ({
  issueId,
  projectUsers,
  fetchProject,
  updateLocalProjectIssues,
  modalClose,
}) => {
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statuses, setStatuses] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [trackers, setTrackers] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [pendingChanges, setPendingChanges] = useState({});
  const [currentUser, setCurrentUser] = useState(null);

  const fetchIssue = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [issueRes, statusRes, priorityRes, trackerRes, userRes] = await Promise.all([
        api.get(`/issues/${issueId}.json?include=journals,relations`),
        api.get('/issue_statuses.json'),
        api.get('/enumerations/issue_priorities.json'),
        api.get('/trackers.json'),
        api.get('/users/current.json'),
      ]);
      setIssue(issueRes.issue);
      setStatuses(statusRes.issue_statuses || []);
      setPriorities(priorityRes.issue_priorities || []);
      setTrackers(trackerRes.trackers || []);
      if (userRes?.user) {
        const user = userRes.user;
        const fullName = [user.firstname, user.lastname].filter(Boolean).join(' ') || user.login || 'User';
        setCurrentUser({
          name: fullName,
          avatarUrl: user.avatar_url || undefined,
          id: user.id,
        });
      }
    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [issueId]);

  useEffect(() => {
    fetchIssue();
  }, [fetchIssue]);

  const updateIssue = async (fields) => {
    if (!issue) return;

    // Оптимистичное обновление данных в модальном окне
    const updatedIssue = { ...issue, ...fields };
    // Если меняется priority_id, подставляем соответствующий объект в .priority
    if (fields.priority_id !== undefined) {
      const newPrio = priorities.find(p => p.id === fields.priority_id);
      if (newPrio) {
        updatedIssue.priority = { id: newPrio.id, name: newPrio.name };
      }
    }
    // Аналогично для status_id, чтобы корректно обновить .status
    if (fields.status_id !== undefined) {
      const newStatus = statuses.find(s => s.id === fields.status_id);
      if (newStatus) {
        updatedIssue.status = { id: newStatus.id, name: newStatus.name };
      }
    }
    setIssue(updatedIssue);

    try {
      const payload = { issue: {} };
      if ('subject' in fields) payload.issue.subject = fields.subject;
      if ('description' in fields) payload.issue.description = fields.description;
      if ('status_id' in fields) payload.issue.status_id = fields.status_id;
      if ('priority_id' in fields) payload.issue.priority_id = fields.priority_id;
      if ('tracker_id' in fields) payload.issue.tracker_id = fields.tracker_id;
      if ('assigned_to_id' in fields) payload.issue.assigned_to_id = fields.assigned_to_id;
      if ('estimated_hours' in fields) payload.issue.estimated_hours = fields.estimated_hours;
      if ('done_ratio' in fields) payload.issue.done_ratio = fields.done_ratio;
      if ('start_date' in fields) payload.issue.start_date = fields.start_date;
      if ('due_date' in fields) payload.issue.due_date = fields.due_date;
      await api.put(`/issues/${issueId}.json`, payload);
      setIssue(prev => ({ ...prev, updated_on: new Date().toISOString() }));
    } catch (err) {
      toast.error('Failed to update issue');
      fetchIssue();
      return;
    }

    // Подготовка mappedFields для доски (уже есть, но оставим как есть)
    const mappedFields = { ...fields };
    if (fields.subject) mappedFields.title = fields.subject;
    if (fields.status_id) {
      const newStatus = statuses.find(s => s.id === fields.status_id);
      if (newStatus) {
        const name = newStatus.name.trim().toLowerCase();
        if (name.includes('backlog')) mappedFields.statusKey = IssueStatus.BACKLOG;
        else if (name.includes('selected')) mappedFields.statusKey = IssueStatus.SELECTED;
        else if (name.includes('in progress')) mappedFields.statusKey = IssueStatus.INPROGRESS;
        else if (name.includes('done')) mappedFields.statusKey = IssueStatus.DONE;
        else mappedFields.statusKey = IssueStatus.BACKLOG;
      }
    }
    if (fields.assigned_to_id !== undefined) {
      mappedFields.userIds = fields.assigned_to_id ? [fields.assigned_to_id] : [];
    }
    if (fields.priority_id !== undefined) {
      mappedFields.priority_id = fields.priority_id;
    }

    if (updateLocalProjectIssues) {
      updateLocalProjectIssues(issue.id, mappedFields);
    }
};

  const handleSave = async () => {
    if (Object.keys(pendingChanges).length === 0) {
      setIsEditing(false);
      return;
    }
    await updateIssue(pendingChanges);
    setPendingChanges({});
    setIsEditing(false);
  };

  const handleCancel = () => {
    setPendingChanges({});
    setIsEditing(false);
    fetchIssue(); // откатываем модальное окно
  };

  const handleModalClose = () => {
    if (isEditing && Object.keys(pendingChanges).length > 0) {
      if (window.confirm('You have unsaved changes. Are you sure you want to close?')) {
        handleCancel();
        modalClose();
      }
    } else {
      modalClose();
    }
  };

  const updatePendingChanges = (field, value) => {
    setPendingChanges(prev => ({ ...prev, [field]: value }));
  };

  const handleFieldUpdate = (fields) => {
    if (isEditing) {
      Object.entries(fields).forEach(([key, value]) => {
        updatePendingChanges(key, value);
      });
    } else {
      updateIssue(fields);
    }
  };

  if (loading) return <Loader />;
  if (error) return <PageError />;
  if (!issue) return null;

  return (
    <>
      <TopActions>
        <Type issue={issue} trackers={trackers} updateIssue={isEditing ? updatePendingChanges : updateIssue} />
        <TopActionsRight>
          <CopyLinkButton variant="empty" />
          <Delete issue={issue} fetchProject={fetchProject} modalClose={handleModalClose} />
          <Button icon="close" iconSize={24} variant="empty" onClick={handleModalClose} />
        </TopActionsRight>
      </TopActions>
      <Content>
        <LeftPanel
          issue={issue}
          updateIssue={handleFieldUpdate}
          fetchIssue={fetchIssue}
          isEditing={isEditing}
          currentUser={currentUser}
          statuses={statuses}
          priorities={priorities}
        />
        <RightPanel
          issue={issue}
          projectUsers={projectUsers}
          statuses={statuses}
          priorities={priorities}
          updateIssue={isEditing ? updatePendingChanges : updateIssue}
          isEditing={isEditing}
          pendingChanges={pendingChanges}
          updatePendingChanges={updatePendingChanges}
          onSave={handleSave}
          onCancel={handleCancel}
          onEnableEditing={() => setIsEditing(true)}
        />
      </Content>
    </>
  );
};

export default ProjectBoardIssueDetails;