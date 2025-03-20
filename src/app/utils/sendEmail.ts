import nodemailer from 'nodemailer';
import config from '../config';

export const sendEmail = async (to: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com.',
    port: 587,
    secure: config.NODE_ENV === 'production',
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: 'c223434@ugrad.iiuc.ac.bd',
      pass: 'fjwd upem lbwz dalh',
    },
  });

  await transporter.sendMail({
    from: 'c223434@ugrad.iiuc.ac.bd', // sender address
    to, // list of receivers
    subject: 'Reset your password within ten mins!', // Subject line
    text: 'please reset your password', // plain text body
    html, // html body
  });
};
