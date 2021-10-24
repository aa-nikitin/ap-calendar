const moment = require('moment');

const config = require('config');
const formatDateConf = config.get('formatDate');
const formatTimeConf = config.get('formatTime');
// const weekDaysConf = config.get('weekDays');

const Plan = require('../models/plan');
const WorkShedule = require('../models/work-shedule');
const { timeToMinutes } = require('../libs/handler-time');
const { daysOfWeekArr: weekDaysConf } = require('../config/priceSettings');

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
      const datePlan = moment(item.date, formatDateConf).format(formatDateConf);
      const minutesStartPlan = timeToMinutes(
        String(moment(item.time, formatTimeConf).format(formatTimeConf))
      );
      const minutesPlan = item.minutes;

      let counterMinutes = minutesStartPlan;
      while (counterMinutes < minutesStartPlan + minutesPlan) {
        // console.log(counterMinutes);
        sheduleWork[datePlan]['list'][String(counterMinutes)]['busy'] = true;
        counterMinutes = counterMinutes + shedule.minutesStep;
      }
      // console.log(datePlan, minutesStartPlan, minutesPlan);
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
