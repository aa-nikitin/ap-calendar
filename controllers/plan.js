const moment = require('moment');
const config = require('config');
const { trim } = require('lodash');

const formatDateConf = config.get('formatDate');
const formatTimeConf = config.get('formatTime');

const { purposeArr, paymentTypeArr, statusArr } = require('../config/priceSettings');
const Clients = require('../models/clients');
const Plan = require('../models/plan');
const Halls = require('../models/halls');
const WorkShedule = require('../models/work-shedule');
const { calculateFreeTime, calculateFreeDays } = require('../libs/handler-time');
const {
  arrToObj,
  parseFullName,
  transformEmpty,
  formatPrice
} = require('../libs/helper.functions');
const handleAddPlan = require('../libs/handler-add-plan');

module.exports.addPlanDate = async (req, res) => {
  try {
    const { idClient, clientName, clientAlias, clientPhone, clientEmail, idPlan } = req.body;

    let clientFromDB = {};

    if (idClient) {
      clientFromDB = await Clients.findOne({ _id: idClient });
      if (!clientFromDB) {
        const plan = await Plan.findOne({
          _id: idPlan
        });
        const clientNameArray = parseFullName(plan.clientInfo.name);
        clientFromDB = {
          id: idClient,
          name: { first: clientNameArray.firstName, last: clientNameArray.lastName },
          nickname: transformEmpty(plan.clientInfo.alias),
          phone: transformEmpty(plan.clientInfo.phone),
          mail: transformEmpty(plan.clientInfo.email)
        };
      }
    } else {
      const clientNameArray = parseFullName(clientName);
      clientFromDB = new Clients({
        name: { first: clientNameArray.firstName, last: clientNameArray.lastName },
        nickname: clientAlias,
        phone: clientPhone,
        mail: clientEmail
      });

      await clientFromDB.save();
    }

    const client = {
      name: trim(`${clientFromDB.name.first} ${clientFromDB.name.last}`),
      alias: clientFromDB.nickname,
      phone: clientFromDB.phone,
      email: clientFromDB.email
    };
    const plan = await handleAddPlan(req.body, client, clientFromDB.id);

    res.status(201).json(plan);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

module.exports.getPlanHalls = async (req, res) => {
  try {
    const { date } = req.body;
    const purposeObj = arrToObj(purposeArr);
    const paymentTypeObj = arrToObj(paymentTypeArr);
    const statusObj = arrToObj(statusArr);
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
        price,
        discount
      } = planItem;
      // console.log(client);
      // const formatTime =
      //   Number(moment(time).format('mm')) !== minutesStep % hourSize
      //     ? moment(time).subtract(30, 'minutes').format(formatTimeConf)
      //     : moment(time).format(formatTimeConf);
      const formatTime = moment(time).format(formatTimeConf);
      const timeEnd = moment(time).add(minutes, 'm').format(formatTimeConf);
      const timeRange = `${formatTime} - ${timeEnd}`;
      const priceDiscount = price - discount > 0 ? price - discount : 0;
      if (!!newPlan[idHall]) {
        newPlan[idHall].plans[formatTime] = {
          id,
          minutes,
          timeRange,
          client: client && client.toString(),
          clientInfo: { ...clientInfo },
          status,
          statusText: statusObj[status].name,
          paymentType,
          paymentTypeObj: paymentTypeObj[paymentType],
          purpose,
          purposeText: purposeObj[purpose].text,
          persons,
          comment,
          paidFor,
          paymentMethod,
          price: priceDiscount,
          priceFormat: priceDiscount ? formatPrice(priceDiscount) : '',
          discount,
          discountFormat: discount ? formatPrice(discount) : ''
          // priceDiscount,
          // priceDiscountFormat: priceDiscount ? formatPrice(priceDiscount) : ''
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
