import { useEffect } from 'react';
import { useFormikContext } from 'formik';

const IdentifierGenerator = () => {
  const { values, setFieldValue } = useFormikContext();

  useEffect(() => {
    if (values.name && values.name.trim() !== '') {
      const identifier = values.name
        .toLowerCase()
        .replace(/[^a-z0-9-_]/g, '-')
        .replace(/--+/g, '-')
        .replace(/^-|-$/g, '')
        .substring(0, 100);

      setFieldValue('identifier', identifier, false);
    }
  }, [values.name, setFieldValue]);

  return null;
};

export default IdentifierGenerator;