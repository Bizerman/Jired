import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { useLanguage } from 'context/LanguageContext';
import {
  TaskListContainer,
  TaskListItem,
  TaskItemTitle,
  TaskItemMeta,
  TaskIconBox,
  TaskLeft,
  TaskInfo,
  TaskRight,
  AvatarPic,
  CreatorName,
  EmptyTasksMessage,
} from './Styles';

const TaskList = ({ issues }) => {
  const history = useHistory();
  const { t } = useLanguage();

  if (!issues || issues.length === 0) {
    return (
      <TaskListContainer>
        <EmptyTasksMessage>{t('noTasksFound')}</EmptyTasksMessage>
      </TaskListContainer>
    );
  }

  return (
    <TaskListContainer>
      {issues.map(issue => {
        const creator = issue.author;
        const creatorName = creator?.name || t('unknown');
        const creatorAvatar = creator?.avatarUrl;
        const projectName = issue.project?.name || t('unknownProject');

        return (
          <TaskListItem
            key={issue.id}
            onClick={() => history.push(`/project/board/issues/${issue.id}`)}
          >
            <TaskLeft>
              <TaskIconBox>
                <svg width="23" height="23" viewBox="0 0 23 23" fill="none">
                  <path d="M17.8887 5.11108H8.94428C8.60539 5.11108 8.28039 5.24571 8.04076 5.48534C7.80113 5.72497 7.6665 6.04997 7.6665 6.38886V7.66664H8.94428V6.38886H17.8887V12.7778H16.6109V14.0555H17.8887C18.2276 14.0555 18.5526 13.9209 18.7923 13.6813C19.0319 13.4416 19.1665 13.1166 19.1665 12.7778V6.38886C19.1665 6.04997 19.0319 5.72497 18.7923 5.48534C18.5526 5.24571 18.2276 5.11108 17.8887 5.11108Z" fill="white"/>
                  <path d="M14.0557 8.94446H5.11127C4.77239 8.94446 4.44738 9.07908 4.20775 9.31871C3.96812 9.55834 3.8335 9.88335 3.8335 10.2222V16.6111C3.8335 16.95 3.96812 17.275 4.20775 17.5146C4.44738 17.7543 4.77239 17.8889 5.11127 17.8889H14.0557C14.3946 17.8889 14.7196 17.7543 14.9592 17.5146C15.1989 17.275 15.3335 16.95 15.3335 16.6111V10.2222C15.3335 9.88335 15.1989 9.55834 14.9592 9.31871C14.7196 9.07908 14.3946 8.94446 14.0557 8.94446ZM5.11127 16.6111V10.2222H14.0557V16.6111H5.11127Z" fill="white"/>
                </svg>
              </TaskIconBox>
              <TaskInfo>
                <TaskItemTitle>{issue.subject}</TaskItemTitle>
                <TaskItemMeta>
                  ISSUE-{issue.id} · {projectName}
                </TaskItemMeta>
              </TaskInfo>
            </TaskLeft>
            <TaskRight>
              <AvatarPic name={creatorName} avatarUrl={creatorAvatar} size={32} />
              <CreatorName>{creatorName}</CreatorName>
            </TaskRight>
          </TaskListItem>
        );
      })}
    </TaskListContainer>
  );
};

TaskList.propTypes = {
  issues: PropTypes.array.isRequired,
};

export default TaskList;