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

    const percentDisount = totalDiscount ? Math.round((totalDiscount * 100) / summWithoutSale) : 0;

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

module.exports.addPriceInfo = async (idPlan, recalc) => {
  try {
    // const aaa = await PlanPrice.find({ idPlan }); idPlan
    const priceDetail = await getPriceInfo(idPlan);
    const priceInfo = await PriceInfo.findOne({ idPlan });

    // console.log(priceDetail);
    if (!priceInfo) {
      const newPriceInfo = new PriceInfo({
        ...priceDetail,
        idPlan,
        recalc: recalc ? recalc : true
      });
      await newPriceInfo.save();
    } else {
      await PriceInfo.updateOne(
        { idPlan },
        { ...priceDetail, idPlan, recalc: recalc ? recalc : priceInfo.recalc },
        { new: true }
      );
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
