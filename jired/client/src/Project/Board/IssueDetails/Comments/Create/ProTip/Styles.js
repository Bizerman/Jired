import styled from 'styled-components';

// Figma: "Pro tip : press M to comment" — 12px, color #5f5f5f
export const Tip = styled.div`
  display: flex;
  align-items: center;
  color: #5f5f5f;
  font-family: 'Outfit', sans-serif;
  font-size: 12px;
`;

export const TipLetter = styled.span`
  display: inline-block;
  margin: 0 4px;
  padding: 0 4px;
  border-radius: 2px;
  color: #4a2727;
  background: #ebe7e7;
  font-weight: 600;
  font-size: 12px;
  font-family: 'Outfit', sans-serif;
`;
