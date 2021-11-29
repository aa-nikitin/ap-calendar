const moment = require('moment');
const config = require('config');
const { trim } = require('lodash');

const formatDateConf = config.get('formatDate');
const formatTimeConf = config.get('formatTime');

const { purposeArr, paymentTypeArr, statusArr } = require('../config/priceSettings');
const Clients = require('../models/clients');
const Plan = require('../models/plan');
const Halls = require('../models/halls');
const Payments = require('../models/payments');
const WorkShedule = require('../models/work-shedule');
const { calculateFreeTime, calculateFreeDays } = require('../libs/handler-time');
const { arrToObj, parseFullName, transformEmpty } = require('../libs/helper.functions');
const handleAddPlan = require('../libs/handler-add-plan');
const calcPayments = require('../libs/payments-calc');

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
          mail: transformEmpty(plan.clientInfo.mail)
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
      mail: clientFromDB.mail
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
    }).populate('client');
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

    const remainSumm = await Promise.all(
      plan.map(async (planItem) => {
        const { price, discount, priceService } = planItem;
        const payments = await Payments.find({ idPlan: planItem._id });
        const { total: paidSum } = calcPayments(payments);
        const remainPay = price - discount + priceService - paidSum;
        const summ = remainPay > 0 ? remainPay : 0;
        return { summ, id: planItem.id };
      })
    );
    // await Promise.all(imagesPromise);

    const remainSummObj = arrToObj(remainSumm, 'id');
    plan.forEach((planItem) => {
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
        price,
        discount,
        services,
        priceService
      } = planItem;
      // const formatTime =
      //   Number(moment(time).format('mm')) !== minutesStep % hourSize
      //     ? moment(time).subtract(30, 'minutes').format(formatTimeConf)
      //     : moment(time).format(formatTimeConf);
      const formatTime = moment(time).format(formatTimeConf);
      const timeEnd = moment(time).add(minutes, 'm').format(formatTimeConf);
      const timeRange = `${formatTime} - ${timeEnd}`;
      const priceDiscount = price - discount > 0 ? price - discount : 0;

      // const payments = await Payments.find({ idPlan: id });

      // const { total: paidSum } = calcPayments(payments);
      // cancelled
      if (!!newPlan[idHall] && planItem.status !== 'cancelled') {
        newPlan[idHall].plans[formatTime] = {
          id,
          minutes,
          timeRange,
          client: client && client._id && client._id.toString(),
          clientBlacklist: !!client && client.blacklist,
          clientInfo: { ...clientInfo },
          status,
          statusText: statusObj[status].name,
          paymentType,
          paymentTypeObj: paymentTypeObj[paymentType],
          purpose,
          purposeText: purposeObj[purpose].text,
          persons,
          comment,
          price: priceDiscount,
          discount,
          services,
          priceService,
          paidSumm: remainSummObj[id].summ
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

module.exports.cancalledPlan = async (req, res) => {
  try {
    const { idPlan, comment, reason, idClient, blacklist } = req.body;
    // const { idPlan } = req.body.params;
    // const resultDelete = await Plan.updateOne({ _id: idPlan });

    const resultUpdate = await Plan.updateOne(
      { _id: idPlan },
      { status: 'cancelled', comment, reason },
      { new: true }
    );

    if (blacklist) await Clients.updateOne({ _id: idClient }, { blacklist: true }, { new: true });

    // { name: 'Заявка', value: 'application' },
    // { name: 'Бронь', value: 'booking' },
    // { name: 'Завершено', value: 'completed' }
    res.json(resultUpdate);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
