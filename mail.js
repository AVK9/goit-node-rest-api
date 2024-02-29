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

const transport = nodemailer.createTransport(nodemailerConfig);
const email = {
  to: 'katsubo79@gmail.com',
  from: 'Alex Katsubo <mail@alexk.site>',
  subject: 'Etentip!! email',
  html: '<p>Hello!!! List from VScod</p>',
};

transport
  .sendMail(email)
  .then(() => console.log('Email send success'))
  .catch(error => console.log(error.message));
