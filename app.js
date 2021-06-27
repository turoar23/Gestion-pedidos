const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

// Configurations
const app = express();
const PORT = 3000;
app.set('view engine', 'ejs');
app.set('views', 'views');
app.set('public', 'public');

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
// app.use(session({ secret: 'my secret', resave: false, saveUninitialized: false }));

// Routes
const routes = require('./src/routes');

const Order = require('./src/models/order');

let order = new Order(123, { hola: { hola: '123' } });
order.save();

console.log(Order.findById(123));

// Add the routes to express
app.use(routes);

app.listen(PORT, () => {
    console.log(`Listening port ${PORT}`);
})