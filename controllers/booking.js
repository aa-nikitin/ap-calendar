const moment = require('moment');

const config = require('config');
const formatDateConf = config.get('formatDate');
const formatTimeConf = config.get('formatTime');
const _ = require('lodash');
const request = require('request');
// const weekDaysConf = config.get('weekDays');

const Plan = require('../models/plan');
const Price = require('../models/prices');
const WorkShedule = require('../models/work-shedule');
const { timeToMinutes, minutesToTime, minutesToTimeHour } = require('../libs/handler-time');
const { daysOfWeekArr: weekDaysConf } = require('../config/priceSettings');
const groupPrices = require('../libs/group-prices');
const calcPrice = require('../libs/calc-price');

moment.locale('ru');

module.exports.getBookingPlanWeek = async (req, res) => {
  try {
    const { date, idHall } = req.body;
    const sheduleWork = {};
    const dateNow = moment(moment().format(formatDateConf), formatDateConf);
    const minutesNow = timeToMinutes(moment().format('HH:mm'));
    const dateFrom = moment(date, formatDateConf).isoWeekday(1);
    const dateTo = moment(date, formatDateConf).isoWeekday(1).add(7, 'd');
    const dateStart = moment(date, formatDateConf).isoWeekday(1);
    const shedule = await WorkShedule.findOne({});
    const plan = await Plan.find({
      date: {
        $gte: dateFrom,
        $lt: dateTo
      },
      hall: idHall
    });
    for (let i = 0; i < 7; i++) {
      let busy = false;
      const dateFull = moment(dateStart.format(formatDateConf), formatDateConf);

      const listSheduleWork = {};
      shedule.list.forEach((item) => {
        busy =
          (dateFull.isSame(dateNow) && item.minutes <= minutesNow) || dateFull.isBefore(dateNow)
            ? true
            : false;
        listSheduleWork[item.minutes] = { ...item, busy };
      });
      sheduleWork[dateStart.format(formatDateConf)] = {
        dateShort: dateStart.format(formatDateConf),
        dateFull: dateFull,
        dayWeek: `${weekDaysConf[i].name}, ${dateStart.format('DD')}`,
        idHall,
        list: listSheduleWork
      };
      dateStart.add(1, 'd');
    }
    plan.forEach((item) => {
      const datePlan = moment(item.date).format(formatDateConf);
      const timePlan = moment(item.time).format(formatTimeConf);
      const isErrorRate = timeToMinutes(timePlan) % shedule.minutesStep;
      const minutesStartPlan =
        isErrorRate > 0 ? timeToMinutes(String(timePlan)) - 30 : timeToMinutes(String(timePlan));
      const minutesPlan = isErrorRate > 0 ? item.minutes + 30 : item.minutes;

      let counterMinutes = minutesStartPlan;
      while (counterMinutes < minutesStartPlan + minutesPlan) {
        sheduleWork[datePlan]['list'][String(counterMinutes)]['busy'] = true;
        counterMinutes = counterMinutes + shedule.minutesStep;
      }
    });

    const dates = Object.keys(sheduleWork);
    const firstDate = moment(dates[0], `${formatDateConf}`).format('D MMMM').split(' ');
    const lastDate = moment(dates[dates.length - 1], `${formatDateConf}`)
      .format('D MMMM')
      .split(' ');
    const rangeDate =
      firstDate[1] === lastDate[1]
        ? `${firstDate[0]} - ${lastDate[0]} ${lastDate[1]}`
        : `${firstDate[0]} ${firstDate[1]} - ${lastDate[0]} ${lastDate[1]}`;

    res.json({
      sheduleWork,
      minutesStep: shedule.minutesStep,
      hourSize: shedule.hourSize,
      minutesFrom: shedule.minutesFrom,
      minutesTo: shedule.minutesTo,
      rangeDate,
      firstDate: dates[0]
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

module.exports.getBookingPrice = async (req, res) => {
  try {
    const { date, minutes, minutesBusy, idHall, persons, key, purpose } = req.body;
    const formateDate = moment(`${date}`, formatDateConf);
    const formateTime = moment(`${minutesToTime(minutes)}`, formatTimeConf);
    const bookingObj = { date: formateDate, time: formateTime, minutes: minutesBusy, persons };
    const shedule = await WorkShedule.findOne({});
    const prices = await Price.find({}).sort('priority');
    const pricesSort = _.reverse(prices);
    const pricesObj = groupPrices(pricesSort);
    const priceByPurpose =
      pricesObj[idHall] && pricesObj[idHall][purpose] ? pricesObj[idHall][purpose]['list'] : [];
    const price = calcPrice(bookingObj, priceByPurpose, shedule);
    // console.log(persons);
    // console.log(date, minutes, minutesBusy, idHall, persons, key, purpose);
    res.json({
      price,
      key,
      priceText: price.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 '),
      timeRange: `${minutesToTime(minutes)}-${minutesToTime(minutes + minutesBusy)}`,
      timeBusy: minutesToTimeHour(minutesBusy)
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const requestFunc = (params) => {
  return new Promise((resolve, reject) => {
    request(params, function (error, response, body) {
      if (error) reject(error);
      if (!error && response.statusCode == 200) {
        resolve(response.body);
      }
    });
  });
};
module.exports.bookingFetch = async (req, res) => {
  try {
    // const aaa = await fetch('https://kamorka2.server.paykeeper.ru/info/settings/token/', {
    //   method: 'GET',
    //   headers: { Authorization: 'Basic ZGVtbzpkZW1v' }
    // });
    const { firstName, phone, mail, comment, typePay, price } = req.body;
    // console.log(firstName, phone, mail, comment, typePay);
    const getToken = JSON.parse(
      await requestFunc({
        method: 'GET',
        url: 'https://kamorka2.server.paykeeper.ru/info/settings/token/',
        headers: {
          Authorization: 'Basic YWRtaW46MTA3NzM1NmZiNDkz'
        }
      })
    );
    const invoice = JSON.parse(
      await requestFunc({
        method: 'POST',
        url: 'https://kamorka2.server.paykeeper.ru/change/invoice/preview/',
        headers: {
          Authorization: 'Basic YWRtaW46MTA3NzM1NmZiNDkz'
        },
        formData: {
          token: getToken.token,
          pay_amount: price,
          client_email: mail,
          client_phone: phone
        }
      })
    );
    // console.log(invoice);
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
