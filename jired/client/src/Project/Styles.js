import styled from 'styled-components';
import { sizes } from 'shared/utils/styles';

// Ширина сайдбара вычисляется так же, как в компоненте Sidebar.
// (sizes.secondarySideBarWidth + 80) * SCALE, где SCALE = 1.25
const sidebarActualWidth = (sizes.secondarySideBarWidth + 80) * 1.25; // 475px при secondarySideBarWidth=300
const baseLeftPadding = sidebarActualWidth + 40; // 515px (сайдбар + отступ 40px)

export const ProjectPage = styled.div.attrs(props => ({
  style: {
    padding: props.isCreatePage ? '0' : `67.5px 32px 62.5px ${baseLeftPadding}px`,
  },
}))`
  @media (max-width: 1100px) {
    padding: ${props =>
      props.isCreatePage ? '0' : `67.5px 25px 62.5px ${baseLeftPadding - 20}px`} !important;
  }
  @media (max-width: 999px) {
    padding-left: ${props =>
      props.isCreatePage ? '0' : `${baseLeftPadding - 20 - sizes.secondarySideBarWidth}px`} !important;
  }
`;