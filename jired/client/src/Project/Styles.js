import styled from 'styled-components';
import { sizes } from 'shared/utils/styles';

const SCALE = 1.25;
const baseLeftPadding = sizes.appNavbarWidth + sizes.secondarySideBarWidth + 40;
const normalPadding = `${54 * SCALE}px ${32 * SCALE}px ${50 * SCALE}px ${(baseLeftPadding) * SCALE}px`;

export const ProjectPage = styled.div.attrs(props => ({
  style: {
    padding: props.isCreatePage ? '0' : normalPadding,
    // медиа-запросы нельзя перенести в style, оставим их в styled
  },
}))`
  @media (max-width: 1100px) {
    padding: ${props => props.isCreatePage ? '0' : `${54 * SCALE}px ${20 * SCALE}px ${50 * SCALE}px ${(baseLeftPadding - 20) * SCALE}px`} !important;
  }
  @media (max-width: 999px) {
    padding-left: ${props => props.isCreatePage ? '0' : `${(baseLeftPadding - 20 - sizes.secondarySideBarWidth) * SCALE}px`} !important;
  }
`;