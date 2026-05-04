import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Route, useRouteMatch, useHistory } from 'react-router-dom';

import useMergeState from 'shared/hooks/mergeState';
import { Breadcrumbs, Modal } from 'shared/components';
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

const ProjectBoard = ({ project, fetchProject, updateLocalProjectIssues, moveIssueInList, moveIssuesInColumn }) => {
  const match = useRouteMatch();
  const baseUrl = match.url.replace(/\/board$/, '');
  const history = useHistory();

  const [filters, mergeFilters] = useMergeState(defaultFilters);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const showOnlyDone = searchParams.get('done') === '1';

  return (
    <Fragment>
      <ProjectBoardHeader project={project} />
      <ProjectToolbar baseUrl={baseUrl} />
      <Filters
        projectUsers={project.users}
        defaultFilters={{ searchTerm: '', userIds: [], myOnly: false, recent: false }}
        filters={filters}
        mergeFilters={mergeFilters}
        showOnlyDone={showOnlyDone}                           // ← добавить
        onClearDoneFilter={() => history.push('/project/board')}  // ← добавить
      />
      <Lists
        project={project}
        filters={filters}
        updateLocalProjectIssues={updateLocalProjectIssues}
        moveIssueInList={moveIssueInList}
        moveIssuesInColumn={moveIssuesInColumn}
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
    </Fragment>
  );
};

ProjectBoard.propTypes = propTypes;

export default ProjectBoard;
