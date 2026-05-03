import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import api from 'shared/utils/api';
import { sortByNewest } from 'shared/utils/javascript';
import Create from './Create';
import Comment from './Comment';
import {
  Comment as StyledComment,
  UserAvatar,
  Content as CommentContent,
  Username,
  CreatedAt,
  Body,
} from './Comment/Styles';

const ProjectBoardIssueDetailsComments = ({ issue, fetchIssue, currentUser, activeFilter, statuses, priorities, sortOrder  }) => {
  const [workLogs, setWorkLogs] = useState([]);
  const [loadingWL, setLoadingWL] = useState(false);

  useEffect(() => {
    if ((activeFilter === 'Work log' || activeFilter === 'All') && workLogs.length === 0) {
      setLoadingWL(true);
      api.get('/time_entries.json', { issue_id: issue.id })
        .then(res => setWorkLogs(res.time_entries || []))
        .catch(() => {})
        .finally(() => setLoadingWL(false));
    }
  }, [activeFilter, issue.id, workLogs.length]);

  const allJournals = issue.journals || [];

  const comments = allJournals
    .filter(j => j.notes)
    .map(j => ({
      id: j.id,
      body: j.notes,
      createdAt: j.created_on,
      user: { id: j.user?.id, name: j.user?.name || 'Unknown', avatarUrl: j.user?.avatarUrl },
    }));

  const historyItems = allJournals
    .filter(j => !j.notes && j.details && j.details.length > 0)
    .map(j => ({
      id: j.id,
      createdAt: j.created_on,
      user: { id: j.user?.id, name: j.user?.name || 'Unknown' },
      details: j.details,
    }));

  const plannedHours = issue.estimated_hours;

  const PlannedHoursItem = () => (
    <StyledComment>
      <UserAvatar name={currentUser?.name || 'User'} avatarUrl={currentUser?.avatarUrl} />
      <CommentContent style={{ paddingTop: 6 }}>
        <Username style={{ fontWeight: 600 }}>
          {currentUser?.name || 'User'} estimated {plannedHours}h
        </Username>
        <CreatedAt>{new Date(issue.updated_on).toLocaleString()}</CreatedAt>
      </CommentContent>
    </StyledComment>
  );

  const EstimateChangeItem = ({ item }) => {
    const detail = item.details.find(d => d.prop_key === 'estimated_hours');
    if (!detail) return null;
    const oldVal = detail.old_value || '0';
    const newVal = detail.value || '0';
    return (
      <StyledComment>
        <UserAvatar name={item.user?.name || 'User'} avatarUrl={item.user?.avatarUrl} />
        <CommentContent style={{ paddingTop: 6 }}>
          <Username style={{ fontWeight: 600 }}>
            {item.user?.name || 'User'} changed estimate from {oldVal}h to {newVal}h
          </Username>
          <CreatedAt>{new Date(item.createdAt).toLocaleString()}</CreatedAt>
        </CommentContent>
      </StyledComment>
    );
  };

  const WorkLogItem = ({ entry }) => (
    <StyledComment>
      <UserAvatar name={entry.user?.name || 'Unknown'} avatarUrl={entry.user?.avatarUrl} />
      <CommentContent style={{ paddingTop: 6 }}>
        <Username style={{ fontWeight: 600 }}>
          {entry.user?.name || 'Unknown'} logged {entry.hours}h
          {entry.comments && <span> — {entry.comments}</span>}
        </Username>
        <CreatedAt>{new Date(entry.created_on).toLocaleString()}</CreatedAt>
      </CommentContent>
    </StyledComment>
  );

  const HistoryItem = ({ item }) => (
    <StyledComment>
      <UserAvatar name={item.user?.name || 'User'} avatarUrl={item.user?.avatarUrl} />
      <CommentContent style={{ paddingTop: 6 }}>
        <Username style={{ fontWeight: 600 }}>
          {item.user?.name || 'User'} made changes
        </Username>
        <CreatedAt>{new Date(item.createdAt).toLocaleString()}</CreatedAt>
      </CommentContent>
    </StyledComment>
  );

  // Все элементы для All и подсчёта количества
  const allItems = [
    ...comments.map(c => ({ ...c, type: 'comment' })),
    ...historyItems.map(h => ({ ...h, type: 'history' })),
    ...(plannedHours ? [{ id: 'planned', type: 'planned' }] : []),
    ...workLogs.map(w => ({ ...w, type: 'worklog' })),
  ].sort((a, b) => new Date(b.createdAt || b.spent_on || issue.updated_on) - new Date(a.createdAt || a.spent_on || issue.updated_on));

  const getItemCount = () => {
    switch (activeFilter) {
      case 'All': return allItems.length;
      case 'Comments': return comments.length;
      case 'History': return historyItems.length;
      case 'Work log': {
        const estimateChanges = historyItems.filter(item =>
          item.details.some(d => d.prop_key === 'estimated_hours')
        ).length;
        return (plannedHours ? 1 : 0) + workLogs.length + estimateChanges;
      }
      default: return 0;
    }
  };
  const itemCount = getItemCount();
  const sortedComments = sortOrder === 'oldest' ? [...comments].reverse() : comments;
  const sortedAllItems = sortOrder === 'oldest' ? [...allItems].reverse() : allItems;
  const sortedHistoryItems = sortOrder === 'oldest' 
    ? [...historyItems].reverse() 
    : historyItems;
  const renderContent = () => {
    switch (activeFilter) {
      case 'All':
        return sortedAllItems.map(item => {
          if (item.type === 'history') return <HistoryItem key={item.id} item={item} />;
          if (item.type === 'planned') return <PlannedHoursItem key="planned" />;
          if (item.type === 'worklog') return <WorkLogItem key={item.id} entry={item} />;
          return <Comment key={item.id} comment={item} />;
        });

      case 'Comments':
        return sortedComments.map(c => <Comment key={c.id} comment={c} />);

      case 'History':
        return sortedHistoryItems.map(h => <HistoryItem key={h.id} item={h} />);

      case 'Work log':
        if (loadingWL) return <div>Loading work log...</div>;
        const estimateChanges = historyItems.filter(item =>
          item.details.some(d => d.prop_key === 'estimated_hours')
        );
        return (
          <>
            {plannedHours && <PlannedHoursItem />}
            {estimateChanges.map(item => (
              <EstimateChangeItem key={item.id} item={item} />
            ))}
            {workLogs.map(w => <WorkLogItem key={w.id} entry={w} />)}
            {!plannedHours && estimateChanges.length === 0 && workLogs.length === 0 && <div>No time logged</div>}
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif" }}>
      <Create issueId={issue.id} fetchIssue={fetchIssue} currentUser={currentUser} />
      <div
        style={{
          marginTop: 16,
          maxHeight: itemCount > 4 ? '400px' : 'none',
          overflowY: itemCount > 4 ? 'auto' : 'visible',
        }}
      >
        {renderContent()}
      </div>
    </div>
  );
};

ProjectBoardIssueDetailsComments.propTypes = {
  issue: PropTypes.object.isRequired,
  fetchIssue: PropTypes.func.isRequired,
  currentUser: PropTypes.object,
  activeFilter: PropTypes.string,
  statuses: PropTypes.array,
  priorities: PropTypes.array,
};

export default ProjectBoardIssueDetailsComments;