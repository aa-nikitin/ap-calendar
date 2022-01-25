const moment = require('moment');
const config = require('config');

const formatDateConf = config.get('formatDate');
const formatTimeConf = config.get('formatTime');

const Plan = require('../models/plan');
const Clients = require('../models/clients');
const Halls = require('../models/halls');
const { daysOfWeekArr, paymentTypeArr, purposeArr, statusArr } = require('../config/priceSettings');
const { arrToObj, formatPrice } = require('../libs/helper.functions');
const { timeToMinutes } = require('../libs/handler-time');
const daysOfWeekObj = arrToObj(daysOfWeekArr);
const paymentTypeObj = arrToObj(paymentTypeArr);
const purposeObj = arrToObj(purposeArr);
const statusObj = arrToObj(statusArr);

module.exports.getPlanDetails = async (req, res) => {
  try {
    const plan = await Plan.findOne({ _id: req.params.id });
    const client = await Clients.findOne({ _id: plan.client });
    const hall = await Halls.findOne({ _id: String(plan.hall) });
    const priceDiscount = plan.price - plan.discount > 0 ? plan.price - plan.discount : 0;
    const paymentType = paymentTypeObj[plan.paymentType];
    const servicePrice = {
      price: formatPrice(plan.price),
      discount: formatPrice(plan.discount),
      total: formatPrice(priceDiscount),
      priceService: formatPrice(plan.priceService)
    };
    const discount = paymentType.value === 'paid' ? plan.discount : plan.priceService + plan.price;
    const totalDiscount = (discount / (plan.priceService + plan.price)) * 100;
    const totalPrice = plan.priceService + plan.price - discount;
    const total = {
      price: formatPrice(plan.price),
      discountPercent: Math.floor(totalDiscount),
      discount: formatPrice(discount),
      totalPrice: totalPrice,
      totalPriceText: formatPrice(totalPrice)
    };
    const clientInfo = client
      ? {
          name: `${client.name.first} ${client.name.last}`.trim(),
          nickname: client.nickname,
          company: client.company,
          comment: client.comment,
          phone: client.phone,
          mail: client.mail,
          idClient: client.id,
          socials: client.socials,
          dateOfBirth: client.dateOfBirth,
          blacklist: client.blacklist
        }
      : {
          name: plan.clientInfo.name,
          phone: plan.clientInfo.phone,
          mail: plan.clientInfo.mail
        };
    const hallInfo = { name: hall.name, idHall: hall.id };

    const dayBirth =
      clientInfo.dateOfBirth && clientInfo.dateOfBirth.day ? clientInfo.dateOfBirth.day : '';
    const monthBirth =
      clientInfo.dateOfBirth && clientInfo.dateOfBirth.month ? clientInfo.dateOfBirth.month : '';
    const yearBirth =
      clientInfo.dateOfBirth && clientInfo.dateOfBirth.year
        ? ` ${clientInfo.dateOfBirth.year}г.`
        : '';
    const dayMonthBirth =
      dayBirth && monthBirth ? moment(`${dayBirth}.${monthBirth}`, 'DD.MM').format('D MMMM') : ``;
    const dateOfBirthText = `${dayMonthBirth}${yearBirth}`.trim();
    clientInfo.birthday = dateOfBirthText;
    // console.log(servicePrice);
    planInfo = {
      client: plan.client,
      clientInfo: plan.clientInfo,
      comment: plan.comment,
      discount: plan.discount,
      id: plan._id,
      minutes: plan.minutes,
      paymentType: plan.paymentType,
      paymentTypeObj: paymentType,
      persons: plan.persons,
      price: plan.price - plan.discount,
      priceService: plan.priceService,
      purpose: plan.purpose,
      purposeText: purposeObj[plan.purpose].name,
      services: plan.services,
      status: plan.status,
      statusText: plan.status === 'cancelled' ? 'Отменен' : statusObj[plan.status].name,
      timeRange: `${moment(plan.time).format(formatTimeConf)} - ${moment(plan.time)
        .add(plan.minutes, 'm')
        .format(formatTimeConf)}`
    };

    const planDetail = {
      idPlan: plan.id,
      date: moment(plan.date).format(formatDateConf),
      time: moment(plan.time).format(formatTimeConf),
      dayOfWeek: daysOfWeekObj[moment(plan.date).isoWeekday() - 1].name,
      paymentType,
      persons: plan.persons,
      comment: plan.comment,
      servicePrice,
      orderNumber: plan.orderNumber,
      dateOrderPlan: `${moment(plan.date).format(formatDateConf)}, ${
        daysOfWeekObj[moment(plan.date).isoWeekday() - 1].name
      } ${moment(plan.time).format(formatTimeConf)} - ${moment(plan.time)
        .add(plan.minutes, 'm')
        .format(formatTimeConf)}`,
      dateOrder: `${moment(plan.dateOrder).format(formatDateConf)}, ${
        daysOfWeekObj[moment(plan.dateOrder).isoWeekday() - 1].name
      } ${moment(plan.dateOrder).format(formatTimeConf)}`,
      clientInfo: clientInfo,
      hall: hallInfo,
      total,
      statusText: plan.status === 'cancelled' ? 'Отменен' : statusObj[plan.status].name,
      minutes: plan.minutes,
      minutesStart: timeToMinutes(moment(plan.time).format(formatTimeConf)),
      planInfo
    };

    // const planDetails = {
    //   name: `${client.name.first} ${client.name.last}`.trim(),
    //   phone: client.phone,
    //   mail: client.mail
    // };
    // planDetails.phone = client.phone;
    // const hallsArr = await Halls.find({});
    // const hallsObj = arrToObj(hallsArr, 'id');
    // const planNew = converterDiscountFromBase(plan, hallsObj);

    res.json(planDetail);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
