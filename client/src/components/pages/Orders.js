import { Tabs, Tab } from 'react-bootstrap';
import ListActiveOrders from '../orders/ListActiveOrders';
import ListResumenOrders from '../orders/ListResumenOrders';

const LayoutOrders = () => {
	return (
		<Tabs
			defaultActiveKey='orders'
			id='uncontrolled-tab-example'
			className='mb-3'
		>
			<Tab eventKey='orders' title='Pedidos'>
				<ListActiveOrders />
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
