import React, { useEffect, useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { useFormikContext, Field } from 'formik';

import toast from 'shared/utils/toast';
import useApi from 'shared/hooks/api';
import { Form } from 'shared/components';
import { color } from 'shared/utils/styles';
import { Icon } from 'shared/components';
import bgImage from 'App/assets/imgs/project-creation.svg';
import bgImageBoard from 'App/assets/imgs/project-creation-board.svg';
import defaultProjectIcon from 'App/assets/imgs/projectdefault.svg';
import { AccessSelect } from './AccessSelect';

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
} from './Styles';

// Кастомный чекбокс
const CheckboxField = ({ name, label }) => {
  const { values, setFieldValue } = useFormikContext();
  const checked = values[name];
  return (
    <label
      style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, cursor: 'pointer', userSelect: 'none' }}
      onClick={() => setFieldValue(name, !checked)}
    >
      <span
        style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: 20, height: 20, border: `1px solid ${color.borderLight}`, borderRadius: 3,
          background: checked ? color.primary : '#fff', color: '#fff',
          transition: 'background 0.15s', flexShrink: 0, userSelect: 'none',
        }}
      >
        {checked && <span style={{ fontWeight: 'bold', fontSize: 14, lineHeight: 1 }}>✓</span>}
      </span>
      <span>{label}</span>
    </label>
  );
};

const IdentifierAutoGenerator = () => {
  const { values, setFieldValue } = useFormikContext();
  useEffect(() => {
    if (values.name && values.name.trim() !== '') {
      const identifier = values.name
        .toLowerCase()
        .replace(/[^a-z0-9-_]/g, '-')
        .replace(/--+/g, '-')
        .replace(/^-|-$/g, '')
        .substring(0, 100);
      setFieldValue('identifier', identifier, false);
    }
  }, [values.name, setFieldValue]);
  return null;
};

const ProjectCreate = () => {
  const history = useHistory();
  const [{ isCreating }, createProject] = useApi.post('/projects.json');

  // Состояния иконки и цвета
  const [icon, setIcon] = useState(null);
  const [iconPreview, setIconPreview] = useState(null);
  const [iconBgColor, setIconBgColor] = useState(color.backgroundMedium);
  const isMounted = useRef(true);

  // Состояние «Show more»
  const [showAdvanced, setShowAdvanced] = useState(false);

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
        if (icon) {
          localStorage.setItem(`project_icon_${projectId}`, icon);
        }
        localStorage.setItem(`project_icon_bg_${projectId}`, iconBgColor);
        localStorage.setItem('currentProjectId', projectId);

        try {
          const stored = JSON.parse(localStorage.getItem('recentProjects') || '[]');
          const updated = [projectId, ...stored.filter(id => id !== projectId)].slice(0, 5);
          localStorage.setItem('recentProjects', JSON.stringify(updated));
        } catch (e) {}

        toast.success('Project created!');
        history.push('/project/board');
        window.location.reload();
      } else {
        throw new Error('Project ID not received');
      }
    } catch (error) {
      Form.handleAPIError(error, form);
    }
  };

  return (
    <PageWrapper>
      <TopBar>
        <BackBtn onClick={() => history.goBack()}>← Back to projects</BackBtn>
      </TopBar>
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
            <IdentifierAutoGenerator />
            <LeftPanel>
              <HeaderSection>
                <Title>Create project</Title>
                <DescriptionGroup>
                  <DescText>
                    Explore what’s possible when you collaborate with your team.
                    Edit project details anytime in project settings.
                  </DescText>
                  <RequiredNote>
                    <span>Required fields are marked with an asterisk </span>
                    <Asterisk>*</Asterisk>
                  </RequiredNote>
                </DescriptionGroup>
              </HeaderSection>

              <FormSection>
                <FormFields>
                  {/* Поле Name */}
                  <FieldGroup>
                    <FieldLabel><span>Name </span><Asterisk>*</Asterisk></FieldLabel>
                    <Field name="name">
                      {({ field }) => <StyledInput {...field} placeholder="e.g. Landing Page" />}
                    </Field>
                  </FieldGroup>

                  {/* Блок выбора иконки с label */}
                  <FieldGroup>
                    <FieldLabel>Project Icon</FieldLabel>
                    <IconCard>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <IconPreview bg={iconBgColor}>
                          <img
                            src={iconPreview || defaultProjectIcon}
                            alt=""
                            style={{ width: '70%', height: '70%', objectFit: 'contain' }}
                          />
                        </IconPreview>
                        <div style={{ flex: 1 }}>
                          <p style={{  margin: 0, fontWeight: 600, color: '#202020', fontSize: '1rem' }}>
                            Choose an icon
                          </p>
                          <p style={{ margin: '4px 0 0', color: '#7e7e7e', fontSize: '0.875rem' }}>
                            Upload an image and pick a background colour
                          </p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                        <UploadLabel>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleIconChange}
                            style={{ display: 'none' }}
                          />
                          Choose image
                        </UploadLabel>
                        <ColorInputLabel>
                          <ColorInput
                            type="color"
                            value={iconBgColor}
                            onChange={(e) => setIconBgColor(e.target.value)}
                          />
                          Background
                        </ColorInputLabel>
                      </div>
                    </IconCard>
                  </FieldGroup>

                  <ShowMoreBtn onClick={() => setShowAdvanced(!showAdvanced)}>
                    <Icon type={showAdvanced ? 'chevron-up' : 'chevron-down'} size={16} />
                    <span>{showAdvanced ? 'Show less' : 'Show more'}</span>
                  </ShowMoreBtn>

                  {/* Сворачиваемые поля */}
                  {showAdvanced && (
                    <>
                      <KeyField>
                        <FieldLabel><span>Key </span><Asterisk>*</Asterisk></FieldLabel>
                        <Field name="identifier">
                          {({ field }) => <KeyInput {...field} placeholder="LP" maxLength={10} readOnly />}
                        </Field>
                      </KeyField>

                      <FieldGroup>
                        <FieldLabel>Description</FieldLabel>
                        <Field name="description">
                          {({ field }) => <StyledInput {...field} placeholder="Optional description" />}
                        </Field>
                      </FieldGroup>

                      <FieldGroup>
                        <FieldLabel>Access</FieldLabel>
                        <AccessSelect />
                      </FieldGroup>

                      <CheckboxField name="inherit_members" label="Inherit members" />
                    </>
                  )}
                </FormFields>

                <SubmitButton
                  onClick={formik.submitForm}
                  disabled={formik.isSubmitting || isCreating}
                >
                  {formik.isSubmitting || isCreating ? 'Creating...' : 'Create Project'}
                </SubmitButton>
              </FormSection>
            </LeftPanel>

            <RightPanel bg={bgImage}>
              <div
                style={{
                  width: '100%',
                  height: 0,
                  paddingBottom: '75%',
                  background: `url(${bgImageBoard}) center/contain no-repeat`,
                  pointerEvents: 'none',
                  userSelect: 'none',
                }}
              />
            </RightPanel>
          </MainContainer>
        )}
      </Form>
    </PageWrapper>
  );
};

export default ProjectCreate;