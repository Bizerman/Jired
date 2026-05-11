import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { color, font } from 'shared/utils/styles';
import { Avatar, Modal } from 'shared/components';
import ProjectBoardIssueDetails from '../Board/IssueDetails';
import { useLanguage } from 'context/LanguageContext';

// === СТИЛИ ===
const Container = styled.div` margin-top: 20px; `;

const Filters = styled.div`
  display: flex; gap: 15px; margin-bottom: 20px; flex-wrap: wrap;
`;

const SearchInput = styled.input`
  padding: 8px 12px; border: 1px solid ${color.borderLight}; border-radius: 4px;
  font-size: 14px; width: 250px; ${font.regular}
  &:focus { outline: none; border-color: ${color.primary}; }
`;

const Select = styled.select`
  padding: 8px 12px; border: 1px solid ${color.borderLight}; border-radius: 4px;
  font-size: 14px; background: white; ${font.regular} cursor: pointer;
  &:focus { outline: none; border-color: ${color.primary}; }
`;

const Table = styled.table`
  width: 100%; border-collapse: collapse; ${font.regular} font-size: 14px;
`;

const Th = styled.th`
  text-align: left; padding: 12px 16px; background: ${color.backgroundLightest};
  border-bottom: 2px solid ${color.borderLight}; color: ${color.textMedium};
  font-weight: 500; cursor: pointer; user-select: none; white-space: nowrap;
  &:hover { background: ${color.backgroundLight}; }
`;

const Td = styled.td`
  padding: 12px 16px; border-bottom: 1px solid ${color.borderLightest}; color: ${color.textDark};
`;

const Badge = styled.span`
  display: inline-block; padding: 2px 8px; border-radius: 3px;
  font-size: 12px; font-weight: 500;
  background: ${props => props.bg || '#ddd'}; color: ${props => props.color || '#333'};
`;

const AssigneeList = styled.div`
  display: flex; align-items: center; gap: 6px;
`;

const EmptyMessage = styled.div`
  text-align: center; padding: 40px; color: ${color.textMedium}; font-size: 16px;
`;

const TableRow = styled.tr`
  cursor: pointer; transition: background 0.1s;
  &:hover { background: ${color.backgroundLightest}; }
`;

// === КОНСТАНТЫ ===
const statusColors = {
  backlog: { bg: '#e8e1e1', textColor: '#5e3f3f' },
  inprogress: { bg: '#fde8e8', textColor: '#ad1e1e' },
  done: { bg: '#e4fcef', textColor: '#0B875B' },
};

const priorityColorByName = {
  low:      { bg: '#e9e9e9', color: '#5e5e5e' },
  medium:   { bg: '#e3f2fd', color: '#1565c0' },
  high:     { bg: '#fff3e0', color: '#e65100' },
  critical: { bg: '#fde8e8', color: '#b71c1c' },
};

const statusKeyMap = {
  backlog: 'backlog',
  inprogress: 'inProgress',
  done: 'done',
};

// === КОМПОНЕНТ ===
const ProjectIssues = ({ project, updateIssue, currentUser }) => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [sortField, setSortField] = useState('id');
  const [sortAsc, setSortAsc] = useState(true);

  const [selectedIssueId, setSelectedIssueId] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const issues = project.issues || [];
  const users = project.users || [];
  const priorities = project.priorities || [];
  const statuses = project.statuses || [];

  const priorityMap = useMemo(() => {
    const map = {};
    priorities.forEach(p => { map[p.id] = p; });
    return map;
  }, [priorities]);

  const getPriorityName = (priorityId) => {
    const p = priorityMap[priorityId];
    return p?.name || '—';
  };

  const getPriorityColor = (priorityId) => {
    const name = getPriorityName(priorityId)?.toLowerCase();
    return priorityColorByName[name] || { bg: '#eee', color: '#333' };
  };

  const getUserInfo = (issue) => {
    const userId = issue.userIds?.[0];
    const user = users.find(u => u.id === userId);
    if (user) {
      return {
        name: user.name || `User ${user.id}`,
        avatarUrl: user.avatar_url || null,
      };
    }
    const assigned = issue.assigned_to;
    if (assigned?.name) {
      return {
        name: assigned.name,
        avatarUrl: null,
      };
    }
    return null;
  };

  const filteredIssues = useMemo(() => {
    let filtered = issues.filter(issue => {
      const matchSearch = !searchTerm || issue.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = !statusFilter || issue.statusKey === statusFilter;
      const matchPriority = !priorityFilter || issue.priority_id === parseInt(priorityFilter);
      return matchSearch && matchStatus && matchPriority;
    });

    filtered.sort((a, b) => {
      let aVal, bVal;
      switch (sortField) {
        case 'id': aVal = a.id; bVal = b.id; break;
        case 'title':
          aVal = a.title.toLowerCase(); bVal = b.title.toLowerCase();
          return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        case 'status': aVal = a.statusKey || ''; bVal = b.statusKey || ''; break;
        case 'priority': aVal = a.priority_id || 0; bVal = b.priority_id || 0; break;
        case 'assignee': {
          const aUser = getUserInfo(a);
          const bUser = getUserInfo(b);
          aVal = aUser?.name?.toLowerCase() || '';
          bVal = bUser?.name?.toLowerCase() || '';
          return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        }
        case 'updated': aVal = new Date(a.updatedAt); bVal = new Date(b.updatedAt); break;
        default: return 0;
      }
      if (sortAsc) return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      else return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
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

  const handleUpdateIssue = (issueId, changes) => {
    updateIssue(issueId, changes);
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
        <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">{t('allStatuses') || 'All statuses'}</option>
          <option value="backlog">{t('backlog') || 'Backlog'}</option>
          <option value="inprogress">{t('inprogress') || 'In Progress'}</option>
          <option value="done">{t('done') || 'Done'}</option>
        </Select>
        <Select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}>
          <option value="">{t('allPriorities') || 'All priorities'}</option>
          {priorities.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </Select>
      </Filters>

      {filteredIssues.length > 0 ? (
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
              const status = statusColors[issue.statusKey] || { bg: '#eee', textColor: '#333' };
              const priorityColor = getPriorityColor(issue.priority_id);
              const priorityName = getPriorityName(issue.priority_id);
              const assignee = getUserInfo(issue);
              return (
                <TableRow key={issue.id} onClick={() => handleRowClick(issue.id)}>
                  <Td>{issue.id}</Td>
                  <Td>{issue.title}</Td>
                  <Td>
                    <Badge bg={status.bg} color={status.textColor}>
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
                        <Avatar
                          name={assignee.name}
                          avatarUrl={assignee.avatarUrl}
                          size={24}
                        />
                        <span>{assignee.name}</span>
                      </AssigneeList>
                    ) : (
                      <span>-</span>
                    )}
                  </Td>
                  <Td>{new Date(issue.updatedAt).toLocaleDateString()}</Td>
                </TableRow>
              );
            })}
          </tbody>
        </Table>
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
              fetchProject={() => {}}
              updateLocalProjectIssues={handleUpdateIssue}
              modalClose={() => setIsDetailModalOpen(false)}
            />
          )}
        />
      )}
    </Container>
  );
};

export default ProjectIssues;