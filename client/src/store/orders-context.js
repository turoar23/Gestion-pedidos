import React from 'react';

const OrdersContext = React.createContext({
	orders: [],
	updateOrders: () => {},
	cancelOrder: () => {}
});

export default OrdersContext;
