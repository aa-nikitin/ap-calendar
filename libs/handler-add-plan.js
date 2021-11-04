const _ = require('lodash');
const moment = require('moment');
const config = require('config');

const dateForTimeConf = config.get('dateForTime');
const formatDateConf = config.get('formatDate');
const formatTimeConf = config.get('formatTime');

const Plan = require('../models/plan');
const WorkShedule = require('../models/work-shedule');
const Price = require('../models/prices');
const groupPrices = require('../libs/group-prices');
const { calculateFreeTime } = require('../libs/handler-time');
const calcPrice = require('../libs/calc-price');

module.exports = async (params, client, clientID) => {
  try {
    const {
      date,
      time,
      minutes,
      idHall,
      idPlan,
      status,
      paymentType,
      purpose,
      persons,
      comment,
      paidFor,
      paymentMethod
    } = params;
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

    const newPlanObj = {
      date: formateDate,
      time: formateTime,
      minutes,
      hall: idHall,
      client: clientID,
      clientInfo: client,
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
      // console.log(newPlanObj);
      newPlanObj.price = price;
    } else newPlanObj.price = 0;
    // console.log(newPlanObj);

    let newPlan = {};
    if (!idPlan) {
      newPlan = new Plan(newPlanObj);

      await newPlan.save();
    } else {
      newPlan = await Plan.updateOne({ _id: idPlan }, newPlanObj, { new: true });

      newPlan = await Plan.findOne({ _id: idPlan });
    }
    return newPlan;
    // res.status(201).json({});
  } catch (error) {
    return { error };
  }
};
