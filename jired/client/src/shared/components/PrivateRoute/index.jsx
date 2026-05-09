import React, { useState, useEffect } from 'react';
import { Route, Redirect, useLocation } from 'react-router-dom';
import axios from 'axios';
import { getStoredAuthToken, removeStoredAuthToken } from 'shared/utils/authToken';
import { PageLoader } from 'shared/components';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const [isValid, setIsValid] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const token = getStoredAuthToken();
    if (!token) {
      setIsValid(false);
      return;
    }

    axios
      .get('/redmine/users/current.json', {
        headers: {
          'X-Redmine-API-Key': token,
          Accept: 'application/json',
        },
      })
      .then(() => setIsValid(true))
      .catch(() => {
        removeStoredAuthToken();
        setIsValid(false);
      });
  }, []);

  if (isValid === null) {
    return <PageLoader />;
  }

  if (!isValid) {
    return <Redirect to={{ pathname: '/authenticate', state: { from: location } }} />;
  }

  return <Route {...rest} render={props => <Component {...props} />} />;
};

export default PrivateRoute;