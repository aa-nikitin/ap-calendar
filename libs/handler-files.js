const fs = require('fs');
const sharp = require('sharp');
const path = require('path');
const config = require('config');

const { asyncUnlink } = require('../libs/fs.functions');

module.exports = (files, dir, callback, resolution) => {
  // files(Array) - список файлов полученный из loadFormData,
  // dir(String) - дириктория куда грузились файлы полученa из loadFormData
  // callback(Function) - колбэк в который передается объект {name,path,pathResize} можно использовать для добавления в базу
  // resolution(Array) - разрешение для обрезания изображения например: [340, 240]

  const imgWidth = resolution ? resolution[0] : config.get('imgWidthResize');
  const imgHeight = resolution ? resolution[1] : config.get('imgHeightResize');
  return new Promise(async (resolve, reject) => {
    if (!files) return reject('Не выбрано изображений!');
    let images = [],
      defectiveFiles = [],
      idFiles = [];
    const imagesPromise = await files.map(async (file) => {
      const { size: fileSize, name: fileName, type: fileType, path: filePath } = file;
      if (fileSize > 0 && fileType !== 'image/jpeg' && fileType !== 'image/png') {
        defectiveFiles.push(file);
        await asyncUnlink(filePath);
        return;
      }
      return new Promise(async (resolve) => {
        images.push(file);
        const dirResize = path.join(dir, 'resize');
        if (!fs.existsSync(dirResize)) {
          fs.mkdirSync(dirResize);
        }
        const nameResize = `${fileName.replace(
          /(\.[^/.]+)+$/,
          ''
        )}_${imgWidth}-${imgHeight}${path.extname(fileName)}`;
        const pathResize = path.join(dirResize, nameResize);

        await sharp(filePath).resize(imgWidth, imgHeight).toFile(pathResize);

        const image = await callback({
          fileName,
          filePath,
          pathResize
        });

        idFiles.push(image.id);

        resolve(image);
      });
    });
    await Promise.all(imagesPromise);
    return resolve({ images: files, defectiveFiles, idFiles });
  });
};
