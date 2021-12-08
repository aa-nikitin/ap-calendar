const moment = require('moment');
const config = require('config');

const formatDateConf = config.get('formatDate');
const formatTimeConf = config.get('formatTime');

const Plan = require('../models/plan');
const Payments = require('../models/payments');
const Halls = require('../models/halls');
const { arrToObj, formatPrice } = require('../libs/helper.functions');
const { paymentMethodArr, paymentArr, daysOfWeekArr } = require('../config/priceSettings');

const paymentMethodObj = arrToObj(paymentMethodArr);
const paymentArrObj = arrToObj(paymentArr);
const daysOfWeekObj = arrToObj(daysOfWeekArr);

module.exports.getFinance = async (req, res) => {
  try {
    const { dateFrom, dateTo, paymentDate, operations, methods, halls: hallsId } = req.body;

    // console.log(req.body);
    const dateFromFormat = moment(`${dateFrom} 00:00`, 'DD.MM.YYYY HH:mm');
    const dateToFormat = moment(`${dateTo} 23:59`, 'DD.MM.YYYY HH:mm');

    const halls = await Halls.find({});
    const hallsObj = arrToObj(halls, 'id');

    const queryPlan = {};
    if (paymentDate === 'byPaymentDate')
      queryPlan['paymentDate'] = { $gte: dateFromFormat, $lte: dateToFormat };
    if (paymentDate === 'byOrderDate')
      queryPlan['orderDate'] = { $gte: dateFromFormat, $lte: dateToFormat };
    if (operations !== 'all') queryPlan['paymentType'] = operations;
    if (methods !== 'all') queryPlan['paymentWay'] = methods;
    const payments = await Payments.find(queryPlan).populate('plan');
    // console.log(payments);

    const paymentPlan = [];
    let incomePlan = 0;
    let expensePlan = 0;
    let receiptsPlan = 0;
    let offsPlan = 0;
    const paymentsList = payments.map(async (item) => {
      if (
        item.plan.status !== 'cancelled' &&
        (String(item.plan.hall) === hallsId || hallsId === 'all')
      ) {
        const {
          client: idClient,
          clientInfo,
          hall: idHall,
          orderNumber,
          dateOrder,
          date: datePlan,
          time: timePlan,
          minutes: minutesPlan,
          persons: personsPlan
        } = item.plan;
        const { name: nameClient } = clientInfo;
        const { name: nameHall } = hallsObj[idHall];
        const { paymentType, paymentDate, paymentWay, paymentSum, paymentPurpose, idPlan, id } =
          item;
        if (paymentType === 'income') incomePlan += Number(paymentSum);
        else expensePlan += Number(paymentSum);
        if (paymentType === 'income') receiptsPlan += 1;
        else offsPlan += 1;
        paymentPlan.push({
          id,
          paymentTypeText: paymentArrObj[paymentType].name,
          paymentType: paymentType,
          paymentDate: moment(paymentDate).format('DD.MM.YYYY'),
          paymentWay: paymentMethodObj[paymentWay].name,
          paymentSum: formatPrice(paymentSum),
          paymentPurpose,
          idPlan,
          clientName: nameClient,
          idClient,
          orderNumber,
          dateOrder: moment(dateOrder).format('DD.MM.YYYY HH:mm'),
          datePlan: `${moment(datePlan).format(formatDateConf)}, ${
            daysOfWeekObj[moment(datePlan).isoWeekday() - 1].name
          } ${moment(timePlan).format(formatTimeConf)} - ${moment(timePlan)
            .add(minutesPlan, 'm')
            .format(formatTimeConf)}`,
          personsPlan,
          nameHall,
          idHall
        });
        return item;
      }
    });
    // console.log(total);
    await Promise.all(paymentsList);
    const total = {
      income: formatPrice(incomePlan),
      expense: formatPrice(expensePlan),
      profit: formatPrice(incomePlan - expensePlan),
      receipts: receiptsPlan,
      offs: offsPlan,
      operations: receiptsPlan + offsPlan
    };
    // console.log(aaa);
    // console.log(dateFrom, dateTo, paymentDate, operations, methods, hallsId);
    res.json({ paymentPlan, total });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
