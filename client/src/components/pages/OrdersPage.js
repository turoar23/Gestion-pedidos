import { useEffect } from 'react';
import { Tabs, Tab } from 'react-bootstrap';

import ActiveOrdersPanel from '../orders/active/ActiveOrdersPanel';
import PanelCierre from '../orders/cierre/PanelCierre';
import ListResumenOrders from '../orders/resumen/ListResumenOrders';
import PanelRiders from '../orders/riders/PanelRiders';

import classes from './OrdersPage.module.css';

const LayoutOrders = () => {
	useEffect(() => {
		document.title = 'Pedidos';
	});
	return (
		<Tabs
			defaultActiveKey='orders'
			id='uncontrolled-tab-example'
			className='mb-3'
		>
			<Tab eventKey='orders' title='Pedidos'>
				<ActiveOrdersPanel />
			</Tab>
			<Tab eventKey='resumen' title='Resumen'>
				<ListResumenOrders />
			</Tab>
			<Tab eventKey='cierre' title='Cierre'>
				<PanelCierre />
			</Tab>
			<Tab eventKey='riders' title='Riders'>
				<PanelRiders />
			</Tab>
		</Tabs>
	);
};

export default LayoutOrders;
