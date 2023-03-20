const StatusRider = props => {
  const rider = props.data.rider;
  const orders = props.data.orders;

  const totalOrders = orders.length;
  const totalOrdersCompleted = orders.filter(order => order.status === 'Completed').length;

  const riderIsDelivering =
    orders.filter(order => order.status !== 'Completed' && order.status !== 'Active').length > 0;

  const riderStatus = riderIsDelivering ? 'Delivering' : 'Free';

  // Recupera el tiempo y la accion del ultimo pedido
  const getLastUpdate = order => {
    const times = order.times.filter(
      time => time.action !== 'fulfill_at' && time.action !== 'accepted_at'
    );

    if (times.length === 0) return -1;
    return Math.max.apply(
      Math,
      times.map(time => {
        return time.by;
      })
    );
  };

  return (
    <div>
      <div>{rider}</div>
      <div></div>
      <div>{riderStatus}</div>
      <div>{`(${totalOrdersCompleted}/${totalOrders})`}</div>
    </div>
  );
};

export default StatusRider;
