import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'shared/components';
import Icon from 'shared/components/Icon';
import { Avatar } from 'shared/components';
import toast from 'shared/utils/toast';
import api from 'shared/utils/api';
import { getStoredAuthToken } from 'shared/utils/authToken';
import { getPriorityMeta } from 'shared/utils/priorities';
import { useLanguage } from 'context/LanguageContext';
import checkboxIcon from 'App/assets/imgs/check-icon.svg';
import userIconSrc from 'App/assets/imgs/user-icon.svg';
import CustomSelect from '../ProjectIssues/CustomSelect';
import {
  FormElement,
  FormHeading,
  FormHeadingWrapper,
  FieldLabel,
  StyledInput,
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
  project: PropTypes.object,
  projects: PropTypes.array,
  fetchProject: PropTypes.func,
  onCreate: PropTypes.func.isRequired,
  modalClose: PropTypes.func.isRequired,
};

const IssueCreate = ({ project, projects, fetchProject, onCreate, modalClose, initialValues }) => {
  const { t } = useLanguage();
  const [isCreating, setIsCreating] = useState(false);
  const [trackers, setTrackers] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [loadingMeta, setLoadingMeta] = useState(true);
  const [configMessage, setConfigMessage] = useState('');
  const [backlogStatusId, setBacklogStatusId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [projectUsers, setProjectUsers] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(project?.id || null);
  const [parentIssues, setParentIssues] = useState([]);
  const [uploadedTokens, setUploadedTokens] = useState([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const fileInputRef = useRef(null);
  const isMountedRef = useRef(false);

  useEffect(() => { isMountedRef.current = true; return () => { isMountedRef.current = false; }; }, []);

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

      if (userRes?.user) {
        const u = userRes.user;
        setCurrentUser({
          id: u.id,
          name: [u.firstname, u.lastname].filter(Boolean).join(' ') || u.login || 'User',
          avatarUrl: u.avatar_url || undefined,
        });
      }

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

  const fetchProjectUsers = async (projectId) => {
    try {
      const { memberships } = await api.get(`/projects/${projectId}/memberships.json`);
      const users = (memberships || []).map(m => m.user).filter(Boolean);
      if (isMountedRef.current) setProjectUsers(users);
    } catch (e) {
      console.warn('Failed to load project members', e);
    }
  };

  useEffect(() => { fetchMeta(); }, []);
  useEffect(() => {
    if (selectedProjectId) {
      fetchProjectUsers(selectedProjectId);
      api.get(`/issues.json`, { project_id: selectedProjectId, status_id: '*', limit: 200 })
        .then(res => setParentIssues(res.issues || []))
        .catch(() => setParentIssues([]));
    } else {
      setProjectUsers([]);
      setParentIssues([]);
    }
  }, [selectedProjectId]);

  // ─── Обработчики файлов ─────────────────────────────────
  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch('/redmine/uploads.json', {
      method: 'POST',
      headers: { 'X-Redmine-API-Key': getStoredAuthToken() || '' },
      body: formData,
    });
    if (!response.ok) throw new Error('Upload failed');
    const data = await response.json();
    return data.upload.token;
  };

  const handleAttachmentsChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setUploadingFiles(true);
    try {
      const tokens = [];
      for (const file of files) {
        const token = await handleFileUpload(file);
        tokens.push(token);
      }
      setUploadedTokens(prev => [...prev, ...tokens]);
    } catch (err) {
      toast.error('File upload failed');
    } finally {
      setUploadingFiles(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // ─── Создание задачи ─────────────────────────────────────
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
      if (uploadedTokens.length > 0) {
        payload.issue.uploads = uploadedTokens.map(token => ({ token }));
      }
      await api.post('/issues.json', payload);
      toast.success(t('issueCreated'));
      onCreate();
      modalClose();
    } catch (error) {
      console.error('Redmine error:', error);
      if (isMountedRef.current) toast.error('Failed to create issue.');
    } finally {
      if (isMountedRef.current) setIsCreating(false);
    }
  };

  // ─── Опции ──────────────────────────────────────────────
  const priorityOptions = priorities.map(p => ({ value: p.id, label: p.name }));
  const allUsers = [...projectUsers];
  if (currentUser && !allUsers.some(u => u.id === currentUser.id)) {
    allUsers.push(currentUser);
  }
  const assigneeOptions = [
    { value: '', label: t('unassigned'), avatarUrl: null },
    ...allUsers.map(u => ({ value: u.id, label: u.name, avatarUrl: u.avatarUrl || null })),
  ];
  const projectOptions = projects ? projects.map(p => ({ value: p.id, label: p.name })) : [];
  const parentIssueOptions = [
    { value: '', label: t('parentIssuePlaceholder') || 'Search by issue key or ID...' },
    ...parentIssues.map(i => ({ value: i.id, label: `ISSUE-${i.id}: ${i.subject}` })),
  ];

  const getPriorityIcon = (priorityId) => {
    if (!priorities.length) return null;
    const meta = getPriorityMeta({ priority: { id: priorityId } }, priorities);
    return meta ? <img src={meta.src} alt="" style={{ width: '1rem', height: '1rem' }} /> : null;
  };

  if (loadingMeta || configMessage) {
    return (
      <div style={{ padding: 20, textAlign: 'center' }}>
        <p>{configMessage || t('loadingConfig')}</p>
      </div>
    );
  }

  if (trackers.length === 0 || !backlogStatusId) {
    return (
      <div style={{ padding: 20, color: 'red', textAlign: 'center' }}>
        <p>Could not initialize trackers or required status (Backlog).</p>
        <button onClick={fetchMeta}>{t('retry')}</button>
      </div>
    );
  }

  return (
    <div style={{ maxHeight: '80vh', overflowY: 'auto' }}>
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
          ...initialValues,
        }}
        validations={{
          subject: [Form.is.required(), Form.is.maxLength(255)],
          priority_id: [Form.is.required()],
        }}
        onSubmit={handleCreate}
      >
        {(formik) => {
          const { setFieldValue, values } = formik;
          const currentPriorityId = values.priority_id;
          const selectedAssignee = assigneeOptions.find(u => String(u.value) === String(values.assigned_to_id));

          return (
            <FormElement>
              <FormHeadingWrapper>
                <IconBox><img src={checkboxIcon} alt="" /></IconBox>
                <FormHeading>{t('newIssue')}</FormHeading>
              </FormHeadingWrapper>

              <FormLayout>
                <MainColumn>
                  {!project && projectOptions.length > 0 && (
                    <div>
                      <FieldLabel>{t('projectSelect')}</FieldLabel>
                      <CustomSelect
                        value={selectedProjectId || ''}
                        options={[{ value: '', label: t('selectProject') }, ...projectOptions]}
                        onChange={(val) => setSelectedProjectId(val ? Number(val) : null)}
                        maxHeight="200px"
                        width="100%"
                      />
                    </div>
                  )}

                  <div>
                    <FieldLabel>{t('summary')} *</FieldLabel>
                    <Form.Field.Input name="subject" placeholder={t('summaryPlaceholder')} component={StyledInput} autoFocus />
                  </div>

                  <div>
                    <FieldLabel>{t('description')}</FieldLabel>
                    <Form.Field.Textarea name="description" placeholder={t('descriptionPlaceholder')} component={StyledTextArea} />
                  </div>

                  <div>
                    <FieldLabel>{t('attachments')}</FieldLabel>
                    <AttachmentZone onClick={() => fileInputRef.current?.click()} hasFile={uploadedTokens.length > 0}>
                      <Icon type="attach" size={16} />
                      {uploadingFiles ? 'Uploading...' : uploadedTokens.length > 0 ? `${uploadedTokens.length} file(s) attached` : t('attachmentsDrop')}
                    </AttachmentZone>
                    <input ref={fileInputRef} type="file" multiple style={{ display: 'none' }} onChange={handleAttachmentsChange} />
                  </div>

                   <div>
                      <FieldLabel>{t('parentIssue')}</FieldLabel>
                      <div style={{ maxWidth: '100%' }}>
                        <CustomSelect
                          value={values.parent_issue_id}
                          options={parentIssueOptions}
                          onChange={(val) => setFieldValue('parent_issue_id', val ? Number(val) : '')}
                          maxHeight="200px"
                          width="100%"
                        />
                      </div>
                    </div>
                </MainColumn>

                <SidebarColumn>
                   <div>
                    <FieldLabel>{t('assignee')}</FieldLabel>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 ,marginTop: '20px' }}>
                      <div style={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {selectedAssignee && selectedAssignee.value !== '' && selectedAssignee.value != null ? (
                          <Avatar name={selectedAssignee.label} avatarUrl={selectedAssignee.avatarUrl} size={24} />
                        ) : (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 22,
                            height: 22,
                            borderRadius: '50%',
                            background: '#5E3F3F',
                          }}>
                            <img src={userIconSrc} alt="" width={14} height={14} />
                          </span>
                        )}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <CustomSelect
                          value={values.assigned_to_id}
                          options={assigneeOptions}
                          onChange={(val) => setFieldValue('assigned_to_id', val ? Number(val) : '')}
                          maxHeight="200px"
                          width="100%"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <FieldLabel>{t('priority')}</FieldLabel>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 20, height: 20 }}>
                        {getPriorityIcon(currentPriorityId)}
                      </span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <CustomSelect
                          value={values.priority_id}
                          options={priorityOptions}
                          onChange={(val) => setFieldValue('priority_id', val ? Number(val) : '')}
                          maxHeight="200px"
                          width="100%"
                        />
                      </div>
                    </div>
                  </div>

                  <FieldRow>
                    <div>
                      <FieldLabel>{t('startDate')}</FieldLabel>
                      <Form.Field.Input name="start_date" type="date" component={StyledInput} />
                    </div>
                    <div>
                      <FieldLabel>{t('dueDate')}</FieldLabel>
                      <Form.Field.Input name="due_date" type="date" component={StyledInput} />
                    </div>
                  </FieldRow>

                  <FieldRow>
                    <div>
                      <FieldLabel>{t('originalEstimate')}</FieldLabel>
                      <Form.Field.Input name="estimated_hours" type="number" step="0.5" min="0" placeholder="e.g. 4h" component={StyledInput} />
                    </div>
                    <div>
                      <FieldLabel>{t('donePercent')}</FieldLabel>
                      <Form.Field.Input name="done_ratio" type="number" min="0" max="100" step="1" placeholder="0" component={StyledInput} />
                    </div>
                  </FieldRow>
                </SidebarColumn>
              </FormLayout>

              <Actions>
                <CancelButton type="button" onClick={modalClose}>{t('cancelBtn')}</CancelButton>
                <SubmitButton onClick={formik.submitForm} disabled={isCreating || formik.isSubmitting}>
                  {isCreating ? t('creatingBtn') : t('createBtn')}
                </SubmitButton>
              </Actions>
            </FormElement>
          );
        }}
      </Form>
    </div>
  );
};

IssueCreate.propTypes = propTypes;
export default IssueCreate;