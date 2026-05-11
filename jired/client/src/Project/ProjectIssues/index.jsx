import React, { useState, useMemo } from 'react';
import { Avatar, Modal } from 'shared/components';
import ProjectBoardIssueDetails from '../Board/IssueDetails';
import { useLanguage } from 'context/LanguageContext';
import CustomSelect from './CustomSelect';

import {
  Container,
  Filters,
  SearchInput,
  Select,
  TableWrapper,
  Table,
  Th,
  Td,
  TableRow,
  Badge,
  AssigneeList,
  EmptyMessage,
} from './Styles';

// === КОНСТАНТЫ ===
const statusColors = {
  backlog:    { bg: '#e8e1e1', color: '#5e3f3f' },
  inprogress: { bg: '#fde8e8', color: '#ad1e1e' },
  done:       { bg: '#e4fcef', color: '#0B875B' },
};

const priorityColorByName = {
  low:      { bg: '#e9e9e9', color: '#5e5e5e' },
  medium:   { bg: '#e3f2fd', color: '#1565c0' },
  high:     { bg: '#fff3e0', color: '#e65100' },
  critical: { bg: '#fde8e8', color: '#b71c1c' },
};

const statusKeyMap = {
  backlog:    'backlog',
  inprogress: 'inProgress',
  done:       'done',
};

// === КОМПОНЕНТ ===
const ProjectIssues = ({ project, updateIssue, currentUser, fetchProject }) => {
  const { t } = useLanguage();

  const [searchTerm, setSearchTerm]       = useState('');
  const [statusFilter, setStatusFilter]   = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [sortField, setSortField]         = useState('id');
  const [sortAsc, setSortAsc]             = useState(true);
  const [selectedIssueId, setSelectedIssueId]     = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const issues     = project.issues     || [];
  const users      = project.users      || [];
  const priorities = project.priorities || [];

  const priorityMap = useMemo(() => {
    const map = {};
    priorities.forEach(p => { map[p.id] = p; });
    return map;
  }, [priorities]);

  const priorityNameToKey = {
  'Low': 'priorityLow',
  'Medium': 'priorityMedium',
  'Normal': 'priorityMedium',   // иногда Redmine отдаёт "Normal"
  'High': 'priorityHigh',
  'Critical': 'priorityCritical',
  'Urgent': 'priorityCritical',
};

  // Меняем getPriorityName
  // Оригинальное имя приоритета в нижнем регистре (для цвета)
  const getPriorityRawName = (priorityId) => {
    const p = priorityMap[priorityId];
    return (p?.name || 'medium').toLowerCase();
  };

  // Переведённое имя для показа в таблице
  const getPriorityDisplayName = (priorityId) => {
    const p = priorityMap[priorityId];
    const raw = p?.name || '—';
    const key = priorityNameToKey[raw];
    return key ? t(key) : raw;
  };

  // Цвет бейджа
  const getPriorityColor = (priorityId) => {
    const name = getPriorityRawName(priorityId);
    return priorityColorByName[name] || { bg: '#eee', color: '#333' };
  };

  const getUserInfo = (issue) => {
    const userId = issue.userIds?.[0];
    const user = users.find(u => u.id === userId);
    if (user) return { name: user.name || `User ${user.id}`, avatarUrl: user.avatar_url || null };
    const assigned = issue.assigned_to;
    if (assigned?.name) return { name: assigned.name, avatarUrl: null };
    return null;
  };

  const filteredIssues = useMemo(() => {
    let filtered = issues.filter(issue => {
      const matchSearch   = !searchTerm     || issue.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus   = !statusFilter   || issue.statusKey === statusFilter;
      const matchPriority = !priorityFilter || issue.priority_id === parseInt(priorityFilter);
      return matchSearch && matchStatus && matchPriority;
    });

    filtered.sort((a, b) => {
      let aVal, bVal;
      switch (sortField) {
        case 'id':
          aVal = a.id; bVal = b.id; break;
        case 'title':
          aVal = a.title.toLowerCase(); bVal = b.title.toLowerCase();
          return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        case 'status':
          aVal = a.statusKey || ''; bVal = b.statusKey || ''; break;
        case 'priority':
          aVal = a.priority_id || 0; bVal = b.priority_id || 0; break;
        case 'assignee': {
          aVal = (getUserInfo(a)?.name || '').toLowerCase();
          bVal = (getUserInfo(b)?.name || '').toLowerCase();
          return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        }
        case 'updated':
          aVal = new Date(a.updatedAt); bVal = new Date(b.updatedAt); break;
        default: return 0;
      }
      if (sortAsc) return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
    });

    return filtered;
  }, [issues, searchTerm, statusFilter, priorityFilter, sortField, sortAsc]);

  const handleSort = (field) => {
    if (sortField === field) setSortAsc(!sortAsc);
    else { setSortField(field); setSortAsc(true); }
  };

  const getSortIndicator = (field) =>
    sortField === field ? (sortAsc ? ' ↑' : ' ↓') : null;

  const handleRowClick = (issueId) => {
    setSelectedIssueId(issueId);
    setIsDetailModalOpen(true);
  };

  return (
    <Container>
      <Filters>
        <SearchInput
          type="text"
          placeholder={t('search') + '...'}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <CustomSelect
          value={statusFilter}
          options={[
            { value: '', label: t('allStatuses') || 'All statuses' },
            { value: 'backlog', label: t('backlog') || 'Backlog' },
            { value: 'inprogress', label: t('inprogress') || 'In Progress' },
            { value: 'done', label: t('done') || 'Done' },
          ]}
          onChange={setStatusFilter}
          width="200px"
        />
        <CustomSelect
          value={priorityFilter}
          options={[
            { value: '', label: t('allPriorities') || 'All priorities' },
            ...priorities.map(p => ({
              value: p.id,
              label: priorityNameToKey[p.name] ? t(priorityNameToKey[p.name]) : p.name,
            })),
          ]}
          onChange={setPriorityFilter}
          width="200px"
        />
      </Filters>

      {filteredIssues.length > 0 ? (
        <TableWrapper>
          <Table>
            <thead>
              <tr>
                <Th onClick={() => handleSort('id')}>{t('id')}{getSortIndicator('id')}</Th>
                <Th onClick={() => handleSort('title')}>{t('title')}{getSortIndicator('title')}</Th>
                <Th onClick={() => handleSort('status')}>{t('status')}{getSortIndicator('status')}</Th>
                <Th onClick={() => handleSort('priority')}>{t('priority')}{getSortIndicator('priority')}</Th>
                <Th onClick={() => handleSort('assignee')}>{t('assignee') || 'Assignee'}{getSortIndicator('assignee')}</Th>
                <Th onClick={() => handleSort('updated')}>{t('updated')}{getSortIndicator('updated')}</Th>
              </tr>
            </thead>
            <tbody>
              {filteredIssues.map(issue => {
                const status        = statusColors[issue.statusKey] || { bg: '#eee', color: '#333' };
                const priorityColor = getPriorityColor(issue.priority_id);
                const priorityName  = getPriorityDisplayName(issue.priority_id);
                const assignee      = getUserInfo(issue);
                return (
                  <TableRow key={issue.id} onClick={() => handleRowClick(issue.id)}>
                    <Td>{issue.id}</Td>
                    <Td>{issue.title}</Td>
                    <Td>
                      <Badge bg={status.bg} color={status.color}>
                        {t(statusKeyMap[issue.statusKey] || issue.statusKey) || 'Unknown'}
                      </Badge>
                    </Td>
                    <Td>
                      <Badge bg={priorityColor.bg} color={priorityColor.color}>
                        {priorityName}
                      </Badge>
                    </Td>
                    <Td>
                      {assignee ? (
                        <AssigneeList>
                          <Avatar name={assignee.name} avatarUrl={assignee.avatarUrl} size={24} />
                          <span>{assignee.name}</span>
                        </AssigneeList>
                      ) : (
                        <span style={{ color: '#866f6f' }}>—</span>
                      )}
                    </Td>
                    <Td>{new Date(issue.updatedAt).toLocaleDateString()}</Td>
                  </TableRow>
                );
              })}
            </tbody>
          </Table>
        </TableWrapper>
      ) : (
        <EmptyMessage>{t('noIssuesFound') || 'No issues found'}</EmptyMessage>
      )}

      {isDetailModalOpen && selectedIssueId && (
        <Modal
          isOpen
          testid="modal:issue-detail"
          withCloseIcon={false}
          width="60vw"
          onClose={() => setIsDetailModalOpen(false)}
          renderContent={() => (
            <ProjectBoardIssueDetails
              issueId={selectedIssueId}
              projectUsers={users}
              fetchProject={() => fetchProject(`/projects/${project.id}.json?include=issues`)}
              updateLocalProjectIssues={(issueId, changes) => updateIssue(issueId, changes)}
              modalClose={() => setIsDetailModalOpen(false)}
              onAttachmentUploaded={() => fetchProject(`/projects/${project.id}.json?include=issues`)}
            />
          )}
        />
      )}
    </Container>
  );
};

export default ProjectIssues;
