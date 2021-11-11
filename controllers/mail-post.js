const MailPost = require('../models/mail-post');
const sendMailer = require('../libs/sendmailer');

module.exports.getMailPost = async (req, res) => {
  try {
    const mailPost = await MailPost.findOne({});

    res.json(mailPost ? mailPost : {});
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

module.exports.changeMailPost = async (req, res) => {
  try {
    const { email, fromWhom, host, port, userAuth, passAuth } = req.body;
    const mailPost = await MailPost.findOne({});

    if (!mailPost) {
      const newMailPost = new MailPost({ email, fromWhom, host, port, userAuth, passAuth });

      await newMailPost.save();
    } else {
      await MailPost.updateOne(
        {},
        { email, fromWhom, host, port, userAuth, passAuth },
        {
          new: true
        }
      );
    }
    const formedMailPost = await MailPost.findOne({});
    res.json(formedMailPost);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

module.exports.sendMailTest = async (req, res) => {
  try {
    const resultSending = await sendMailer({
      subject: 'Тест',
      text: 'Тестовая отправка сообщения'
    });

    res.status(201).json(resultSending);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
