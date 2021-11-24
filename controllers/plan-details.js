const moment = require('moment');
const config = require('config');

const formatDateConf = config.get('formatDate');
const formatTimeConf = config.get('formatTime');

const Plan = require('../models/plan');
const Clients = require('../models/clients');
const Halls = require('../models/halls');
const { daysOfWeekArr, paymentTypeArr } = require('../config/priceSettings');
const { arrToObj, formatPrice } = require('../libs/helper.functions');
const daysOfWeekObj = arrToObj(daysOfWeekArr);
const paymentTypeObj = arrToObj(paymentTypeArr);

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
      total: formatPrice(priceDiscount)
    };
    const discount = paymentType.value === 'paid' ? plan.discount : plan.price;
    const totalDiscount = (discount / plan.price) * 100;
    const totalPrice = plan.price - discount;
    const total = {
      price: formatPrice(plan.price),
      discountPercent: Math.floor(totalDiscount),
      discount: formatPrice(discount),
      totalPrice: totalPrice,
      totalPriceText: formatPrice(totalPrice)
    };
    // console.log(total);
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
          dateOfBirth: client.dateOfBirth
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
      total
    };
    // console.log(planDetail);

    // console.log(planDetail);

    // const planDetails = {
    //   name: `${client.name.first} ${client.name.last}`.trim(),
    //   phone: client.phone,
    //   mail: client.mail
    // };
    // planDetails.phone = client.phone;
    // console.log(planDetail);
    // console.log(plan);
    // const hallsArr = await Halls.find({});
    // const hallsObj = arrToObj(hallsArr, 'id');
    // const planNew = converterDiscountFromBase(plan, hallsObj);

    res.json(planDetail);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
