const nodemailer = require('nodemailer');
const MailPost = require('../models/mail-post');

module.exports = ({ to, subject, text, html }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const mailPost = await MailPost.findOne({});
      const { email, fromWhom, host, port, userAuth, passAuth } = mailPost;
      const emailTo = email ? email : userAuth;

      let transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465 ? true : false,
        auth: {
          user: userAuth,
          pass: passAuth
        }
      });

      const sendMail = {
        from: `${fromWhom} <${userAuth}>`,
        to: to ? to : emailTo,
        subject,
        text,
        html
      };

      const info = await transporter.sendMail(sendMail);

      return resolve(info);
    } catch (error) {
      return reject(error);
    }
  });
};
