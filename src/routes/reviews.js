const express = require('express')
const Router = express.Router();

const reviewController = require('../controllers/reviewsController');

Router.get('/reviews', reviewController.getReviews);

module.exports = Router;