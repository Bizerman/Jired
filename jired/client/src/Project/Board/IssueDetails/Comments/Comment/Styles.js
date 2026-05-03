import styled, { css } from 'styled-components';
import { Avatar } from 'shared/components';

// Figma: comments look like activity feed items
export const Comment = styled.div`
  position: relative;
  margin-top: 25px;
  font-size: 14px;
  font-family: 'Outfit', sans-serif;
`;

export const UserAvatar = styled(Avatar)`
  position: absolute;
  top: 0;
  left: 0;
  width: 40px !important;
  height: 40px !important;
  border-radius: 28px !important;
  background-color: #360f0f !important;
  font-family: 'Outfit', sans-serif;
  font-weight: 500;
`;

export const Content = styled.div`
  padding-left: 54px;
`;

export const Username = styled.div`
  display: inline-block;
  padding-right: 12px;
  padding-bottom: 6px;
  color: #4a2727;
  font-weight: 600;
  font-family: 'Outfit', sans-serif;
`;

export const CreatedAt = styled.div`
  display: inline-block;
  padding-bottom: 6px;
  color: #725757;
  font-size: 12px;
  font-family: 'Outfit', sans-serif;
`;

export const Body = styled.p`
  padding-bottom: 8px;
  white-space: pre-wrap;
  color: #5e3f3f;
  font-family: 'Outfit', sans-serif;
  margin: 0 0 4px;
`;

const actionLinkStyles = css`
  display: inline-block;
  padding: 2px 0;
  color: #866f6f;
  font-size: 12px;
  cursor: pointer;
  font-family: 'Outfit', sans-serif;
  &:hover {
    text-decoration: underline;
    color: #725757;
  }
`;

export const EditLink = styled.div`
  margin-right: 12px;
  ${actionLinkStyles}
`;

export const DeleteLink = styled.div`
  ${actionLinkStyles}
  &:before {
    position: relative;
    right: 6px;
    content: '·';
    display: inline-block;
  }
`;
