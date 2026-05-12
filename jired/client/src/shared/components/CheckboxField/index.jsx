import React from 'react';
import { useFormikContext } from 'formik';
import {
  CheckboxWrapper,
  Checkbox,
  Checkmark,
  Label,
} from './Styles';

const CheckboxField = ({ name, label }) => {
  const { values, setFieldValue } = useFormikContext();
  const checked = values[name];

  return (
    <CheckboxWrapper onClick={() => setFieldValue(name, !checked)}>
      <Checkbox checked={checked}>
        {checked && <Checkmark />}
      </Checkbox>
      <Label>{label}</Label>
    </CheckboxWrapper>
  );
};

export default CheckboxField;