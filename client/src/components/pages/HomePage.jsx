import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import { getUser } from '../lib/jwt';

import Card from '../UI/Card';
import Content from '../UI/Content';
import LoginPage from './login/LoginPage';
import RiderLogin from './login/RiderLoginPage';

const HomePage = () => {
  const [isRider, setIsRider] = useState(false);
  const user = getUser();

  const handleToggleIsRider = () => {
    setIsRider(!isRider);
  };

  if (user) return <Navigate to={'/'} replace />;

  return (
    <Content>
      <Card className='p-2'>
        <h1>Bienvedid@ a la web de gestión del reparto de Tepuy Burger/Umbrella</h1>
        {!isRider && (
          <>
            <LoginPage />
            <Button variant='info' onClick={handleToggleIsRider}>
              Soy Rider
            </Button>
          </>
        )}
        {isRider && (
          <>
            <RiderLogin />
            <Button variant='info' onClick={handleToggleIsRider}>
              Soy restaurante
            </Button>
          </>
        )}
      </Card>
    </Content>
  );
};

export default HomePage;
