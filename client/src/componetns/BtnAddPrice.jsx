import React from 'react';

const BtnAddPrice = ({ name }) => {
  return (params) => {
    return (
      <button className="price-hall__button" {...params}>
        {name}
      </button>
    );

    // return <button className="shedule__button" data-hour={time} onClick={onClick}></button>;
  };
};

export { BtnAddPrice };
