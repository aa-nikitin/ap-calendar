const moment = require('moment');

const config = require('config');
const formatDateConf = config.get('formatDate');

const Plan = require('../models/plan');

module.exports.getBookingPlanWeek = async (req, res) => {
  try {
    const { date } = req.body;
    const dateFrom = moment(date, formatDateConf).isoWeekday(1);
    const dateTo = moment(date, formatDateConf).isoWeekday(1).add(7, 'd');
    const plan = await Plan.find({
      date: {
        $gte: dateFrom,
        $lt: dateTo
      }
    });
    console.log(plan);
    // console.log(dateFrom.format(formatDateConf), dateTo.format(formatDateConf));
    res.json({});
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
