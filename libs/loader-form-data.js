const formidable = require('formidable');
const path = require('path');
const fs = require('fs');
const { asyncReaddir } = require('../libs/fs.functions');

module.exports = (req, fileParams, dir, replacePhotos) => {
  // req,
  // fileParams(Array) - имена параметров в массиве от куда беруться изображения
  // dir(Array) - дирректория в массиве, с именем каждой папке в отдельном элементе
  // replacePhotos(boolean) - если true то будут создаваться случайные имена
  //                          в случае если такие имена существуют, в противном случае изображения с похожими именами просто перезаписываются
  const form = formidable({ multiples: true });

  return new Promise(async (resolve, reject) => {
    let upload = './';
    dir.forEach((itemDir) => {
      upload = path.join(upload, itemDir);
      if (!fs.existsSync(upload)) {
        fs.mkdirSync(upload);
      }
    });

    const listFiles = await asyncReaddir(upload);

    form.uploadDir = path.join(process.cwd(), upload);

    form.parse(req, async (_, fields, files) => {
      try {
        if (Object.keys(files).length) {
          const keys = Object.keys(files);

          const arrayFiles = Object.values(files).map((_, key) => {
            const keyFiles = keys[key];
            const filesArray =
              files[keyFiles].constructor !== Array ? [files[keyFiles]] : files[keyFiles];

            if (fileParams.includes(keyFiles)) {
              if (filesArray[0].size === 0 && filesArray.length === 1) {
                fs.unlinkSync(filesArray[0].path);
                return {};
              } else
                return [
                  keyFiles,
                  filesArray.map((file) => {
                    const { size, name, type } = file;

                    let fileName = '',
                      filePath = '';

                    if (listFiles.includes(name) && replacePhotos) {
                      fileName = `${path.basename(file.path)}${path.extname(name)}`;
                      filePath = path.join(upload, fileName);
                    } else {
                      fileName = name;
                      filePath = path.join(upload, name);
                    }

                    fs.renameSync(file.path, filePath);

                    return { size, name: fileName, originalName: file.name, type, path: filePath };
                  })
                ];
            } else {
              return filesArray.map((file) => {
                fs.unlinkSync(file.path);

                return;
              });
            }
          });
          const objFiles = Object.fromEntries(arrayFiles);

          resolve({ fields, files: objFiles, dir: upload });
        } else {
          resolve({ fields, files: {}, dir: upload });
        }
      } catch (error) {
        return reject(error);
      }
    });
  });
};
