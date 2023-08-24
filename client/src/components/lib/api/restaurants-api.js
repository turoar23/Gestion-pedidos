import { getJwt } from '../jwt';
import { SERVER_URL } from './config';

export async function getRestaurants() {
  const token = getJwt();

  if (!token) throw new Error();

  const response = await fetch(`${SERVER_URL}/restaurants`, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Could not fetch restaurants');
  }

  return data.result;
}

export async function createRestaurant(restaurant) {
  const token = getJwt();

  if (!token) throw new Error();

  const url = `${SERVER_URL}/restaurants`;

  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(restaurant),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Could not update the restaurant.');
  }

  return data.result;
}

export async function updateRestaurant(restaurant) {
  const token = getJwt();

  if (!token) throw new Error();

  let url = `${SERVER_URL}/restaurants/${restaurant._id}`;
  delete restaurant._id;

  const response = await fetch(url, {
    method: 'PUT',
    body: JSON.stringify(restaurant),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Could not update the restaurant.');
  }

  return data.result;
}

export async function removeRestaurant(restaurantId) {
  const token = getJwt();

  if (!token) throw new Error();

  const response = await fetch(`${SERVER_URL}/restaurants/${restaurantId}`, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    method: 'DELETE',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Could not fetch restaurants');
  }

  return data.result;
}
