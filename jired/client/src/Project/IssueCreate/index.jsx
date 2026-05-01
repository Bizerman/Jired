import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'shared/components';
import Icon from 'shared/components/Icon';
import toast from 'shared/utils/toast';
import api from 'shared/utils/api';
import checkboxIcon from 'App/assets/imgs/check-icon.svg';
import {
  FormElement,
  FormHeading,
  FormHeadingWrapper,
  FieldLabel,
  StyledInput,
  StyledSelect,
  StyledTextArea,
  FieldRow,
  Actions,
  SubmitButton,
  CancelButton,
  AttachmentZone,
  IconBox,
  CreateStatusDialog,
  CreateStatusInput,
  CreateStatusActions,
} from './Styles';

const propTypes = {
  project: PropTypes.object.isRequired,
  fetchProject: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
  modalClose: PropTypes.func.isRequired,
};

const IssueCreate = ({ project, fetchProject, onCreate, modalClose }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [hasAttachment, setHasAttachment] = useState(false);
  const [trackers, setTrackers] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [loadingMeta, setLoadingMeta] = useState(true);
  const [configMessage, setConfigMessage] = useState('');

  // создание нового приоритета
  const [showCreatePriority, setShowCreatePriority] = useState(false);
  const [newPriorityName, setNewPriorityName] = useState('');
  const [newPriorityIsDefault, setNewPriorityIsDefault] = useState(false);
  const [creatingPriority, setCreatingPriority] = useState(false);

  // ID статуса Backlog
  const [backlogStatusId, setBacklogStatusId] = useState(null);

  const isMountedRef = useRef(false);
  useEffect(() => {
    isMountedRef.current = true;
    return () => { isMountedRef.current = false; };
  }, []);

  // ─── вспомогательный вызов для создания трекера ─────────────
  const createDefaultTracker = async (defaultStatusId) => {
    const { tracker } = await api.post('/extended_api/trackers.json', {
      tracker: { name: 'Task', default_status_id: defaultStatusId },
    });
    return tracker;
  };

  const ensureTrackerAssignedToProject = async (trackerId) => {
    try {
      await api.post(`/projects/${project.id}/trackers/${trackerId}.json`);
    } catch (error) {
      console.warn('Tracker assignment skipped (maybe already assigned)', error);
    }
  };

  // ─── загрузка метаданных и инициализация статусов ────────────
  const fetchMeta = async () => {
    setLoadingMeta(true);
    setConfigMessage('');
    try {
      const [tRes, sRes, pRes] = await Promise.all([
        api.get('/trackers.json'),
        api.get('/issue_statuses.json'),
        api.get('/enumerations/issue_priorities.json'),
      ]);

      let currentTrackers = tRes.trackers || [];
      let currentStatuses = sRes.issue_statuses || [];
      let currentPriorities = pRes.issue_priorities || [];

      // Проверяем наличие каждого из трёх нужных статусов
      const neededStatuses = [
        { name: 'Backlog', is_closed: false },
        { name: 'Selected', is_closed: false },
        { name: 'In Progress', is_closed: false },
        { name: 'Done', is_closed: true },
      ];

      for (const needed of neededStatuses) {
        const exists = currentStatuses.some(
          s => s.name.toLowerCase() === needed.name.toLowerCase()
        );
        if (!exists) {
          try {
            setConfigMessage(`Creating status "${needed.name}"...`);
            const { issue_status } = await api.post('/extended_api/issue_statuses.json', {
              issue_status: needed,
            });
            currentStatuses.push(issue_status);
          } catch (e) {
            console.warn(`Could not create status "${needed.name}"`, e);
          }
        }
      }

      // Находим ID статуса Backlog
      const backlog = currentStatuses.find(
        s => s.name.toLowerCase() === 'backlog'
      );
      if (backlog) {
        setBacklogStatusId(backlog.id);
      } else {
        throw new Error('Backlog status is missing and could not be created.');
      }

      // Если трекеров нет – создаём стандартный Task
      if (currentTrackers.length === 0) {
        setConfigMessage('Creating default tracker...');
        const defaultStatusId = currentStatuses[0]?.id;
        if (!defaultStatusId) throw new Error('No status available for tracker');
        const newTracker = await createDefaultTracker(defaultStatusId);
        currentTrackers = [newTracker];
        toast.success('Default tracker "Task" created.');

        // Автоматически настраиваем workflow для роли администратора (или первой не-встроенной)
        try {
          const response = await api.post('/workflows.json', {
            tracker_id: newTracker.id,
          });
          toast.success('Workflow configured.');
        } catch (e) {
          // Посмотрим, что именно ответил Redmine
          console.error('Workflow error details:', e.response?.data || e);
          toast.error('Workflow setup failed. See console for details.');
        }
      }

      // Привязываем все трекеры к проекту
      for (const tracker of currentTrackers) {
        await ensureTrackerAssignedToProject(tracker.id);
      }

      if (isMountedRef.current) {
        setTrackers(currentTrackers);
        setStatuses(currentStatuses);
        setPriorities(currentPriorities);
      }
    } catch (error) {
      console.error('Initialization error:', error);
      if (isMountedRef.current) {
        toast.error('Failed to initialize: ' + (error.message || 'Unknown error'));
      }
    } finally {
      if (isMountedRef.current) {
        setLoadingMeta(false);
        setConfigMessage('');
      }
    }
  };

  useEffect(() => {
    fetchMeta();
  }, []);

  // ─── создание приоритета ─────────────────────────────────────
  const handleCreatePriority = async () => {
    if (!newPriorityName.trim()) return;
    setCreatingPriority(true);
    try {
      const response = await api.post('/extended_api/enumerations.json', {
        enumeration: {
          name: newPriorityName.trim(),
          type: 'IssuePriority',
          is_default: newPriorityIsDefault || false,
          active: true,
        },
      });
      const newPriority = response.enumeration || response;
      if (isMountedRef.current) {
        setPriorities(prev => [...prev, newPriority]);
        toast.success(`Priority "${newPriority.name}" created.`);
        setShowCreatePriority(false);
        setNewPriorityName('');
        setNewPriorityIsDefault(false);
      }
    } catch (error) {
      console.error('Failed to create priority:', error);
      if (isMountedRef.current) toast.error('Could not create priority.');
    } finally {
      if (isMountedRef.current) setCreatingPriority(false);
    }
  };

  // ─── создание задачи (статус всегда Backlog) ─────────────────
  const handleCreate = async (values) => {
    if (!backlogStatusId) {
      toast.error('Backlog status is not ready.');
      return;
    }
    setIsCreating(true);
    try {
      const payload = {
        issue: {
          project_id: project.id,
          tracker_id: values.tracker_id,
          subject: values.subject,
          description: values.description || '',
          status_id: backlogStatusId,
          priority_id: values.priority_id || priorities[0]?.id,
          assigned_to_id: values.assigned_to_id || undefined,
          estimated_hours: values.estimated_hours || undefined,
          due_date: values.due_date || undefined,
        },
      };
      await api.post('/issues.json', payload);
      toast.success('Issue created successfully!');
      onCreate();
      modalClose();
    } catch (error) {
      console.error('Redmine error:', error);
      if (isMountedRef.current) toast.error('Failed to create issue.');
    } finally {
      if (isMountedRef.current) setIsCreating(false);
    }
  };

  // ─── подготовка опций ────────────────────────────────────────
  const trackerOptions = trackers.map(t => ({ value: t.id, label: t.name }));
  const priorityOptions = priorities.map(p => ({ value: p.id, label: p.name }));
  const assigneeOptions = (project.users || []).map(u => ({ value: u.id, label: u.name }));

  if (loadingMeta || configMessage) {
    return (
      <div style={{ padding: 20, textAlign: 'center' }}>
        <p>{configMessage || 'Loading configuration…'}</p>
      </div>
    );
  }

  if (trackers.length === 0 || !backlogStatusId) {
    return (
      <div style={{ padding: 20, color: 'red', textAlign: 'center' }}>
        <p>Could not initialize trackers or required status (Backlog).</p>
        <button onClick={fetchMeta}>Retry</button>
      </div>
    );
  }

  return (
    <Form
      initialValues={{
        subject: '',
        description: '',
        tracker_id: trackers[0]?.id,
        priority_id: priorities.find(p => p.is_default)?.id || priorities[0]?.id,
        assigned_to_id: '',
        estimated_hours: '',
        due_date: '',
      }}
      validations={{
        subject: [Form.is.required(), Form.is.maxLength(255)],
        tracker_id: [Form.is.required()],
        priority_id: [Form.is.required()],
      }}
      onSubmit={handleCreate}
    >
      {(formik) => (
        <FormElement>
          <FormHeadingWrapper>
            <IconBox>
              <img src={checkboxIcon} alt="" />
            </IconBox>
            <FormHeading>New Issue</FormHeading>
          </FormHeadingWrapper>

          <div>
            <FieldLabel>Tracker *</FieldLabel>
            <Form.Field.Select name="tracker_id" options={trackerOptions} component={StyledSelect} />
          </div>

          <div>
            <FieldLabel>Subject *</FieldLabel>
            <Form.Field.Input
              name="subject"
              placeholder="Briefly describe the task"
              component={StyledInput}
              autoFocus
            />
          </div>

          <div>
            <FieldLabel>Description</FieldLabel>
            <Form.Field.Textarea
              name="description"
              placeholder="Details, steps to reproduce, expected result..."
              component={StyledTextArea}
            />
          </div>

          <div>
            <FieldLabel>Attachments</FieldLabel>
            <AttachmentZone onClick={() => setHasAttachment(!hasAttachment)} hasFile={hasAttachment}>
              <Icon type="attach" size={16} />
              {hasAttachment ? 'File_TOR.pdf (Attached)' : 'Click to attach files or drag & drop here'}
            </AttachmentZone>
          </div>

          <FieldRow>
            <div style={{ position: 'relative' }}>
              <FieldLabel>Priority</FieldLabel>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <Form.Field.Select name="priority_id" options={priorityOptions} component={StyledSelect} />
                <button
                  type="button"
                  onClick={() => setShowCreatePriority(true)}
                  style={{
                    background: 'none',
                    border: '1px solid #ececec',
                    borderRadius: 4,
                    padding: '4px 8px',
                    cursor: 'pointer',
                    color: '#AD1E1E',
                    fontSize: 14,
                    whiteSpace: 'nowrap',
                  }}
                  title="Create new priority"
                >
                  + New priority
                </button>
              </div>

              {showCreatePriority && (
                <CreateStatusDialog>
                  <h4 style={{ margin: '0 0 8px', fontWeight: 500 }}>Create issue priority</h4>
                  <CreateStatusInput
                    type="text"
                    placeholder="Priority name (e.g. Urgent)"
                    value={newPriorityName}
                    onChange={(e) => setNewPriorityName(e.target.value)}
                    autoFocus
                  />
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, margin: '8px 0', fontSize: 14 }}>
                    <input
                      type="checkbox"
                      checked={newPriorityIsDefault}
                      onChange={(e) => setNewPriorityIsDefault(e.target.checked)}
                    />
                    Set as default priority
                  </label>
                  <CreateStatusActions>
                    <button
                      type="button"
                      onClick={() => { setShowCreatePriority(false); setNewPriorityName(''); }}
                      disabled={creatingPriority}
                      style={{ background: 'none', border: '1px solid #ccc', borderRadius: 4, padding: '4px 12px', cursor: 'pointer' }}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleCreatePriority}
                      disabled={creatingPriority || !newPriorityName.trim()}
                      style={{
                        background: '#AD1E1E',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 4,
                        padding: '4px 12px',
                        cursor: 'pointer',
                      }}
                    >
                      {creatingPriority ? 'Creating…' : 'Create'}
                    </button>
                  </CreateStatusActions>
                </CreateStatusDialog>
              )}
            </div>
          </FieldRow>

          <div>
            <FieldLabel>Assignee</FieldLabel>
            <Form.Field.Select
              name="assigned_to_id"
              options={[{ value: '', label: 'Unassigned' }, ...assigneeOptions]}
              component={StyledSelect}
            />
          </div>

          <FieldRow>
            <div>
              <FieldLabel>Estimated hours</FieldLabel>
              <Form.Field.Input
                name="estimated_hours"
                type="number"
                step="0.5"
                min="0"
                placeholder="e.g. 2.5"
                component={StyledInput}
              />
            </div>
            <div>
              <FieldLabel>Due date</FieldLabel>
              <Form.Field.Input name="due_date" type="date" component={StyledInput} />
            </div>
          </FieldRow>

          <Actions>
            <CancelButton type="button" onClick={modalClose}>Cancel</CancelButton>
            <SubmitButton onClick={formik.submitForm} disabled={isCreating || formik.isSubmitting}>
              {isCreating ? 'Saving...' : 'Create Issue'}
            </SubmitButton>
          </Actions>
        </FormElement>
      )}
    </Form>
  );
};

IssueCreate.propTypes = propTypes;
export default IssueCreate;