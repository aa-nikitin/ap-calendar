const _ = require('lodash');
const mongoose = require('mongoose');
const config = require('config');

const hourSize = config.get('hourSize');

const PlanPrice = require('../models/plan-price');
const Plan = require('../models/plan');

const { addPriceInfo } = require('../libs/price-info');

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

    await addPriceInfo(idPlan);

    res.json(priceNew);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

module.exports.getPlanPriceById = async (req, res) => {
  try {
    const idPlan = req.params.id;
    const prices = await PlanPrice.find({ idPlan });

    res.json(prices);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

module.exports.deletePlanPriceById = async (req, res) => {
  try {
    // const prices = await PlanPrice.find({ idPlan: req.params.id });
    const { idPlan, idService } = req.body.params;
    await PlanPrice.deleteOne({ _id: req.params.id });
    await addPriceInfo(idPlan);

    const plan = await Plan.findOne({ _id: idPlan });
    const newPlanServices = plan.services.filter((item) => {
      const stringItemId = String(item);

      return stringItemId !== idService;
    });

    await Plan.updateOne({ _id: idPlan }, { services: newPlanServices }, { new: true });
    // console.log(newPlanServices);

    res.json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

module.exports.editPlanPrice = async (req, res) => {
  try {
    const { field, value, idPlan } = req.body;
    const formatValue = parseInt(value) ? parseInt(value) : 0;
    const planPriceFind = await PlanPrice.findOne({ _id: req.params.id });
    let { price, count, discount } = planPriceFind;

    switch (field) {
      case 'price':
        price = formatValue;
        break;
      case 'count':
        count = formatValue > 0 ? formatValue : 1;
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
    await addPriceInfo(idPlan);

    res.json({ id: req.params.id, field, ...newPlanPrice });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

module.exports.addServicesPlanPrice = async (req, res) => {
  try {
    const { idPlan, minutes, servicesChecked, list: listServices } = req.body;
    const count = minutes / hourSize;
    const servicesChoice = [];
    const listServicesForAdd = listServices.filter((item) => {
      const isNewPriceOfService = servicesChecked.indexOf(item._id);

      return isNewPriceOfService < 0;
    });

    const listPlanPrices = listServicesForAdd.map(async (item) => {
      try {
        servicesChoice.push(item._id);
        const countItem = item.hourly ? count : 1;
        const totalPriceItem = Math.round(parseInt(item.price) * countItem);
        const newPlanPrice = {
          idPlan,
          typePrice: '',
          name: item.name,
          price: item.price,
          count: countItem,
          discount: 0,
          total: totalPriceItem,
          idService: item._id
        };
        const priceNew = new PlanPrice(newPlanPrice);

        await priceNew.save();
        return priceNew;
      } catch (error) {
        res.status(500).json({ message: error });
      }
    });

    const resultPlanPrices = await Promise.all(listPlanPrices);

    await Plan.updateOne(
      { _id: idPlan },
      { services: [...servicesChecked, ...servicesChoice] },
      { new: true }
    );

    await addPriceInfo(idPlan);

    res.json(resultPlanPrices);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
