const moment = require('moment');
const { trim } = require('lodash');
const { base64encode } = require('nodejs-base64');
var md5 = require('md5');

const config = require('config');
const formatDateConf = config.get('formatDate');
const formatTimeConf = config.get('formatTime');
const hostname = config.get('hostname');
const secretSeed = config.get('secretSeed');
const _ = require('lodash');
// const weekDaysConf = config.get('weekDays');

const Plan = require('../models/plan');
const Invoices = require('../models/invoices');
const Price = require('../models/prices');
const Holidays = require('../models/holidays');
const Halls = require('../models/halls');
const Clients = require('../models/clients');
const WorkShedule = require('../models/work-shedule');
const Discounts = require('../models/discounts');
const Paykeeper = require('../models/paykeeper');
const Prepayment = require('../models/prepayment');
const Payments = require('../models/payments');
const {
  timeToMinutes,
  minutesToTime,
  minutesToTimeHour,
  creatingSchedule
} = require('../libs/handler-time');
const {
  statusArr,
  paymentTypeArr,
  purposeArr,
  daysOfWeekArr: weekDaysConf
} = require('../config/priceSettings');
const groupPrices = require('../libs/group-prices');
const calcPrice = require('../libs/calc-price');
const calcDiscount = require('../libs/calc-discount');
const sendMailer = require('../libs/sendmailer');
const {
  arrToObj,
  parseFullName,
  transformEmpty,
  formatPrice,
  requestFunc
} = require('../libs/helper.functions');
const handleAddPlan = require('../libs/handler-add-plan');

moment.locale('ru');

module.exports.getBookingPlanWeek = async (req, res) => {
  try {
    const { date, idHall } = req.body;
    const sheduleWork = {};
    const dateNow = moment(moment().format(formatDateConf), formatDateConf);
    const minutesNow = timeToMinutes(moment().format('HH:mm'));
    const dateFrom = moment(date, formatDateConf).isoWeekday(1);
    const dateTo = moment(date, formatDateConf).isoWeekday(1).add(7, 'd');
    const dateStart = moment(date, formatDateConf).isoWeekday(1);
    const shedule = await WorkShedule.findOne({});
    const { minutesTo, hourSize, minutesFrom } = shedule;
    const plan = await Plan.find({
      date: {
        $gte: dateFrom,
        $lt: dateTo
      },
      hall: idHall
    });
    const hall = await Halls.findOne({
      _id: idHall
    });

    const minutesStep = hall.step ? hall.step : shedule.minutesStep;
    const list = creatingSchedule({ minutesFrom, minutesTo, minutesStep, hourSize });

    for (let i = 0; i < 7; i++) {
      let busy = false;
      const dateFull = moment(dateStart.format(formatDateConf), formatDateConf);

      const listSheduleWork = {};
      list.forEach((item) => {
        busy =
          (dateFull.isSame(dateNow) && item.minutes <= minutesNow) || dateFull.isBefore(dateNow)
            ? true
            : false;
        listSheduleWork[item.minutes] = { ...item, busy };
      });
      sheduleWork[dateStart.format(formatDateConf)] = {
        dateShort: dateStart.format(formatDateConf),
        dateFull: dateFull,
        dayWeek: `${weekDaysConf[i].name}, ${dateStart.format('DD')}`,
        idHall,
        list: listSheduleWork
      };
      dateStart.add(1, 'd');
    }
    plan.forEach((item) => {
      const datePlan = moment(item.date).format(formatDateConf);
      const timePlan = moment(item.time).format(formatTimeConf);
      const isErrorRate = timeToMinutes(timePlan) % minutesStep;
      const minutesStartPlan =
        isErrorRate > 0 ? timeToMinutes(String(timePlan)) - 30 : timeToMinutes(String(timePlan));
      const minutesPlan = isErrorRate > 0 ? item.minutes + 30 : item.minutes;

      let counterMinutes = minutesStartPlan;
      while (counterMinutes < minutesStartPlan + minutesPlan) {
        sheduleWork[datePlan]['list'][String(counterMinutes)]['busy'] = true;
        counterMinutes = counterMinutes + minutesStep;
      }
    });

    const dates = Object.keys(sheduleWork);
    const firstDate = moment(dates[0], `${formatDateConf}`).format('D MMMM').split(' ');
    const lastDate = moment(dates[dates.length - 1], `${formatDateConf}`)
      .format('D MMMM')
      .split(' ');
    const rangeDate =
      firstDate[1] === lastDate[1]
        ? `${firstDate[0]} - ${lastDate[0]} ${lastDate[1]}`
        : `${firstDate[0]} ${firstDate[1]} - ${lastDate[0]} ${lastDate[1]}`;

    const { hours: prepaymentHours, percent: prepaymentPercent } = await Prepayment.findOne({});

    res.json({
      sheduleWork,
      minutesStep: minutesStep,
      hourSize: hourSize,
      minutesFrom: minutesFrom,
      minutesTo: minutesTo,
      rangeDate,
      firstDate: dates[0],
      prepaymentHours,
      prepaymentPercent
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

module.exports.getBookingPrice = async (req, res) => {
  try {
    const { date, minutes, minutesBusy, idHall, persons, key, purpose } = req.body;
    const formateDate = moment(`${date}`, formatDateConf);
    const formateTime = moment(`${minutesToTime(minutes)}`, formatTimeConf);
    const bookingObj = { date: formateDate, time: formateTime, minutes: minutesBusy, persons };
    const shedule = await WorkShedule.findOne({});
    const prices = await Price.find({}).sort('priority');
    const holidaysObj = await Holidays.find({});
    const discounts = await Discounts.find({});
    const pricesSort = _.reverse(prices);
    const pricesObj = groupPrices(pricesSort);
    const purposeObj = arrToObj(purposeArr);
    const priceByPurpose =
      pricesObj[idHall] && pricesObj[idHall][purpose] ? pricesObj[idHall][purpose]['list'] : [];

    const price = calcPrice(bookingObj, priceByPurpose, shedule, holidaysObj);

    const discount = calcDiscount({
      plan: bookingObj,
      discounts,
      shedule,
      holidays: holidaysObj,
      price,
      idHall
    });
    const diffPrice = price - discount;
    const resultPrice = diffPrice > 0 ? diffPrice : 0;

    res.json({
      price: resultPrice,
      discount,
      key,
      discountText: formatPrice(discount),
      priceText: formatPrice(resultPrice),
      purposeText: purposeObj[purpose].text,
      timeRange: `${minutesToTime(minutes)}-${minutesToTime(minutes + minutesBusy)}`,
      timeBusy: minutesToTimeHour(minutesBusy)
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

module.exports.addOrders = async (req, res) => {
  try {
    const { firstName, phone, mail, comment, /*price,*/ selected, dateOrder, dateOrderFormat } =
      req.body;
    let clientFromDB = {};

    const findClient = await Clients.findOne({
      $or: [
        { phone: phone },
        {
          mail: mail
        }
      ]
    });

    if (findClient) {
      clientFromDB = findClient;
    } else {
      const clientNameArray = parseFullName(firstName);
      clientFromDB = new Clients({
        name: { first: clientNameArray.firstName, last: clientNameArray.lastName },
        phone: transformEmpty(phone),
        mail: transformEmpty(mail)
      });

      await clientFromDB.save();
    }
    const client = {
      name: trim(`${clientFromDB.name.first} ${clientFromDB.name.last}`),
      phone: transformEmpty(clientFromDB.phone),
      mail: transformEmpty(clientFromDB.mail)
    };

    const keysOrders = Object.keys(selected);
    const promiseOrder = keysOrders.map(async (item) => {
      const itemOrders = selected[item];
      const newOrder = {
        idHall: itemOrders.idHall,
        minutes: itemOrders.minutesBusy,
        date: itemOrders.date,
        time: minutesToTime(itemOrders.minutes),
        status: statusArr[0].value,
        paymentType: paymentTypeArr[0].value,
        purpose: itemOrders.purpose,
        persons: itemOrders.persons,
        comment,
        paidFor: '',
        paymentMethod: 'сashless',
        dateOrder,
        dateOrderFormat
      };
      const plan = handleAddPlan(newOrder, client, clientFromDB.id);

      return plan;
    });
    const allAddedOrders = await Promise.all(promiseOrder);

    res.json(allAddedOrders);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

module.exports.bookingFetch = async (req, res) => {
  try {
    const { listOrders, price, form } = req.body;
    const { firstName, phone, mail, typePay } = form;
    const listPlanId = [];

    const halls = await Halls.find({});
    const hallsObj = arrToObj(halls, '_id');
    let isAppExist = false;

    const isSingleOrder = listOrders.length === 1;
    let serviceName = isSingleOrder ? 'Аренда зала:' : 'Аренда залов:';

    listOrders.forEach((item) => {
      if (item.error) isAppExist = true;
      else {
        listPlanId.push(item._id);
        const { hall, date, time, minutes } = item;
        const nameHall = hallsObj[hall].name;
        const dateFormat = moment(date).format(formatDateConf);
        const timeFormat = moment(time).format(formatTimeConf);
        const timeToFormat = moment(time).add(minutes, 'm').format(formatTimeConf);
        serviceName += ` ${nameHall} (${dateFormat} ${timeFormat} - ${timeToFormat});`;
      }
    });
    const prepayment = await Prepayment.findOne({});
    const expiryPrepayment = moment(form.dateOrder).add(prepayment.hours, 'h');

    if (isAppExist) {
      res.json({ error: true, message: '' });
    } else {
      const { loginPK, passPK, serverPK } = await Paykeeper.findOne({});
      const percentResult =
        prepayment.percent === 100 || typePay === 'full' ? 100 : prepayment.percent;
      const payAmount = Math.ceil((price / 100) * percentResult);

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
      const { invoice_id, invoice_url } = JSON.parse(
        await requestFunc({
          method: 'POST',
          url: `${serverPK}/change/invoice/preview/`,
          headers: {
            Authorization: `Basic ${encodedAuthorization}`
          },
          formData: {
            token: token,
            clientid: firstName,
            orderid: invoicesOrderId,
            pay_amount: payAmount,
            client_email: mail,
            client_phone: phone,
            service_name: serviceName,
            expiry: expiryPrepayment.format('YYYY-MM-DD HH:mm:ss')
          }
        })
      );
      const invoicesNew = new Invoices({
        invoiceID: invoice_id,
        invoiceUrl: invoice_url,
        listPlans: listPlanId,
        orderId: parseInt(invoicesOrderId),
        percent: percentResult
      });

      await invoicesNew.save();

      const listOrdersWithInvoicesPromise = listOrders.map(async (item) => {
        await Plan.updateOne(
          { _id: item._id },
          { invoices: [...item.invoices, invoicesNew._id] },
          { new: true }
        );
        return {};
      });
      await Promise.all(listOrdersWithInvoicesPromise);

      await requestFunc({
        method: 'POST',
        url: `${serverPK}/change/invoice/send/`,
        headers: {
          Authorization: `Basic ${encodedAuthorization}`
        },
        formData: {
          id: invoice_id,
          token: token
        }
      });
      // Plan;
      // await Plan.updateOne(
      //   { _id: idPlan },
      //   { status: 'cancelled', comment, reason },
      //   { new: true }
      // );
      // console.log(listOrdersWithInvoices);
      // console.log(invoice_id, invoice_url);

      res.json({ error: false, result: 'success', invoice_url });
    }
    // res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

module.exports.bookingNotice = async (req, res) => {
  try {
    const { id, orderid, sum } = req.body;
    const hash = md5(`${id}${secretSeed}`);
    const invoice = await Invoices.findOne({ orderId: orderid });
    const { listPlans, percent, invoiceID } = invoice;
    const isAddPayment = !(await Payments.findOne({ invoiceID }));

    let textPlans = '';
    let textClient = '';
    if (isAddPayment) {
      const allPaymentsPlans = listPlans.map(async (item, key) => {
        const plan = await Plan.findOne({ _id: item }).populate('hall').populate('client');
        const dateFormat = moment(plan.date).format(formatDateConf);
        const timeFormat = moment(plan.time).format(formatTimeConf);
        const timeToFormat = moment(plan.time).add(plan.minutes, 'm').format(formatTimeConf);
        const priceCalc = plan.price - plan.discount;
        const priceCalcPercent = parseInt(Math.ceil((priceCalc / 100) * percent));
        console.log('1 - ', priceCalcPercent);
        const textPlan = `<div><a href="${hostname}/detail-plan/${plan.id}">${plan.hall.name} (${dateFormat} ${timeFormat} - ${timeToFormat})</a></div>`;
        textPlans += textPlan;
        if (key === 0) {
          textClient = `<a href="${hostname}/clients/${plan.client.id}">${plan.client.name.first} ${plan.client.name.last}</a>`;
        }
        const payment = new Payments({
          paymentType: 'income',
          paymentDate: moment(),
          paymentWay: 'сashless',
          paymentSum: priceCalcPercent,
          paymentPurpose: '',
          idPlan: item,
          invoiceID: invoiceID,
          plan: plan.id,
          orderDate: plan.dateOrder
        });

        await payment.save();

        // console.log(plan);

        return payment;
      });
      // console.log(allPaymentsPlans);
      await Promise.all(allPaymentsPlans);

      const priceFormat = formatPrice(parseInt(sum));

      await sendMailer({
        subject: `Оплата заказа на сумму ${priceFormat} руб.`,
        html: `
        <h2>Оплачено от ${moment().format(formatDateConf)} в ${moment().format(formatTimeConf)}</h2>
        <h2>Номер заказа в PayKeeper - ${id}</h2>
        <h2>Клиент: ${textClient}</h2>
        <hr>
        <br>
        <h2>Заказы:</h2>
        ${textPlans}
        <br>
        <hr>
        <br>
        <h2>Внесена предоплата <b>${percent}%</b> в размере <b>${priceFormat} руб.</b></h2>
      `
      });
    }
    // console.log(hostname);
    // console.log(resultSending);

    res.send(`OK ${hash}`);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
