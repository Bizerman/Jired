import { useEffect, useRef } from 'react';
import { useFormikContext } from 'formik';

const IdentifierGenerator = () => {
  const { values, setFieldValue } = useFormikContext();
  const lastAutoId = useRef('');
  const userTouched = useRef(false);

  useEffect(() => {
    const name = values.name?.trim();
    if (!name) {
      lastAutoId.current = '';
      userTouched.current = false;
      return;
    }
    const autoId = name
      .toLowerCase()
      .replace(/[^a-z0-9-_]/g, '-')
      .replace(/--+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 100);
    if (values.identifier !== lastAutoId.current && values.identifier !== '') {
      userTouched.current = true;
    }
    if (!userTouched.current) {
      setFieldValue('identifier', autoId, false);
      lastAutoId.current = autoId;
    }
  }, [values.name, values.identifier, setFieldValue]);

  return null;
};

export default IdentifierGenerator;