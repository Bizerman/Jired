import React, { useState } from 'react';
import PropTypes from 'prop-types';
import api from 'shared/utils/api';
import toast from 'shared/utils/toast';
import { Button, Modal, Icon } from 'shared/components';
import { useLanguage } from 'context/LanguageContext';
import {
  DeleteModalContent,
  DeleteModalTitle,
  DeleteModalMessage,
  DeleteModalActions,
  DeleteModalCancelButton,
  DeleteModalConfirmButton,
} from './DeleteStyles';

const propTypes = {
  issue: PropTypes.object.isRequired,
  fetchProject: PropTypes.func.isRequired,
  modalClose: PropTypes.func.isRequired,
};

const ProjectBoardIssueDetailsDelete = ({ issue, fetchProject, modalClose }) => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await api.delete(`/issues/${issue.id}.json`);
      await fetchProject();
      modalClose();
    } catch (error) {
      toast.error(t('issueDeleteFailed') || 'Failed to delete issue');
    }
  };

  return (
    <>
      <Button
        icon="trash"
        iconSize={19}
        variant="empty"
        onClick={() => setIsOpen(true)}
      />
      <Modal
        isOpen={isOpen}
        width="480px"
        onClose={() => setIsOpen(false)}
        renderContent={() => (
          <DeleteModalContent>
            <DeleteModalTitle>
              {t('deleteIssueTitle') || 'Delete Issue'}
            </DeleteModalTitle>
            <DeleteModalMessage>
              {t('deleteIssueMessage', { issueId: issue.id }) ||
                `Are you sure you want to permanently delete ISSUE-${issue.id}? This action cannot be undone.`}
            </DeleteModalMessage>
            <DeleteModalActions>
              <DeleteModalCancelButton onClick={() => setIsOpen(false)}>
                {t('cancel') || 'Cancel'}
              </DeleteModalCancelButton>
              <DeleteModalConfirmButton onClick={handleDelete}>
                <Icon type="trash" size={16} color="currentColor" />
                {t('delete') || 'Delete'}
              </DeleteModalConfirmButton>
            </DeleteModalActions>
          </DeleteModalContent>
        )}
      />
    </>
  );
};

ProjectBoardIssueDetailsDelete.propTypes = propTypes;
export default ProjectBoardIssueDetailsDelete;