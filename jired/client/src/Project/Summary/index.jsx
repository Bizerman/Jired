import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import { Avatar } from 'shared/components';   // ← добавлен импорт
import {
  SummaryPage,
  WorkHeader,
  Title,
  Divider,
  SectionTitle,
  MetaList,
  MetaRow,
  MetaLabel,
  MetaValue,
  ProgressBar,
  ProgressFill,
  CardFooter,
  FooterText,
  TaskListContainer,
  TaskListItem,
  TaskItemTitle,
  TaskItemMeta,
  TaskLeft,
  TaskIconBox,
  TaskInfo,
  TaskRight,
  CreatorName,
  StatsGrid,      
  StatCard,
  StatValue,
  StatLabel, 
} from './Styles';   // AvatarPic больше не импортируется

const ProjectSummary = ({ project }) => {
  const history = useHistory();
  const issues = project.issues || [];
  const openIssues = issues.filter(i => !i.status?.is_closed && i.statusKey !== 'done');
  const closedIssues = issues.filter(i => i.status?.is_closed);
  const total = issues.length;
  const progress = total > 0 ? Math.round((closedIssues.length / total) * 100) : 0;
  const inProgressIssues = issues.filter(i => i.statusKey === 'inprogress');
  const backlogIssues = issues.filter(i => i.statusKey === 'backlog');
  const doneIssues = issues.filter(i => i.status?.is_closed || i.statusKey === 'done');


  return (
    <SummaryPage>
      <SectionTitle>Task Statistics</SectionTitle>
      <StatsGrid>
        <StatCard>
          <StatLabel>Total Tasks</StatLabel>
          <StatValue>{total}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Backlog</StatLabel>
          <StatValue>{backlogIssues.length}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>In Progress</StatLabel>
          <StatValue>{inProgressIssues.length}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Done</StatLabel>
          <StatValue>{doneIssues.length}</StatValue>
        </StatCard>
      </StatsGrid>
      <SectionTitle>Project Details</SectionTitle>
      <MetaList>
        <MetaRow>
          <MetaLabel>Identifier</MetaLabel>
          <MetaValue>{project.identifier}</MetaValue>
        </MetaRow>
        <MetaRow>
          <MetaLabel>Created</MetaLabel>
          <MetaValue>{moment(project.created_on).format('LL')}</MetaValue>
        </MetaRow>
        <MetaRow>
          <MetaLabel>Last updated</MetaLabel>
          <MetaValue>{moment(project.updated_on).format('LL')}</MetaValue>
        </MetaRow>
        <MetaRow>
          <MetaLabel>Visibility</MetaLabel>
          <MetaValue>{project.is_public ? 'Public' : 'Private'}</MetaValue>
        </MetaRow>
      </MetaList>
      <SectionTitle style={{ marginTop: 32 }}>Progress</SectionTitle>
      <div>
        <span style={{ fontSize: 14, color: '#725757' }}>All tasks: {total}</span>
        <ProgressBar>
          <ProgressFill width={progress} />
        </ProgressBar>
        <CardFooter>
          <FooterText>{closedIssues.length} of {total} completed</FooterText>
        </CardFooter>
      </div>

      {openIssues.length > 0 && (
        <>
          <SectionTitle style={{ marginTop: 32 }}>Open Tasks</SectionTitle>
          <TaskListContainer>
            {openIssues.slice(0, 5).map(issue => {
              const creator = issue.author;
              const creatorName = creator?.name || 'Unknown';
              const creatorAvatar = creator?.avatarUrl;
              const projectName = project.name || 'Unknown project';
              const issueId = issue.id;
              const title = issue.subject;

              return (
                <TaskListItem key={issue.id} onClick={() => history.push(`/project/board/issues/${issue.id}`)}>
                  <TaskLeft>
                    <TaskIconBox>
                      <svg width="23" height="23" viewBox="0 0 23 23" fill="none">
                        <path d="M17.8887 5.11108H8.94428C8.60539 5.11108 8.28039 5.24571 8.04076 5.48534C7.80113 5.72497 7.6665 6.04997 7.6665 6.38886V7.66664H8.94428V6.38886H17.8887V12.7778H16.6109V14.0555H17.8887C18.2276 14.0555 18.5526 13.9209 18.7923 13.6813C19.0319 13.4416 19.1665 13.1166 19.1665 12.7778V6.38886C19.1665 6.04997 19.0319 5.72497 18.7923 5.48534C18.5526 5.24571 18.2276 5.11108 17.8887 5.11108Z" fill="white"/>
                        <path d="M14.0557 8.94446H5.11127C4.77239 8.94446 4.44738 9.07908 4.20775 9.31871C3.96812 9.55834 3.8335 9.88335 3.8335 10.2222V16.6111C3.8335 16.95 3.96812 17.275 4.20775 17.5146C4.44738 17.7543 4.77239 17.8889 5.11127 17.8889H14.0557C14.3946 17.8889 14.7196 17.7543 14.9592 17.5146C15.1989 17.275 15.3335 16.95 15.3335 16.6111V10.2222C15.3335 9.88335 15.1989 9.55834 14.9592 9.31871C14.7196 9.07908 14.3946 8.94446 14.0557 8.94446ZM5.11127 16.6111V10.2222H14.0557V16.6111H5.11127Z" fill="white"/>
                      </svg>
                    </TaskIconBox>
                    <TaskInfo>
                      <TaskItemTitle>{title}</TaskItemTitle>
                      <TaskItemMeta>
                        LP-{issueId} · {projectName}
                      </TaskItemMeta>
                    </TaskInfo>
                  </TaskLeft>
                  <TaskRight>
                    <Avatar name={creatorName} avatarUrl={creatorAvatar} size={32} />
                    <CreatorName>{creatorName}</CreatorName>
                  </TaskRight>
                </TaskListItem>
              );
            })}
          </TaskListContainer>
        </>
      )}
    </SummaryPage>
  );
};

ProjectSummary.propTypes = {
  project: PropTypes.object.isRequired,
};

export default ProjectSummary;