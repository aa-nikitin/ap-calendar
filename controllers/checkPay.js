const moment = require('moment');

const Prepayment = require('../models/prepayment');
const Payments = require('../models/payments');
const Plan = require('../models/plan');
const config = require('config');
const hourCheck = config.get('hourCheck');

checkPayment = async () => {
  try {
    const prepayment = await Prepayment.findOne({});
    const { hours: hoursPrepayment, percent: percentPrepayment } = prepayment;
    const dateFrom = moment().subtract(hoursPrepayment + hourCheck, 'h');
    const dateTo = moment().subtract(hoursPrepayment, 'h');
    const plan = await Plan.find({
      dateOrder: {
        $gte: dateFrom,
        $lt: dateTo
      },
      paymentType: 'paid'
    });
    plan.forEach(async (item) => {
      const { price, discount, id } = item;
      const paymentThreshold = ((price - discount) * percentPrepayment) / 100;
      const payments = await Payments.find({ idPlan: id });
      let sumPayment = 0;
      payments.forEach((itemPayment) => {
        if (itemPayment.paymentType === 'income') sumPayment += Number(itemPayment.paymentSum);
        else sumPayment -= Number(itemPayment.paymentSum);
      });
      if (sumPayment < paymentThreshold)
        await Plan.updateOne(
          { _id: id },
          {
            status: 'cancelled',
            comment: 'Не внесена требуемая предоплата в течении отведенного времени',
            reason: 'notpayment'
          },
          { new: true }
        );
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.checkPaymentTimeout = async () => {
  setInterval(checkPayment, 1000 * 60 * 60);
};

module.exports.checkPayment = checkPayment;
