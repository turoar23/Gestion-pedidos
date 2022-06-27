import { useEffect } from 'react';
import { Navigate } from 'react-router';

import RiderContent from '../riders/RiderContent';

const Rider = () => {
  const rider = JSON.parse(localStorage.getItem('rider'));

  useEffect(() => {
    document.title = 'Rider';
  }, []);

  if (!rider) {
    return  <Navigate to={'/'} replace />;
  }

  return <RiderContent riderId={rider._id} riderName={rider.name} />;
};

export default Rider;
