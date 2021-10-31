const moment = require('moment');
const _ = require('lodash');
const { trim } = require('lodash');
const config = require('config');

const Plan = require('../models/plan');
const Clients = require('../models/clients');
const Halls = require('../models/halls');
const WorkShedule = require('../models/work-shedule');
const Price = require('../models/prices');
const { calculateFreeTime, calculateFreeDays } = require('../libs/handler-time');
const groupPrices = require('../libs/group-prices');
const calcPrice = require('../libs/calc-price');

const formatDateConf = config.get('formatDate');
const formatTimeConf = config.get('formatTime');
const dateForTimeConf = config.get('dateForTime');
const { purposeArr, paymentTypeArr } = require('../config/priceSettings');
const { arrToObj } = require('../libs/helper.functions');

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
      status,
      paymentType,
      purpose,
      persons,
      comment,
      paidFor,
      paymentMethod
    } = req.body;
    const formateDate = moment(`${date}`, formatDateConf);
    const formateTime = moment(`${dateForTimeConf} ${time}`, `${formatDateConf} ${formatTimeConf}`);

    const prices = await Price.find({}).sort('priority');
    const pricesSort = _.reverse(prices);
    const pricesObj = groupPrices(pricesSort);

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
      status,
      paymentType,
      purpose,
      persons,
      comment,
      paidFor,
      paymentMethod
    };
    // console.log(newPlanObj);

    if (paymentType === 'paid') {
      const priceByPurpose =
        pricesObj[idHall] && pricesObj[idHall][purpose] ? pricesObj[idHall][purpose]['list'] : [];
      const price = calcPrice(newPlanObj, priceByPurpose, shedule);
      newPlanObj.price = price;
    } else newPlanObj.price = 0;
    // console.log(newPlanObj);

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
    paymentTypeArr;
    const purposeObj = arrToObj(purposeArr);
    const paymentTypeObj = arrToObj(paymentTypeArr);
    const newPlan = {};
    const plan = await Plan.find({
      date: moment(date, formatDateConf)
    });
    const halls = await Halls.find({}).sort('order');
    // const { minutesStep, hourSize } = shedule;

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
      // console.log(planItem);
      const idHall = planItem.hall._id.toString();
      const {
        id,
        time,
        minutes,
        client,
        clientInfo,
        status,
        paymentType,
        purpose,
        persons,
        comment,
        paidFor,
        paymentMethod,
        price
      } = planItem;
      // console.log(client);
      // const formatTime =
      //   Number(moment(time).format('mm')) !== minutesStep % hourSize
      //     ? moment(time).subtract(30, 'minutes').format(formatTimeConf)
      //     : moment(time).format(formatTimeConf);
      const formatTime = moment(time).format(formatTimeConf);
      const timeEnd = moment(time).add(minutes, 'm').format(formatTimeConf);
      const timeRange = `${formatTime} - ${timeEnd}`;
      if (!!newPlan[idHall]) {
        newPlan[idHall].plans[formatTime] = {
          id,
          minutes,
          timeRange,
          client: client && client.toString(),
          clientInfo: { ...clientInfo },
          status,
          paymentType,
          paymentTypeObj: paymentTypeObj[paymentType],
          purpose,
          purposeText: purposeObj[purpose].text,
          persons,
          comment,
          paidFor,
          paymentMethod,
          price,
          priceFormat: price ? price.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ') : ''
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
    // console.log(resultFreeDays);
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
