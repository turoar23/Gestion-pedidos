const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

exports.sendSurvey = async order => {
  const pathTemplate = path.join(process.cwd(), 'src/templates/survey.html');
  const name = order.client.name.split(' ')[0];
  const idOrder = order.gloriaId;
  // Por defecto envia el correo a esta dirección
  var sendTo = 'turoar2006@gmail.com';

  // Si el enterno es de produccion, enviar al correo del cliente
  if (process.env.NODE_ENV === 'production') {
    sendTo = order.client.email;
  }

  let content = fs.readFileSync(pathTemplate, 'utf-8');
  content = content.replace('{name}', name); // Cambiamos el nombre de la plantilla por el del cliente
  content = content.replace('{idOrder}', idOrder); // Cambiamos el id del pedido por el de GloriaFood (asi se vincula el pedido con la encuesta)

  //FIXME: This is strange
  sendTo ? this.sendEmail(content, sendTo) : console.log('No se pudo enviar el correo');
  // console.log(result);
};

exports.sendEmail = async (
  content,
  sendTo,
  subject = 'Valora tu experiencia con nosotros 🍔 Umbrella SH'
) => {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();
  // create reusable transporter object using the default SMTP transport
  // let transporter = nodemailer.createTransport({
  // 	host: 'smtp.ethereal.email',
  // 	port: 587,
  // 	secure: false, // true for 465, false for other ports
  // 	auth: {
  // 		user: testAccount.user, // generated ethereal user
  // 		pass: testAccount.pass, // generated ethereal password
  // 	},
  // });
  let transporter = nodemailer.createTransport({
    host: 'smtp-es.securemail.pro',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Umbrella SH" <noresponder@umbrellash.es>', // sender address
    to: sendTo, // list of receivers
    subject, // Subject line
    text: 'Valora tu experiencia con nosotros', // plain text body
    html: content,
  });
  console.log('Message sent: %s', info.response);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
};

exports.sendTrackerEmail = async (order, mainColor = '#0d6efd') => {
  const pathTemplate = path.join(process.cwd(), 'src/templates/tracker.html');
  const name = order.client.name.split(' ')[0];
  const orderId = order._id;
  const domain = process.env.domain || 'azape.es';
  let content = fs.readFileSync(pathTemplate, 'utf-8');
  var sendTo = 'turoar2006@gmail.com';

  // Si el enterno es de produccion, enviar al correo del cliente
  if (process.env.NODE_ENV === 'production') {
    sendTo = order.client.email;
  }

  content = content.replace(/{name}/g, name);
  content = content.replace(/{orderId}/g, orderId);
  content = content.replace(/{mainColor}/g, mainColor);
  content = content.replace(/{domain}/g, domain);

  sendTo ? this.sendEmail(content, sendTo, "Sigue tu pedido :D") : console.log('No se pudo enviar el correo');
};
