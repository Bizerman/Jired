import React from 'react';
import PropTypes from 'prop-types';
import { xor } from 'lodash';
import { Icon } from 'shared/components';
import useCurrentUser from 'shared/hooks/currentUser';
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
  showOnlyDone: PropTypes.bool,                     // новое
  onClearDoneFilter: PropTypes.func,                // новое
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
  const { searchTerm, userIds, myOnly, recent } = filters;

  // Кнопка Clear All видна, если есть локальные фильтры ИЛИ активен фильтр "Done"
  const hasLocalFilters = !!searchTerm || userIds.length > 0 || myOnly || recent;
  const showClearAll = hasLocalFilters || showOnlyDone;

  // Сброс вообще всего: локальные фильтры + done‑фильтр
  const handleClearAll = () => {
    // сначала сбрасываем локальные фильтры
    mergeFilters(defaultFilters);
    // если включён done‑фильтр, переходим на доску без него
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
          placeholder="Search board"
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
          Only My Issues
        </StyledButton>

        <StyledButton
          variant="empty"
          isActive={recent}
          onClick={() => mergeFilters({ recent: !recent })}
        >
          Recently Updated
        </StyledButton>

        {showClearAll && (
          <ClearAll onClick={handleClearAll}>Clear all</ClearAll>
        )}
      </LeftFilters>

      <RightFilters>
        <GroupByBtn>
          <Icon type="issues" size={16} />
          Group by: Status
        </GroupByBtn>
        <GroupByBtn>
          <Icon type="more" size={16} />
          More
        </GroupByBtn>
      </RightFilters>
    </Filters>
  );
};

ProjectBoardFilters.propTypes = propTypes;
export default ProjectBoardFilters;