import { SERVER_URL } from './config';

export async function getRestaurants() {
  const response = await fetch(`${SERVER_URL}/restaurants`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Could not fetch restaurants');
  }

  return data.result;
}
