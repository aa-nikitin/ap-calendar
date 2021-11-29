const Services = require('../models/services');
const { formatPrice } = require('../libs/helper.functions');

module.exports.getServices = async (req, res) => {
  try {
    const services = await Services.find();

    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

module.exports.addServices = async (req, res) => {
  try {
    const { name, price, hourly } = req.body;
    const priceInt = parseInt(price);
    const newPrice = priceInt ? priceInt : 0;
    const newServices = new Services({
      name,
      price: newPrice,
      hourly,
      priceText: formatPrice(price)
    });

    await newServices.save();

    const services = await Services.find();
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

module.exports.editServices = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, hourly } = req.body;
    const priceInt = parseInt(price);
    const newPrice = priceInt ? priceInt : 0;

    await Services.updateOne(
      { _id: id },
      { name, price: newPrice, hourly, priceText: formatPrice(price) },
      { new: true }
    );
    const services = await Services.find();

    res.status(201).json(services);
  } catch (error) {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
  }
};

module.exports.deleteServices = async (req, res) => {
  try {
    await Services.deleteOne({ _id: req.params.id });

    const services = await Services.find();

    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
