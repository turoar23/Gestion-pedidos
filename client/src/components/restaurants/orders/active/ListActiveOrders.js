import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';

import ActiveOrder from './ActiveOrder';
import useHttp from '../../../hooks/use-http';
import { connectSocket } from '../../../lib/socket';
import { getRestaurants } from '../../../lib/api/restaurants-api';
import { getAllActiveOrders } from '../../../lib/api/orders-api';

import { getAllRiders, updateOrderStatus } from '../../../lib/api';
import OrdersContext from '../../../../store/orders-context';
import NewOrderModal from '../NewOrderModal';

// @ts-ignore
import classes from './ListActiveOrders.module.css';
// import ListStatusRiders from './ListStatusRiders';

const ListActiveOrders = () => {
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);

  // To get All riders
  const { sendRequest: sendRequestRiders, status: statusRiders, data: riders } = useHttp(getAllRiders, true);
  // To get all the active orders
  const { sendRequest, status, data: loadedOrders } = useHttp(getAllActiveOrders, true);
  // To cancel an order
  const { sendRequest: sendRequestCancelOrder, status: statusCancelOrder } = useHttp(updateOrderStatus);

  const {
    sendRequest: sendRequestRestaurants,
    status: statusRestaurants,
    data: restaurants,
    error,
  } = useHttp(getRestaurants, true);

  useEffect(() => {
    Promise.all([sendRequestRiders(), sendRequest(), sendRequestRestaurants()]);
  }, [sendRequestRiders, sendRequest, sendRequestRestaurants]);

  useEffect(() => {
    const socket = connectSocket(updateHandler);

    // CLEAN UP THE EFFECT
    return () => socket.disconnect();
    //
  }, []);

  const handleCloseNewOrder = () => setShowNewOrderModal(false);
  const handleShowNewOrder = () => setShowNewOrderModal(true);

  const updateHandler = async () => {
    await sendRequest();
  };

  const cancelOrderHandler = async orderId => {
    await sendRequestCancelOrder({
      _id: orderId,
      status: 'Cancelled',
      action: 'Cancelled Manually',
    });
    await sendRequest();
  };

  if (statusRiders === 'pending') {
    return <div className="centered">Loading riders...</div>;
  }

  let listOrders = <div className="centered">Loading orders...</div>;
  if (status === 'completed' && loadedOrders) {
    listOrders = loadedOrders.map(order => <ActiveOrder key={order._id} order={order} riders={riders} />);
  }

  return (
    <OrdersContext.Provider
      value={{
        orders: loadedOrders,
        updateOrders: updateHandler,
        cancelOrder: cancelOrderHandler,
      }}
    >
      {/* <ListStatusRiders orders={loadedOrders} riders={riders} /> */}
      <Container fluid>
        <div className="actions">
          <Button onClick={handleShowNewOrder}>Nuevo pedido</Button>
        </div>
        <Row className="order">
          <Col className={classes.col}>ID</Col>
          <Col className={classes.col}>Dirección</Col>
          <Col className={classes.col}>Entrega</Col>
          <Col className={classes.col}>Duración</Col>
          <Col className={classes.col}>Restante</Col>
          <Col className={classes.col}>Restaurante</Col>
          <Col className={classes.col}>Rider</Col>
          <Col className={classes.col}>Estado</Col>
          <Col className={classes.col}>Actions</Col>
        </Row>
        {listOrders}
        <NewOrderModal show={showNewOrderModal} handleClose={handleCloseNewOrder} restaurants={restaurants} />
      </Container>
    </OrdersContext.Provider>
  );
};

export default ListActiveOrders;
