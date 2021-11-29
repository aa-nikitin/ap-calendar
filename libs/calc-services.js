const { arrToObj } = require('../libs/helper.functions');
const config = require('config');

const hourSize = config.get('hourSize');

module.exports = (servicesChoice, services, minutes) => {
  const servicesObj = arrToObj(services, '_id');
  let totalPrice = 0;
  servicesChoice.forEach((item) => {
    const serviceItem = servicesObj[item];
    if (serviceItem) {
      const hours = Math.ceil(minutes / hourSize);
      const resultSum =
        serviceItem.hourly === true ? Number(serviceItem.price) * hours : Number(serviceItem.price);

      totalPrice += Number(resultSum);
    }
  });

  return totalPrice;
};
