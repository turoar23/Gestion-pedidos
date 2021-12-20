const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

exports.parseStreet = function (_street) {
	let parts = _street.split(' ');
	var find = false;
	var i = 0;

	for (; i < parts.length && !find; i++) {
		find = !isNaN(getNumberFromString(parts[i]));
	}

	if (!find) return _street;

	var street = '';
	for (var j = 0; j < i - 1; j++) {
		street += parts[j] + ' ';
	}
	var street_number = getNumberFromString(parts[i - 1]);

	return street + street_number.toString();
};
/**
 * Devuelve el numero de la cadena si es que existe. Si no hay, devuelve NaN
 */
function getNumberFromString(_string) {
	var number = '';

	for (var i = 0; i < _string.length; i++) {
		if (!isNaN(parseInt(_string[i]))) number += parseInt(_string[i]);
	}

	if (number == '') return NaN;
	return parseInt(number);
}

exports.checkIfNewOrder = function (order) {
	return checkIfEqual(orders, order);
};
function checkIfEqual(arr1, arr2) {
	var find = false;

	for (var i = 0; i < arr1.length && !find; i++) {
		find = arr1[i]['id'] == arr2['id'];
	}
	return find;
}
exports.sendSurvey = async order => {
	const pathTemplate = path.join(process.cwd(), '/views/email/survey.html');
	const name = order.client.name.split(' ')[0];
	var sendTo = 'turoar2006@gmail.com';

	// Si es produccio, enviar al correo del cliente
	if (process.env.NODE_ENV == 'production') {
		sendTo = order.client.email;
	}

	let content = fs.readFileSync(pathTemplate, 'utf-8');
	content = content.replace('{name}', name); // Cambiamos el nombre de la plantilla por el del cliente

	sendTo
		? this.sendEmail(content, sendTo)
		: console.log('No se pudo enviar el correo');
	// console.log(result);
};

exports.sendEmail = async (content, sendTo) => {
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
			user: 'noresponder@umbrellash.es', // generated ethereal user
			pass: 'YXCWkx!1$9Vk', // generated ethereal password
		},
	});

	// send mail with defined transport object
	let info = await transporter.sendMail({
		from: '"Umbrella SH" <noresponder@umbrellash.es>', // sender address
		to: sendTo, // list of receivers
		subject: 'Valora tu experiencia con nosotros 🍔 Umbrella SH', // Subject line
		text: 'Hello world?', // plain text body
		// html: '<b>Hello world?</b>', // html body
		html: content,
	});
	console.log('Message sent: %s', info.response);
	// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

	// Preview only available when sending through an Ethereal account
	// console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
	// Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
};
