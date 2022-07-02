import { SERVER_URL } from './config';

export async function getUsers() {
  const response = await fetch(`${SERVER_URL}/users/`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Could not fetch users');
  }
  return data;
}

export async function newUser(userData) {
  let url = `${SERVER_URL}/users`;

  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(userData),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Could not create the user.');
  }

  return data;
}
