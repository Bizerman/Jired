import React, { Fragment, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Route, useRouteMatch, useHistory } from 'react-router-dom';
import useApi from 'shared/hooks/api'
import useMergeState from 'shared/hooks/mergeState';
import { Breadcrumbs, Modal } from 'shared/components';
import MakeGroupModal from './MakeGroupModal';
import { useLocation } from 'react-router-dom';
import ProjectBoardHeader from './Header';
import Filters from './Filters';
import Lists from './Lists';
import IssueDetails from './IssueDetails';
import ProjectToolbar from './Toolbar';

const propTypes = {
  project: PropTypes.object.isRequired,
  fetchProject: PropTypes.func.isRequired,
  updateLocalProjectIssues: PropTypes.func.isRequired,
};

const defaultFilters = {
  searchTerm: '',
  userIds: [],
  myOnly: false,
  recent: false,
};

const ProjectBoard = ({ project, fetchProject, updateLocalProjectIssues, moveIssueInList, moveIssuesInColumn, updateAllIssues }) => {
  const [isMakeGroupOpen, setMakeGroupOpen] = useState(false);
  const match = useRouteMatch();
  const baseUrl = match.url.replace(/\/board$/, '');
  const history = useHistory();

  const [filters, mergeFilters] = useMergeState(defaultFilters);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const showOnlyDone = searchParams.get('done') === '1';
  const [priorities, setPriorities] = useState([]);
  const [{ data: prioritiesData }] = useApi.get('/enumerations/issue_priorities.json');
  const [groups, setGroups] = useState(() => {
    try {
      const saved = localStorage.getItem(`jired_groups_${project.id}`);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  useEffect(() => {
    if (groups !== null) {
      localStorage.setItem(`jired_groups_${project.id}`, JSON.stringify(groups));
    } else {
      localStorage.removeItem(`jired_groups_${project.id}`);
    }
  }, [groups, project.id]);
  useEffect(() => {
    if (prioritiesData?.issue_priorities) {
      setPriorities(prioritiesData.issue_priorities);
    }
  }, [prioritiesData]);
  const buildGroupedItems = useCallback((statusKey) => {
    const allIssues = project.issues || [];
    // задачи, не попавшие ни в одну группу
    const ungrouped = allIssues.filter(
      issue => issue.statusKey === statusKey && !groups?.some(g => g.tasks.includes(issue.id))
    );

    // группы, содержащие задачи с этим статусом
    const groupsForStatus = (groups || []).map(group => ({
      ...group,
      tasks: group.tasks.filter(taskId => {
        const task = allIssues.find(i => i.id === taskId);
        return task && task.statusKey === statusKey;
      }),
    })).filter(group => group.tasks.length > 0);

    return { ungrouped, groups: groupsForStatus };
  }, [project.issues, groups]);
  return (
    <Fragment>
      <ProjectBoardHeader project={project} />
      <ProjectToolbar baseUrl={baseUrl} />
      <Filters
        projectUsers={project.users}
        defaultFilters={{ searchTerm: '', userIds: [], myOnly: false, recent: false }}
        filters={filters}
        mergeFilters={mergeFilters}
        showOnlyDone={showOnlyDone}
        onClearDoneFilter={() => history.push('/project/board')}
        onMakeGroup={() => setMakeGroupOpen(true)}
      />
      <Lists
        project={project}
        filters={filters}
        groups={groups}
        onGroupsChange={setGroups}
        updateLocalProjectIssues={updateLocalProjectIssues}
        moveIssueInList={moveIssueInList}
        moveIssuesInColumn={moveIssuesInColumn}
        updateAllIssues={updateAllIssues}
        showOnlyDone={showOnlyDone}
      />
      <Route
        path={`${match.path}/issues/:issueId`}
        render={routeProps => (
          <Modal
            isOpen
            width="60vw"
            testid="modal:issue-details"
            withCloseIcon={false}
            onClose={() => history.push(match.url)}
            renderContent={modal => (
              <IssueDetails
                issueId={routeProps.match.params.issueId}
                projectUsers={project.users}
                fetchProject={fetchProject}
                updateLocalProjectIssues={updateLocalProjectIssues}
                modalClose={modal.close}
              />
            )}
          />
        )}
      />
      {isMakeGroupOpen && (
        <MakeGroupModal
          issues={project.issues}
          projectUsers={project.users}
          priorities={priorities}
          groups={groups}    
          onSaveGroups={setGroups}
          onClose={() => setMakeGroupOpen(false)}
        />
      )}
    </Fragment>
  );
};

ProjectBoard.propTypes = propTypes;

export default ProjectBoard;
