import styled from 'styled-components';

// ─── Figma Design Tokens ───────────────────────────────────────────────────────
const f = {
  white:         '#fff',
  secondary100:  '#ebe7e7',
  secondary600:  '#866f6f',
  secondary700:  '#725757',
  secondary800:  '#5e3f3f',
  secondary900:  '#4a2727',
  secondary1000: '#360f0f',
  greyScale100:  '#ececec',
  greyScale700:  '#5f5f5f',
  greyScale800:  '#3f3f3f',
  primary1000:   '#ad1e1e',
  font:          "'Outfit', sans-serif",
};

export const Content = styled.div`
  display: flex;
  align-items: stretch;   // ← было flex-start
  gap: 30px;
  min-height: 55vh;       // ← было max-height или height
  padding: 0 3% 3%;
  font-family: ${f.font};
  @media (max-width: 1200px) { flex-wrap: wrap; }
`;

export const Left = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

export const Right = styled.div`
  width: 40%;
  height: 100%;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2%;
  @media (max-width: 1200px) { width: 100%; }
`;

export const TopActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 40px 40px 26px;
  font-family: ${f.font};
  font-size: 12px;
  color: ${f.secondary700};
`;

export const TopActionsRight = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  & > * { margin-left: 0; }
`;

export const SectionTitle = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: ${f.secondary900};
  font-family: ${f.font};
  margin-bottom: 14px;
`;

// Details panel helpers (used by sub-components via import from '../Styles')
export const DetailsPanel = styled.div`
  border-radius: 4px;
  background-color: ${f.white};
  border: 1px solid ${f.greyScale100};
  overflow: hidden;
`;

export const DetailsPanelHeader = styled.div`
  background-color: ${f.white};
  border-bottom: 1px solid ${f.greyScale100};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px 10px;
  font-size: 16px;
  font-weight: 500;
  color: ${f.secondary900};
  font-family: ${f.font};
`;

export const DetailsPanelBody = styled.div`
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
`;

export const DetailLabel = styled.div`
  font-size: 14px;
  color: ${f.secondary700};
  font-family: ${f.font};
  white-space: nowrap;
`;

export const DetailValue = styled.div`
  font-size: 14px;
  color: ${f.secondary600};
  font-family: ${f.font};
`;
