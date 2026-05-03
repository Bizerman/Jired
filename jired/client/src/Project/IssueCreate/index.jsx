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
  FormLayout,
  MainColumn,
  SidebarColumn,
  FieldRow,
  Actions,
  SubmitButton,
  CancelButton,
  AttachmentZone,
  IconBox,
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

  // ─── загрузка метаданных и инициализация статусов/приоритетов ────
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

      // 1. Проверяем/создаём обязательные статусы
      const neededStatuses = [
        { name: 'Backlog', is_closed: false },
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

      // 2. Проверяем/создаём стандартные приоритеты
      const neededPriorities = [
        { name: 'Low', is_default: false },
        { name: 'Medium', is_default: true },
        { name: 'High', is_default: false },
        { name: 'Critical', is_default: false },
      ];

      for (const neededPriority of neededPriorities) {
        const exists = currentPriorities.some(
          p => p.name.toLowerCase() === neededPriority.name.toLowerCase()
        );
        if (!exists) {
          try {
            setConfigMessage(`Creating priority "${neededPriority.name}"...`);
            const { enumeration } = await api.post('/extended_api/enumerations.json', {
              enumeration: {
                name: neededPriority.name,
                type: 'IssuePriority',
                is_default: neededPriority.is_default,
                active: true,
              },
            });
            currentPriorities.push(enumeration);
          } catch (e) {
            console.warn(`Could not create priority "${neededPriority.name}"`, e);
          }
        }
      }

      // 3. Если трекеров нет – создаём Task
      if (currentTrackers.length === 0) {
        setConfigMessage('Creating default tracker...');
        const defaultStatusId = currentStatuses[0]?.id;
        if (!defaultStatusId) throw new Error('No status available for tracker');
        const newTracker = await createDefaultTracker(defaultStatusId);
        currentTrackers = [newTracker];
        toast.success('Default tracker "Task" created.');

        // Настройка workflow для администратора
        try {
          await api.post('/workflows.json', {
            tracker_id: newTracker.id,
          });
          toast.success('Workflow configured.');
        } catch (e) {
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
          tracker_id: trackers[0]?.id,          // Task всегда
          subject: values.subject,
          description: values.description || '',
          status_id: backlogStatusId,
          priority_id: values.priority_id || priorities[0]?.id,
          assigned_to_id: values.assigned_to_id || undefined,
          estimated_hours: values.estimated_hours || undefined,
          due_date: values.due_date || undefined,
          start_date: values.start_date || undefined,
          done_ratio: values.done_ratio ? Number(values.done_ratio) : 0,
          parent_issue_id: values.parent_issue_id ? Number(values.parent_issue_id) : undefined,
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
        priority_id: priorities.find(p => p.is_default)?.id || priorities[0]?.id,
        assigned_to_id: '',
        estimated_hours: '',
        due_date: '',
        start_date: '',
        done_ratio: 0,
        parent_issue_id: '',
      }}
      validations={{
        subject: [Form.is.required(), Form.is.maxLength(255)],
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
            <FormHeading>Create Issue</FormHeading>
          </FormHeadingWrapper>

          <FormLayout>
            {/* ЛЕВАЯ КОЛОНКА: Основной контент */}
            <MainColumn>
              <div>
                <FieldLabel>Summary *</FieldLabel>
                <Form.Field.Input
                  name="subject"
                  placeholder="What needs to be done?"
                  component={StyledInput}
                  autoFocus
                />
              </div>

              <div>
                <FieldLabel>Description</FieldLabel>
                <Form.Field.Textarea
                  name="description"
                  placeholder="Add details, steps to reproduce, or acceptance criteria..."
                  component={StyledTextArea}
                />
              </div>

              <div>
                <FieldLabel>Attachments</FieldLabel>
                <AttachmentZone onClick={() => setHasAttachment(!hasAttachment)} hasFile={hasAttachment}>
                  <Icon type="attach" size={16} />
                  {hasAttachment ? 'File_TOR.pdf (Attached)' : 'Drop files here or click to browse'}
                </AttachmentZone>
              </div>

              <div>
                <FieldLabel>Parent Issue</FieldLabel>
                <Form.Field.Input
                  name="parent_issue_id"
                  type="text"
                  placeholder="Search by issue key or ID..."
                  component={StyledInput}
                />
              </div>
            </MainColumn>

            {/* ПРАВАЯ КОЛОНКА: Атрибуты */}
            <SidebarColumn>
              <div>
                <FieldLabel>Assignee</FieldLabel>
                <Form.Field.Select
                  name="assigned_to_id"
                  options={[{ value: '', label: 'Unassigned' }, ...assigneeOptions]}
                  component={StyledSelect}
                />
              </div>

              <div>
                <FieldLabel>Priority</FieldLabel>
                <Form.Field.Select 
                  name="priority_id" 
                  options={priorityOptions} 
                  component={StyledSelect} 
                />
              </div>

              <FieldRow>
                <div>
                  <FieldLabel>Start date</FieldLabel>
                  <Form.Field.Input name="start_date" type="date" component={StyledInput} />
                </div>
                <div>
                  <FieldLabel>Due date</FieldLabel>
                  <Form.Field.Input name="due_date" type="date" component={StyledInput} />
                </div>
              </FieldRow>

              <FieldRow>
                <div>
                  <FieldLabel>Original estimate</FieldLabel>
                  <Form.Field.Input
                    name="estimated_hours"
                    type="number"
                    step="0.5"
                    min="0"
                    placeholder="e.g. 4h"
                    component={StyledInput}
                  />
                </div>
                <div>
                  <FieldLabel>Done (%)</FieldLabel>
                  <Form.Field.Input
                    name="done_ratio"
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    placeholder="0"
                    component={StyledInput}
                  />
                </div>
              </FieldRow>
            </SidebarColumn>
          </FormLayout>

          <Actions>
            <CancelButton type="button" onClick={modalClose}>Cancel</CancelButton>
            <SubmitButton onClick={formik.submitForm} disabled={isCreating || formik.isSubmitting}>
              {isCreating ? 'Creating...' : 'Create'}
            </SubmitButton>
          </Actions>
        </FormElement>
      )}
    </Form>
  );
};

IssueCreate.propTypes = propTypes;
export default IssueCreate;