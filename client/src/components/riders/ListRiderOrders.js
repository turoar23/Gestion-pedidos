import { useContext } from 'react';
import RiderContext from '../../store/rider-context';
import OrderAssigned from './OrderAssigned';

const ListRiderOrders = props => {
	const ctx = useContext(RiderContext);

	if (ctx.orders.length > 0) {
		return ctx.orders.map(order => (
			<OrderAssigned order={order} key={order._id} />
		));
	}
    return <p>No hay pedidos asignados</p>
};

export default ListRiderOrders;
