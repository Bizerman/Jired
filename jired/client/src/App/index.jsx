import React, { Fragment } from 'react';
import { LanguageProvider } from 'context/LanguageContext';
import NormalizeStyles from './NormalizeStyles';
import BaseStyles from './BaseStyles';
import Toast from './Toast';
import Routes from './Routes';
import './fontStyles.css';

const App = () => (
  <LanguageProvider>
    <NormalizeStyles />
    <BaseStyles />
    <Toast />
    <Routes />
  </LanguageProvider>
);

export default App;