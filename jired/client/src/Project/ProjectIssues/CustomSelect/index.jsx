// CustomSelect.jsx
import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import ReactDOM from 'react-dom';
import { color, font } from 'shared/utils/styles';

const Wrapper = styled.div`
  position: relative;
  width: ${p => p.width || 'auto'};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 14px;
  border: 1px solid ${color.borderLight};
  border-radius: 8px;
  background: #F9F8F8;
  color: #4a2727;
  font-size: 14px;
  font-family: 'Outfit', sans-serif;
  cursor: pointer;
  user-select: none;
  ${font.regular}
  transition: border-color 0.15s, box-shadow 0.15s;

  &:focus-within,
  &:hover {
    border-color: ${color.primary};
    box-shadow: 0 0 0 2px rgba(173, 30, 30, 0.15);
  }
`;

const Arrow = styled.span`
  display: inline-block;
  width: 10px;
  height: 6px;
  margin-left: 8px;
  background: url("data:image/svg+xml;utf8,<svg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M1 1L5 5L9 1' stroke='%234a2727' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/></svg>") no-repeat center;
  transition: transform 0.15s;
  transform: ${p => p.open ? 'rotate(180deg)' : 'rotate(0)'};
`;

const Dropdown = styled.div`
  position: fixed;
  background: #fff;
  border: 1px solid ${color.borderLight};
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  z-index: 9999;
  max-height: ${p => p.maxHeight || '240px'};
  overflow-y: auto;
`;

const Option = styled.div`
  padding: 8px 14px;
  font-size: 14px;
  color: #4a2727;
  font-family: 'Outfit', sans-serif;
  cursor: pointer;
  background: ${p => p.isSelected ? '#fde8e8' : 'transparent'};
  &:hover {
    background: #fde8e8;
  }
`;

const CustomSelect = ({ value, options, onChange, width, maxHeight }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);
  const dropdownRef = useRef(null);
  const [dropdownStyle, setDropdownStyle] = useState({});

  const selectedOption = options.find(opt => opt.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        wrapperRef.current && !wrapperRef.current.contains(event.target) &&
        dropdownRef.current && !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    setDropdownStyle({
      top: rect.bottom + 4,
      left: rect.left,
      width: rect.width,   // <-- ширина родительского контейнера в px
      maxHeight: maxHeight || '240px',
    });
  }, [isOpen, maxHeight]);

  const handleSelect = (opt) => {
    onChange(opt.value);
    setIsOpen(false);
  };

  const dropdown = isOpen && (
    <Dropdown
      ref={dropdownRef}
      style={dropdownStyle}
      maxHeight={maxHeight}
    >
      {options.map(opt => (
        <Option
          key={opt.value}
          isSelected={opt.value === value}
          onClick={() => handleSelect(opt)}
        >
          {opt.label}
        </Option>
      ))}
    </Dropdown>
  );

  return (
    <Wrapper ref={wrapperRef} width={width}>
      <Header onClick={() => setIsOpen(!isOpen)} tabIndex={0}>
        <span>{selectedOption?.label}</span>
        <Arrow open={isOpen} />
      </Header>
      {ReactDOM.createPortal(dropdown, document.body)}
    </Wrapper>
  );
};

export default CustomSelect;