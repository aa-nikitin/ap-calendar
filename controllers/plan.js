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
      idPlan,
      comment
    } = req.body;
    const formateDate = moment(`${date}`, formatDateConf);
    const formateTime = moment(`${dateForTimeConf} ${time}`, `${formatDateConf} ${formatTimeConf}`);

    const plan = await Plan.find({
      date: formateDate,
      hall: idHall
    });

    const shedule = await WorkShedule.findOne({});
    const planFiltered = idPlan
      ? plan.filter((item) => {
          return item.id !== idPlan;
        })
      : plan;

    const hoursCount = calculateFreeTime(planFiltered, time, shedule);

    if (!(hoursCount >= minutes)) throw 'Указанное время занято';

    let clientFromDB = {};

    if (idClient) {
      clientFromDB = await Clients.findOne({ _id: idClient });
    } else {
      const clientNameArray = clientName.split(' ');
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

    const newPlanObj = {
      date: formateDate,
      time: formateTime,
      minutes,
      hall: idHall,
      client: clientFromDB.id,
      clientInfo: clientInfo,
      comment
    };
    let newPlan = {};
    if (!idPlan) {
      newPlan = new Plan(newPlanObj);

      await newPlan.save();
    } else {
      newPlan = await Plan.updateOne({ _id: idPlan }, newPlanObj, { new: true });
    }

    res.status(201).json({});
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

module.exports.getPlanHalls = async (req, res) => {
  try {
    const { date } = req.body;
    const newPlan = {};
    const plan = await Plan.find({
      date: moment(date, formatDateConf)
    });

    const halls = await Halls.find({}).sort('order');
    halls.forEach(({ id, name, square, ceilingHeight, priceFrom, description, order }) => {
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
      const idHall = planItem.hall._id.toString();
      const { id, time, minutes, client, clientInfo } = planItem;
      // console.log(client);
      const formatTime = moment(time).format(formatTimeConf);
      const timeEnd = moment(time).add(minutes, 'm').format(formatTimeConf);
      const timeRange = `${formatTime} - ${timeEnd}`;
      if (!!newPlan[idHall]) {
        newPlan[idHall].plans[formatTime] = {
          id,
          minutes,
          timeRange,
          client: client && client.toString(),
          clientInfo: { ...clientInfo }
        };
      }
    });
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

module.exports.checkPlanTime = async (req, res) => {
  try {
    const { date, time, idHall } = req.body;
    const formateDate = moment(`${date}`, formatDateConf);
    const plan = await Plan.find({
      date: formateDate,
      hall: idHall
    });
    const shedule = await WorkShedule.findOne({});
    const resultFreeDays = calculateFreeTime(plan, time, shedule);
    // console.log(resultFreeDays);
    res.status(201).json(resultFreeDays);
  } catch (error) {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
  }
};

module.exports.planTimeForEdit = async (req, res) => {
  try {
    const { date, time, idHall, minutes, idPlan } = req.body;
    const formateDate = moment(`${date}`, formatDateConf);
    const plan = await Plan.find({
      date: formateDate,
      hall: idHall
    });
    const planFiltered = plan.filter((item) => {
      return item.id !== idPlan;
    });

    const shedule = await WorkShedule.findOne({});
    const planFreeTime = calculateFreeTime(planFiltered, time, shedule);
    const planFree = calculateFreeDays(planFiltered, shedule);

    res.status(201).json({ planFreeTime, date, time, idHall, minutes, idPlan, planFree });
  } catch (error) {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
  }
};

module.exports.deletePlan = async (req, res) => {
  try {
    const { idPlan } = req.body.params;
    const resultDelete = await Plan.deleteOne({ _id: idPlan });

    res.json(resultDelete);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
