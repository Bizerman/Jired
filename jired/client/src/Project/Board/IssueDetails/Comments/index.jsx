import React from 'react';
import PropTypes from 'prop-types';
import { sortByNewest } from 'shared/utils/javascript';
import Create from './Create';
import Comment from './Comment';
import { Comments, Title } from './Styles';

const propTypes = {
  issue: PropTypes.object.isRequired,   // Redmine issue с полем journals
  fetchIssue: PropTypes.func.isRequired,
};

const ProjectBoardIssueDetailsComments = ({ issue, fetchIssue }) => {
  // Преобразуем journals в старый формат comment
  const comments = (issue.journals || [])
    .filter(j => j.notes)
    .map(j => ({
      id: j.id,
      body: j.notes,
      createdAt: j.created_on,
      user: {
        id: j.user?.id,
        name: j.user?.name || 'Unknown',
        avatarUrl: j.user?.avatarUrl || undefined,
      },
    }));

  return (
    <Comments>
      <Title>Comments</Title>
      <Create issueId={issue.id} fetchIssue={fetchIssue} />
      {sortByNewest(comments, 'createdAt').map(comment => (
        <Comment key={comment.id} comment={comment} />
      ))}
    </Comments>
  );
};

ProjectBoardIssueDetailsComments.propTypes = propTypes;
export default ProjectBoardIssueDetailsComments;