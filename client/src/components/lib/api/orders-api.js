import { SERVER_URL } from './config';

export const getOrderById = async orderId => {
  const response = await fetch(`${SERVER_URL}/orders/${orderId}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Could not fetch the order.');
  }

  return data.result;
};

export const getOrderTrackingById = async orderId => {
  const response = await fetch(`${SERVER_URL}/orders/tracking/${orderId}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Could not fetch the order.');
  }

  return data.result;
};

export const sendToEpa = async orderId => {
  let url = `${SERVER_URL}/orders/${orderId}/sendPartner`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Could not send the order');
  }

  return null;
};
