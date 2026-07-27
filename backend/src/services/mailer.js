const nodemailer = require('nodemailer');
const config = require('../config');

let transporter = null;

/**
 * Initializes the Nodemailer transporter with Gmail SMTP config.
 */
function getTransporter() {
  if (transporter) {
    return transporter;
  }
  transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: config.gmail.user,
      pass: config.gmail.appPassword,
    },
  });
  return transporter;
}

/**
 * Sends a contact inquiry email to the company inbox.
 *
 * @param {Object} contact
 * @param {string} contact.name
 * @param {string} contact.email
 * @param {string} contact.message
 * @returns {Promise<Object>} Nodemailer send result
 */
async function sendContactMail({ name, email, message }) {
  const transport = getTransporter();

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #1a2b4a; padding: 24px; border-radius: 8px 8px 0 0;">
        <h2 style="color: #fff; margin: 0;">Nueva consulta web — NTC Del Norte</h2>
      </div>
      <div style="border: 1px solid #e5e7eb; border-top: none; padding: 24px; border-radius: 0 0 8px 8px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Nombre:</td>
            <td style="padding: 8px 0; color: #111827;">${escapeHtml(name)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Email:</td>
            <td style="padding: 8px 0; color: #111827;">
              <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-weight: 600; vertical-align: top;">Mensaje:</td>
            <td style="padding: 8px 0; color: #111827;">${escapeHtml(message)}</td>
          </tr>
        </table>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
        <p style="color: #9ca3af; font-size: 12px;">
          Recibido desde el formulario de contacto del sitio web.
        </p>
      </div>
    </div>
  `;

  const mailOptions = {
    from: `"NTC Web" <${config.gmail.user}>`,
    to: config.gmail.user, // Send to self: ntcdelnorte@gmail.com
    replyTo: email,
    subject: `Consulta web - ${name}`,
    text: `Nombre: ${name}\nEmail: ${email}\n\nMensaje:\n${message}`,
    html: htmlBody,
  };

  return transport.sendMail(mailOptions);
}

function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

module.exports = { sendContactMail };
