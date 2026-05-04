import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

import toast from 'shared/utils/toast';
import {
  getStoredAuthToken,
  storeAuthToken,
  removeStoredAuthToken,
} from 'shared/utils/authToken';

import projectIcon from '../favicon.png'; // импорт вашей иконки

import {
  PageContainer,
  Card,
  LogoRow,
  LogoImage,
  AppTitle,
  VerificationRow,
  StyledForm,
  Title,
  FieldsWrapper,
  FieldGroup,
  Label,
  InputWrapper,
  Input,
  Actions,
  SubmitButton,
  Hint,
  CheckingWrapper,
} from './Styles';

const Authenticate = () => {
  const history = useHistory();
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingExisting, setCheckingExisting] = useState(true);

  useEffect(() => {
    const existingToken = getStoredAuthToken();
    if (!existingToken) {
      setCheckingExisting(false);
      return;
    }

    axios
      .get('/redmine/users/current.json', {
        headers: {
          'X-Redmine-API-Key': existingToken,
          Accept: 'application/json',
        },
      })
      .then((response) => {
        if (response.data && response.data.user) {
          history.push('/your-work');
        } else {
          removeStoredAuthToken();
          setCheckingExisting(false);
        }
      })
      .catch(() => {
        removeStoredAuthToken();
        setCheckingExisting(false);
      });
  }, [history]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      toast.error('Please enter your API key');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get('/redmine/users/current.json', {
        headers: {
          'X-Redmine-API-Key': apiKey.trim(),
          Accept: 'application/json',
        },
      });

      if (!response.data || !response.data.user) {
        throw new Error('Server did not return valid user data');
      }

      storeAuthToken(apiKey.trim());
      toast.success('Login successful');
      history.push('/your-work');
    } catch (err) {
      console.error(err);
      removeStoredAuthToken();
      toast.error('Invalid API key. Check your Redmine account settings.');
    } finally {
      setLoading(false);
    }
  };

  if (checkingExisting) {
    return (
      <CheckingWrapper>
        <p>Checking saved API key…</p>
      </CheckingWrapper>
    );
  }

  return (
    <PageContainer>
      <Card>
        {/* Логотип + название */}
        <LogoRow>
          <LogoImage src={projectIcon} alt="Jired logo" />
          <AppTitle>Jired</AppTitle>
        </LogoRow>

        <VerificationRow>
          <span>API‑key verification</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="8" stroke="#12B76A" strokeWidth="2" fill="none" />
            <path
              d="M6 10l3 3 5-6"
              stroke="#12B76A"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </VerificationRow>

        <StyledForm onSubmit={handleSubmit}>
          <Title>Sign in with API‑key</Title>

          <FieldsWrapper>
            <FieldGroup>
              <Label>API‑Key</Label>
              <InputWrapper>
                <Input
                  placeholder="Paste your Redmine API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  type="password"
                />
              </InputWrapper>
            </FieldGroup>
          </FieldsWrapper>

          <Actions>
            <SubmitButton type="submit" disabled={loading || !apiKey.trim()}>
              {loading ? 'Verifying…' : 'Continue'}
            </SubmitButton>
            <Hint>
              Your API‑key is available in your Redmine account settings.
            </Hint>
          </Actions>
        </StyledForm>
      </Card>
    </PageContainer>
  );
};

export default Authenticate;