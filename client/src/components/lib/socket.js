import socketIOClient from 'socket.io-client';
import { getJwt } from './jwt';

const ENDPOINT = `${process.env.REACT_APP_URL}:${process.env.REACT_APP_PORT}`;

export const connectSocket = callback => {
  const token = getJwt();
  const socket = socketIOClient(ENDPOINT, { auth: { token } });

  // Only for test
  // socket.onAny((event, ...args) => {
  //   console.log(event, args);
  // });

  return socket.on('Orders', data => {
    callback();
  });
};

export const connectSocketOrder = (orderId, callback) => {
  const socket = socketIOClient(ENDPOINT);
  return socket.on(`order-${orderId}`, data => {
    callback(data.status);
  });
};
