import React from 'react';
import { NavLink, useRouteMatch } from 'react-router-dom';
import { Icon } from 'shared/components';
import {
  ToolbarContainer,
  ToolbarItems,
  ToolbarItem,
  ItemIcon,
  ItemLabel,
} from './Styles';

const ProjectToolbar = () => {
  const match = useRouteMatch();

  return (
    <ToolbarContainer>
      <ToolbarItems>
        <ToolbarItem
          as={NavLink}
          exact
          to={`${match.url}/board`}
          activeClassName="active"
        >
          <ItemIcon>
            <Icon type="board" size={16} />
          </ItemIcon>
          <ItemLabel>Board</ItemLabel>
        </ToolbarItem>

        <ToolbarItem as="div" onClick={() => alert('Attachments not implemented')}>
          <ItemIcon>
            <Icon type="attach" size={16} />
          </ItemIcon>
          <ItemLabel>Attachments</ItemLabel>
        </ToolbarItem>

        <ToolbarItem as="div" onClick={() => alert('Issues not implemented')}>
          <ItemIcon>
            <Icon type="issues" size={16} />
          </ItemIcon>
          <ItemLabel>Issues</ItemLabel>
        </ToolbarItem>

        <ToolbarItem
          as={NavLink}
          to={`${match.url}/reports`}
          activeClassName="active"
        >
          <ItemIcon>
            <Icon type="reports" size={16} />
          </ItemIcon>
          <ItemLabel>Reports</ItemLabel>
        </ToolbarItem>
      </ToolbarItems>
    </ToolbarContainer>
  );
};

export default ProjectToolbar;