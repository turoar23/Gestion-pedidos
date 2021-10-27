import { Row, Col } from "react-bootstrap";

const ActiveOrders = props => {
	return (
		<Row className='order'>
			<Col>{props.order.gloriaId || '--'}</Col>
			<Col>{`${props.order.address.street} ${props.order.address.zipcode}`}</Col>
			<Col></Col>
			<Col></Col>
			<Col></Col>
			<Col>{props.order.restaurant}</Col>
			<Col>{props.order.rider ? props.order.rider.name : '--'}</Col>
			<Col className={props.order.status.toLowerCase()}>{props.order.status}</Col>
			<Col></Col>
		</Row>
	);
};
export default ActiveOrders;
