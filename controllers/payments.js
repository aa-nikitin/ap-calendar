const Payments = require('../models/payments');
const Prepayment = require('../models/prepayment');
const Plan = require('../models/plan');
const Paykeeper = require('../models/paykeeper');
const Invoices = require('../models/invoices');
const { base64encode } = require('nodejs-base64');
const moment = require('moment');
const config = require('config');

const { requestFunc, formatPrice } = require('../libs/helper.functions');
const calcPayments = require('../libs/payments-calc');

const formatDateConf = config.get('formatDate');
const formatTimeConf = config.get('formatTime');
const sendMailer = require('../libs/sendmailer');

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
    const plan = await Plan.findOne({ _id: idPlan });
    const formatPaymentDate = moment(paymentDate, formatDateConf);
    const paymentSumInt = parseInt(paymentSum);
    const formatPaymentSum = paymentSumInt ? paymentSumInt : 0;
    const payments = new Payments({
      paymentType,
      paymentDate: formatPaymentDate,
      paymentWay,
      paymentSum: formatPaymentSum,
      paymentPurpose,
      idPlan,
      plan: idPlan,
      orderDate: plan.dateOrder
    });

    await payments.save();

    const paymentsFind = await Payments.find({ idPlan });
    const formatPayments = handlerPayments(paymentsFind);

    res.json(formatPayments);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
module.exports.deletePayments = async (req, res) => {
  try {
    const payments = await Payments.deleteOne({ _id: req.params.id });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

module.exports.sendBill = async (req, res) => {
  try {
    const { priceBill, idPlan, dateOrder } = req.body;
    const { loginPK, passPK, serverPK } = await Paykeeper.findOne({});
    const prepayment = await Prepayment.findOne({});

    const plan = await Plan.findOne({
      _id: idPlan
    })
      .populate('client')
      .populate('hall');
    let encodedAuthorization = base64encode(`${loginPK}:${passPK}`);
    const { token } = JSON.parse(
      await requestFunc({
        method: 'GET',
        url: `${serverPK}/info/settings/token/`,
        headers: {
          Authorization: `Basic ${encodedAuthorization}`
        }
      })
    );
    const invoicesLast = await Invoices.findOne().sort({ orderId: -1 }).limit(1);
    const invoicesOrderId = invoicesLast && invoicesLast.orderId ? invoicesLast.orderId + 1 : 1;
    const clientName =
      plan.client && plan.client.name
        ? `${plan.client.name.first} ${plan.client.name.last}`
        : plan.clientInfo.name;
    const clientEmail = plan.client ? plan.client.mail : plan.clientInfo.mail;
    const clientPhone = plan.client ? plan.client.phone : plan.clientInfo.phone;
    let serviceName = 'Аренда зала:';
    const dateFormat = moment(plan.date).format(formatDateConf);
    const timeFormat = moment(plan.time).format(formatTimeConf);
    const timeToFormat = moment(plan.time).add(plan.minutes, 'm').format(formatTimeConf);
    serviceName += ` ${plan.hall.name} (${dateFormat} ${timeFormat} - ${timeToFormat});`;
    const expiryPrepayment = moment(dateOrder, 'DD.MM.YYYY HH:mm').add(prepayment.hours, 'h');
    const { invoice_id, invoice_url } = JSON.parse(
      await requestFunc({
        method: 'POST',
        url: `${serverPK}/change/invoice/preview/`,
        headers: {
          Authorization: `Basic ${encodedAuthorization}`
        },
        formData: {
          token: token,
          clientid: clientName,
          orderid: invoicesOrderId,
          pay_amount: priceBill,
          client_email: clientEmail,
          client_phone: clientPhone,
          service_name: serviceName,
          expiry: expiryPrepayment.format('YYYY-MM-DD HH:mm:ss')
        }
      })
    );

    // const percentResult = ((priceBill * 100) / plan.price).toFixed(2);
    const invoicesNew = new Invoices({
      invoiceID: invoice_id,
      invoiceUrl: invoice_url,
      listPlans: [plan.id],
      orderId: parseInt(invoicesOrderId),
      percent: 0
    });

    await sendMailer({
      to: clientEmail,
      subject: `Выставлен счет на сумму ${priceFormat} руб.`,
      html: `
      <a href="${invoice_url}">Ссылка на оплату счета</a>
    `
    });

    await invoicesNew.save();

    await Plan.updateOne(
      { _id: plan._id },
      { invoices: [...plan.invoices, invoicesNew._id] },
      { new: true }
    );

    res.json({ invoice_id, invoice_url });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
