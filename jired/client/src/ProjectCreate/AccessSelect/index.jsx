import React, { useState } from 'react';
import { useFormikContext } from 'formik';
import { Icon } from 'shared/components';
import { useLanguage } from 'context/LanguageContext';

import limitedIcon from '../../App/assets/imgs/limited-icon.svg';
import openIcon from '../../App/assets/imgs/open-icon.svg';


import {
  SelectWrapper,
  SelectHeader,
  SelectIcon,
  SelectLabel,
  OptionsList,
  OptionItem,
} from './Styles';

const AccessSelect = ({ compact = false }) => {
  const { values, setFieldValue } = useFormikContext();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const current = values.access;

  const iconSrc = current === 'private' ? limitedIcon : openIcon;
  const label = current === 'private' ? t('privateAccess') : t('publicAccess');

  const handleSelect = (val) => {
    if (val !== current) {
      setFieldValue('access', val);
    }
    setIsOpen(false);
  };

  return (
    <SelectWrapper>
      <SelectHeader compact={compact} onClick={() => setIsOpen(!isOpen)}>
        <SelectIcon src={iconSrc} alt="" />
        <SelectLabel compact={compact}>{label}</SelectLabel>
        <Icon type="chevron-down" size={compact ? 16 : 20} color="#5f5f5f" />
      </SelectHeader>
      {isOpen && (
        <OptionsList>
          <OptionItem compact={compact} onClick={() => handleSelect('open')}>
            <SelectIcon src={openIcon} alt="" />
            <SelectLabel compact={compact}>{t('publicAccess')}</SelectLabel>
          </OptionItem>
          <OptionItem compact={compact} onClick={() => handleSelect('private')}>
            <SelectIcon src={limitedIcon} alt="" />
            <SelectLabel compact={compact}>{t('privateAccess')}</SelectLabel>
          </OptionItem>
        </OptionsList>
      )}
    </SelectWrapper>
  );
};

export default AccessSelect;