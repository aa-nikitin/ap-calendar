const Halls = require('../models/halls');
const HallPhotos = require('../models/hall-photos');
const { asyncUnlink } = require('../libs/fs.functions');

module.exports.getHalls = async (req, res) => {
  try {
    const halls = await Halls.find({}).populate('cover').populate('photos');

    res.json(halls);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

module.exports.addHall = async (req, res) => {
  try {
    const hall = new Halls(req.body);

    await hall.save();

    const halls = await Halls.find({}).populate('cover').populate('photos');

    res.status(201).json(halls);
  } catch (error) {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
  }
};

module.exports.editHall = async (req, res) => {
  try {
    const { id } = req.params;

    await Halls.updateOne({ _id: id }, req.body, { new: true });

    const hallChanged = await Halls.find({}).populate('cover').populate('photos');

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

    const hallChanged = await Halls.findOne({ _id: idHall }).populate('cover').populate('photos');

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

    const halls = await Halls.find({}).populate('cover').populate('photos');

    res.json(halls);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
