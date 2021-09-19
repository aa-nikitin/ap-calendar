const config = require('config');
const uniqueImages = config.get('uniqueImages');
const _ = require('lodash');

const HallPhotos = require('../models/hall-photos');
const Halls = require('../models/halls');
const loaderFormData = require('../libs/loader-form-data');
const handlerFiles = require('../libs/handler-files');
const { asyncUnlink } = require('../libs/fs.functions');

module.exports.uploadHallPhotos = async (req, res, next) => {
  try {
    const { fields, files, dir } = await loaderFormData(
      req,
      ['images'],
      ['files', 'halls'],
      uniqueImages
    );
    const { idFiles } = await handlerFiles(
      files.images,
      dir,
      async ({ fileName, filePath, pathResize }) => {
        const hallPhoto = await new HallPhotos({
          name: fileName,
          path: filePath,
          pathResize: pathResize
        });
        await hallPhoto.save();
        return hallPhoto;
      }
    );
    const hall = await Halls.findOne({ _id: fields.idHall });

    await Halls.updateOne(
      { _id: fields.idHall },
      { photos: uniqueImages ? [...hall.photos, ...idFiles] : idFiles },
      { new: true }
    );

    const hallNew = await Halls.findOne({ _id: fields.idHall })
      .populate('cover')
      .populate('photos');

    res.json(hallNew);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

module.exports.deleteHallPhoto = async (req, res) => {
  try {
    const {
      params: { idHall, idPhoto }
    } = req.body;
    const hall = await Halls.findOne({ _id: idHall });
    const photoIds = _.remove(hall.photos, function (idObj) {
      return idObj.toString() !== idPhoto;
    });

    const coverId = hall.cover && hall.cover.toString();
    const cover = coverId === idPhoto ? null : coverId;

    await Halls.updateOne({ _id: idHall }, { photos: [...photoIds], cover }, { new: true });

    const hallPhotos = await HallPhotos.findOne({ _id: idPhoto });

    await HallPhotos.deleteOne({ _id: idPhoto });
    if (hallPhotos) {
      await asyncUnlink(hallPhotos.path);
      await asyncUnlink(hallPhotos.pathResize);
    }

    const halls = await Halls.findOne({ _id: idHall }).populate('cover').populate('photos');

    res.json(halls);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};
