import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';

import toast from 'shared/utils/toast';
import useApi from 'shared/hooks/api';
import api from 'shared/utils/api';
import { Form, Icon } from 'shared/components';
import { color } from 'shared/utils/styles';
import { useLanguage } from 'context/LanguageContext';

import defaultProjectIcon from 'App/assets/imgs/projectdefault.svg';
import bgImage from 'App/assets/imgs/project-creation.svg';

import AccessSelect from './AccessSelect';
import IdentifierGenerator from './IdentifierGenerator';
import CheckboxField from 'shared/components/CheckboxField';

import {
  PageWrapper,
  TopBar,
  BackBtn,
  MainContainer,
  LeftPanel,
  HeaderSection,
  Title,
  DescriptionGroup,
  DescText,
  RequiredNote,
  Asterisk,
  FormSection,
  FormFields,
  FieldGroup,
  FieldLabel,
  StyledInput,
  KeyField,
  KeyInput,
  RightPanel,
  SubmitButton,
  IconCard,
  IconPreview,
  UploadLabel,
  ColorInputLabel,
  ColorInput,
  ShowMoreBtn,
  IconTextContainer,
  IconTextContent,
  IconTextTitle,
  IconTextSubtitle,
  IconActions,
  BoardImagePreview,
} from './Styles';

const ProjectCreate = () => {
  const history = useHistory();
  const { t } = useLanguage();
  const [{ isCreating }, createProject] = useApi.post('/projects.json');
  const [{ data: projectsData }] = useApi.get('/projects.json');
  const hasProjects = (projectsData?.projects?.length || 0) > 0;
  const [icon, setIcon] = useState(null);
  const [iconPreview, setIconPreview] = useState(null);
  const [iconBgColor, setIconBgColor] = useState(color.backgroundMedium);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => { isMounted.current = false; };
  }, []);

  const handleIconChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (!isMounted.current) return;
      const dataUrl = ev.target.result;
      setIcon(dataUrl);
      setIconPreview(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const ensureDefaultStatuses = async () => {
    const required = [
      { name: 'Backlog', is_closed: false },
      { name: 'In Progress', is_closed: false },
      { name: 'Done', is_closed: true },
    ];
    const { issue_statuses } = await api.get('/issue_statuses.json');
    const existing = (issue_statuses || []).map(s => s.name.toLowerCase());
    for (const status of required) {
      if (!existing.includes(status.name.toLowerCase())) {
        try {
          await api.post('/extended_api/issue_statuses.json', { issue_status: status });
        } catch (err) {
          console.error(`Failed to create status "${status.name}"`, err);
        }
      }
    }
  };

  const handleSubmit = async (values, form) => {
    try {
      const payload = {
        project: {
          name: values.name,
          identifier: values.identifier,
          description: values.description,
          is_public: values.access === 'open',
          inherit_members: values.inherit_members,
        },
      };
      const response = await createProject(payload);
      const projectId = response?.project?.id;
      if (projectId) {
        await ensureDefaultStatuses();
        if (icon) localStorage.setItem(`project_icon_${projectId}`, icon);
        localStorage.setItem(`project_icon_bg_${projectId}`, iconBgColor);
        localStorage.setItem('currentProjectId', projectId);

        try {
          const stored = JSON.parse(localStorage.getItem('recentProjects') || '[]');
          const updated = [projectId, ...stored.filter(id => id !== projectId)].slice(0, 5);
          localStorage.setItem('recentProjects', JSON.stringify(updated));
        } catch (e) {}

        toast.success(t('projectCreated'));
        window.location.href = `/project/board?newProjectId=${projectId}`;
      } else {
        throw new Error('Project ID not received');
      }
    } catch (error) {
      Form.handleAPIError(error, form);
    }
  };

  return (
    <PageWrapper>
      {hasProjects && (
        <TopBar>
          <BackBtn onClick={() => history.goBack()}>{t('backToYourWork')}</BackBtn>
        </TopBar>
      )}
      <Form
        initialValues={{
          name: '',
          identifier: '',
          description: '',
          access: 'open',
          inherit_members: false,
        }}
        validations={{
          name: [Form.is.required(), Form.is.maxLength(100)],
          identifier: [Form.is.required(), Form.is.maxLength(100)],
        }}
        onSubmit={handleSubmit}
      >
        {(formik) => (
          <MainContainer>
            <IdentifierGenerator />
            <LeftPanel>
              <HeaderSection>
                <Title>{t('createProjectTitle')}</Title>
                <DescriptionGroup>
                  <DescText>{t('createProjectDesc')}</DescText>
                  <RequiredNote>
                    <span>{t('requiredFieldsNote')} </span>
                    <Asterisk>*</Asterisk>
                  </RequiredNote>
                </DescriptionGroup>
              </HeaderSection>

              <FormSection>
                <FormFields>
                  <FieldGroup>
                    <FieldLabel><span>{t('name')} </span><Asterisk>*</Asterisk></FieldLabel>
                    <Form.Field.Input
                      name="name"
                      placeholder={t('namePlaceholder')}
                      component={StyledInput}
                    />
                  </FieldGroup>

                  <FieldGroup>
                    <FieldLabel>{t('projectIcon')}</FieldLabel>
                    <IconCard>
                      <IconTextContainer>
                        <IconPreview bg={iconBgColor}>
                          <img
                            src={iconPreview || defaultProjectIcon}
                            alt=""
                            style={{ width: '70%', height: '70%', objectFit: 'contain' }}
                          />
                        </IconPreview>
                        <IconTextContent>
                          <IconTextTitle>{t('chooseIconDesc')}</IconTextTitle>
                          <IconTextSubtitle>{t('uploadImageDesc')}</IconTextSubtitle>
                        </IconTextContent>
                      </IconTextContainer>
                      <IconActions>
                        <UploadLabel>
                          <input type="file" accept="image/*" onChange={handleIconChange} hidden />
                          {t('chooseImage')}
                        </UploadLabel>
                        <ColorInputLabel>
                          <ColorInput
                            type="color"
                            value={iconBgColor}
                            onChange={(e) => setIconBgColor(e.target.value)}
                          />
                          {t('background')}
                        </ColorInputLabel>
                      </IconActions>
                    </IconCard>
                  </FieldGroup>

                  <ShowMoreBtn onClick={() => setShowAdvanced(!showAdvanced)}>
                    <Icon type={showAdvanced ? 'chevron-up' : 'chevron-down'} size={16} />
                    <span>{showAdvanced ? t('showLess') : t('showMore')}</span>
                  </ShowMoreBtn>

                  {showAdvanced && (
                    <>
                      <KeyField>
                        <FieldLabel><span>{t('key')} </span><Asterisk>*</Asterisk></FieldLabel>
                        <Form.Field.Input
                          name="identifier"
                          placeholder={t('keyPlaceholder') || 'LP'}
                          component={KeyInput}
                          maxLength={25}
                        />
                      </KeyField>

                      <FieldGroup>
                        <FieldLabel>{t('description')}</FieldLabel>
                        <Form.Field.TextEditor
                          name="description"
                          tip={t('optionalDescription')}
                        />
                      </FieldGroup>

                      <FieldGroup>
                        <FieldLabel>{t('access')}</FieldLabel>
                        <AccessSelect />
                      </FieldGroup>

                      <CheckboxField name="inherit_members" label={t('inheritMembers')} />
                    </>
                  )}
                </FormFields>

                <SubmitButton onClick={formik.submitForm} disabled={formik.isSubmitting || isCreating}>
                  {formik.isSubmitting || isCreating ? t('creating') : t('createProjectBtn')}
                </SubmitButton>
              </FormSection>
            </LeftPanel>

            <RightPanel bg={bgImage}>
              <BoardImagePreview />
            </RightPanel>
          </MainContainer>
        )}
      </Form>
    </PageWrapper>
  );
};

export default ProjectCreate;