const PriceInfo = require('../models/price-info');

module.exports.getPriceInfoByIdPlan = async (req, res) => {
  try {
    const idPlan = req.params.id;
    const priceInfo = await PriceInfo.findOne({ idPlan });

    res.json(priceInfo);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
