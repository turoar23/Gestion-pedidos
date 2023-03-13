const moment = require('moment');
const fetch = require('node-fetch');
const BaseError = require('../../errors/baseError');
const { parseTookanEpaPaymentMethod } = require('../../utils/parsers');
// import fetch from 'node-fetch';
const { parseAddress, isObjectEmpty } = require('../../utils/utils');
const TOOKAN_TOKEN = process.env.TOOKAN_TOKEN;

module.exports.createTask = async (order, restaurant) => {
  if (!isObjectEmpty(order.partner))
    throw new BaseError('This order already had been send to a partner', 401);

  const dateToDeliver = new Date(order.times.find(time => time.action === 'fulfill_at').by);

  const response = await fetch('https://api.tookanapp.com/v2/create_task', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      api_key: TOOKAN_TOKEN,
      order_id: order._id,
      // team_id: ':931585',
      auto_assignment: '1',
      // job_description: 'Delivery ' + restaurant.name,
      job_pickup_phone: restaurant.phone,
      job_pickup_name: restaurant.name,
      // job_pickup_email: '',
      job_pickup_address: parseAddress(restaurant.address),
      // job_pickup_latitude: '30.7188978',
      // job_pickup_longitude: '76.810296',
      job_pickup_datetime: moment(dateToDeliver).add(-20, 'minutes').toDate(),
      // customer_email: 'john@example.com',
      // customer_username: 'John Doe',
      // customer_phone: '+12015555555',
      customer_address: parseAddress(order.address),
      // latitude: '30.7188978',
      // longitude: '76.810298',
      job_delivery_datetime: dateToDeliver,
      // job_delivery_datetime: moment().add(20, 'minutes').toDate(), // Cambiar a 20 el tiempo de la recogida
      has_pickup: '1',
      has_delivery: '1',
      layout_type: '0',
      tracking_link: 1,
      timezone: moment().tz('Europe/Madrid').utcOffset(),
      // custom_field_template: 'Template_1',
      custom_field_template: 'ENTREGA-AZAPE',
      meta_data: [
        // { label: 'nOMBRE', data: '100' },
        { label: 'Cobrar', data: order.total_price },
        // { label: 'paymentMethod', data: 'Efectivo' },
      ],
      pickup_custom_field_template: 'RECOGIDA-AZAPE',
      pickup_meta_data: [
        // { label: 'nOMBRE', data: '100' },
        { label: 'Suplido', data: order.total_price }, // Mismo que el precio del pedido
        { label: 'Metodo de pago', data: parseTookanEpaPaymentMethod(order.payment) },
        { label: 'Detalles de la Dirección', data: order.address.floor },
      ],
      // pickup_custom_field_template: 'Template_2',
      // pickup_meta_data: [
      //   { label: 'Price', data: '100' },
      //   { label: 'Quantity', data: '100' },
      // ],
      // fleet_id: '',
      // p_ref_images: [
      //   'http://tookanapp.com/wp-content/uploads/2015/11/logo_dark.png',
      //   'http://tookanapp.com/wp-content/uploads/2015/11/logo_dark.png',
      // ],
      // ref_images: [
      //   'http://tookanapp.com/wp-content/uploads/2015/11/logo_dark.png',
      //   'http://tookanapp.com/wp-content/uploads/2015/11/logo_dark.png',
      // ],
      // notify: 1,
      // tags: '',
      // geofence: 0,
      // ride_type: 0,
    }),
  });
  const body = await response.text();

  // return body;
  console.log('Enviando pedido ...');
  // TODO: save the response

  // const body = {
  //   message: 'The task has been created.',
  //   status: 200,
  //   data: {
  //     job_id: 469202494,
  //     pickup_job_id: 469202494,
  //     delivery_job_id: 469202495,
  //     job_hash: '05961141951e6de5a27505564679c85c',
  //     pickup_job_hash: '30fb8513c3dd5f82663688db8eb9d0ce',
  //     delivery_job_hash: '05961141951e6de5a27505564679c85c',
  //     customer_address: 'Avenida periodista Rodolfo salazar 29, 03015, Alicante',
  //     job_pickup_name: 'Delivery Umbrella',
  //     job_pickup_address: 'Carrer Llinares 6, 03010, Alicante',
  //     job_token: '469202494215216769338950924381',
  //     pickup_tracking_link: 'https://jngl.ml/U8db8Zeb9',
  //     delivery_tracing_link: 'https://jngl.ml/C55D64679',
  //     order_id: '63eea4411582cf104d1e0b9d',
  //     pickupOrderId: '63eea4411582cf104d1e0b9d',
  //     deliveryOrderId: '63eea4411582cf104d1e0b9d',
  //     pickupAddressNotFound: false,
  //     deliveryAddressNotFound: false,
  //   },
  // };

  order.partner = {
    id: body.data.job_id,
    name: 'Tookan',
    original: body.data,
  };

  await order.save();

  return body.message;
};

// Ejemplo de respuesta de tarea creada
// {"message":"The task has been
// created.","status":200,"data":{"job_id":469202494,"pickup_job_id":469202494,"delivery_job_id":469202495,"job_hash":"05961141951e6de5a27505564679c85c","pickup_job_hash":"30fb8513c3dd5f82663688db8eb9d0ce","delivery_job_hash":"05961141951e6de5a27505564679c85c","customer_address":"Avenida
// periodista Rodolfo salazar 29, 03015, Alicante","job_pickup_name":"Delivery Umbrella","job_pickup_address":"Carrer
// Llinares 6, 03010,
// Alicante","job_token":"469202494215216769338950924381","pickup_tracking_link":"https://jngl.ml/U8db8Zeb9","delivery_tracing_link":"https://jngl.ml/C55D64679","order_id":"63eea4411582cf104d1e0b9d","pickupOrderId":"63eea4411582cf104d1e0b9d","deliveryOrderId":"63eea4411582cf104d1e0b9d","pickupAddressNotFound":false,"deliveryAddressNotFound":false}}

// importe del pedido, metodo de pago
