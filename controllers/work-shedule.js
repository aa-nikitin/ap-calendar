const WorkShedule = require('../models/work-shedule');
const { creatingSchedule } = require('../libs/handler-time');

module.exports.changeWorkShedule = async (req, res) => {
  try {
    let minutesFrom = Number(req.body.minutesFrom);
    const minutesTo = Number(req.body.minutesTo);
    const minutesStep = Number(req.body.minutesStep);
    const hourSize = Number(req.body.hourSize);
    const list = creatingSchedule({ minutesFrom, minutesTo, minutesStep, hourSize });
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
