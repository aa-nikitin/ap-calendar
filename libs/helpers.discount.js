const moment = require('moment');
const config = require('config');

const formatDateConf = config.get('formatDate');
const formatTimeConf = config.get('formatTime');

const {
  goalArr,
  weekdayArr,
  daysOfWeekArr,
  daysBeforeBookingArr
} = require('../config/priceSettings');
const { arrToObj, formatPrice } = require('../libs/helper.functions');

const goalObj = arrToObj(goalArr);
const weekdayObj = arrToObj(weekdayArr);
const daysBeforeBookingObj = arrToObj(daysBeforeBookingArr);

module.exports.converterDiscountToBase = (fields) => {
  const {
    purpose,
    weekday,
    daysOfWeek,
    condition,
    dateFrom,
    dateTo,
    daysBeforeBooking,
    fromHours,
    hall,
    discount,
    everyHour
  } = fields;

  const newDateFrom = moment(`${dateFrom} 00:00`, `${formatDateConf} ${formatTimeConf}`);
  const newDateTo = moment(`${dateTo} 00:00`, `${formatDateConf} ${formatTimeConf}`);
  const dateCondition =
    condition === 'limited'
      ? {
          from: newDateFrom,
          to: newDateTo,
          isClear: newDateTo.isBefore(newDateFrom)
        }
      : { from: null, to: null, isClear: null };

  const newFromHours = Number(fromHours) > 0 ? Math.floor(Number(fromHours)) : 1;

  const isDiscountPrice = discount.indexOf('%') > -1;
  const discountNumber = Math.floor(parseInt(isDiscountPrice ? discount.split('%')[0] : discount));
  const percentSymbol = isDiscountPrice ? '%' : '';
  const resultDiscountSum = discountNumber ? `${discountNumber}${percentSymbol}` : 0;

  return {
    purpose,
    weekday,
    daysOfWeek: weekday === 'by-days' ? daysOfWeek : [],
    condition,
    dateFrom: dateCondition.from,
    dateTo: !!dateCondition.isClear ? dateCondition.from : dateCondition.to,
    daysBeforeBooking,
    fromHours: newFromHours,
    hall,
    discount: resultDiscountSum,
    everyHour
  };
};

module.exports.converterDiscountFromBase = (discounts, hallsObj) => {
  const discountsNew = discounts.map((item) => {
    const {
      id,
      purpose,
      weekday,
      daysOfWeek,
      condition,
      dateFrom,
      dateTo,
      daysBeforeBooking,
      fromHours,
      hall,
      discount,
      everyHour
    } = item;
    const purposeText =
      purpose === 'all' ? goalObj[purpose].name : `Аренда для ${goalObj[purpose].text}`;
    const weekdayText =
      weekday === 'by-days'
        ? daysOfWeek.map((itemDay) => daysOfWeekArr[itemDay].name).join(',')
        : weekdayObj[weekday].name;
    let conditionText = '';
    if (condition === 'limited') {
      const formateDateFrom = moment(dateFrom).format(formatDateConf);
      const formateDateTo = moment(dateTo).format(formatDateConf);
      conditionText = `с ${formateDateFrom} по ${formateDateTo}`;
    }
    if (condition === 'days-before-booking') {
      const daysBeforeBookingText = daysBeforeBooking === 'day-to-day' ? 'Бронь' : 'Бронь за';
      conditionText = `${daysBeforeBookingText} ${daysBeforeBookingObj[daysBeforeBooking].name}`;
    }

    const fromHoursText = fromHours > 1 ? `от ${fromHours} ч.` : '';
    const everyHourText = everyHour ? `на каждый час` : '';
    const hallText = hall === 'all' ? '' : `зал - ${hallsObj[hall].name}`;
    // const discountText = '';
    const isDiscountPrice = discount.indexOf('%') > -1;
    const discountText = !isDiscountPrice ? `${formatPrice(parseInt(discount))} руб.` : discount;
    const separator = ', ';
    const conditionInfo = `${conditionText ? `${conditionText}${separator}` : ''}${
      hallText ? `${hallText}${separator}` : ''
    }${fromHoursText ? `${fromHoursText}${separator}` : ''}`
      .trim()
      .slice(0, -1);

    const infoDiscount = {
      purpose: purposeText,
      weekday: weekdayText,
      everyHour: everyHourText,
      discount: discountText,
      condition: conditionInfo
    };

    return {
      id,
      purpose,
      weekday,
      daysOfWeek,
      condition,
      dateFrom,
      dateTo,
      daysBeforeBooking,
      fromHours,
      hall,
      discount,
      everyHour,
      info: infoDiscount
    };
  });
  return discountsNew;
};
