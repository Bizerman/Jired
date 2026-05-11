import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { color, font } from 'shared/utils/styles';

export const Container = styled.div`
  color: ${color.textMedium};
  ${font.size(15)};
`;

export const Divider = styled.span`
  position: relative;
  top: 2px;
  margin: 0 10px;
  ${font.size(18)};
`;
export const CrumbLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  &:hover {
    text-decoration: underline;
  }
`;

export const CrumbText = styled.span`
  color: inherit;
`;