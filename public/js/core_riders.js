const GLOBAL_HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};
// var local_orders = [];

const url_base = window.location.origin;

async function getActiveOrders(id) {
  const url = url_base + '/getActiveRiderOrders/' + id;

  request = {
    method: 'GET',
    headers: GLOBAL_HEADERS,
  };

  try {
    let peticion = await fetch(url, request);
    let r = await peticion.json();
    //alert(mensajes);

    if (r.result) {
      return r.result;
    }
  } catch (error) {
    console.log(error);
  }
}

async function getOrdersWithoutRiders() {
  const url = url_base + `/getOrderFilter/`;

  request = {
    method: 'POST',
    headers: GLOBAL_HEADERS,
    body: JSON.stringify({
      status: 'Active',
      rider: null,
    }),
  };

  try {
    let peticion = await fetch(url, request);
    let r = await peticion.json();
    //alert(mensajes);

    if (r.result) {
      return r.result;
    }
  } catch (error) {
    console.log(error);
  }
}

async function updateOrderStatus(_id, status, action) {
  const url = url_base + '/updateStatusOrder/';

  let payload = {
    _id: _id,
    status: status,
    action: action,
  };
  request = {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: GLOBAL_HEADERS,
  };

  return fetch(url, request);
}

async function updateOrder(order) {
  const url = url_base + '/modifyOrder/';

  let payload = {
    ...order,
  };
  request = {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: GLOBAL_HEADERS,
  };

  return fetch(url, request);
}

async function removeRiderFromOrder(orderId) {
  const url = url_base + '/removeRiderOrder/';

  let payload = {
    orderId: orderId,
  };
  request = {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: GLOBAL_HEADERS,
  };

  return fetch(url, request);
}

async function assignRiderToOrder(orderId, riderId) {
  const url = url_base + '/assignRiderOrder/';

  let payload = {
    riderId: riderId,
    orderId: orderId,
  };
  request = {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: GLOBAL_HEADERS,
  };

  return fetch(url, request);
}
