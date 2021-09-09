const Halls = require('../models/halls');

module.exports.getHalls = async (req, res) => {
  try {
    const halls = await Halls.find({});

    res.json(halls);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

module.exports.addHall = async (req, res) => {
  try {
    const hall = new Halls(req.body);

    await hall.save();

    const halls = await Halls.find({});

    res.status(201).json(halls);
  } catch (error) {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
  }
};

module.exports.editHall = async (req, res) => {
  try {
    const { id } = req.params;

    await Halls.updateOne({ _id: id }, req.body, { new: true });

    const hallChanged = await Halls.find({});

    res.status(201).json(hallChanged);
  } catch (error) {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
  }
};

module.exports.deleteHall = async (req, res) => {
  try {
    await Halls.deleteOne({ _id: req.params.id });
    const halls = await Halls.find({});

    res.json(halls);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
