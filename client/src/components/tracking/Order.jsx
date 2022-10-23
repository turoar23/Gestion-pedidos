import { useEffect } from 'react';
import { useState } from 'react';
import { connectSocketOrder } from '../lib/socket';
import Container from './Container';
import Footer from './Footer';
import Header from './Header';

const Order = props => {
  const [order, setOrder] = useState(props.order);
  if (order.restaurant?.colors?.main)
    document.documentElement.style.setProperty('--main-color', order.restaurant?.colors?.main);

  useEffect(() => {
    const socket = connectSocketOrder(order._id, updateStatusHandler);

    // CLEAN UP THE EFFECT
    return () => socket.disconnect();
  }, []);

  const updateStatusHandler = status => {
    const orderUpdated = { ...order, status };

    setOrder(orderUpdated);
  };

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '400px',
        height: '100vh',
        maxHeight: '600px',
        textAlign: 'center',
        fontSize: '1.1rem',
        position: 'relative',
        margin: 'auto',
      }}
    >
      <Header id={order.id} />
      <Container status={order.status} />
      <Footer order={order} />
    </div>
  );
};

export default Order;
