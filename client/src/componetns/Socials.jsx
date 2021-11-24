import React from 'react';
import PropTypes from 'prop-types';

import { SocialsItem } from '../componetns';

const Socials = ({ socials }) => {
  return (
    <div className="contacts-socials">
      <div className="contacts-socials__head">Соц.сети:</div>
      <div className="contacts-socials__body">
        <SocialsItem socLink={socials.vk} socText="Вконтакте" />
        <SocialsItem socLink={socials.fb} socText="Facebook" />
        <SocialsItem socLink={socials.ins} socText="Instagram" />
      </div>
    </div>
  );
};

Socials.propTypes = {
  socials: PropTypes.object
};
Socials.defaultProps = {
  socials: {}
};

export { Socials };
