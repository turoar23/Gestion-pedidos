import classes from './Header.module.css';

const Header = props => {
  const orderId = props.id || '--';

  return (
    <div className={classes.header}>
      <div className={classes['order-text']}>Pedido</div>
      <div className={classes['order-number']}>{orderId}</div>
    </div>
  );
};

export default Header;
