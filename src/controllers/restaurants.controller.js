const { ObjectId } = require('mongodb');
const restaurantModel = require('../models/restaurant.model');
const UserModel = require('../models/user');
const BaseError = require('../errors/baseError');

/**
 * Receive a new order from GloriaFood
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
exports.getRestaurants = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id);
    if (!user) throw new Error();

    /**
     * @type {import('../types/restaurant').IRestaurant []}
     */
    const restaurants = [];

    // FIXME: only works for admins
    if (user.role === 'Admin')
      restaurants.push(...(await restaurantModel.find({ owner: new ObjectId(user._id), removed: false })));

    res.send({ result: restaurants, err: null });
  } catch (err) {
    console.error(err);
    res.status(500);
    res.send({ result: null, err: "Can't get the restaurants" });
  }
};

exports.getRestaurant = async (req, res, next) => {
  try {
    const restaurantId = req.params.id;
    const user = await UserModel.findById(req.user._id);
    if (!user) throw new Error();

    const restaurant = await restaurantModel.findOne({
      _id: restaurantId,
      $or: [{ owner: user._id }, { restaurants: user.restaurants }],
      removed: false,
    });

    res.send({ result: restaurant, err: null });
  } catch (err) {
    console.error(err);
    res.status(404);
    res.send({ result: null, err: "Can't get the restaurant" });
  }
};

exports.createRestaurant = async (req, res, next) => {
  try {
    const restaurantInfo = req.body;

    const restaurantToInsert = new restaurantModel({
      name: restaurantInfo.name,
      internalName: restaurantInfo.internalName,
      phone: restaurantInfo.phone,
      address: {
        street: restaurantInfo.address.street,
        city: restaurantInfo.address.city,
        zipcode: restaurantInfo.address.zipcode,
        country: restaurantInfo.address.country,
      },
      emails: {
        global: restaurantInfo.emails.global || undefined,
        noreply: restaurantInfo.emails.noreply || undefined,
      },
      colors: { mainColor: restaurantInfo.colors.mainColor },
      integrations: restaurantInfo.integrations,
    });
    restaurantToInsert.owner = req.user._id;

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
    if (!restaurant) throw new BaseError('Cant find this restaurant', 404);

    const restaurantInfo = req.body;

    restaurant.name = restaurantInfo.name;
    restaurant.internalName = restaurantInfo.internalName;
    restaurant.phone = restaurantInfo.phone;
    restaurant.address = {
      street: restaurantInfo.address.street,
      city: restaurantInfo.address.city,
      zipcode: restaurantInfo.address.zipcode,
      country: restaurantInfo.address.country,
    };
    restaurant.emails = {
      global: restaurantInfo.emails.global || undefined,
      noreply: restaurantInfo.emails.noreply || undefined,
    };
    restaurant.colors = { mainColor: restaurantInfo.colors.mainColor };
    restaurant.integrations = restaurantInfo.integrations;

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
    // await restaurantModel.deleteOne({ _id: req.params.id });
    await restaurantModel.updateOne({ _id: req.params.id }, { removed: true });

    res.send({ result: null, err: null });
  } catch (err) {
    console.log(err);
    res.status(500);
    res.send({ result: null, err: "Can't create the restaurant" });
  }
};
