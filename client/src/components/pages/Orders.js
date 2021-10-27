import { Tabs, Tab } from 'react-bootstrap';
import ListActiveOrders from '../orders/ListActiveOrders';

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
				Profile
			</Tab>
			<Tab eventKey='history' title='Histórico'>
				Contact
			</Tab>
		</Tabs>
	);
};

export default LayoutOrders;
