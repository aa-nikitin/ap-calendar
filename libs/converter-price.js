const moment = require('moment');
const config = require('config');

const formatDateConf = config.get('formatDate');
const formatTimeConf = config.get('formatTime');
const dateForTimeConf = config.get('dateForTime');

module.exports = (fields, rebuild) => {
  const {
    purpose,
    weekday,
    daysOfWeek,
    worktime,
    timeFrom,
    timeTo,
    fromHours,
    fromPersons,
    validityPeriod,
    dateFrom,
    dateTo,
    price,
    priceSum,
    priority,
    roundUp,
    idHall
  } = fields;

  if (rebuild)
    return {
      purpose,
      weekday,
      daysOfWeek,
      worktime,
      timeFrom,
      timeTo,
      fromHours,
      fromPersons,
      validityPeriod,
      dateFrom,
      dateTo,
      price,
      priceSum,
      priority,
      roundUp,
      idHall
    };

  const newDateFrom = moment(`${dateFrom} 00:00`, `${formatDateConf} ${formatTimeConf}`);
  const newDateTo = moment(`${dateTo} 00:00`, `${formatDateConf} ${formatTimeConf}`);
  const dateLimited =
    validityPeriod === 'limited'
      ? {
          from: newDateFrom,
          to: newDateTo,
          isClear: newDateTo.isBefore(newDateFrom)
        }
      : { from: null, to: null, isClear: null };

  const newFromHours = Number(fromHours) > 0 ? Math.floor(Number(fromHours)) : 1;
  const newFromPersons = Number(fromPersons) > 0 ? Math.floor(Number(fromPersons)) : 1;

  const newTimeFrom = moment(`${dateForTimeConf} ${timeFrom}`, `${formatDateConf} HH:00`);
  const newTimeTo = moment(`${dateForTimeConf} ${timeTo}`, `${formatDateConf} HH:00`);
  const timeLimited =
    worktime === 'by-time'
      ? {
          from: newTimeFrom,
          to: newTimeTo,
          isClear: newTimeTo.isBefore(newTimeFrom)
        }
      : { from: null, to: null, isClear: null };

  const isPercentPrice = price === 'surcharge' && priceSum.indexOf('%') > -1;
  const priceNumber = Math.floor(parseInt(isPercentPrice ? priceSum.split('%')[0] : priceSum));
  const percentSymbol = isPercentPrice ? '%' : '';
  const resultPriceSum = priceNumber ? `${priceNumber}${percentSymbol}` : 0;

  return {
    purpose,
    weekday,
    daysOfWeek: weekday === 'by-days' ? daysOfWeek : [],
    worktime,
    timeFrom: timeLimited.from,
    timeTo: !!timeLimited.isClear ? timeLimited.from : timeLimited.to,
    fromHours: newFromHours,
    fromPersons: newFromPersons,
    validityPeriod,
    dateFrom: dateLimited.from,
    dateTo: !!dateLimited.isClear ? dateLimited.from : dateLimited.to,
    price,
    priceSum: resultPriceSum,
    priority,
    roundUp,
    idHall
  };
};
