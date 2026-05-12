import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'formik';
import { Icon } from 'shared/components';
import toast from 'shared/utils/toast';
import useApi from 'shared/hooks/api';
import { Form, Breadcrumbs, Modal } from 'shared/components';
import { color } from 'shared/utils/styles';
import { useLanguage } from 'context/LanguageContext';
import CheckboxField from 'shared/components/CheckboxField';
import AccessSelect from '../../ProjectCreate/AccessSelect';
import defaultProjectIcon from '../../App/assets/imgs/projectdefault.svg';

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
  FormFieldsWrapper,
  Separator,
  ActionsWrapper,
} from './Styles';

const ProjectSettings = ({ project, fetchProject }) => {
  const [{ isUpdating }, updateProject] = useApi.put(`/projects/${project.id}.json`);
  const [{ isDeleting }, deleteProject] = useApi.delete(`/projects/${project.id}.json`);
  const { t } = useLanguage();

  const [icon, setIcon] = useState(null);
  const [iconPreview, setIconPreview] = useState(null);
  const [iconBgColor, setIconBgColor] = useState(color.backgroundMedium);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

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

  const handleDeleteConfirm = async () => {
    try {
      await deleteProject();
      const recent = JSON.parse(localStorage.getItem('recentProjects') || '[]');
      const updated = recent.filter(id => id !== project.id);
      localStorage.setItem('recentProjects', JSON.stringify(updated));
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
              <Breadcrumbs
                items={[
                  { label: t('projects'), to: '/projects' },
                  { label: project.name, to: '/project/board' },
                  t('projectDetails')
                ]}
              />
              <FormHeading>{t('projectDetails')}</FormHeading>

              <RequiredNote>
                <span>{t('requiredFieldsNote')} </span>
                <Asterisk>*</Asterisk>
              </RequiredNote>

              <FormFieldsWrapper>
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
                        <img src={iconPreview || defaultProjectIcon} alt="" />
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
                        <input type="file" accept="image/*" onChange={handleIconChange} hidden />
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
              </FormFieldsWrapper>

              <Separator />

              <ActionsWrapper>
                <SubmitButton
                  onClick={formik.submitForm}
                  disabled={formik.isSubmitting || isUpdating || isDeleting}
                >
                  {formik.isSubmitting || isUpdating ? t('saving') : t('saveChanges')}
                </SubmitButton>
                <DeleteButton
                  type="button"
                  onClick={() => setDeleteModalOpen(true)}
                  disabled={isDeleting || formik.isSubmitting || isUpdating}
                >
                  {isDeleting ? t('deleting') : t('deleteProject')}
                </DeleteButton>
              </ActionsWrapper>
            </FormElement>
          </FormCont>
        )}
      </Form>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        testid="modal:delete-project-confirm"
        width={480}
        renderContent={() => (
          <DeleteModalContent>
            <DeleteModalTitle>{t('deleteProjectTitle')}</DeleteModalTitle>
            <DeleteModalMessage>
              {t('deleteProjectMessage', { projectName: project.name })}
            </DeleteModalMessage>
            <DeleteModalActions>
              <DeleteModalCancelButton onClick={() => setDeleteModalOpen(false)} disabled={isDeleting}>
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

ProjectSettings.propTypes = {
  project: PropTypes.object.isRequired,
  fetchProject: PropTypes.func.isRequired,
};

export default ProjectSettings;