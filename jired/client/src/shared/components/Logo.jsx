import React from 'react';
import PropTypes from 'prop-types';
import favicon from '../../favicon.svg';

const propTypes = {
  className: PropTypes.string,
  size: PropTypes.number,
};

const defaultProps = {
  className: undefined,
  size: 32,
};

const Logo = ({ className, size }) => {
  return (
    <button
      className={className}
      style={{
        width: size,
        height: size,
        padding: 0,
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <img
        src={favicon}
        alt="Jired Logo"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
        }}
      />
    </button>
  );
};

Logo.propTypes = propTypes;
Logo.defaultProps = defaultProps;

export default Logo;