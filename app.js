const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const webSocket = require('./src/utils/socket');

// Configurations
dotenv.config();
const app = express();
const PORT = process.env.PORT;
process.env.TZ = 'Etc/Universal';

app.set('public', 'public');

// Middleware
require('./src/middlewares/passport-strategy');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, './client/build')));

// Disable crossorigin
//TODO: Ver como se puede mejorar esto, quizas con el paquete cors
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Routes
const routes = require('./src/routes');

// Add the routes to express
app.use('/api/v1', routes);

if (process.env.NODE_ENV === 'production') {
  // Any route than dosent exist in the routes before, will be forwaded to the client
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, './client/build', 'index.html'));
  });
}

// For errors
const { errorHandler } = require('./src/middlewares/error.middleware');
const { decodeToken } = require('./src/middlewares/auth');
const UserModel = require('./src/models/user');
const { findRestaurantByUser } = require('./src/services/restaurant.service');
app.use(errorHandler);

mongoose
  .connect(process.env.DATABASE)
  .then(result => {
    const server = app.listen(PORT || 3000);
    const io = webSocket.init(server);

    io.on('connection', async socket => {
      const token = socket.handshake.auth.token;
      const tokenDecoded = decodeToken(token);

      const user = await UserModel.findById(tokenDecoded.user);
      if (!user) throw new Error();

      const restaurants = await findRestaurantByUser(user);
      const restaurantsIds = restaurants.map(restaurant => restaurant._id);

      restaurantsIds.forEach(id => {
        socket.join(id.toString());
      });
    });
  })
  .then(() => {
    console.log(`Listen at port: ${PORT}`);
  })
  .catch(err => {
    console.log(err);
  });
