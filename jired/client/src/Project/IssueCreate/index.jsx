import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'shared/components';
import Icon from 'shared/components/Icon';
import toast from 'shared/utils/toast';
import api from 'shared/utils/api';
import { getPriorityMeta } from 'shared/utils/priorities'; // общая утилита для иконок приоритетов
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
  PrioritySelect,
} from './Styles';

const propTypes = {
  project: PropTypes.object,            // теперь не обязателен, если передан – используется
  projects: PropTypes.array,            // список проектов для выбора (опционально)
  fetchProject: PropTypes.func,         // опционально, если проект выбран позже
  onCreate: PropTypes.func.isRequired,
  modalClose: PropTypes.func.isRequired,
};

const IssueCreate = ({ project, projects, fetchProject, onCreate, modalClose }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [hasAttachment, setHasAttachment] = useState(false);
  const [trackers, setTrackers] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [loadingMeta, setLoadingMeta] = useState(true);
  const [configMessage, setConfigMessage] = useState('');
  const [backlogStatusId, setBacklogStatusId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [projectUsers, setProjectUsers] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(project?.id || null);

  const isMountedRef = useRef(false);
  useEffect(() => {
    isMountedRef.current = true;
    return () => { isMountedRef.current = false; };
  }, []);

  // ─── Загрузка метаданных ─────────────────────────────────
  const fetchMeta = async () => {
    setLoadingMeta(true);
    setConfigMessage('');
    try {
      const [tRes, sRes, pRes, userRes] = await Promise.all([
        api.get('/trackers.json'),
        api.get('/issue_statuses.json'),
        api.get('/enumerations/issue_priorities.json'),
        api.get('/users/current.json'),
      ]);

      let currentTrackers = tRes.trackers || [];
      let currentStatuses = sRes.issue_statuses || [];
      let currentPriorities = pRes.issue_priorities || [];

      // Сохраняем текущего пользователя
      if (userRes?.user) {
        const u = userRes.user;
        setCurrentUser({
          id: u.id,
          name: [u.firstname, u.lastname].filter(Boolean).join(' ') || u.login || 'User',
          avatarUrl: u.avatar_url || undefined,
        });
      }

      // 1. Обязательные статусы
      const neededStatuses = [
        { name: 'Backlog', is_closed: false },
        { name: 'In Progress', is_closed: false },
        { name: 'Done', is_closed: true },
      ];
      for (const needed of neededStatuses) {
        const exists = currentStatuses.some(s => s.name.toLowerCase() === needed.name.toLowerCase());
        if (!exists) {
          setConfigMessage(`Creating status "${needed.name}"...`);
          const { issue_status } = await api.post('/extended_api/issue_statuses.json', { issue_status: needed });
          currentStatuses.push(issue_status);
        }
      }
      const backlog = currentStatuses.find(s => s.name.toLowerCase() === 'backlog');
      if (backlog) {
        setBacklogStatusId(backlog.id);
      } else {
        throw new Error('Backlog status is missing and could not be created.');
      }

      // 2. Стандартные приоритеты
      const neededPriorities = [
        { name: 'Low', is_default: false },
        { name: 'Medium', is_default: true },
        { name: 'High', is_default: false },
        { name: 'Critical', is_default: false },
      ];
      for (const np of neededPriorities) {
        const exists = currentPriorities.some(p => p.name.toLowerCase() === np.name.toLowerCase());
        if (!exists) {
          setConfigMessage(`Creating priority "${np.name}"...`);
          const { enumeration } = await api.post('/extended_api/enumerations.json', {
            enumeration: { name: np.name, type: 'IssuePriority', is_default: np.is_default, active: true },
          });
          currentPriorities.push(enumeration);
        }
      }

      // 3. Трекеры
      if (currentTrackers.length === 0) {
        setConfigMessage('Creating default tracker...');
        const defaultStatusId = currentStatuses[0]?.id;
        if (!defaultStatusId) throw new Error('No status available for tracker');
        const { tracker } = await api.post('/extended_api/trackers.json', {
          tracker: { name: 'Task', default_status_id: defaultStatusId },
        });
        currentTrackers = [tracker];
        toast.success('Default tracker "Task" created.');
        try {
          await api.post('/workflows.json', { tracker_id: tracker.id });
          toast.success('Workflow configured.');
        } catch (e) {
          console.error('Workflow error:', e);
          toast.error('Workflow setup failed.');
        }
      }

      // Привязываем трекеры к проекту (если проект уже выбран)
      if (selectedProjectId) {
        for (const tracker of currentTrackers) {
          try {
            await api.post(`/projects/${selectedProjectId}/trackers/${tracker.id}.json`);
          } catch (e) { /* уже привязан */ }
        }
      }

      if (isMountedRef.current) {
        setTrackers(currentTrackers);
        setStatuses(currentStatuses);
        setPriorities(currentPriorities);
      }
    } catch (error) {
      console.error('Initialization error:', error);
      if (isMountedRef.current) toast.error('Failed to initialize: ' + (error.message || 'Unknown error'));
    } finally {
      if (isMountedRef.current) {
        setLoadingMeta(false);
        setConfigMessage('');
      }
    }
  };

  // Загрузка участников проекта
  const fetchProjectUsers = async (projectId) => {
    try {
      const { memberships } = await api.get(`/projects/${projectId}/memberships.json`);
      const users = (memberships || []).map(m => m.user).filter(Boolean);
      if (isMountedRef.current) setProjectUsers(users);
    } catch (e) {
      console.warn('Failed to load project members', e);
    }
  };

  useEffect(() => {
    fetchMeta();
  }, []);

  useEffect(() => {
    if (selectedProjectId) {
      fetchProjectUsers(selectedProjectId);
    } else {
      setProjectUsers([]);
    }
  }, [selectedProjectId]);

  // ─── Создание задачи ──────────────────────────────────────
  const handleCreate = async (values) => {
    if (!backlogStatusId) {
      toast.error('Backlog status is not ready.');
      return;
    }
    if (!selectedProjectId) {
      toast.error('Please select a project.');
      return;
    }
    setIsCreating(true);
    try {
      const payload = {
        issue: {
          project_id: selectedProjectId,
          tracker_id: trackers[0]?.id,
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

  // ─── Опции для селектов ──────────────────────────────────
  const priorityOptions = priorities.map(p => ({ value: p.id, label: p.name }));

  // Объединённый список пользователей: участники проекта + текущий пользователь (без дубликатов)
  const allUsers = [...projectUsers];
  if (currentUser && !allUsers.some(u => u.id === currentUser.id)) {
    allUsers.push(currentUser);
  }
  const assigneeOptions = allUsers.map(u => ({ value: u.id, label: u.name }));

  // Проекты для выбора (если не передан конкретный проект)
  const projectOptions = projects ? projects.map(p => ({ value: p.id, label: p.name })) : [];

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

  // Получаем иконку для приоритета по умолчанию (или выбранного)
  const getPriorityIcon = (priorityId) => {
    const meta = getPriorityMeta({ priority: { id: priorityId } }, priorities);
    return meta ? <img src={meta.src} alt="" style={{ width: '1rem', height: '1rem' }} /> : null;
  };

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
      {(formik) => {
        const currentPriorityId = formik.values.priority_id;
        return (
          <FormElement>
            <FormHeadingWrapper>
              <IconBox>
                <img src={checkboxIcon} alt="" />
              </IconBox>
              <FormHeading>Create Issue</FormHeading>
            </FormHeadingWrapper>

            <FormLayout>
              <MainColumn>
                {/* Выбор проекта (если не задан жестко) */}
                {!project && projectOptions.length > 0 && (
                  <div>
                    <FieldLabel>Project *</FieldLabel>
                    <Form.Field.Select
                      name="project_id"
                      options={[{ value: '', label: 'Select a project' }, ...projectOptions]}
                      component={StyledSelect}
                      onChange={(e) => setSelectedProjectId(e.target.value ? Number(e.target.value) : null)}
                      value={selectedProjectId || ''}
                    />
                  </div>
                )}

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
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ marginTop: '20px' }}>
                      {getPriorityIcon(currentPriorityId)}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <Form.Field.Select
                        name="priority_id"
                        options={priorityOptions}
                        component={PrioritySelect}
                      />
                    </div>
                  </div>
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
        );
      }}
    </Form>
  );
};

IssueCreate.propTypes = propTypes;
export default IssueCreate;