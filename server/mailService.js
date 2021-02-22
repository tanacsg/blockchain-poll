"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

var nodemailer = require('nodemailer');
const log = require('simple-node-logger').createSimpleLogger('blockchain-poll-mail.log');

const MAIL_SERVER_HOST = process.env.BCP_MAIL_SERVER_HOST || 'localhost';
const MAIL_SERVER_PORT = parseInt(process.env.BCP_MAIL_SERVER_PORT || '25');
const MAIL_SERVER_FROM = process.env.BCP_MAIL_SERVER_FROM || 'tg@gmail.com';


const MAIL_SERVER_USERNAME = process.env.BCP_MAIL_SERVER_USERNAME;
const MAIL_SERVER_PASSWORD = process.env.BCP_MAIL_SERVER_PASSWORD;


// see https://nodemailer.com/about/
const transporter = nodemailer.createTransport({
  host: MAIL_SERVER_HOST,
  port: MAIL_SERVER_PORT,
  //auth: {
  //  user: MAIL_SERVER_USERNAME,
  //  pass: MAIL_SERVER_PASSWORD
  //},
  tls: {
    rejectUnauthorized: false
  }
});


async function sendBallotCodeEmail(recepient, ballotCode) {

  var mailOptions = {
    from: MAIL_SERVER_FROM,
    to: recepient,
    subject: 'Your ballot code to vote',
    text: 'You can vote now with the following ballot code: ' + ballotCode
  };

  try {
    var result = await transporter.sendMail(mailOptions);
    log.info('Email sent: ' + result.response);
    return "SUCCESS"
  } catch (error) {
    log.error(error);
    return "ERROR"
  }

}


module.exports = sendBallotCodeEmail;



