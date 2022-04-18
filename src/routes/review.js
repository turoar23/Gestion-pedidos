const express = require('express')
const Router = express.Router();

const reviewController = require('../controllers/reviewController');

Router.get('/getReviews', reviewController.getReviews);

module.exports = Router;