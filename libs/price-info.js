const PlanPrice = require('../models/plan-price');
const PriceInfo = require('../models/price-info');

const getPriceInfo = async (idPlan) => {
  try {
    const planPriceFind = await PlanPrice.find({ idPlan });
    let addServices = 0;
    let summWithoutSale = 0;
    let summTotal = 0;
    let totalDiscount = 0;
    planPriceFind.forEach((item) => {
      const { typePrice, price, count, discount, total } = item;
      if (typePrice !== 'main') {
        addServices += total;
      }
      summTotal += total;
      summWithoutSale += price * count;
      totalDiscount += discount;
    });
    const percentDisount = Math.round((totalDiscount * 100) / summWithoutSale);

    return {
      addServices,
      total: summTotal,
      percentDisount,
      totalDiscount
    };
  } catch (error) {
    return { error };
  }
};

module.exports.addPriceInfo = async (idPlan) => {
  try {
    // const aaa = await PlanPrice.find({ idPlan }); idPlan
    const priceDetail = await getPriceInfo(idPlan);
    // console.log(priceDetail);
    const priceInfo = await PriceInfo.findOne({ idPlan });
    if (!priceInfo) {
      const newPriceInfo = new PriceInfo({ ...priceDetail, idPlan });
      await newPriceInfo.save();
    } else {
      await PriceInfo.updateOne({ idPlan: idPlan }, { ...priceDetail, idPlan }, { new: true });
    }

    // const aaa = await PriceInfo.findOne({ idPlan });
    // console.log(priceDetail);
    // return aaa;
  } catch (error) {
    console.log(error);
    return { error };
  }
};

module.exports.getPriceInfo = getPriceInfo;
