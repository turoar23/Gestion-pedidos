import { useEffect, Fragment, useState } from 'react';
import { Button, Table } from 'react-bootstrap';

import useHttp from '../../hooks/use-http';
import { getAllRiders } from '../../lib/api';
import Rider from './Rider';
import ModalNewRider from './ModalNewRider';

const PanelCierre = () => {
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
		<Fragment>
			<Button onClick={handleOpen}>Crear nuevo rider</Button>
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
		</Fragment>
	);
};

export default PanelCierre;
