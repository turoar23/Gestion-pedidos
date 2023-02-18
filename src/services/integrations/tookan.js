const moment = require('moment');
const fetch = require('node-fetch');
// import fetch from 'node-fetch';
const { parseAddress } = require('../../utils/utils');
// FIXME: hide this
const TOOKAN_TOKEN = '5b606280f64b5d1e5e48756c554225401be1c6fd2fd87c37591909';

module.exports.createTask = async (order, restaurant) => {
  const response = await fetch(
    'https://private-anon-7b57a2eec1-tookanapi.apiary-mock.com/v2/create_task',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: '2b997be77e2cc22becfd4c66426ef504',
        order_id: order._id,
        team_id: '',
        auto_assignment: '1',
        // job_description: 'Delivery ' + restaurant.name,
        job_pickup_phone: restaurant.phone,
        job_pickup_name: 'Delivery ' + restaurant.name,
        // job_pickup_email: '',
        job_pickup_address: parseAddress(restaurant.address),
        // job_pickup_latitude: '30.7188978',
        // job_pickup_longitude: '76.810296',
        job_pickup_datetime: moment().add(15, 'minutes'),
        // customer_email: 'john@example.com',
        // customer_username: 'John Doe',
        // customer_phone: '+12015555555',
        customer_address: parseAddress(order.address),
        // latitude: '30.7188978',
        // longitude: '76.810298',
        job_delivery_datetime: new Date(order.times.find(time => time.action === 'fulfill_at').by),
        has_pickup: '1',
        has_delivery: '1',
        layout_type: '0',
        tracking_link: 1,
        timezone: moment().utcOffset(),
        // custom_field_template: 'Template_1',
        // meta_data: [
        //   { label: 'Price', data: '100' },
        //   { label: 'Quantity', data: '100' },
        // ],
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
    }
  );
  const body = await response.text();

  return body;
};
