const { google } = require('googleapis');
const path = require('path');

exports.getReviews = async (req, res) => {
	// Initialize the sheet - doc ID is the long id in the sheets URL
	// const doc = new GoogleSpreadsheet(
	// 	'1PLdmfMvvHAP3iPTPMu4gUigoAFDCgOvF8kKtmNveJyQ'
	// );
	const auth = new google.auth.GoogleAuth({
		keyFile: path.join(process.cwd(), 'key.json'), //the key file
		//url to spreadsheets API
		scopes: 'https://www.googleapis.com/auth/spreadsheets',
	});
	const authClientObject = await auth.getClient();
	const googleSheetsInstance = google.sheets({
		version: 'v4',
		auth: authClientObject,
	});
	const spreadsheetId = '1PLdmfMvvHAP3iPTPMu4gUigoAFDCgOvF8kKtmNveJyQ';

	const readData = await googleSheetsInstance.spreadsheets.values.get({
		auth, //auth object
		spreadsheetId, // spreadsheet id
		range: 'Respuestas de formulario 1!A:L', //range of cells to read from.
	});
	res.send(readData.data.values);
	// console.log(readData.data);
};
