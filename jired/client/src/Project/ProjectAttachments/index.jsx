import React, { useMemo, useState } from 'react';
import { Modal, Icon } from 'shared/components';           // ← добавлен Icon
import { useLanguage } from 'context/LanguageContext';
import { getStoredAuthToken } from 'shared/utils/authToken';
import toast from 'shared/utils/toast';

import {
  Container,
  TableWrapper,
  Table,
  Th,
  Td,
  DownloadButton,
  DeleteButton,
  DeleteModalContent,          // ← новые стили
  DeleteModalTitle,
  DeleteModalMessage,
  DeleteModalActions,
  DeleteModalCancelButton,
  DeleteModalConfirmButton,
  Empty,
  IssueLink,
} from './Styles';

const DownloadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
    <path
      d="M9 2V11M9 11L5 7M9 11L13 7M2 13V15C2 15.5523 2.44772 16 3 16H15C15.5523 16 16 15.5523 16 15V13"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
    />
  </svg>
);

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
    <path
      d="M3 5H15M7 5V3.5C7 3.22386 7.22386 3 7.5 3H10.5C10.7761 3 11 3.22386 11 3.5V5M13 5V14.5C13 15.3284 12.3284 16 11.5 16H6.5C5.67157 16 5 15.3284 5 14.5V5H13Z"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
    />
  </svg>
);

const ProjectAttachments = ({ project, fetchProject }) => {
  const { t } = useLanguage();
  const apiKey = getStoredAuthToken() || '';

  const [deleteTarget, setDeleteTarget]   = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const attachments = useMemo(() => {
    const list = [];
    (project.issues || []).forEach(issue => {
      (issue.attachments || []).forEach(att => {
        list.push({
          ...att,
          issueId:    issue.id,
          issueTitle: issue.subject || issue.title || '',
        });
      });
    });
    return list;
  }, [project]);

  const handleDownload = async (att) => {
    try {
      const url = `/redmine/attachments/download/${att.id}/${encodeURIComponent(att.filename)}`;
      const response = await fetch(url, { headers: { 'X-Redmine-API-Key': apiKey } });
      if (!response.ok) throw new Error(`Download failed: ${response.status}`);
      const blob    = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = att.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error('Download error:', err);
      toast.error(t('downloadFailed') || 'Could not download file');
    }
  };

  const handleDeleteClick = (att) => {
    setDeleteTarget(att);
    setIsConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      const response = await fetch(`/redmine/attachments/${deleteTarget.id}.json`, {
        method: 'DELETE',
        headers: { 'X-Redmine-API-Key': apiKey },
      });
      if (!response.ok) throw new Error('Delete failed');
      toast.success(t('fileDeleted') || 'File deleted');
      setIsConfirmOpen(false);
      setDeleteTarget(null);
      fetchProject?.();
    } catch (err) {
      console.error('Delete error:', err);
      toast.error(t('deleteFailed') || 'Could not delete file');
    }
  };

  const handleDeleteCancel = () => {
    setIsConfirmOpen(false);
    setDeleteTarget(null);
  };

  if (attachments.length === 0) {
    return <Empty>{t('noAttachments') || 'No attachments'}</Empty>;
  }

  return (
    <Container>
      <TableWrapper>
        <Table>
          <thead>
            <tr>
              <Th>{t('fileName') || 'File'}</Th>
              <Th>{t('issue')    || 'Issue'}</Th>
              <Th>{t('size')     || 'Size'}</Th>
              <Th>{t('date')     || 'Date'}</Th>
              <Th />
            </tr>
          </thead>
          <tbody>
            {attachments.map(att => (
              <tr key={att.id}>
                <Td>{att.filename}</Td>
                <Td>
                  <IssueLink>ISSUE-{att.issueId}:</IssueLink> {att.issueTitle}
                </Td>
                <Td>{((att.filesize || 0) / 1024).toFixed(2)} KB</Td>
                <Td>{new Date(att.created_on).toLocaleDateString()}</Td>
                <Td>
                  <DownloadButton
                    onClick={() => handleDownload(att)}
                    title={t('download') || 'Download'}
                  >
                    <DownloadIcon />
                  </DownloadButton>
                  <DeleteButton
                    onClick={() => handleDeleteClick(att)}
                    title={t('delete') || 'Delete'}
                  >
                    <TrashIcon />
                  </DeleteButton>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableWrapper>

      <Modal
        isOpen={isConfirmOpen}
        width="480px"
        onClose={handleDeleteCancel}
        renderContent={() => (
          <DeleteModalContent>
            <DeleteModalTitle>{t('deleteAttachmentTitle') || 'Delete Attachment'}</DeleteModalTitle>
            <DeleteModalMessage>
              {t('deleteAttachmentMessage', { fileName: deleteTarget?.filename }) ||
                `Are you sure you want to delete "${deleteTarget?.filename}"?`}
            </DeleteModalMessage>
            <DeleteModalActions>
              <DeleteModalCancelButton onClick={handleDeleteCancel}>
                {t('cancel') || 'Cancel'}
              </DeleteModalCancelButton>
              <DeleteModalConfirmButton onClick={handleDeleteConfirm}>
                <Icon type="trash" size={16} color="currentColor" />
                {t('delete') || 'Delete'}
              </DeleteModalConfirmButton>
            </DeleteModalActions>
          </DeleteModalContent>
        )}
      />
    </Container>
  );
};

export default ProjectAttachments;
