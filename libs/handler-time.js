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

const minutesToTimeHour = (minutes) => {
  const hoursTime = Math.floor(minutes / hourSize);
  const minutesTime = minutes - hoursTime * hourSize;
  const hoursTimeResult = hoursTime > 0 ? `${hoursTime} ч.` : '';
  const minutesTimeResult = minutesTime > 0 ? `${minutesTime} м.` : '';

  return `${hoursTimeResult}${minutesTimeResult}`;
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
  ).subtract(shedule.minutesStep, 'm');

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

const creatingSchedule = (params) => {
  let minutesFrom = Number(params.minutesFrom);
  const minutesTo = Number(params.minutesTo);
  const minutesStep = Number(params.minutesStep);
  const hourSize = Number(params.hourSize);
  const arrayTimeOfDay = ['night', 'morning', 'afternoon', 'evening'];
  const list = [];
  while (minutesFrom <= minutesTo) {
    let timeOfDay = 0;
    const timeH = Math.floor(minutesFrom / hourSize)
      .toString()
      .padStart(2, '0');
    const timeM = Math.floor(minutesFrom % hourSize)
      .toString()
      .padStart(2, '0');
    const timeHN = Number(timeH);

    if (timeHN >= 4 && timeHN <= 11) timeOfDay = 1;
    else if (timeHN >= 12 && timeHN <= 16) timeOfDay = 2;
    else if (timeHN >= 17 && timeHN <= 23) timeOfDay = 3;

    list.push({
      timeH: timeH,
      timeM: timeM,
      minutes: minutesFrom,
      timeOfDay: arrayTimeOfDay[timeOfDay]
    });
    minutesFrom = minutesFrom + minutesStep;
  }

  return list;
};

const timeArrToStr = (objPriceByGroup) => {
  let thisTime;
  let lengthMinutes;
  let strTime = '';

  objPriceByGroup.timePoints.forEach((itemTime, keyItemTime) => {
    if (!thisTime) {
      thisTime = itemTime;
      lengthMinutes = objPriceByGroup.minutesStep;
      strTime += minutesToTime(itemTime);
    } else if (thisTime + objPriceByGroup.minutesStep === itemTime) {
      thisTime = itemTime;
      lengthMinutes = lengthMinutes + objPriceByGroup.minutesStep;
    } else {
      strTime += ` - ${minutesToTime(thisTime + objPriceByGroup.minutesStep)}; ${minutesToTime(
        itemTime
      )}`;
      lengthMinutes = objPriceByGroup.minutesStep;
      thisTime = itemTime;
    }
    if (objPriceByGroup.timePoints.length === keyItemTime + 1) {
      strTime += ` - ${minutesToTime(thisTime + objPriceByGroup.minutesStep)}`;
      lengthMinutes = undefined;
      thisTime = undefined;
    }
  });

  return strTime;
};

module.exports.timeToMinutes = timeToMinutes;
module.exports.minutesToTime = minutesToTime;
module.exports.minutesToTimeHour = minutesToTimeHour;
module.exports.calculateFreeTime = calculateFreeTime;
module.exports.calculateFreeDays = calculateFreeDays;
module.exports.creatingSchedule = creatingSchedule;
module.exports.timeArrToStr = timeArrToStr;
