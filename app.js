const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const webSocket = require('./src/lib/socket');

// Configurations
dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.set('view engine', 'ejs');
app.set('views', 'views');
app.set('public', 'public');

// Middleware
require('./src/middlewares/passport-strategy');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, './client/build')));

// Disable crossorigin
//TODO: Ver como se puede mejorar esto, quizas con el paquete cors
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader(
		'Access-Control-Allow-Methods',
		'OPTIONS, GET, POST, PUT, PATCH, DELETE'
	);
	res.setHeader(
		'Access-Control-Allow-Headers',
		'Content-Type, Authorization'
	);
	next();
});

// Routes
const routes = require('./src/routes');

// Add the routes to express
app.use('/api/v1', routes);

// Any route than dosent exist in the routes before, will be forwaded to the client
app.get('*', (req, res) => {
	res.sendFile(path.resolve(__dirname, './client/build', 'index.html'));
});

mongoose
	.connect(process.env.DATABASE)
	.then(result => {
		const server = app.listen(PORT);
		const io = webSocket.init(server);
		io.on('connection', socket => {
			// console.log("hola");
		});
	})
	.then(() => {
		console.log(`Listen at port: ${PORT}`);
	})
	.catch(err => {
		console.log(err);
	});
