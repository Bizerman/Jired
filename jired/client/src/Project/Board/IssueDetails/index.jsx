import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import api from 'shared/utils/api';
import toast from 'shared/utils/toast';
import { PageError, Button, AboutTooltip, CopyLinkButton } from 'shared/components';

import Loader from './Loader';
import Type from './Type';
import Delete from './Delete';
import Title from './Title';
import Description from './Description';
import Comments from './Comments';
import Status from './Status';
import AssigneesReporter from './AssigneesReporter';
import Priority from './Priority';
import EstimateTracking from './EstimateTracking';
import Dates from './Dates';
import RightPanel from './RightPanel';
import LeftPanel from './LeftPanel';
import { TopActions, TopActionsRight, Content, Left, Right } from './Styles';

const propTypes = {
  issueId: PropTypes.string.isRequired,
  projectUsers: PropTypes.array.isRequired,
  fetchProject: PropTypes.func.isRequired,
  updateLocalProjectIssues: PropTypes.func.isRequired,
  modalClose: PropTypes.func.isRequired,
};

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
  // Справочники
  const [statuses, setStatuses] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [trackers, setTrackers] = useState([]);

  // Загрузка данных
  const fetchIssue = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // Загружаем issue с журналами и параллельно справочники, если ещё не загружены
      const [issueRes, statusRes, priorityRes, trackerRes] = await Promise.all([
        api.get(`/issues/${issueId}.json?include=journals`),
        api.get('/issue_statuses.json'),
        api.get('/enumerations/issue_priorities.json'),
        api.get('/trackers.json'),
      ]);

      setIssue(issueRes.issue);
      setStatuses(statusRes.issue_statuses || []);
      setPriorities(priorityRes.issue_priorities || []);
      setTrackers(trackerRes.trackers || []);
    } catch (err) {
      console.error(err);
      setError(err);
      toast.error('Failed to load issue details');
    } finally {
      setLoading(false);
    }
  }, [issueId]);

  useEffect(() => {
    fetchIssue();
  }, [fetchIssue]);

  // Обновление полей на Redmine
  const updateIssue = async (fields) => {
    if (!issue) return;

    // Оптимистично обновляем локальный объект
    const updatedIssue = { ...issue, ...fields };
    setIssue(updatedIssue);

    // Отправляем PUT на сервер
    try {
      const payload = { issue: {} };
      // Преобразуем наши поля в то, что ожидает Redmine
      if ('subject' in fields) payload.issue.subject = fields.subject;
      if ('description' in fields) payload.issue.description = fields.description;
      if ('status_id' in fields) payload.issue.status_id = fields.status_id;
      if ('priority_id' in fields) payload.issue.priority_id = fields.priority_id;
      if ('tracker_id' in fields) payload.issue.tracker_id = fields.tracker_id;
      if ('assigned_to_id' in fields) payload.issue.assigned_to_id = fields.assigned_to_id;
      if ('estimated_hours' in fields) payload.issue.estimated_hours = fields.estimated_hours;
      if ('done_ratio' in fields) payload.issue.done_ratio = fields.done_ratio;
      // Можно добавить другие поля по необходимости

      await api.put(`/issues/${issueId}.json`, payload);

      // После успешного обновления сообщаем родителю, чтобы обновить локальные данные проекта
      if (updateLocalProjectIssues) {
        updateLocalProjectIssues(issue.id, fields);
      }
    } catch (err) {
      toast.error('Failed to update issue');
      // Откатываем локальное изменение, перезапросив issue
      fetchIssue();
    }
  };

  if (loading) return <Loader />;
  if (error) return <PageError />;
  if (!issue) return null;

  return (
    <>
      <TopActions>
        <Type
          issue={issue}
          trackers={trackers}
          updateIssue={updateIssue}
        />
        <TopActionsRight>
          <CopyLinkButton variant="empty" />
          <Delete
            issue={issue}
            fetchProject={fetchProject}
            modalClose={modalClose}
          />
          <Button icon="close" iconSize={24} variant="empty" onClick={modalClose} />
        </TopActionsRight>
      </TopActions>
      <Content>
        <LeftPanel
          issue={issue}
          updateIssue={updateIssue}
          fetchIssue={fetchIssue}
        />
        <RightPanel
        issue={issue}
        projectUsers={projectUsers}
        statuses={statuses}
        priorities={priorities}
        updateIssue={updateIssue}
      />
      </Content>
    </>
  );
};

ProjectBoardIssueDetails.propTypes = propTypes;
export default ProjectBoardIssueDetails;