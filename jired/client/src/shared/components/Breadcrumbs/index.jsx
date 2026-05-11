import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Container, Divider, CrumbLink, CrumbText } from './Styles';

const propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        to: PropTypes.string,
      }),
    ])
  ).isRequired,
};

const Breadcrumbs = ({ items }) => {
  const normalizedItems = items.map(item =>
    typeof item === 'string' ? { label: item } : item
  );

  return (
    <Container>
      {normalizedItems.map((item, index) => (
        <Fragment key={index}>
          {index !== 0 && <Divider>/</Divider>}
          {item.to ? (
            <CrumbLink to={item.to}>{item.label}</CrumbLink>
          ) : (
            <CrumbText>{item.label}</CrumbText>
          )}
        </Fragment>
      ))}
    </Container>
  );
};

Breadcrumbs.propTypes = propTypes;
export default Breadcrumbs;