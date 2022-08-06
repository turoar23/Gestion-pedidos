import { useState } from 'react';

import Button from '../UI/Button';
import ModalOrder from '../restaurants/orders/ModalItems';

import classes from './Footer.module.css';

const Footer = props => {
  const order = props.order;
  // const direction = `${order.address.street}, ${order.address.zipcode}, ${order.address.city}`;
  const direction = order.restaurant?.name || '--';

  const [show, setShow] = useState(false);

  const handleCloseModal = () => {
    setShow(false);
  };

  const handleOpenModal = () => {
    setShow(true);
  };

  return (
    <div className={classes.footer}>
      <div className={classes.details}>Detalles</div>
      <div className={classes.container}>
        <div className={`${classes.row} ${classes.flex}`}>
          <div className={classes.col}>Restaurante</div>
          <div className={classes.col}>{direction}</div>
        </div>
        <div className={`${classes.row} ${classes.flex}`}>
          <div className={classes.col}>Repartidor</div>
          <div className={classes.col}>{order.rider || '--'}</div>
        </div>
        <div className={`${classes.row} ${classes.flex}`}>
          <div className={classes.col}>
            <Button onClick={handleOpenModal}>Ver pedido</Button>
          </div>
          <div className={classes.col}>
            <Button as='a' href={`tel:${order.restaurant?.phone || 0}`}>
              Llamar&nbsp;
              <i className='fas fa-phone'></i>
            </Button>
          </div>
        </div>
      </div>
      <ModalOrder order={order} show={show} handleClose={handleCloseModal} />
    </div>
  );
};

export default Footer;
