var _ = require('lodash');

const PlanPrice = require('../models/plan-price');

module.exports.addPlanPrice = async (req, res) => {
  try {
    const { idPlan, typePrice, name, price, count, discount } = req.body;
    const newPrice = parseInt(price) ? parseInt(price) : 0;
    const valCount = parseInt(count);
    const newCount = valCount || valCount > 0 ? valCount : 1;
    const newDiscount = parseInt(discount) ? parseInt(discount) : 0;
    const newPlanPrice = {
      idPlan,
      typePrice,
      name,
      price: newPrice,
      count: newCount,
      discount: newDiscount,
      total: newPrice * newCount - newDiscount
    };
    const priceNew = new PlanPrice(newPlanPrice);

    await priceNew.save();

    res.json(priceNew);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

module.exports.getPlanPriceById = async (req, res) => {
  try {
    const prices = await PlanPrice.find({ idPlan: req.params.id });

    res.json(prices);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

module.exports.deletePlanPriceById = async (req, res) => {
  try {
    // const prices = await PlanPrice.find({ idPlan: req.params.id });
    await PlanPrice.deleteOne({ _id: req.params.id });

    res.json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

module.exports.editPlanPrice = async (req, res) => {
  try {
    const { field, value } = req.body;
    const formatValue = parseInt(value) ? parseInt(value) : 0;
    const planPriceFind = await PlanPrice.findOne({ _id: req.params.id });
    let { price, count, discount } = planPriceFind;

    switch (field) {
      case 'price':
        price = formatValue;
        break;
      case 'count':
        count = formatValue;
        break;
      case 'discount':
        discount = formatValue;
        break;

      default:
        break;
    }

    const total = price * count - discount;
    const newPlanPrice = { price, count, discount, total };

    await PlanPrice.updateOne({ _id: req.params.id }, newPlanPrice, { new: true });

    res.json({ id: req.params.id, field, ...newPlanPrice });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
