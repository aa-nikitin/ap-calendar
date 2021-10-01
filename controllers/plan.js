const moment = require('moment');
const _ = require('lodash');
const { trim } = require('lodash');
const config = require('config');

const Plan = require('../models/plan');
const Clients = require('../models/clients');
const Halls = require('../models/halls');
const WorkShedule = require('../models/work-shedule');
const { calculateFreeTime, calculateFreeDays } = require('../libs/handler-time');

const formatDateConf = config.get('formatDate');
const formatTimeConf = config.get('formatTime');
const dateForTimeConf = config.get('dateForTime');

module.exports.addPlanDate = async (req, res) => {
  try {
    const {
      date,
      time,
      minutes,
      idHall,
      idClient,
      clientName,
      clientAlias,
      clientPhone,
      clientEmail,
      comment
    } = req.body;
    const formateDate = moment(`${date}`, formatDateConf);
    const formateTime = moment(`${dateForTimeConf} ${time}`, `${formatDateConf} ${formatTimeConf}`);

    const plan = await Plan.find({
      date: formateDate,
      hall: idHall
    });

    const shedule = await WorkShedule.findOne({});

    const hoursCount = calculateFreeTime(plan, time, shedule);

    // console.log(hoursCount >= minutes, hoursCount, minutes);

    if (!(hoursCount >= minutes)) throw 'Указанное время занято';

    let clientFromDB = {};

    if (idClient) {
      clientFromDB = await Clients.findOne({ _id: idClient });
    } else {
      const clientNameArray = clientName.split(' ');
      // console.log(clientNameArray);
      const clientFirstName = clientNameArray[0] ? clientNameArray[0] : '';
      const clientLastName = clientNameArray[1] ? clientNameArray[1] : '';
      clientFromDB = new Clients({
        name: { first: clientFirstName, last: clientLastName },
        nickname: clientAlias,
        phone: clientPhone,
        mail: clientEmail
      });

      await clientFromDB.save();
    }

    const clientInfo = {
      name: trim(`${clientFromDB.name.first} ${clientFromDB.name.last}`),
      alias: clientFromDB.nickname,
      phone: clientFromDB.phone,
      email: clientFromDB.email
    };

    const newPlan = new Plan({
      date: formateDate,
      time: formateTime,
      minutes,
      hall: idHall,
      client: clientFromDB.id,
      clientInfo: clientInfo,
      comment
    });

    await newPlan.save();

    // const plan = await Plan.find({
    //   date: {
    //     $gte: moment(`12.07.2021`, 'DD.MM.YYYY'),
    //     $lte: moment(`12.07.2021`, 'DD.MM.YYYY')
    //   }
    // });
    // console.log(moment(plan[1].date).format('DD.MM.YYYY'), moment(plan[1].time).format('HH:mm'));
    res.status(201).json(newPlan);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

module.exports.getPlanHalls = async (req, res) => {
  try {
    // console.log(req.body);
    const { date } = req.body;
    const newPlan = {};
    // const plan = await Plan.find({
    //   date: moment(date, 'DD.MM.YYYY')
    // }).populate('clients');
    const plan = await Plan.find({
      date: moment(date, formatDateConf)
    });

    const halls = await Halls.find({}).sort('order');
    // console.log(halls);
    halls.forEach(({ id, name, square, ceilingHeight, priceFrom, description, order }) => {
      // console.log({ id, name, square, ceilingHeight, priceFrom, description, order });

      // console.log(date);
      newPlan[id] = {
        id,
        date,
        name,
        square,
        ceilingHeight,
        priceFrom,
        description,
        order,
        plans: {}
      };
    });
    plan.forEach((planItem) => {
      // newPlan[planItem.hall._id.toString()].plans.push('asd');
      const idHall = planItem.hall._id.toString();
      const { id, time, minutes, client, clientInfo } = planItem;
      // console.log(client);
      const formatTime = moment(time).format(formatTimeConf);
      const timeEnd = moment(time).add(minutes, 'm').format(formatTimeConf);
      const timeRange = `${formatTime} - ${timeEnd}`;
      // console.log(moment(time).format('HH:mm'), minutes);
      // console.log(timeRange);
      if (!!newPlan[idHall]) {
        newPlan[idHall].plans[formatTime] = {
          id,
          minutes,
          timeRange,
          client: client && client.toString(),
          clientInfo: { ...clientInfo }
        };
      }
      // console.log(newPlan[planItem.hall._id.toString()]);
    });
    // console.log(newPlan);
    // console.log(date, plan);
    // console.log(moment(plan[1].date).format('DD.MM.YYYY'), moment(plan[1].time).format('HH:mm'));
    // const aaa = _.chain(plan).groupBy('hall.name').value();
    // console.log(Object.values(aaa));
    // console.log(halls);
    res.status(201).json(Object.values(newPlan));
  } catch (error) {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
  }
};

module.exports.checkPlanFree = async (req, res) => {
  try {
    const { date, idHall } = req.body;
    const formateDate = moment(`${date}`, formatDateConf);
    const plan = await Plan.find({
      date: formateDate,
      hall: idHall
    });
    const shedule = await WorkShedule.findOne({});
    const resultFreeDays = calculateFreeDays(plan, shedule);
    res.status(201).json(resultFreeDays);
  } catch (error) {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
  }
};
