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

export async function removeUser(userId) {
  let url = `${SERVER_URL}/users/${userId}`;

  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Could not delete the user.');
  }

  return data;
}

export async function updateUser(userData) {
  let url = `${SERVER_URL}/users/${userData._id}`;

  const response = await fetch(url, {
    method: 'PUT',
    body: JSON.stringify(userData),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Could not update the user.');
  }

  return data;
}
