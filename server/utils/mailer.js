let nodemailer = null;
try {
  nodemailer = require('nodemailer');
} catch (_) {
  // optional dependency; we'll fall back to a dev transport
}

const MAIL_HOST = process.env.MAIL_HOST;
const MAIL_PORT = Number(process.env.MAIL_PORT || 587);
const MAIL_USER = process.env.MAIL_USER;
const MAIL_PASS = process.env.MAIL_PASS;
const MAIL_FROM = process.env.MAIL_FROM || MAIL_USER;

let transporter;

function getTransporter() {
  if (transporter) return transporter;
  if (!MAIL_HOST || !MAIL_USER || !MAIL_PASS || !nodemailer) {
    // Fallback to a no-op transport that logs instead of sending
    transporter = {
      sendMail: async (opts) => {
        console.log('[DEV email] To:', opts.to, 'Subject:', opts.subject);
        return { messageId: 'dev-' + Date.now() };
      },
    };
    return transporter;
  }
  if (!nodemailer) {
    // If nodemailer isn't installed, use dev transport
    transporter = {
      sendMail: async (opts) => {
        console.log('[DEV email] To:', opts.to, 'Subject:', opts.subject);
        return { messageId: 'dev-' + Date.now() };
      },
    };
    return transporter;
  }
  transporter = nodemailer.createTransport({
    host: MAIL_HOST,
    port: MAIL_PORT,
    secure: MAIL_PORT === 465,
    auth: { user: MAIL_USER, pass: MAIL_PASS },
  });
  return transporter;
}

exports.sendEmail = async (to, subject, text, html) => {
  if (!to) return;
  const t = getTransporter();
  return t.sendMail({ from: MAIL_FROM, to, subject, text, html });
};
