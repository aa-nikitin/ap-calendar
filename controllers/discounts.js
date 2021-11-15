const Discounts = require('../models/discounts');
const Halls = require('../models/halls');
const { converterDiscountToBase, converterDiscountFromBase } = require('../libs/helpers.discount');
const { arrToObj } = require('../libs/helper.functions');

module.exports.getDiscounts = async (req, res) => {
  try {
    const discounts = await Discounts.find({});
    const hallsArr = await Halls.find({});
    const hallsObj = arrToObj(hallsArr, 'id');
    const discountsNew = converterDiscountFromBase(discounts, hallsObj);

    res.json(discountsNew);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

module.exports.addDiscounts = async (req, res) => {
  try {
    const discountNew = new Discounts(converterDiscountToBase(req.body));

    await discountNew.save();

    const discounts = await Discounts.find();
    const hallsArr = await Halls.find({});
    const hallsObj = arrToObj(hallsArr, 'id');
    const discountsNew = converterDiscountFromBase(discounts, hallsObj);

    res.json(discountsNew);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

module.exports.editDiscounts = async (req, res) => {
  try {
    const { id } = req.params;

    await Discounts.updateOne({ _id: id }, converterDiscountToBase(req.body), { new: true });

    const discounts = await Discounts.find();
    const hallsArr = await Halls.find({});
    const hallsObj = arrToObj(hallsArr, 'id');
    const discountsNew = converterDiscountFromBase(discounts, hallsObj);

    res.status(201).json(discountsNew);
  } catch (error) {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
  }
};

module.exports.deleteDiscounts = async (req, res) => {
  try {
    await Discounts.deleteOne({ _id: req.params.id });

    const discounts = await Discounts.find();
    const hallsArr = await Halls.find({});
    const hallsObj = arrToObj(hallsArr, 'id');
    const discountsNew = converterDiscountFromBase(discounts, hallsObj);

    res.json(discountsNew);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
