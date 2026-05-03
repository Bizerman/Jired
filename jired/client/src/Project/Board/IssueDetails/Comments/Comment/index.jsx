import React from 'react';
import PropTypes from 'prop-types';
import { formatDateTimeConversational } from 'shared/utils/dateTime';
import {
  Comment,
  UserAvatar,
  Content,
  Username,
  CreatedAt,
  Body,
} from './Styles';

const propTypes = {
  comment: PropTypes.object.isRequired,
};

const ProjectBoardIssueDetailsComment = ({ comment }) => (
  <Comment data-testid="issue-comment">
    <UserAvatar name={comment.user.name} avatarUrl={comment.user.avatarUrl} />
    <Content>
      <Username>{comment.user.name}</Username>
      <CreatedAt>{formatDateTimeConversational(comment.createdAt)}</CreatedAt>
      <Body>{comment.body}</Body>
      {/* Редактирование/удаление убрано, т.к. не поддерживается стандартным Redmine API */}
    </Content>
  </Comment>
);

ProjectBoardIssueDetailsComment.propTypes = propTypes;
export default ProjectBoardIssueDetailsComment;