import styled from 'styled-components';
import { color, font } from 'shared/utils/styles';

export const Container = styled.div`
  margin-top: 20px;
`;

export const Filters = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  align-items: center;
`;

export const SearchInput = styled.input`
  padding: 8px 14px;
  border: 1px solid ${color.borderLight};
  border-radius: 8px;
  font-size: 14px;
  width: 260px;
  background: #F9F8F8;
  color: #4a2727;
  font-family: 'Outfit', sans-serif;
  outline: none;
  ${font.regular}

  &::placeholder {
    color: #866f6f;
  }

  &:focus {
    border-color: ${color.primary};
    box-shadow: 0 0 0 2px rgba(173, 30, 30, 0.15);
    background: #fff;
  }
`;

export const Select = styled.select`
  padding: 8px 14px;
  border: 1px solid ${color.borderLight};
  border-radius: 8px;
  font-size: 14px;
  background: #F9F8F8;
  color: #4a2727;
  font-family: 'Outfit', sans-serif;
  cursor: pointer;
  outline: none;
  appearance: none;                 /* убираем стандартную стрелку */
  -webkit-appearance: none;
  -moz-appearance: none;
  padding-right: 30px;              /* место для кастомной стрелки */
  
  /* Кастомная стрелка (тонкий тёмный шеврон) */
  background-image: url("data:image/svg+xml;utf8,<svg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M1 1L5 5L9 1' stroke='%234a2727' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/></svg>");
  background-repeat: no-repeat;
  background-position: right 12px center;
  
  ${font.regular}

  &:focus {
    border-color: ${color.primary};
    box-shadow: 0 0 0 2px rgba(173, 30, 30, 0.15);
  }

  /* Жёсткое переопределение фона для опций */
  option {
    background: #F9F8F8;
    color: #4a2727;
  }

  option:checked {
    background: #fde8e8 !important;
    color: #ad1e1e !important;
  }

  option:hover,
  option:focus {
    background: #fde8e8 !important;   /* светло-красный фон при наведении/фокусе */
    color: #ad1e1e !important;
  }
`;


export const TableWrapper = styled.div`
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid ${color.borderLightest};
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  font-family: 'Outfit', sans-serif;
  ${font.regular}
`;

export const Th = styled.th`
  text-align: left;
  padding: 12px 18px;
  background: #F9F8F8;
  border-bottom: 1px solid ${color.borderLight};
  color: #866f6f;
  font-weight: 500;
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  font-family: 'Outfit', sans-serif;

  &:hover {
    background: #F0ECEC;
  }
`;

export const Td = styled.td`
  padding: 12px 18px;
  border-bottom: 1px solid ${color.borderLightest};
  color: #4a2727;
  vertical-align: middle;
`;

export const TableRow = styled.tr`
  cursor: pointer;
  transition: background 0.1s;
  background: #fff;

  &:hover {
    background: #F9F8F8;
  }

  &:last-child td {
    border-bottom: none;
  }
`;

export const Badge = styled.span`
  display: inline-block;
  padding: 3px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  font-family: 'Outfit', sans-serif;
  background: ${props => props.bg || '#eee'};
  color: ${props => props.color || '#333'};
`;

export const AssigneeList = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #5e3f3f;
  font-family: 'Outfit', sans-serif;
`;

export const EmptyMessage = styled.div`
  text-align: center;
  padding: 60px 40px;
  color: #866f6f;
  font-size: 15px;
  font-family: 'Outfit', sans-serif;
  background: #F9F8F8;
  border-radius: 12px;
`;