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
    const restaurant = await restaurantModel.findById(restaurantId);

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

    res.status(201).send({ result: restaurant, err: null });
  } catch (err) {
    console.log(err);
    res.status(500);
    res.send({ result: null, err: "Can't create the restaurant" });
  }
};

exports.updateRestaurant = async (req, res, next) => {
  try {
    const restaurant = await restaurantModel.findById(req.params.id);

    restaurant.name = req.body.name;
    restaurant.phone = req.body.phone;
    restaurant.address = {
      street: req.body.address.street,
      city: req.body.address.city,
      zipcode: req.body.address.zipcode,
      country: req.body.address.country,
    };
    restaurant.emails = {
      global: req.body.emails.global || undefined,
      noreply: req.body.emails.noreply || undefined,
    };
    restaurant.colors = { mainColor: req.body.colors.mainColor };
    restaurant.integrations = req.body.integrations;

    const restaurantUpdated = await restaurant.save();

    res.send({ result: restaurantUpdated, err: null });
  } catch (err) {
    console.log(err);
    res.status(500);
    res.send({ result: null, err: "Can't create the restaurant" });
  }
};

exports.removeRestaurant = async (req, res, next) => {
  try {
    await restaurantModel.deleteOne({ _id: req.params.id });

    res.send({ result: null, err: null });
  } catch (err) {
    console.log(err);
    res.status(500);
    res.send({ result: null, err: "Can't create the restaurant" });
  }
};
