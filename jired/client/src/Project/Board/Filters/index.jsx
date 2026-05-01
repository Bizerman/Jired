import React from 'react';
import PropTypes from 'prop-types';
import { xor } from 'lodash';

import { Icon } from 'shared/components';

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
};

const ProjectBoardFilters = ({ projectUsers, defaultFilters, filters, mergeFilters }) => {
  const { searchTerm, userIds, myOnly, recent } = filters;
  const areFiltersCleared = !searchTerm && userIds.length === 0 && !myOnly && !recent;

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
          onClick={() => mergeFilters({ recent: !recent })}>
          Recently Updated
        </StyledButton>
        {!areFiltersCleared && (
          <ClearAll onClick={() => mergeFilters(defaultFilters)}>Clear all</ClearAll>
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
