const moment = require('moment');

const Prepayment = require('../models/prepayment');
const Payments = require('../models/payments');
const Plan = require('../models/plan');
const config = require('config');
const hourCheck = config.get('hourCheck');
const calcPayments = require('../libs/payments-calc');
const PriceInfo = require('../models/price-info');

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
      paymentType: 'paid',
      status: { $ne: 'cancelled' }
    });

    plan.forEach(async (item) => {
      const { id } = item;
      const priceInfo = await PriceInfo.findOne({ idPlan: id });
      const payments = await Payments.find({ idPlan: id });
      const paymentThreshold = (priceInfo.total * percentPrepayment) / 100;
      const { total: sumPayment } = calcPayments(payments);

      if (sumPayment < paymentThreshold && !priceInfo.fixed)
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
