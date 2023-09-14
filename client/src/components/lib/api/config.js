import { getJwt } from '../jwt';

const SERVER_URL = `${process.env.REACT_APP_URL}:${process.env.REACT_APP_PORT}${process.env.REACT_APP_API}`;

export { SERVER_URL };

/**
 * Execute the request to use same base
 * @param {String} url
 * @param {('GET' | 'POST' | 'PUT' | 'DELETE')} method by default GET
 * @param {any}[body] info to send
 * @returns
 */
export const makeRequest = async (url, method = 'GET', body) => {
  const token = getJwt();
  if (!token) throw new Error();

  const response = await fetch(`${SERVER_URL}/${url}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error in request: ' + url);
  }

  return data.result;
};
