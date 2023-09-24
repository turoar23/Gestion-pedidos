const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

exports.sendEmail = async (
  content,
  sendTo,
  subject = 'Valora tu experiencia con nosotros 🍔 Umbrella SH',
  from = '"Umbrella SH" <noresponder@umbrellash.es>'
) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp-es.securemail.pro',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from, // sender address
    to: sendTo, // list of receivers
    subject, // Subject line
    text: subject, // plain text body
    html: content,
  });
  console.log('Message sent: %s', info.response);
};

exports.sendSurvey = async (order, restaurant) => {
  const pathTemplate = path.join(process.cwd(), 'src/templates/survey.html');
  const restaurantOrder = restaurant || order.restaurant;
  const name = order.client.name.split(' ')[0];
  const orderId = order.gloriaId;
  const mainColor = restaurantOrder?.colors?.mainColor || '#0d6efd';
  // Si el entorno es de produccion, enviar al correo del cliente
  const sendTo = process.env.NODE_ENV === 'production' ? order.client.email : 'turoar2006@gmail.com';

  let content = fs.readFileSync(pathTemplate, 'utf-8');

  content = content.replace(/{name}/g, name); // Cambiamos el nombre de la plantilla por el del cliente
  content = content.replace(/{orderId}/g, orderId); // Cambiamos el id del pedido por el de GloriaFood (asi se vincula el pedido con la encuesta)
  content = content.replace(/{mainColor}/g, mainColor);

  //FIXME: This is strange
  sendTo ? this.sendEmail(content, sendTo) : console.log('No se pudo enviar el correo');
  // console.log(result);
};

exports.sendTrackerEmail = async (order, restaurant) => {
  const pathTemplate = path.join(process.cwd(), 'src/templates/tracker.html');
  const name = order.client.name.split(' ')[0];
  const orderId = order._id;
  const domain = process.env.DOMAIN || 'azape.es';
  const from = restaurant.emails?.noreply
    ? `${restaurant.name} <${restaurant.emails.noreply}>`
    : 'Azape <noresponder@azape.es>';
  const mainColor = restaurant.colors.mainColor || '#0d6efd';
  // Si el enterno es de produccion, enviar al correo del cliente
  const sendTo = process.env.NODE_ENV === 'production' ? order.client.email : 'turoar2006@gmail.com';

  let content = fs.readFileSync(pathTemplate, 'utf-8');

  content = content.replace(/{name}/g, name);
  content = content.replace(/{orderId}/g, orderId);
  content = content.replace(/{mainColor}/g, mainColor);
  content = content.replace(/{domain}/g, domain);

  sendTo ? this.sendEmail(content, sendTo, 'Sigue tu pedido', from) : console.log('No se pudó enviar el correo');
};
