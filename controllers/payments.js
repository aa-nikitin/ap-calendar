const Payments = require('../models/payments');
const moment = require('moment');
const config = require('config');

const { formatPrice } = require('../libs/helper.functions');
const calcPayments = require('../libs/payments-calc');

const formatDateConf = config.get('formatDate');
const handlerPayments = (payments) =>
  payments.map((item) => {
    const { paymentType, paymentDate, paymentWay, paymentSum, paymentPurpose, idPlan, id } = item;
    return {
      paymentType,
      paymentDate: moment(paymentDate).format(formatDateConf),
      paymentWay,
      paymentSum,
      paymentSumText: formatPrice(paymentSum),
      paymentPurpose,
      idPlan,
      id
    };
  });

module.exports.getPayments = async (req, res) => {
  try {
    const payments = await Payments.find({ idPlan: req.params.id });
    const formatPayments = handlerPayments(payments);

    res.json(formatPayments);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
module.exports.getTotalPayments = async (req, res) => {
  try {
    const payments = await Payments.find({ idPlan: req.params.id });

    const { income, expense, total } = calcPayments(payments);
    const totalPayments = {
      income,
      expense,
      total,
      incomeText: formatPrice(income),
      expenseText: formatPrice(expense),
      totalText: formatPrice(total)
    };

    res.json(totalPayments);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
module.exports.addPayments = async (req, res) => {
  try {
    const { paymentType, paymentDate, paymentWay, paymentSum, paymentPurpose, idPlan } = req.body;
    const formatPaymentDate = moment(paymentDate, formatDateConf);
    const paymentSumInt = parseInt(paymentSum);
    const formatPaymentSum = paymentSumInt ? paymentSumInt : 0;
    const payments = new Payments({
      paymentType,
      paymentDate: formatPaymentDate,
      paymentWay,
      paymentSum: formatPaymentSum,
      paymentPurpose,
      idPlan
    });

    // console.log(payments);

    await payments.save();

    const paymentsFind = await Payments.find({ idPlan });
    const formatPayments = handlerPayments(paymentsFind);
    // console.log(payments);
    res.json(formatPayments);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
module.exports.deletePayments = async (req, res) => {
  try {
    const payments = await Payments.deleteOne({ _id: req.params.id });
    // console.log(req.params.id);
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
