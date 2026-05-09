import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import axios from 'axios';

import toast from 'shared/utils/toast';
import {
  getStoredAuthToken,
  storeAuthToken,
  removeStoredAuthToken,
} from 'shared/utils/authToken';
import { useLanguage } from 'context/LanguageContext';

import projectIcon from '../favicon.png';

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
  const location = useLocation();
  const { t, locale, switchLanguage } = useLanguage();
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingExisting, setCheckingExisting] = useState(true);

  useEffect(() => {
    let mounted = true;
    const existingToken = getStoredAuthToken();
    if (!existingToken) {
      setCheckingExisting(false);
      return () => { mounted = false; };
    }

    axios.get('/redmine/users/current.json', {
      headers: { 'X-Redmine-API-Key': existingToken, Accept: 'application/json' },
    })
      .then(response => {
        if (!mounted) return;
        if (response.data?.user) {
          history.push(location.state?.from?.pathname || '/your-work');
        } else {
          removeStoredAuthToken();
          setCheckingExisting(false);
        }
      })
      .catch(() => {
        if (!mounted) return;
        removeStoredAuthToken();
        setCheckingExisting(false);
      });

    return () => { mounted = false; };
  }, [history, location.state?.from?.pathname]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      toast.error(t('enterApiKey'));
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
      toast.success(t('loginSuccess'));
      const from = location.state?.from?.pathname || '/your-work';
      history.push(from);
    } catch (err) {
      console.error(err);
      removeStoredAuthToken();
      toast.error(t('invalidApiKey'));
    } finally {
      setLoading(false);
    }
  };

  const toggleLanguage = () => {
    switchLanguage(locale === 'en' ? 'ru' : 'en');
  };

  if (checkingExisting) {
    return (
      <CheckingWrapper>
        <p>{t('checkingSaved')}</p>
      </CheckingWrapper>
    );
  }

  return (
    <PageContainer>
      {/* Кнопка смены языка справа сверху */}
      <div style={{ position: 'absolute', top: 20, right: 20 }}>
        <button
          onClick={toggleLanguage}
          style={{
            background: 'none',
            border: '1px solid #ccc',
            borderRadius: 4,
            padding: '4px 12px',
            cursor: 'pointer',
            fontSize: 14,
            color: '#333',
          }}
        >
          {locale.toUpperCase()}
        </button>
      </div>

      <Card>
        <LogoRow>
          <LogoImage src={projectIcon} alt="Jired logo" />
          <AppTitle>Jired</AppTitle>
        </LogoRow>

        <VerificationRow>
          <span>{t('apiVerification')}</span>
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
          <Title>{t('signInTitle')}</Title>

          <FieldsWrapper>
            <FieldGroup>
              <Label>{t('apiKeyLabel')}</Label>
              <InputWrapper>
                <Input
                  placeholder={t('apiKeyPlaceholder')}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  type="password"
                />
              </InputWrapper>
            </FieldGroup>
          </FieldsWrapper>

          <Actions>
            <SubmitButton type="submit" disabled={loading || !apiKey.trim()}>
              {loading ? t('verifying') : t('continueBtn')}
            </SubmitButton>
            <Hint>
              {t('apiKeyHint')}
            </Hint>
          </Actions>
        </StyledForm>
      </Card>
    </PageContainer>
  );
};

export default Authenticate;