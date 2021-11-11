const Paykeeper = require('../models/paykeeper');

module.exports.getPaykeeper = async (req, res) => {
  try {
    const paykeeper = await Paykeeper.findOne({});

    res.json(paykeeper ? paykeeper : {});
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

module.exports.changePaykeeper = async (req, res) => {
  try {
    const { loginPK, passPK, serverPK } = req.body;
    const paykeeper = await Paykeeper.findOne({});

    if (!paykeeper) {
      const newPaykeeper = new Paykeeper({ loginPK, passPK, serverPK });

      await newPaykeeper.save();
    } else {
      await Paykeeper.updateOne(
        {},
        { loginPK, passPK, serverPK },
        {
          new: true
        }
      );
    }
    const formedPaykeeper = await Paykeeper.findOne({});
    res.json(formedPaykeeper);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
