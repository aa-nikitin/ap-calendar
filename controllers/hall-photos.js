const fs = require('fs');
const sharp = require('sharp');
const gm = require('gm');
const path = require('path');

const HallPhotos = require('../models/hall-photos');
const photos = require('../libs/handle-form-data');
const { asyncUnlink } = require('../libs/fs.functions');

module.exports.uploadHallPhotos = async (req, res, next) => {
  try {
    const formData = await photos(req, ['images'], ['files', 'halls'], false);
    let files = [];
    let defectiveFiles = [];
    formData.files.images.forEach(async (file) => {
      const { size: fileSize, name: fileName, type: fileType, path: filePath } = file;
      // if (fileSize > 200000) {
      //   defectiveFiles.push(file);
      //   await asyncUnlink(filePath);
      //   return;
      // }

      if (fileSize > 0 && fileType !== 'image/jpeg' && fileType !== 'image/png') {
        defectiveFiles.push(file);
        await asyncUnlink(filePath);
        return;
      }
      files.push(file);
      const dirResize = path.join(formData.dir, 'resize');
      if (!fs.existsSync(dirResize)) {
        fs.mkdirSync(dirResize);
      }
      const nameResize = `${fileName.replace(/(\.[^/.]+)+$/, '')}_240-240${path.extname(fileName)}`;
      const pathResize = path.join(dirResize, nameResize);

      await sharp(filePath).resize(240, 240).toFile(pathResize);
      console.log(file);

      const hallPhoto = new HallPhotos({
        name: fileName,
        path: filePath,
        pathResize: pathResize
      });
      await hallPhoto.save();
    });
    // console.log(files);

    res.json({ fields: formData.fields, files, dir: formData.dir, defectiveFiles });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
