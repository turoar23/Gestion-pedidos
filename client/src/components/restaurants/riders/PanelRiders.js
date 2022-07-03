import { useEffect, Fragment, useState } from 'react';
import { Button, Container, Row, Table, Col } from 'react-bootstrap';

import useHttp from '../../hooks/use-http';
import { getAllRiders } from '../../lib/api';
import Rider from './Rider';
import ModalNewRider from './ModalNewRider';

const PaenelRiders = () => {
	const { sendRequest, status, data } = useHttp(getAllRiders, true);
	const [showModal, setShowModal] = useState(false);

	const handleOpen = () => setShowModal(true);
	const handleClose = () => setShowModal(false);

	useEffect(() => {
		sendRequest();
	}, [sendRequest]);

	let listRiders = undefined;
	if (status === 'completed' && data.length > 0) {
		listRiders = data.map(rider => <Rider key={rider._id} rider={rider} />);
	}

	return (
		<Container fluid="xxl">
			<Row>
				<Col>
					<Button onClick={handleOpen}>Crear nuevo rider</Button>
				</Col>
			</Row>
			<Row>
				<Col>
					<Table bordered hover>
						<thead>
							<tr>
								<th>Nombre</th>
								<th>Vehículo</th>
								<th>Estado</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>{listRiders}</tbody>
					</Table>
					<ModalNewRider
						show={showModal}
						handleClose={handleClose}
						// rider={rider}
					/>
				</Col>
			</Row>
		</Container>
	);
};

export default PaenelRiders;
