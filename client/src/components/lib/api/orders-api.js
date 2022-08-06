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