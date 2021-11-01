const Halls = require('../models/halls');
const Price = require('../models/prices');
const HallPhotos = require('../models/hall-photos');
const { asyncUnlink } = require('../libs/fs.functions');
const { purposeArr } = require('../config/priceSettings');
const { arrToObj } = require('../libs/helper.functions');

module.exports.getHalls = async (req, res) => {
  try {
    const halls = await Halls.find({}).sort('order').populate('cover').populate('photos');

    res.json(halls);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

module.exports.getHallsPurpose = async (req, res) => {
  try {
    const purposeObj = arrToObj(purposeArr);
    const prices = await Price.find({}).sort('priority');
    const newPurpose = {};

    prices.forEach((itemPurpose) => {
      if (!newPurpose[itemPurpose.purpose]) {
        newPurpose[itemPurpose.purpose] = {};
        newPurpose[itemPurpose.purpose].name = purposeObj[itemPurpose.purpose].name;
        newPurpose[itemPurpose.purpose].value = purposeObj[itemPurpose.purpose].value;
        newPurpose[itemPurpose.purpose].list = [itemPurpose.idHall];
      }
      if (!!newPurpose[itemPurpose.purpose]) {
        if (!newPurpose[itemPurpose.purpose].list.includes(itemPurpose.idHall))
          newPurpose[itemPurpose.purpose].list.push(itemPurpose.idHall);
      }
    });
    // console.log(Object.values(newPurpose));
    res.json(newPurpose);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

module.exports.addHall = async (req, res) => {
  try {
    const hall = new Halls(req.body);

    await hall.save();

    const halls = await Halls.find({}).sort('order').populate('cover').populate('photos');

    res.status(201).json(halls);
  } catch (error) {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
  }
};

module.exports.editHall = async (req, res) => {
  try {
    const { id } = req.params;

    await Halls.updateOne({ _id: id }, req.body, { new: true });

    const hallChanged = await Halls.find({}).sort('order').populate('cover').populate('photos');

    res.status(201).json(hallChanged);
  } catch (error) {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
  }
};

module.exports.editHallCover = async (req, res) => {
  try {
    const { idHall, idPhoto } = req.body;
    const cover = idPhoto;

    await Halls.updateOne({ _id: idHall }, { cover }, { new: true });

    const hallChanged = await Halls.findOne({ _id: idHall })
      .sort('order')
      .populate('cover')
      .populate('photos');

    res.status(201).json(hallChanged);
  } catch (error) {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
  }
};

module.exports.deleteHall = async (req, res) => {
  try {
    const hall = await Halls.findOne({ _id: req.params.id }).populate('cover');
    const hallPhotos = await HallPhotos.find({ _id: hall.photos });

    hallPhotos.forEach(async ({ path, pathResize }) => {
      await asyncUnlink(path);
      await asyncUnlink(pathResize);
    });
    await HallPhotos.deleteMany({
      _id: hall.photos
    });
    await Halls.deleteOne({ _id: req.params.id });

    const idHall = req.params.id;
    const prices = await Price.find({ idHall });
    const arrPrices = prices.map((itemPrice) => {
      return new Promise(async (resolve) => {
        await Price.deleteOne({ _id: itemPrice.id });

        resolve();
      });
    });
    await Promise.all(arrPrices);

    const halls = await Halls.find({}).sort('order').populate('cover').populate('photos');

    res.json(halls);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
