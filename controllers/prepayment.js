const Prepayment = require('../models/prepayment');

module.exports.getPrepayment = async (req, res) => {
  try {
    const prepayment = await Prepayment.findOne({});

    res.json(prepayment ? prepayment : {});
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

module.exports.changePrepayment = async (req, res) => {
  try {
    const { hours, percent } = req.body;
    const prepayment = await Prepayment.findOne({});

    if (!prepayment) {
      const newPrepayment = new Prepayment({ hours, percent });

      await newPrepayment.save();
    } else {
      await Prepayment.updateOne(
        {},
        { hours, percent },
        {
          new: true
        }
      );
    }
    const formedPrepayment = await Prepayment.findOne({});
    res.json(formedPrepayment);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
