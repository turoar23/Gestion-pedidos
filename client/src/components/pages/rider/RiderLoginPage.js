import { useRef, useEffect } from 'react';
import { Fragment } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useHistory } from 'react-router';

import useHttp from '../../hooks/use-http';
import { getRiderByCode } from '../../lib/api';

const RiderLogin = props => {
	const history = useHistory();
	const codeRef = useRef();
	const { sendRequest, status, data } = useHttp(getRiderByCode, true);
	let error = null;

	const submitHandler = async event => {
		event.preventDefault();
		const code = codeRef.current.value.trim();
		await sendRequest({ code: code });
	};
	useEffect(() => {
		document.title = 'Rider';
	}, []);

	if (status === 'completed') {
		if (data.result) {
			error = null;
			history.push(`/rider/${data.result._id}`);
			localStorage.setItem('rider', JSON.stringify(data.result));
		} else {
			error = (
				<div>Pin incorrecto</div>
			)
		}
	}

	return (
		<Fragment>
			<h2>Introduce tu código</h2>
			{error}
			<Form onSubmit={submitHandler}>
				<Form.Group className='mb-3' controlId='formGridAddress1'>
					<Form.Label>Código</Form.Label>
					<Form.Control ref={codeRef} required />
				</Form.Group>
				<Button type='submit'>Log-in</Button>
			</Form>
		</Fragment>
	);
};

export default RiderLogin;
