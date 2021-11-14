import React from 'react';

const RiderContext = React.createContext({
	riderId: null,
	orders: [],
	updateOrders: () => {},
	addNewOrder: () => {},
	removeOrder: () => {},
});

export default RiderContext;
