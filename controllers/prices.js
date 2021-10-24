const Price = require('../models/prices');

const {
  purposeArr,
  weekdayArr,
  worktimeArr,
  validityPeriodArr,
  priceArr,
  daysOfWeekArr
} = require('../config/priceSettings');
const converterPrice = require('../libs/converter-price');

module.exports.getPriceParams = async (req, res) => {
  try {
    res.json({ purposeArr, weekdayArr, worktimeArr, validityPeriodArr, priceArr, daysOfWeekArr });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
module.exports.addPrice = async (req, res) => {
  try {
    const priceNew = new Price(converterPrice(req.body));

    await priceNew.save();

    res.json(priceNew);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

module.exports.getPrices = async (req, res) => {
  try {
    const { idHall } = req.body;
    const prices = await Price.find({ idHall: idHall });
    // console.log(prices);
    res.json(prices);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
