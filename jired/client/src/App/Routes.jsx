import React from 'react';
import { Router, Switch, Route, Redirect } from 'react-router-dom';

import history from 'browserHistory';
import Project from 'Project';
import YourWork from '../YourWork';
import Authenticate from '../Authenticate';
import PageError from 'shared/components/PageError';
import AllProjects from '../AllProjects';

import PrivateRoute from 'shared/components/PrivateRoute';

const Routes = () => (
  <Router history={history}>
    <Switch>
      <Redirect exact from="/" to="/project" />
      <Route path="/authenticate" component={Authenticate} />
      <PrivateRoute path="/project" component={Project} />
      <PrivateRoute path="/projects" component={AllProjects} />
      <PrivateRoute path="/your-work" component={YourWork} />
      <Route component={PageError} />
    </Switch>
  </Router>
);

export default Routes;
