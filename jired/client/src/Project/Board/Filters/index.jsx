import React from 'react';
import PropTypes from 'prop-types';
import { xor } from 'lodash';
import { Icon } from 'shared/components';
import useCurrentUser from 'shared/hooks/currentUser';
import { useLanguage } from 'context/LanguageContext';
import {
  Filters,
  LeftFilters,
  RightFilters,
  SearchInput,
  Avatars,
  AvatarIsActiveBorder,
  StyledAvatar,
  StyledButton,
  GroupByBtn,
  ClearAll,
} from './Styles';

const propTypes = {
  projectUsers: PropTypes.array.isRequired,
  defaultFilters: PropTypes.object.isRequired,
  filters: PropTypes.object.isRequired,
  mergeFilters: PropTypes.func.isRequired,
  showOnlyDone: PropTypes.bool,
  onClearDoneFilter: PropTypes.func,
};

const ProjectBoardFilters = ({
  projectUsers,
  defaultFilters,
  filters,
  mergeFilters,
  showOnlyDone,
  onClearDoneFilter,
}) => {
  const { currentUserId } = useCurrentUser();
  const { t } = useLanguage();
  const { searchTerm, userIds, myOnly, recent } = filters;

  const hasLocalFilters = !!searchTerm || userIds.length > 0 || myOnly || recent;
  const showClearAll = hasLocalFilters || showOnlyDone;

  const handleClearAll = () => {
    mergeFilters(defaultFilters);
    if (showOnlyDone && onClearDoneFilter) {
      onClearDoneFilter();
    }
  };

  return (
    <Filters data-testid="board-filters">
      <LeftFilters>
        <SearchInput
          icon="search"
          value={searchTerm}
          placeholder={t('searchBoard')}
          onChange={value => mergeFilters({ searchTerm: value })}
        />

        <Avatars>
          {projectUsers.map(user => (
            <AvatarIsActiveBorder key={user.id} isActive={userIds.includes(user.id)}>
              <StyledAvatar
                avatarUrl={user.avatarUrl}
                name={user.name}
                size={24}
                onClick={() => mergeFilters({ userIds: xor(userIds, [user.id]) })}
              />
            </AvatarIsActiveBorder>
          ))}
        </Avatars>

        <StyledButton
          variant="empty"
          isActive={myOnly}
          onClick={() => mergeFilters({ myOnly: !myOnly })}
        >
          {t('onlyMyIssues')}
        </StyledButton>

        <StyledButton
          variant="empty"
          isActive={recent}
          onClick={() => mergeFilters({ recent: !recent })}
        >
          {t('recentlyUpdated')}
        </StyledButton>

        {showClearAll && (
          <ClearAll onClick={handleClearAll}>{t('clearAll')}</ClearAll>
        )}
      </LeftFilters>

      <RightFilters>
        <GroupByBtn>
          <Icon type="issues" size={16} />
          {t('groupByStatus')}
        </GroupByBtn>
        <GroupByBtn>
          <Icon type="more" size={16} />
          {t('more')}
        </GroupByBtn>
      </RightFilters>
    </Filters>
  );
};

ProjectBoardFilters.propTypes = propTypes;
export default ProjectBoardFilters;