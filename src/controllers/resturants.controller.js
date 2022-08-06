const restaurantModel = require('../models/restaurant.model');

exports.getRestaurants = async (req, res, next) => {
  try {
    const restaurants = await restaurantModel.find();

    res.send({ result: restaurants, err: null });
  } catch (err) {
    res.status(500);
    res.send({ result: null, err: "Can't get the restaurants" });
  }
};

exports.getRestaurant = async (req, res, next) => {
  try {
    const restaurantId = req.params.id;
    const restaurant = restaurantModel.findById(restaurantId);

    res.send({ result: restaurant, err: null });
  } catch (err) {
    res.status(404);
    res.send({ result: null, err: "Can't get the restaurant" });
  }
};

exports.createRestaurant = async (req, res, next) => {
  try {
    const restaurantToInsert = new restaurantModel({
      name: req.body.name,
      phone: req.body.phone,
      address: {
        street: req.body.address.street,
        city: req.body.address.city,
        zipcode: req.body.address.zipcode,
        country: req.body.address.country,
      },
      emails: {
        global: req.body.emails.global || undefined,
        noreply: req.body.emails.noreply || undefined,
      },
      colors: { mainColor: req.body.colors.mainColor },
      integrations: req.body.integrations,
    });

    const restaurant = await restaurantToInsert.save();

    res.send({ result: restaurant, err: null });
  } catch (err) {
    console.log(err);
    res.status(500);
    res.send({ result: null, err: "Can't create the restaurant" });
  }
};
