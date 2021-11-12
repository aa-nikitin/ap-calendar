const moment = require('moment');
const { trim } = require('lodash');

const config = require('config');
const formatDateConf = config.get('formatDate');
const formatTimeConf = config.get('formatTime');
const _ = require('lodash');
// const request = require('request');
// const weekDaysConf = config.get('weekDays');

const Plan = require('../models/plan');
const Price = require('../models/prices');
const Holidays = require('../models/holidays');
const Halls = require('../models/halls');
const Clients = require('../models/clients');
const WorkShedule = require('../models/work-shedule');
const {
  timeToMinutes,
  minutesToTime,
  minutesToTimeHour,
  creatingSchedule
} = require('../libs/handler-time');
const {
  statusArr,
  paymentTypeArr,
  purposeArr,
  daysOfWeekArr: weekDaysConf
} = require('../config/priceSettings');
const groupPrices = require('../libs/group-prices');
const calcPrice = require('../libs/calc-price');
const { arrToObj, parseFullName, transformEmpty } = require('../libs/helper.functions');
const handleAddPlan = require('../libs/handler-add-plan');

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
    const { minutesTo, hourSize, minutesFrom } = shedule;
    const plan = await Plan.find({
      date: {
        $gte: dateFrom,
        $lt: dateTo
      },
      hall: idHall
    });
    const hall = await Halls.findOne({
      _id: idHall
    });

    const minutesStep = hall.step ? hall.step : shedule.minutesStep;
    const list = creatingSchedule({ minutesFrom, minutesTo, minutesStep, hourSize });

    for (let i = 0; i < 7; i++) {
      let busy = false;
      const dateFull = moment(dateStart.format(formatDateConf), formatDateConf);

      const listSheduleWork = {};
      list.forEach((item) => {
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
      const isErrorRate = timeToMinutes(timePlan) % minutesStep;
      const minutesStartPlan =
        isErrorRate > 0 ? timeToMinutes(String(timePlan)) - 30 : timeToMinutes(String(timePlan));
      const minutesPlan = isErrorRate > 0 ? item.minutes + 30 : item.minutes;

      let counterMinutes = minutesStartPlan;
      while (counterMinutes < minutesStartPlan + minutesPlan) {
        sheduleWork[datePlan]['list'][String(counterMinutes)]['busy'] = true;
        counterMinutes = counterMinutes + minutesStep;
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

    // console.log(hall.step, idHall);
    res.json({
      sheduleWork,
      minutesStep: minutesStep,
      hourSize: hourSize,
      minutesFrom: minutesFrom,
      minutesTo: minutesTo,
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
    const holidaysObj = await Holidays.find({});
    const pricesSort = _.reverse(prices);
    const pricesObj = groupPrices(pricesSort);
    const purposeObj = arrToObj(purposeArr);
    const priceByPurpose =
      pricesObj[idHall] && pricesObj[idHall][purpose] ? pricesObj[idHall][purpose]['list'] : [];

    const price = calcPrice(bookingObj, priceByPurpose, shedule, holidaysObj);
    // console.log(date, minutes, minutesBusy, idHall, persons, key, purpose);
    res.json({
      price,
      key,
      priceText: price.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 '),
      purposeText: purposeObj[purpose].text,
      timeRange: `${minutesToTime(minutes)}-${minutesToTime(minutes + minutesBusy)}`,
      timeBusy: minutesToTimeHour(minutesBusy)
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

module.exports.addOrders = async (req, res) => {
  try {
    const { firstName, phone, mail, comment, price, selected } = req.body;
    let clientFromDB = {};

    const findClient = await Clients.findOne({
      $or: [
        { phone: phone },
        {
          mail: mail
        }
      ]
    });

    if (findClient) {
      clientFromDB = findClient;
    } else {
      const clientNameArray = parseFullName(firstName);
      clientFromDB = new Clients({
        name: { first: clientNameArray.firstName, last: clientNameArray.lastName },
        phone: transformEmpty(phone),
        mail: transformEmpty(mail)
      });

      await clientFromDB.save();
    }

    const client = {
      name: trim(`${clientFromDB.name.first} ${clientFromDB.name.last}`),
      phone: transformEmpty(clientFromDB.phone),
      email: transformEmpty(clientFromDB.mail)
    };

    const keysOrders = Object.keys(selected);
    const promiseOrder = keysOrders.map(async (item) => {
      const itemOrders = selected[item];
      // console.log(itemOrders);
      const newOrder = {
        idHall: itemOrders.idHall,
        minutes: itemOrders.minutesBusy,
        date: itemOrders.date,
        time: minutesToTime(itemOrders.minutes),
        status: statusArr[0].value,
        paymentType: paymentTypeArr[0].value,
        purpose: itemOrders.purpose,
        persons: itemOrders.persons,
        comment,
        paidFor: '',
        paymentMethod: 'сashless'
      };
      const plan = handleAddPlan(newOrder, client, clientFromDB.id);

      return plan;
    });
    const allAddedOrders = await Promise.all(promiseOrder);
    // console.log(allAddedOrders);
    res.json(allAddedOrders);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

// const requestFunc = (params) => {
//   return new Promise((resolve, reject) => {
//     request(params, function (error, response, body) {
//       if (error) reject(error);
//       if (!error && response.statusCode == 200) {
//         resolve(response.body);
//       }
//     });
//   });
// };
// module.exports.bookingFetch = async (req, res) => {
//   try {
//     const { firstName, phone, mail, comment, typePay, price } = req.body;
//     const getToken = JSON.parse(
//       await requestFunc({
//         method: 'GET',
//         url: 'https://kamorka2.server.paykeeper.ru/info/settings/token/',
//         headers: {
//           Authorization: 'Basic YWRtaW46MTA3NzM1NmZiNDkz'
//         }
//       })
//     );
//     const invoice = JSON.parse(
//       await requestFunc({
//         method: 'POST',
//         url: 'https://kamorka2.server.paykeeper.ru/change/invoice/preview/',
//         headers: {
//           Authorization: 'Basic YWRtaW46MTA3NzM1NmZiNDkz'
//         },
//         formData: {
//           token: getToken.token,
//           pay_amount: price,
//           client_email: mail,
//           client_phone: phone
//         }
//       })
//     );
//     // console.log(invoice);
//     res.json(invoice);
//   } catch (error) {
//     res.status(500).json({ message: error });
//   }
// };
