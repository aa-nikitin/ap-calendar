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
const Services = require('../models/services');
const groupPrices = require('../libs/group-prices');
const { calculateFreeTime } = require('../libs/handler-time');
const calcPrice = require('../libs/calc-price');
const calcDiscount = require('../libs/calc-discount');
const calcServices = require('../libs/calc-services');

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
      paymentMethod,
      services
    } = params;
    const dateOrder = !params.dateOrder ? moment(new Date()) : params.dateOrder;
    const formateDate = moment(`${date}`, formatDateConf);
    const formateTime = moment(`${dateForTimeConf} ${time}`, `${formatDateConf} ${formatTimeConf}`);
    const prices = await Price.find({}).sort('priority');
    const pricesSort = _.reverse(prices);
    const pricesObj = groupPrices(pricesSort);
    const plan = await Plan.find({
      date: formateDate,
      hall: idHall
    });
    // console.log(plan[0].services);
    const discounts = await Discounts.find({});
    const shedule = await WorkShedule.findOne({});
    const planFiltered = idPlan
      ? plan.filter((item) => {
          return item.id !== idPlan;
        })
      : plan;
    const planFiltered2 = planFiltered.filter((item) => {
      return item.status !== 'cancelled';
    });
    console.log(planFiltered2);
    const hoursCount = calculateFreeTime(planFiltered2, time, shedule);
    console.log(hoursCount);
    const comparePlan = await Plan.findOne({ _id: idPlan });
    const planLast = await Plan.findOne().sort({ orderNumber: -1 }).limit(1);
    const orderNumberNew = planLast && planLast.orderNumber ? planLast.orderNumber + 1 : 1;
    // console.log(comparePlan.orderNumber);
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
      paymentMethod,
      orderNumber: !idPlan || !comparePlan.orderNumber ? orderNumberNew : comparePlan.orderNumber,
      dateOrder: !idPlan || !comparePlan.dateOrder ? dateOrder : comparePlan.dateOrder,
      services
    };
    // console.log(newPlanObj);

    const priceByPurpose =
      pricesObj[idHall] && pricesObj[idHall][purpose] ? pricesObj[idHall][purpose]['list'] : [];

    const holidaysObj = await Holidays.find({});
    const price = calcPrice(newPlanObj, priceByPurpose, shedule, holidaysObj);
    // console.log(services);

    const servicesAll = await Services.find({});
    const priceService = calcServices(services ? services : [], servicesAll, minutes);
    // console.log(priceService);
    const discount = calcDiscount({
      plan: newPlanObj,
      discounts,
      shedule,
      holidays: holidaysObj,
      price,
      idHall
    });
    let priceNew = price;
    let discountNew = discount;
    let priceServiceNew = 0;

    if (!!idPlan) {
      const comparePlanServices = comparePlan.services.map((item) => String(item));
      const isChangedServices =
        _.difference(services, comparePlanServices).length !== 0 ||
        _.difference(comparePlanServices, services).length !== 0;

      priceNew = comparePlan.minutes !== minutes ? price : comparePlan.price;
      discountNew = comparePlan.minutes !== minutes ? discount : comparePlan.discount;
      priceServiceNew =
        comparePlan.minutes !== minutes || isChangedServices
          ? priceService
          : comparePlan.priceService;
    }

    newPlanObj.price = priceNew;
    newPlanObj.discount = discountNew > priceNew ? priceNew : discountNew;
    newPlanObj.priceService = priceServiceNew;

    let newPlan = {};
    if (!idPlan) {
      newPlan = new Plan(newPlanObj);

      await newPlan.save();
    } else {
      newPlan = await Plan.updateOne({ _id: idPlan }, newPlanObj, { new: true });

      newPlan = await Plan.findOne({ _id: idPlan });
    }
    // console.log(newPlan.priceService);
    return newPlan;
    // res.status(201).json({});
  } catch (error) {
    return { error };
  }
};
