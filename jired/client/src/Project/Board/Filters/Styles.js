import styled from 'styled-components';
import { color, font, mixin } from 'shared/utils/styles';
import { InputDebounced, Avatar, Button } from 'shared/components';

export const Filters = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 25px;      
  padding: 12.5px 0;
`;

export const LeftFilters = styled.div`
  display: flex;
  align-items: center;
  gap: 22.5px;           /* 18 * 1.25 */
`;

export const RightFilters = styled.div`
  display: flex;
  align-items: center;
  gap: 62.5px;           /* 50 * 1.25 */
`;

export const SearchInput = styled(InputDebounced)`
  width: 250px;          /* 200 * 1.25 */
  height: 42.5px;        /* 34 * 1.25 */
  border-radius: 6.25px; /* 5 * 1.25 */
  border: 1px solid ${color.borderLightest};
  background: #fff;
  ${font.regular}
  font-size: 17.5px;     /* 14 * 1.25 */
  color: ${color.textLight};
  padding-x: 0;
  &:focus {
    border-color: ${color.borderInputFocus};
  }
`;

export const Avatars = styled.div`
  display: flex;
  flex-direction: row-reverse;
  margin: 0 7.5px;      /* 6 * 1.25 */
`;

export const AvatarIsActiveBorder = styled.div`
  display: inline-flex;
  margin-left: -5px;    /* -4 * 1.25 */
  border-radius: 50%;
  transition: transform 0.1s;
  ${mixin.clickable};
  ${props => props.isActive && `box-shadow: 0 0 0 3.75px ${color.primary}`} /* 3 * 1.25 */
  &:hover {
    transform: translateY(-5px); /* -4 * 1.25 */
  }
`;

export const StyledAvatar = styled(Avatar)`
  transform: scale(1.25);
  transform-origin: center;
  box-shadow: 0 0 0 2.5px #fff;
`;

export const StyledButton = styled(Button)`
  margin-left: 5px;      /* 4 * 1.25 */
  padding: 7.5px 12.5px; /* 6 * 1.25, 10 * 1.25 */
  font-size: 17.5px;     /* 14 * 1.25 */
  background: #fff;
  border: 1px solid ${color.borderLightest};
  color: ${color.textMedium};
  border-radius: 6.25px; /* 5 * 1.25 */
  &:hover {
    border-color: ${color.borderLight};
    background: ${color.backgroundLightest};
  }
`;

export const GroupByBtn = styled.div`
  display: flex;
  align-items: center;
  gap: 7.5px;            /* 6 * 1.25 */
  ${font.medium}
  font-size: 17.5px;      /* 14 * 1.25 */
  color: ${color.textMedium};
  padding: 7.5px 15px;    /* 6 * 1.25, 12 * 1.25 */
  border: 1px solid ${color.borderLightest};
  border-radius: 6.25px;  /* 5 * 1.25 */
  background: #fff;
  ${mixin.clickable}
  &:hover {
    border-color: ${color.borderLight};
    color: ${color.textDark};
  }
  i {
    font-size: 20px;      /* 16 * 1.25 */
  }
`;

export const ClearAll = styled.div`
  height: 42.5px;         /* 34 * 1.25 */
  line-height: 42.5px;    /* 34 * 1.25 */
  margin-left: 15px;      /* 12 * 1.25 */
  padding-left: 17.5px;   /* 14 * 1.25 */
  border-left: 1px solid ${color.borderLightest};
  color: ${color.textMedium};
  font-size: 17.5px;      /* 14 * 1.25 */
  ${mixin.clickable}
  &:hover {
    color: ${color.textDark};
  }
`;