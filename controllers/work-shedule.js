const WorkShedule = require('../models/work-shedule');

module.exports.changeWorkShedule = async (req, res) => {
  try {
    let minutesFrom = Number(req.body.minutesFrom);
    const minutesTo = Number(req.body.minutesTo);
    const minutesStep = Number(req.body.minutesStep);
    const hourSize = Number(req.body.hourSize);
    const arrayTimeOfDay = ['night', 'morning', 'afternoon', 'evening'];
    const list = [];

    while (minutesFrom <= minutesTo) {
      let timeOfDay = 0;
      const timeH = Math.floor(minutesFrom / hourSize)
        .toString()
        .padStart(2, '0');
      const timeM = Math.floor(minutesFrom % hourSize)
        .toString()
        .padStart(2, '0');
      const timeHN = Number(timeH);

      if (timeHN >= 4 && timeHN <= 11) timeOfDay = 1;
      else if (timeHN >= 12 && timeHN <= 16) timeOfDay = 2;
      else if (timeHN >= 17 && timeHN <= 23) timeOfDay = 3;

      list.push({
        timeH: timeH,
        timeM: timeM,
        minutes: minutesFrom,
        timeOfDay: arrayTimeOfDay[timeOfDay]
      });
      minutesFrom = minutesFrom + minutesStep;
    }
    const paramsShedule = {
      list,
      minutesStep,
      hourSize,
      minutesFrom: req.body.minutesFrom,
      minutesTo
    };
    const findShedule = await WorkShedule.findOne({});

    if (!findShedule) {
      const newShedule = new WorkShedule(paramsShedule);

      await newShedule.save();
    } else {
      await WorkShedule.updateOne({ _id: findShedule.id }, paramsShedule, {
        new: true
      });
    }
    const formedShedule = await WorkShedule.findOne({});

    res.status(201).json(formedShedule);
  } catch (error) {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
  }
};

module.exports.getWorkShedule = async (req, res) => {
  try {
    const workShedule = await WorkShedule.findOne({});

    res.json(workShedule);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
