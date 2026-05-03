import styled from 'styled-components';
import { Avatar } from 'shared/components';

// Figma: avatar 40x40 rounded, dark bg #360f0f; comment input with border #ececec
export const Create = styled.div`
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

export const Right = styled.div`
  padding-left: 54px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const FakeTextarea = styled.div`
  padding: 10px 20px;
  border-radius: 6px;
  border: 1px solid #ececec;
  color: #7e7e7e;
  font-family: 'Outfit', sans-serif;
  font-size: 16px;
  cursor: pointer;
  transition: border-color 0.1s;
  background: #fff;
  &:hover {
    border-color: #c0afaf;
  }
`;
