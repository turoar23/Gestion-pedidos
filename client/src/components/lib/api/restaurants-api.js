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
