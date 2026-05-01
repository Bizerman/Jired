import React from 'react';
import { Router, Switch, Route, Redirect } from 'react-router-dom';

import history from 'browserHistory';
import Project from 'Project';
import YourWork from '../YourWork';
import Authenticate from 'Auth/Authenticate';
import PageError from 'shared/components/PageError';
import AllProjects from '../AllProjects';

const Routes = () => (
  <Router history={history}>
    <Switch>
      <Redirect exact from="/" to="/project" />
      <Route path="/authenticate" component={Authenticate} />
      <Route path="/project" component={Project} />
      <Route path="/projects" component={AllProjects} />
      <Route path="/your-work" component={YourWork} />
      <Route component={PageError} />
    </Switch>
  </Router>
);

export default Routes;
