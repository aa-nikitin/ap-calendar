import React from 'react';
import PropTypes from 'prop-types';

const SocialsItem = ({ socLink, socText }) => {
  return (
    <div className="contacts-socials__item">
      {socLink && (
        <a target="_blank" className="contacts-socials__link" rel="noreferrer" href={socLink}>
          {socText}
        </a>
      )}
    </div>
  );
};

SocialsItem.propTypes = {
  socLink: PropTypes.string,
  socText: PropTypes.string
};
SocialsItem.defaultProps = {
  socLink: '',
  socText: ''
};

export { SocialsItem };
