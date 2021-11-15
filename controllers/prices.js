var _ = require('lodash');

const Price = require('../models/prices');
const Halls = require('../models/halls');

const {
  purposeArr,
  goalArr,
  weekdayArr,
  worktimeArr,
  validityPeriodArr,
  priceArr,
  daysOfWeekArr,
  statusArr,
  paymentTypeArr,
  paymentMethodArr,
  conditionArr,
  daysBeforeBookingArr
} = require('../config/priceSettings');
const converterPrice = require('../libs/converter-price');
const groupPrices = require('../libs/group-prices');

module.exports.getPriceParams = async (req, res) => {
  try {
    const halls = await Halls.find({});
    const hallsArr = halls.map((item) => ({ name: item.name, value: item.id }));

    res.json({
      purposeArr,
      goalArr,
      weekdayArr,
      worktimeArr,
      validityPeriodArr,
      priceArr,
      daysOfWeekArr,
      statusArr,
      paymentTypeArr,
      paymentMethodArr,
      conditionArr,
      daysBeforeBookingArr,
      hallsArr
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
module.exports.addPrice = async (req, res) => {
  try {
    const priceNew = new Price(converterPrice(req.body));

    await priceNew.save();

    const prices = await Price.find().sort('priority');
    const pricesSort = _.reverse(prices);
    const pricesObj = groupPrices(pricesSort);

    res.json(pricesObj);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

module.exports.editPrice = async (req, res) => {
  try {
    const { id } = req.params;
    await Price.updateOne({ _id: id }, converterPrice(req.body), { new: true });

    const prices = await Price.find().sort('priority');
    const pricesSort = _.reverse(prices);
    const pricesObj = groupPrices(pricesSort);

    res.status(201).json(pricesObj);
  } catch (error) {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
  }
};

module.exports.getPrices = async (req, res) => {
  try {
    const prices = await Price.find({}).sort('priority');
    const pricesSort = _.reverse(prices);

    const pricesObj = groupPrices(pricesSort);

    res.json(pricesObj);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

module.exports.getPrice = async (req, res) => {
  try {
    const price = await Price.findOne({ _id: req.params.id });

    res.json(price);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

module.exports.deletePrice = async (req, res) => {
  try {
    await Price.deleteOne({ _id: req.params.id });

    const prices = await Price.find({}).sort('priority');
    const pricesSort = _.reverse(prices);

    pricesObj = groupPrices(pricesSort);

    res.json(pricesObj);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

module.exports.copyPrices = async (req, res) => {
  try {
    const { idHall, newIdHall } = req.body;
    const oldPrices = await Price.find({ idHall: newIdHall });
    const arrOldPrices = oldPrices.map((itemPrice) => {
      return new Promise(async (resolve) => {
        await Price.deleteOne({ _id: itemPrice.id });

        resolve();
      });
    });

    const prices = await Price.find({ idHall });
    const arrNewPrices = prices.map(
      (itemPrice) =>
        new Promise(async (resolve) => {
          const newPriceItem = converterPrice(itemPrice, true);
          const priceNew = new Price({ ...newPriceItem, idHall: newIdHall });

          await priceNew.save();
          resolve(priceNew);
        })
    );

    await Promise.all(arrOldPrices);
    await Promise.all(arrNewPrices);

    const pricesResult = await Price.find({}).sort('priority');
    const pricesSort = _.reverse(pricesResult);

    pricesObj = groupPrices(pricesSort);

    res.json(pricesObj);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

module.exports.deletePrices = async (req, res) => {
  try {
    const { idHall } = req.body.params;
    const prices = await Price.find({ idHall });
    const arrPrices = prices.map((itemPrice) => {
      return new Promise(async (resolve) => {
        await Price.deleteOne({ _id: itemPrice.id });

        resolve();
      });
    });
    await Promise.all(arrPrices);

    const pricesResult = await Price.find({}).sort('priority');
    const pricesSort = _.reverse(pricesResult);

    pricesObj = groupPrices(pricesSort);

    res.json(pricesObj);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
