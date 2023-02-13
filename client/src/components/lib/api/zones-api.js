import { SERVER_URL } from './config';

export async function getZones() {
  const response = await fetch(`${SERVER_URL}/zones`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Could not fetch zones');
  }

  return data.result;
}

export async function addRestaurant(zoneId, restaurantId) {
  const result = await modifyListRestaurantZone(zoneId, restaurantId, true);

  return result;
}

export async function removeRestaurant(zoneId, restaurantId) {
  const result = await modifyListRestaurantZone(zoneId, restaurantId, false);

  return result;
}

// -----------------
// Private functions
// -----------------

const modifyListRestaurantZone = async (zoneId, restaurantId, add) => {
  let url = `${SERVER_URL}/zones/${zoneId}`;

  if (add) url += '/add';
  else url += '/remove';

  const response = await fetch(url, {
    method: 'PUT',
    body: JSON.stringify({
      restaurantId,
    }),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Could not fetch zones');
  }

  return data.result;
};
