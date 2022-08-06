const PlanPrice = require('../models/plan-price');
const { timeArrToStr } = require('../libs/handler-time');

module.exports = async ({ idPlan, minutes, price, newPlanId, nameHall, discount }) => {
  const { pricesByGroup, totalSurcharge } = price;

  await PlanPrice.deleteMany({ idPlan, typePrice: 'main' });

  const countHours = minutes / 60;
  const keysPricesByGroup = Object.keys(pricesByGroup);

  const newPriceByGroupArr = keysPricesByGroup.map(async (item) => {
    const objPriceByGroup = pricesByGroup[item];
    const countPricePlan = objPriceByGroup.totalMinutes / 60;
    const priceUnit = objPriceByGroup.summ / countPricePlan;

    const strTime = timeArrToStr(objPriceByGroup);

    const newPlanPrice = {
      idPlan: newPlanId,
      typePrice: 'main',
      name: `Аренда зала: ${nameHall}`,
      descr: `${strTime}`,
      price: Math.round(priceUnit),
      count: countPricePlan,
      discount: 0,
      total: Math.round(priceUnit * countPricePlan),
      hourly: true
    };
    const createPlanPrice = new PlanPrice(newPlanPrice);

    await createPlanPrice.save();

    return createPlanPrice;
  });

  await Promise.all(newPriceByGroupArr);

  if (totalSurcharge) {
    const surchargeForHour = totalSurcharge / countHours;

    const newTotalSurcharge = {
      idPlan: newPlanId,
      typePrice: 'main',
      name: `Доплата общая`,
      descr: `в перерасчете на 1 час ~`,
      price: Math.round(surchargeForHour),
      count: countHours,
      discount: 0,
      total: Math.round(totalSurcharge),
      hourly: true
    };
    const createTotalSurcharge = new PlanPrice(newTotalSurcharge);

    await createTotalSurcharge.save();
  }

  if (totalSurcharge) {
    const discountForHour = discount / countHours;

    const newTotalSurcharge = {
      idPlan: newPlanId,
      typePrice: 'main',
      name: `Скидка общая`,
      descr: ``,
      price: 0,
      count: 1,
      discount: Math.round(discountForHour * countHours),
      total: Math.round(0 - discountForHour * countHours),
      hourly: true
    };
    const createTotalSurcharge = new PlanPrice(newTotalSurcharge);

    await createTotalSurcharge.save();
  }
};
