import { SERVER_URL } from './config';

export async function getZones() {
  const response = await fetch(`${SERVER_URL}/zones`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Could not fetch zones');
  }

  return data.result;
}
