const Clients = require('../models/clients');

const clietnsConverter = (clients) =>
  clients.map(({ _id, name, nickname, company, phone, mail, comment, blacklist }) => {
    return { id: _id, name, nickname, company, phone, mail, comment, blacklist };
  });

module.exports.getClients = async (req, res) => {
  try {
    const { query } = req.body;
    let clients = [];
    if (!query) {
      clients = await Clients.find({});
      const clientsFinished = clietnsConverter(clients);

      return res.json(clientsFinished);
    }

    if (query.length >= 3) {
      let regex = new RegExp(query, 'i');
      await Clients.aggregate(
        [
          {
            $project: { fullname: { $concat: ['$name.first', ' ', '$name.last'] }, doc: '$$ROOT' }
          },
          { $match: { fullname: regex } }
        ],
        function (err, persons) {
          if (err) res.status(500).json({ message: err });

          clients = persons.map(function (item) {
            return item.doc;
          });
        }
      );
    }
    const clientsFinished = clietnsConverter(clients);
    res.json(clientsFinished);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

module.exports.getClient = async (req, res) => {
  try {
    const client = await Clients.findOne({ _id: req.params.id });

    res.json(client);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

module.exports.addClient = async (req, res) => {
  try {
    const clientObj = req.body;
    const client = new Clients(clientObj);

    await client.save();

    const clients = await Clients.find({});
    const clientsFinished = clietnsConverter(clients);

    res.status(201).json(clientsFinished);
  } catch (error) {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
  }
};

module.exports.editClient = async (req, res) => {
  try {
    const { id } = req.params;

    await Clients.updateOne({ _id: id }, req.body, { new: true });

    const clientChanged = await Clients.findOne({ _id: id });

    res.status(201).json(clientChanged);
  } catch (error) {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
  }
};

module.exports.deleteClient = async (req, res) => {
  try {
    const resultDelete = await Clients.deleteOne({ _id: req.params.id });

    res.json(resultDelete);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

module.exports.deleteClients = async (req, res) => {
  try {
    await Clients.deleteMany({
      _id: req.body.params
    });
    const clients = await Clients.find({});
    const clientsFinished = clietnsConverter(clients);

    res.json(clientsFinished);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
