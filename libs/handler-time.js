const moment = require('moment');
const config = require('config');

const formatDate = config.get('formatDate');
const formatTime = config.get('formatTime');
const dateForTime = config.get('dateForTime');
const hourSize = config.get('hourSize');

const timeToMinutes = (time, day) => {
  const arrTime = time.split(':');
  let hours = Number(arrTime[0]);
  const minutes = Number(arrTime[1]);

  if (hours === 0 && Number(day) === 2) hours = 24;

  return hours * hourSize + minutes;
};

const minutesToTime = (minutes) => {
  const hoursTime = Math.floor(minutes / hourSize);
  const minutesTime = minutes - hoursTime * hourSize;

  return `${hoursTime.toString().padStart(2, '0')}:${minutesTime.toString().padStart(2, '0')}`;
};

const calculateFreeTime = (plan, time, shedule) => {
  const sheduleTimeFrom = minutesToTime(shedule.minutesFrom);
  const sheduleTimeTo = minutesToTime(shedule.minutesTo);

  const timeFrom = moment(`${dateForTime} ${time}`, `${formatDate} ${formatTime}`);
  const startTime = moment(`${dateForTime} ${sheduleTimeFrom}`, `${formatDate} ${formatTime}`);
  let endTime = moment(`${dateForTime} ${sheduleTimeTo}`, `${formatDate} ${formatTime}`);
  let isError = false;
  const endTimeStart = moment(
    `${dateForTime} ${sheduleTimeTo}`,
    `${formatDate} ${formatTime}`
  ).subtract(hourSize, 'm');

  if (!timeFrom.isSameOrAfter(startTime) || !timeFrom.isSameOrBefore(endTimeStart)) {
    isError = true;
    return 0;
  }

  plan.forEach((planItem) => {
    const planTimeFrom = moment(planItem.time, `${formatDate} ${formatTime}`);
    const planTimeTo = moment(planItem.time, `${formatDate} ${formatTime}`).add(
      planItem.minutes,
      'm'
    );

    if (timeFrom.isSameOrAfter(planTimeFrom) && timeFrom.isBefore(planTimeTo)) {
      isError = true;
      return 0;
    }

    if (planTimeTo.isSameOrBefore(endTime) && timeFrom.isBefore(planTimeFrom))
      endTime = planTimeFrom;
  });
  if (!isError) {
    const timeFromInMinutes = timeToMinutes(timeFrom.format(formatTime));
    const timeToInMinutes = timeToMinutes(endTime.format(formatTime), endTime.format('DD'));

    return timeToInMinutes - timeFromInMinutes;
  } else return 0;
};

const calculateFreeDays = (plan, shedule) => {
  const listBusyTime = [];
  const listSheduleTime = [];
  plan.forEach((planItem) => {
    const planTimeFrom = moment(planItem.time, `${formatDate} ${formatTime}`);
    const planTimeTo = moment(planItem.time, `${formatDate} ${formatTime}`).add(
      planItem.minutes,
      'm'
    );
    let minutesFrom = timeToMinutes(planTimeFrom.format(formatTime));
    const minutesTo = timeToMinutes(planTimeTo.format(formatTime), planTimeTo.format('DD'));
    while (minutesFrom < minutesTo) {
      listBusyTime.push(Number(minutesFrom));
      minutesFrom = minutesFrom + shedule.minutesStep;
    }
  });
  shedule.list.forEach((sheduleItem) => {
    if (sheduleItem.minutes !== shedule.minutesTo) {
      const newSheduleItem = {};

      newSheduleItem['time'] = `${sheduleItem.timeH}:${sheduleItem.timeM}`;
      newSheduleItem['minutes'] = sheduleItem.minutes;
      newSheduleItem['busy'] = listBusyTime.indexOf(sheduleItem.minutes) >= 0 ? true : false;
      listSheduleTime.push(newSheduleItem);
    }
  });

  return listSheduleTime;
};

module.exports.timeToMinutes = timeToMinutes;
module.exports.minutesToTime = minutesToTime;
module.exports.calculateFreeTime = calculateFreeTime;
module.exports.calculateFreeDays = calculateFreeDays;
