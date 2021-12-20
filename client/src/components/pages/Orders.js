import { useEffect } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import ActiveOrdersPanel from '../orders/active/ActiveOrdersPanel';
import ListResumenOrders from '../orders/resumen/ListResumenOrders';

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
			<Tab eventKey='history' title='Histórico'>
				En desarrollo
			</Tab>
		</Tabs>
	);
};

export default LayoutOrders;
