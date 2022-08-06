import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import Page404 from './errors/404';
import useHttp from '../hooks/use-http';
import { getOrderTrackingById } from '../lib/api/orders-api';
import Order from '../tracking/Order';

const TrackingPage = () => {
  const params = useParams();
  const { sendRequest, status, data: orderData } = useHttp(getOrderTrackingById, true);

  useEffect(() => {
    sendRequest(params.id);
  }, []);

  let order = <p>Loading ...</p>;

  // TODO: Make the order error more beatiful
  if (status === 'completed') {
    if (!orderData) order = <Page404 />;
    else order = <Order order={orderData} />;
  }

  return order;
};

export default TrackingPage;
