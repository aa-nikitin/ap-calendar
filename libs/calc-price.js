const moment = require('moment');
const config = require('config');

const formatDate = config.get('formatDate');
const formatTime = config.get('formatTime');

const { timeToMinutes } = require('../libs/handler-time');

module.exports = (plan, price, shedule, holidaysObj) => {
  const { date, time, minutes, persons } = plan;
  const { minutesStep, hourSize } = shedule;
  const countHours = minutes / hourSize;
  const countSteps = minutes / minutesStep;
  const divider = hourSize / minutesStep;
  const timeFrom = moment(time);
  const timeFromInMinutes = timeToMinutes(timeFrom.format(formatTime));
  const datePlan = moment(date);
  const dayOfWeek = datePlan.isoWeekday() - 1;
  let counterMinutes = timeFromInMinutes;
  const arrSumByHours = [];
  const surchargeCommonArr = [];
  const checkPersons = persons > 0 ? persons : 1;

  while (counterMinutes < timeFromInMinutes + minutes) {
    arrSumByHours.push({ timePoint: counterMinutes, price: 0, surcharge: [] });
    counterMinutes = counterMinutes + minutesStep;
  }

  const holidays = holidaysObj.map((itemHoliday) => itemHoliday.date);

  let commonPrice = { price: 0, roundUp: false };

  price.forEach(({ obj: itemPrice }) => {
    const { roundUp, priceSum, timeFrom, timeTo } = itemPrice;
    const datePriceFrom = moment(itemPrice.dateFrom);
    const datePriceTo = moment(itemPrice.dateTo);
    if (itemPrice.weekday === 'weekdays' && dayOfWeek > 4) return;
    if (
      itemPrice.weekday === 'weekend' &&
      dayOfWeek < 5 &&
      !holidays.includes(datePlan.format(formatDate))
    )
      return;
    if (itemPrice.weekday === 'by-days' && !itemPrice.daysOfWeek.includes(dayOfWeek)) return;
    if (!(checkPersons >= itemPrice.fromPersons)) return;
    if (itemPrice.toPersons && !(checkPersons <= itemPrice.toPersons)) return;
    if (!(Math.ceil(countHours) >= itemPrice.fromHours)) return;

    if (
      itemPrice.validityPeriod === 'limited' &&
      !(datePlan.isSameOrAfter(datePriceFrom) && datePlan.isSameOrBefore(datePriceTo))
    )
      return;

    if (itemPrice.price === 'rent' && itemPrice.worktime === 'all-day' && commonPrice.price === 0) {
      commonPrice.price = itemPrice.priceSum / divider;
      commonPrice.roundUp = roundUp;
    }

    if (itemPrice.price !== 'rent' && itemPrice.worktime === 'all-day') {
      let surchargePrice = 0;
      if (itemPrice.price === 'surcharge') {
        surchargePrice = (itemPrice.priceSum / divider) * arrSumByHours.length;
      } else if (itemPrice.price === 'surcharge-per') {
        surchargePrice = checkPersons * itemPrice.priceSum;
      } else if (itemPrice.price === 'surcharge-per-hour') {
        const priceSurchargeStep = (checkPersons * itemPrice.priceSum) / divider;
        const roundUpPrice = countSteps % 2 > 0 && roundUp ? priceSurchargeStep : 0;
        surchargePrice = priceSurchargeStep * countSteps + roundUpPrice;
      }

      surchargeCommonArr.push(surchargePrice);
    }

    if (itemPrice.worktime === 'by-time') {
      const priceNumber = Number(priceSum);
      const timeFromPrice = moment(timeFrom, `${formatDate} ${formatTime}`);
      const timeToPrice = moment(timeTo, `${formatDate} ${formatTime}`);
      const timeFromPriceMinutes = timeToMinutes(timeFromPrice.format(formatTime));
      const timeToPriceMinutes = timeToMinutes(timeToPrice.format(formatTime));
      arrSumByHours.forEach((item, key) => {
        const { timePoint } = item;
        const isUpdatePrice =
          ((timeFromPriceMinutes <= timePoint && timeToPriceMinutes > timePoint) ||
            (timeFromPriceMinutes === timePoint && timeToPriceMinutes === timePoint)) &&
          !arrSumByHours[key].price;

        const isRoundUp =
          (key === 0 && roundUp && timePoint % hourSize !== 0) ||
          (key === arrSumByHours.length - 1 &&
            roundUp &&
            (timePoint + minutesStep) % hourSize !== 0);
        const dividerPrice = isRoundUp ? priceNumber : priceNumber / divider;
        const newPrice = isUpdatePrice ? dividerPrice : arrSumByHours[key].price;
        if (isUpdatePrice && itemPrice.price === 'rent')
          arrSumByHours[key] = { ...item, price: newPrice };
        else if (isUpdatePrice && itemPrice.price !== 'rent') {
          let surchargePrice = 0;

          if (itemPrice.price === 'surcharge') {
            const isPercent = itemPrice.priceSum.indexOf('%') > -1 ? true : false;
            surchargePrice = isPercent ? parseInt(itemPrice.priceSum) / divider + '%' : newPrice;
          } else surchargePrice = checkPersons * newPrice;

          if (surchargePrice !== 0) arrSumByHours[key].surcharge.push(surchargePrice);
        }
      });
    }
  });

  const isRound =
    arrSumByHours.length % 2 !== 0 &&
    commonPrice.roundUp &&
    arrSumByHours[arrSumByHours.length - 1].price === 0 &&
    arrSumByHours[0].price === 0;
  let totalSurcharge = 0;
  let totalPrice = isRound ? commonPrice.price : 0;

  arrSumByHours.forEach((item) => {
    const { surcharge, price } = item;
    totalPrice += price === 0 ? commonPrice.price : price;

    if (surcharge.length) {
      surcharge.forEach((itemSurcharge) => {
        const isPercent = String(itemSurcharge).indexOf('%') > -1 ? true : false;
        if (isPercent) {
          const percent = parseInt(itemSurcharge);
          const percentPrice = (price * percent) / 100;
          totalSurcharge += percentPrice;
        } else {
          totalSurcharge += itemSurcharge;
        }
      });
    }
  });

  let totalCommonSurcharge = 0;
  surchargeCommonArr.forEach((item) => {
    const isPercent = String(item).indexOf('%') > -1 ? true : false;

    totalCommonSurcharge += isPercent ? parseInt(item) : parseInt(item);
  });
  const resultPrice = totalSurcharge + totalPrice + totalCommonSurcharge;

  return resultPrice ? resultPrice : 0;
};
