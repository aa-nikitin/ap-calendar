const moment = require('moment');
const config = require('config');

const formatDate = config.get('formatDate');
const formatTime = config.get('formatTime');

// const { timeToMinutes } = require('../libs/handler-time');
const { arrToObj, maxItemArray } = require('../libs/helper.functions');
const { daysBeforeBookingArr } = require('../config/priceSettings');

module.exports = ({ plan, discounts, shedule, holidays, price }) => {
  // console.log(plan, discounts, shedule, holidays, price);
  const { date, minutes } = plan;
  const { hourSize } = shedule;
  const datePlan = moment(date);
  const dayOfWeek = datePlan.isoWeekday() - 1;
  const daysBeforeBookingObj = arrToObj(daysBeforeBookingArr);
  const countHours = minutes / hourSize;
  const countHoursRound = Math.ceil(countHours);
  const discountsCommonArr = [];
  // console.log(price);
  discounts.forEach((itemDiscount) => {
    // console.log(itemDiscount);
    // console.log(plan.purpose, itemDiscount.purpose);
    if (itemDiscount.purpose !== 'all' && itemDiscount.purpose !== plan.purpose) return;
    if (itemDiscount.hall !== 'all' && itemDiscount.hall !== plan.hall) return;
    if (itemDiscount.weekday === 'weekdays' && dayOfWeek > 4) return;
    if (
      itemDiscount.weekday === 'weekend' &&
      dayOfWeek < 5 &&
      !holidays.includes(datePlan.format(formatDate))
    )
      return;
    if (itemDiscount.weekday === 'by-days' && !itemDiscount.daysOfWeek.includes(dayOfWeek)) return;
    if (itemDiscount.condition === 'limited') {
      const dateDiscountFrom = moment(itemDiscount.dateFrom);
      const dateDiscountTo = moment(itemDiscount.dateTo);
      if (!(datePlan.isSameOrAfter(dateDiscountFrom) && datePlan.isSameOrBefore(dateDiscountTo)))
        return;
    }
    if (itemDiscount.condition === 'days-before-booking') {
      const dateNow = moment().format(formatDate);
      const countDaysAdd = Number(daysBeforeBookingObj[itemDiscount.daysBeforeBooking].valueNum);
      const dateDiscountNow = moment(`${dateNow} 00:00`, `${formatDate} ${formatTime}`).add(
        countDaysAdd,
        'd'
      );
      // const newDateFrom = moment(`${dateFrom} 00:00`, `${formatDateConf} ${formatTimeConf}`);
      // console.log(moment(datePlan).isSame(dateDiscountNow));
      if (!moment(datePlan).isSame(dateDiscountNow)) return;
    }
    if (!(Math.ceil(countHours) >= itemDiscount.fromHours)) return;

    const isDiscountPercent = itemDiscount.discount.indexOf('%') > -1;
    const discountNumber = Math.floor(
      parseInt(isDiscountPercent ? itemDiscount.discount.split('%')[0] : itemDiscount.discount)
    );
    const sumDiscount = isDiscountPercent ? (discountNumber * price) / 100 : discountNumber;
    const resultDiscount = itemDiscount.everyHour ? sumDiscount * countHoursRound : sumDiscount;
    // console.log(discountNumber, isDiscountPercent, itemDiscount.everyHour, countHoursRound);
    discountsCommonArr.push(resultDiscount);
  });

  return discountsCommonArr.length > 0 ? maxItemArray(discountsCommonArr) : 0;
};
