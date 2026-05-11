import React, { useMemo } from 'react';
import styled from 'styled-components';
import { color, font } from 'shared/utils/styles';
import { useLanguage } from 'context/LanguageContext';

const Container = styled.div` margin-top: 20px; `;

const Table = styled.table`
  width: 100%; border-collapse: collapse; ${font.regular} font-size: 14px;
`;

const Th = styled.th`
  text-align: left; padding: 12px 16px; background: ${color.backgroundLightest};
  border-bottom: 2px solid ${color.borderLight}; color: ${color.textMedium};
  font-weight: 500;
`;

const Td = styled.td`
  padding: 12px 16px; border-bottom: 1px solid ${color.borderLightest}; color: ${color.textDark};
`;

const FileLink = styled.a`
  color: ${color.primary};
  text-decoration: none;
  &:hover { text-decoration: underline; }
`;

const Empty = styled.div`
  text-align: center; padding: 40px; color: ${color.textMedium}; font-size: 16px;
`;

const ProjectAttachments = ({ project }) => {
  const { t } = useLanguage();
  const attachments = useMemo(() => {
    const list = [];
    (project.issues || []).forEach(issue => {
      (issue.attachments || []).forEach(att => {
        list.push({
          ...att,
          issueId: issue.id,
          issueTitle: issue.subject || issue.title || '',
        });
      });
    });
    return list;
  }, [project]);

  if (attachments.length === 0) {
    return <Empty>{t('noAttachments') || 'No attachments'}</Empty>;
  }

  return (
    <Container>
      <Table>
        <thead>
          <tr>
            <Th>{t('fileName') || 'File'}</Th>
            <Th>{t('size') || 'Size'}</Th>
            <Th>{t('date') || 'Date'}</Th>
            <Th>{t('issue') || 'Issue'}</Th>
            <Th>{t('download') || 'Download'}</Th>
          </tr>
        </thead>
        <tbody>
          {attachments.map(att => (
            <tr key={att.id}>
              <Td>{att.filename}</Td>
              <Td>{((att.filesize || 0) / 1024).toFixed(2)} KB</Td>
              <Td>{new Date(att.created_on).toLocaleDateString()}</Td>
              <Td>
                ISSUE-{att.issueId}: {att.issueTitle}
              </Td>
              <Td>
                <FileLink href={`/redmine/attachments/${att.id}/${encodeURIComponent(att.filename)}`} target="_blank">
                  {t('download') || 'Download'}
                </FileLink>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default ProjectAttachments;