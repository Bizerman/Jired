import React, { useState } from 'react';
import { useFormikContext } from 'formik';
import { Icon } from 'shared/components';
import limitedIcon from 'App/assets/imgs/limited-icon.svg';
import openIcon from 'App/assets/imgs/open-icon.svg';

export const AccessSelect = ({ compact = false }) => {
  const { values, setFieldValue } = useFormikContext();
  const [isOpen, setIsOpen] = useState(false);
  const current = values.access;
  const iconSrc = current === 'private' ? limitedIcon : openIcon;
  const label = current === 'private' ? 'Private' : 'Open';

  const handleSelect = (val) => {
    if (val !== current) {
      setFieldValue('access', val);   // убрали третий аргумент
      console.log('Access changed to:', val); // для отладки
    }
    setIsOpen(false);
  };

  const fontSize = compact ? '15px' : '1.3125rem';
  const paddingTL = compact ? '8px 14px' : '16px 26px';
  const optionFontSize = compact ? '14px' : '1.125rem';
  const optionPadding = compact ? '8px 14px' : '12px 20px';
  const iconSize = compact ? 16 : 20;

  return (
    <div style={{ position: 'relative' }}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: paddingTL, border: '1px solid #ececec', borderRadius: 8,
          background: '#fff', cursor: 'pointer', userSelect: 'none',
          fontSize: fontSize,
        }}
      >
        <img src={iconSrc} alt="" style={{ width: iconSize, height: iconSize }} />
        <span style={{ flex: 1, color: '#3f3f3f' }}>{label}</span>
        <Icon type="chevron-down" size={iconSize} color="#5f5f5f" />
      </div>

      {isOpen && (
        <ul style={{
          position: 'absolute', top: '100%', left: 0, right: 0,
          background: '#fff', border: '1px solid #ececec', borderRadius: 8,
          listStyle: 'none', padding: 0, marginTop: 4, zIndex: 10,
        }}>
          <li
            onClick={() => handleSelect('open')}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: optionPadding, cursor: 'pointer',
              fontSize: optionFontSize,
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <img src={openIcon} alt="" style={{ width: iconSize, height: iconSize }} />
            <span style={{ color: '#3f3f3f' }}>Open</span>
          </li>
          <li
            onClick={() => handleSelect('private')}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: optionPadding, cursor: 'pointer',
              fontSize: optionFontSize,
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <img src={limitedIcon} alt="" style={{ width: iconSize, height: iconSize }} />
            <span style={{ color: '#3f3f3f' }}>Private</span>
          </li>
        </ul>
      )}
    </div>
  );
};