const sendMailer = require('../libs/sendmailer');

module.exports.sendMail = async (req, res) => {
  try {
    const resultSending = await sendMailer({
      to: 'a.nikitin91@mail.ru',
      subject: 'Тема',
      text: 'Простой текст',
      html: '<b>Текст HTML</b>'
    });

    res.status(201).json(resultSending);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
