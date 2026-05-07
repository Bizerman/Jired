import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { useFormikContext, Field } from 'formik';
import { Icon } from 'shared/components';
import toast from 'shared/utils/toast';
import useApi from 'shared/hooks/api';
import { Form, Breadcrumbs, Modal } from 'shared/components';
import { color as colorConst, color } from 'shared/utils/styles';
import { useLanguage } from 'context/LanguageContext';
import { AccessSelect } from '../../ProjectCreate/AccessSelect';
import defaultProjectIcon from 'App/assets/imgs/projectdefault.svg';

import {
  FormCont,
  FormElement,
  FormHeading,
  SubmitButton,
  DeleteButton,
  IconCard,
  IconPreview,
  UploadLabel,
  ColorInputLabel,
  ColorInput,
  FormFields,
  FieldGroup,
  FieldLabel,
  StyledInput,
  KeyField,
  KeyInput,
  RequiredNote,
  Asterisk,
  DeleteModalContent,
  DeleteModalTitle,
  DeleteModalMessage,
  DeleteModalActions,
  DeleteModalCancelButton,
  DeleteModalConfirmButton,
  DeleteIconWrapper,
  TrashIcon,
} from './Styles';

const propTypes = {
  project: PropTypes.object.isRequired,
  fetchProject: PropTypes.func.isRequired,
};

const CheckboxField = ({ name, label }) => {
  const { values, setFieldValue } = useFormikContext();
  const checked = values[name];

  return (
    <label
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        cursor: 'pointer', userSelect: 'none', width: 'fit-content'
      }}
      onClick={() => setFieldValue(name, !checked)}
    >
      <span
        style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: 18, height: 18, border: `1px solid ${color.borderLight}`, borderRadius: 4,
          background: checked ? color.primary : '#fff', color: '#fff',
          transition: 'background 0.15s', flexShrink: 0,
        }}
      >
        {checked && <span style={{ fontWeight: 'bold', fontSize: 12, lineHeight: 1 }}>✓</span>}
      </span>
      <span style={{ fontSize: '15px', color: '#3f3f3f' }}>{label}</span>
    </label>
  );
};

const ProjectSettings = ({ project, fetchProject }) => {
  const [{ isUpdating }, updateProject] = useApi.put(`/projects/${project.id}.json`);
  const [{ isDeleting }, deleteProject] = useApi.delete(`/projects/${project.id}.json`);
  const { t } = useLanguage();

  const [icon, setIcon] = useState(null);
  const [iconPreview, setIconPreview] = useState(null);
  const [iconBgColor, setIconBgColor] = useState(color.backgroundMedium);

  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const isMounted = useRef(true);
  const history = useHistory();
  useEffect(() => {
    return () => { isMounted.current = false; };
  }, []);

  useEffect(() => {
    const savedIcon = localStorage.getItem(`project_icon_${project.id}`);
    if (savedIcon) {
      setIcon(savedIcon);
      setIconPreview(savedIcon);
    }
    const savedBg = localStorage.getItem(`project_icon_bg_${project.id}`);
    if (savedBg) setIconBgColor(savedBg);
  }, [project.id]);

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
    const { identifier, access, ...rest } = values;
    const payload = {
      project: {
        ...rest,
        is_public: access === 'open',
      },
    };

    try {
      await updateProject(payload);

      if (icon) {
        localStorage.setItem(`project_icon_${project.id}`, icon);
      } else {
        localStorage.removeItem(`project_icon_${project.id}`);
      }
      localStorage.setItem(`project_icon_bg_${project.id}`, iconBgColor);

      await fetchProject();
      toast.success(t('changesSaved'));
      window.dispatchEvent(new CustomEvent('project-icon-updated', { detail: project.id }));
      window.location.href = '/project/board';
    } catch (error) {
      console.error('Update failed:', error);
      Form.handleAPIError(error, form);
    }
  };

  const handleDeleteClick = () => setDeleteModalOpen(true);
  const handleDeleteCancel = () => setDeleteModalOpen(false);

  const handleDeleteConfirm = async () => {
    try {
      await deleteProject();
      try {
        const recent = JSON.parse(localStorage.getItem('recentProjects') || '[]');
        const updated = recent.filter(id => id !== project.id);
        localStorage.setItem('recentProjects', JSON.stringify(updated));
      } catch (e) {}
      
      localStorage.removeItem('currentProjectId');
      toast.success(t('projectDeleted'));
      window.location.href = '/project/board';
    } catch (error) {
      toast.error(t('projectDeleteFailed'));
      setDeleteModalOpen(false);
    }
  };

  return (
    <>
      <Form
        initialValues={Form.initialValues(project, get => ({
          name: get('name'),
          identifier: get('identifier'),
          description: get('description'),
          homepage: get('homepage'),
          access: project.is_public ? 'open' : 'private',
          inherit_members: get('inherit_members', false),
        }))}
        validations={{
          name: [Form.is.required(), Form.is.maxLength(100)],
          identifier: [Form.is.required(), Form.is.maxLength(100)],
          homepage: Form.is.url(),
        }}
        onSubmit={handleSubmit}
      >
        {(formik) => (
          <FormCont>
            <FormElement>
              <Breadcrumbs items={['Projects', project.name, t('projectDetails')]} />
              <FormHeading>{t('projectDetails')}</FormHeading>

              <RequiredNote>
                <span>{t('requiredFieldsNote')} </span>
                <Asterisk>*</Asterisk>
              </RequiredNote>

              <FormFields style={{ marginTop: '24px' }}>
                <FieldGroup>
                  <FieldLabel><span>{t('name')} </span><Asterisk>*</Asterisk></FieldLabel>
                  <Field name="name">
                    {({ field }) => <StyledInput {...field} placeholder="e.g. Landing Page" />}
                  </Field>
                </FieldGroup>

                <FieldGroup>
                  <FieldLabel>{t('projectIcon')}</FieldLabel>
                  <IconCard>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <IconPreview bg={iconBgColor}>
                        <img
                          src={iconPreview || defaultProjectIcon}
                          alt=""
                          style={{ width: '65%', height: '65%', objectFit: 'contain' }}
                        />
                      </IconPreview>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontWeight: 500, color: '#202020', fontSize: '14px' }}>
                          {t('chooseIconDesc')}
                        </p>
                        <p style={{ margin: '2px 0 0', color: '#7e7e7e', fontSize: '12px' }}>
                          {t('uploadImageDesc')}
                        </p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                      <UploadLabel>
                        <input type="file" accept="image/*" onChange={handleIconChange} style={{ display: 'none' }} />
                        {t('chooseImage')}
                      </UploadLabel>
                      <ColorInputLabel>
                        <ColorInput type="color" value={iconBgColor} onChange={(e) => setIconBgColor(e.target.value)} />
                        {t('background')}
                      </ColorInputLabel>
                    </div>
                  </IconCard>
                </FieldGroup>

                <KeyField>
                  <FieldLabel>{t('identifier')}</FieldLabel>
                  <Field name="identifier">
                    {({ field }) => (
                      <KeyInput {...field} disabled title={t('identifierDisabledTip')} />
                    )}
                  </Field>
                </KeyField>

                <FieldGroup>
                  <FieldLabel style={{ marginBottom: 0 }}>{t('description')}</FieldLabel>
                  <Form.Field.TextEditor
                    name="description"
                    tip={t('descriptionTip')}
                  />
                </FieldGroup>

                <FieldGroup>
                  <FieldLabel>{t('homepage')}</FieldLabel>
                  <Field name="homepage">
                    {({ field }) => <StyledInput {...field} placeholder={t('homepagePlaceholder')} />}
                  </Field>
                </FieldGroup>

                <FieldGroup>
                  <FieldLabel>{t('access')}</FieldLabel>
                  <AccessSelect compact />
                </FieldGroup>
                <CheckboxField name="inherit_members" label={t('inheritMembers')} />
              </FormFields>

              <hr style={{ margin: '32px 0 24px', border: 'none', borderTop: `1px solid ${colorConst.borderLightest}` }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 32 }}>
                <SubmitButton onClick={formik.submitForm} disabled={formik.isSubmitting || isDeleting}>
                  {formik.isSubmitting ? t('saving') : t('saveChanges')}
                </SubmitButton>
                <DeleteButton type="button" onClick={handleDeleteClick} disabled={isDeleting || formik.isSubmitting}>
                  {isDeleting ? t('deleting') : t('deleteProject')}
                </DeleteButton>
              </div>
            </FormElement>
          </FormCont>
        )}
      </Form>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        testid="modal:delete-project-confirm"
        width={480}
        renderContent={() => (
          <DeleteModalContent>
            <DeleteModalTitle>{t('deleteProjectTitle')}</DeleteModalTitle>
            <DeleteModalMessage>
              {t('deleteProjectMessage', { projectName: project.name })}
            </DeleteModalMessage>
            <DeleteModalActions>
              <DeleteModalCancelButton onClick={handleDeleteCancel} disabled={isDeleting}>
                {t('cancel')}
              </DeleteModalCancelButton>
              <DeleteModalConfirmButton onClick={handleDeleteConfirm} disabled={isDeleting}>
                <Icon type="trash" size={16} color="currentColor" />
                {isDeleting ? t('deleting') : t('deleteProject')}
              </DeleteModalConfirmButton>
            </DeleteModalActions>
          </DeleteModalContent>
        )}
      />
    </>
  );
};

ProjectSettings.propTypes = propTypes;
export default ProjectSettings;