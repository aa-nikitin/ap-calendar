const _ = require('lodash');
const moment = require('moment');
const config = require('config');

const dateForTimeConf = config.get('dateForTime');
const formatDateConf = config.get('formatDate');
const formatTimeConf = config.get('formatTime');

const Discounts = require('../models/discounts');
const Plan = require('../models/plan');
const WorkShedule = require('../models/work-shedule');
const Holidays = require('../models/holidays');
const Price = require('../models/prices');
const groupPrices = require('../libs/group-prices');
const { calculateFreeTime } = require('../libs/handler-time');
const calcPrice = require('../libs/calc-price');
const calcDiscount = require('../libs/calc-discount');

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
    const discounts = await Discounts.find({});
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

      const holidaysObj = await Holidays.find({});
      const price = calcPrice(newPlanObj, priceByPurpose, shedule, holidaysObj);

      const discount = calcDiscount({
        plan: newPlanObj,
        discounts,
        shedule,
        holidays: holidaysObj,
        price
      });
      let priceNew = price;
      let discountNew = discount;
      if (!!idPlan) {
        comparePlan = await Plan.findOne({ _id: idPlan });
        console.log(comparePlan.price, price);
        priceNew = comparePlan.price === price ? comparePlan.price : price;
        discountNew = comparePlan.price === price ? comparePlan.discount : discount;
      }
      newPlanObj.price = priceNew;
      newPlanObj.discount = discountNew;
    } else {
      newPlanObj.price = 0;
      newPlanObj.discount = 0;
    }

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
