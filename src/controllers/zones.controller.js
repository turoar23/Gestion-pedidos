const Order = require('../models/order');
const ZoneModel = require('../models/zone.model');
const { addRestaurant, createZone, removeRestaurant } = require('../services/zones.service');

exports.getZones = async (req, res, next) => {
  try {
    const zones = await ZoneModel.find();

    res.send({ result: zones, err: null });
  } catch (err) {
    res.status(500);
    res.send({ result: null, err: "Can't get the zones" });
  }
};

exports.getRestaurantsZone = async (req, res, next) => {
  try {
    const { zoneId } = req.params;
    if (!zoneId) throw new Error();

    const zones = await ZoneModel.findById(zoneId).populate('restaurants');

    res.send({ result: zones, err: null });
  } catch (err) {
    res.status(500);
    res.send({ result: null, err: "Can't get the zones" });
  }
};

exports.addZone = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name) throw new Error('Should send a name of the zone');

    await createZone(name);

    res.sendStatus(201);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.addRestaurantZone = async (req, res, next) => {
  try {
    const { zoneId, restaurantId } = req.body;
    if (!zoneId || !restaurantId) throw new Error();

    await addRestaurant(zoneId, restaurantId);

    res.sendStatus(200);
  } catch (err) {
    res.status(500);
    res.send({ result: null, err: err.message });
  }
};

exports.removeRestaurantZone = async (req, res, next) => {
  try {
    const { zoneId, restaurantId } = req.body;
    if (!zoneId || !restaurantId) throw new Error();

    await removeRestaurant(zoneId, restaurantId);

    res.sendStatus(200);
  } catch (err) {
    res.status(500);
    res.send({ result: null, err: err.message });
  }
};
