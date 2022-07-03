import { useEffect } from 'react';
import { Tabs, Tab } from 'react-bootstrap';

import ActiveOrdersPanel from '../restaurants/orders/active/ActiveOrdersPanel';
import PanelCierre from '../restaurants/orders/cierre/PanelCierre';

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
			<Tab eventKey='cierre' title='Cierre'>
				<PanelCierre />
			</Tab>
		</Tabs>
	);
};

export default LayoutOrders;
