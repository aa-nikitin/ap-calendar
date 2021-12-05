const moment = require('moment');
const config = require('config');
const formatDateConf = config.get('formatDate');
const formatTimeConf = config.get('formatTime');

const { arrToObj, formatPrice } = require('../libs/helper.functions');
const {
  weekdayArr,
  worktimeArr,
  priceArr,
  daysOfWeekArr,
  purposeArr
} = require('../config/priceSettings');

module.exports = (prices) => {
  const pricesObj = {};

  const weekdayObj = arrToObj(weekdayArr);
  const worktimeObj = arrToObj(worktimeArr);
  const priceObj = arrToObj(priceArr);
  const purposeObj = arrToObj(purposeArr);

  prices.forEach((itemPrice) => {
    const strWeekdayByDays = itemPrice.daysOfWeek.map((item) => daysOfWeekArr[item].name).join(',');
    const strWorktimeByTime =
      itemPrice.worktime === 'by-time'
        ? `с ${moment(itemPrice.timeFrom).format(formatTimeConf)} по ${moment(
            itemPrice.timeTo
          ).format(formatTimeConf)}`
        : '';

    const strValidityPeriodLimited =
      itemPrice.validityPeriod === 'limited'
        ? `с ${moment(itemPrice.dateFrom).format(formatDateConf)} по ${moment(
            itemPrice.dateTo
          ).format(formatDateConf)}`
        : ''; //дата с-по
    const strWeekday = strWeekdayByDays ? strWeekdayByDays : weekdayObj[itemPrice.weekday].name; // дни недели
    const strWorktime = strWorktimeByTime
      ? strWorktimeByTime
      : worktimeObj[itemPrice.worktime].name; // время работы
    const strFromHours = itemPrice.fromHours > 1 ? `от ${itemPrice.fromHours} ч.` : ''; // количество часов
    const strFromPersons = itemPrice.fromPersons > 1 ? `от ${itemPrice.fromPersons} чел.` : ''; // количество человек

    // формирование цены
    const strPriceMeasure = itemPrice.price === 'surcharge-per' ? `` : `/ч.`;
    const strPriceSum =
      itemPrice.priceSum.indexOf('%') > -1
        ? `${itemPrice.priceSum}${strPriceMeasure}`
        : `${formatPrice(itemPrice.priceSum)} руб.${strPriceMeasure}`;
    const strPrice =
      itemPrice.price !== 'rent'
        ? `${priceObj[itemPrice.price].text} ${strPriceSum}`
        : `${strPriceSum}`;

    const strInfo = `${strWeekday} ${strValidityPeriodLimited} ${strWorktime} ${strFromPersons}`;

    const objPriceStr = {
      info: strInfo,
      price: strPrice,
      fromHours: strFromHours,
      id: itemPrice.id,
      obj: itemPrice
    };

    if (!pricesObj[itemPrice.idHall]) {
      pricesObj[itemPrice.idHall] = {};
      pricesObj[itemPrice.idHall][itemPrice.purpose] = {
        name: purposeObj[itemPrice.purpose].name,
        list: [objPriceStr]
      };
    } else {
      if (!pricesObj[itemPrice.idHall][itemPrice.purpose])
        pricesObj[itemPrice.idHall][itemPrice.purpose] = {
          name: purposeObj[itemPrice.purpose].name,
          list: [objPriceStr]
        };
      else pricesObj[itemPrice.idHall][itemPrice.purpose]['list'].push(objPriceStr);
    }
  });
  return pricesObj;
};
