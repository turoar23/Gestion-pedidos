import socketIOClient from 'socket.io-client';

const ENDPOINT = `${process.env.REACT_APP_URL}:${process.env.REACT_APP_PORT}`;

export const connectSocket = callback => {
  const socket = socketIOClient(ENDPOINT);
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
