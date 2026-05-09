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
  MakeGroupBtn,   // <-- новый стиль
  ClearAll,
} from './Styles';

const propTypes = {
  projectUsers: PropTypes.array.isRequired,
  defaultFilters: PropTypes.object.isRequired,
  filters: PropTypes.object.isRequired,
  mergeFilters: PropTypes.func.isRequired,
  showOnlyDone: PropTypes.bool,
  onClearDoneFilter: PropTypes.func,
  onMakeGroup: PropTypes.func.isRequired,   // <-- новый пропс
};

const ProjectBoardFilters = ({
  projectUsers,
  defaultFilters,
  filters,
  mergeFilters,
  showOnlyDone,
  onClearDoneFilter,
  onMakeGroup,
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
        {/* ... всё без изменений ... */}
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
      <MakeGroupBtn onClick={onMakeGroup} variant="empty">
          <Icon type="issues" size={16} />
          {t('Make group')}
      </MakeGroupBtn>
    </Filters>
  );
};

ProjectBoardFilters.propTypes = propTypes;
export default ProjectBoardFilters;