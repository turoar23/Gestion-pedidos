import { useState } from 'react';
import { Form } from 'react-bootstrap';

import useHttp from '../../hooks/use-http';
import { toggleRiderStatus } from '../../lib/api';

const Rider = props => {
	const rider = props.rider;

	const [statusRider, setStatus] = useState(rider.status);
	const { sendRequest, error } = useHttp(toggleRiderStatus);

	const handlerToggleRiderStatus = async () => {
		await sendRequest({ riderId: rider._id });
		if (!error) setStatus(!statusRider);
	};

	return (
			<tr>
				<td>{rider.name}</td>
				<td>{rider.vehicle}</td>
				<td>{statusRider ? 'Activo' : 'Inactivo'}</td>
				<td>
					{/* <i className='far fa-edit' onClick={handleOpen}></i> */}
					{/* <i className='far fa-trash-alt'></i> */}
					<Form.Switch
						type='switch'
						defaultChecked={statusRider}
						onClick={handlerToggleRiderStatus}
					/>
				</td>
			</tr>
	);
};

export default Rider;
