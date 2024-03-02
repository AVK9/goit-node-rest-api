const nodemailer = require('nodemailer');
require('dotenv').config();
const { A_PASS } = process.env;

const nodemailerConfig = {
  host: 'mail.adm.tools',
  port: 465,
  //   secure: true,
  auth: {
    user: 'mail@alexk.site',
    pass: A_PASS,
  },
};

const sendEmail = async data => {
  const transport = nodemailer.createTransport(nodemailerConfig);
  const emailBady = { ...data, from: 'GoIt NodeRestApi <mail@alexk.site>' };

  transport
    .sendMail(emailBady)
    .then(() => console.log('Email send success'))
    .catch(error => console.log(error.message));
};

module.exports = sendEmail;
