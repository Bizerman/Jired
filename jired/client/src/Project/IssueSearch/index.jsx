import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { get } from 'lodash';
import useApi from 'shared/hooks/api';
import { IssueTypeIcon } from 'shared/components';
import { useLanguage } from 'context/LanguageContext';
import NoResultsSVG from './NoResultsSvg';
import {
  IssueSearch,
  SearchInputCont,
  SearchInputDebounced,
  SearchIcon,
  SearchSpinner,
  Issue,
  IssueData,
  IssueTitle,
  IssueTypeId,
  SectionTitle,
  NoResults,
  NoResultsTitle,
  NoResultsTip,
} from './Styles';

const propTypes = {
  project: PropTypes.object.isRequired,
};

const ProjectIssueSearch = ({ project }) => {
  const { t } = useLanguage();
  const [isSearchTermEmpty, setIsSearchTermEmpty] = useState(true);

  const [{ data, isLoading }, fetchIssues] = useApi.get('/issues.json', {}, { lazy: true });

  const matchingIssues = get(data, 'issues', []);

  const recentIssues = (project.issues || [])
    .slice()
    .sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0))
    .slice(0, 10);

  const handleSearchChange = value => {
    const searchTerm = value.trim();
    setIsSearchTermEmpty(!searchTerm);

    if (searchTerm) {
      fetchIssues({ subject: `~${searchTerm}` });
    }
  };

  return (
    <IssueSearch>
      <SearchInputCont>
        <SearchInputDebounced
          autoFocus
          placeholder={t('searchPlaceholder')}
          onChange={handleSearchChange}
        />
        <SearchIcon type="search" size={22} />
        {isLoading && <SearchSpinner />}
      </SearchInputCont>

      {isSearchTermEmpty && recentIssues.length > 0 && (
        <Fragment>
          <SectionTitle>{t('recentIssues')}</SectionTitle>
          {recentIssues.map(renderIssue)}
        </Fragment>
      )}

      {!isSearchTermEmpty && matchingIssues.length > 0 && (
        <Fragment>
          <SectionTitle>{t('matchingIssues')}</SectionTitle>
          {matchingIssues.map(issue => renderIssue(issue))}
        </Fragment>
      )}

      {!isSearchTermEmpty && !isLoading && matchingIssues.length === 0 && (
        <NoResults>
          <NoResultsSVG />
          <NoResultsTitle>{t('searchNoResults')}</NoResultsTitle>
          <NoResultsTip>{t('searchNoResultsTip')}</NoResultsTip>
        </NoResults>
      )}
    </IssueSearch>
  );
};

const renderIssue = issue => (
  <Link key={issue.id} to={`/project/board/issues/${issue.id}`}>
    <Issue>
      <IssueTypeIcon type={issue.type || 'task'} size={25} />
      <IssueData>
        <IssueTitle>{issue.title || issue.subject}</IssueTitle>
        <IssueTypeId>{`ISSUE-${issue.id}`}</IssueTypeId>
      </IssueData>
    </Issue>
  </Link>
);

ProjectIssueSearch.propTypes = propTypes;
export default ProjectIssueSearch;