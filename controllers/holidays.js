const Holidays = require('../models/holidays');

module.exports.addHolidays = async (req, res) => {
  try {
    const { date } = req.body;
    const holiday = new Holidays({ date });

    await holiday.save();

    const holidays = await Holidays.find({});

    res.json(holidays);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

module.exports.getHolidays = async (req, res) => {
  try {
    const holidays = await Holidays.find({});

    res.json(holidays);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

module.exports.deleteHolidays = async (req, res) => {
  try {
    const { id } = req.params;

    await Holidays.deleteOne({ _id: id });

    const holidays = await Holidays.find({});

    res.json(holidays);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
