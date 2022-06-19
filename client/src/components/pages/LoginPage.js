import { useRef } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { login } from '../lib/api';
import { setJwt } from '../lib/jwt';

const LoginPage = props => {
	const history = useHistory();
	const usernameRef = useRef();
	const passwordRef = useRef();

	const handleLogin = async event => {
		event.preventDefault();

		const username = usernameRef.current.value;
		const password = passwordRef.current.value;

		try {
			const token = await login(username, password);

			setJwt(token.token);
			history.push('/admin');
		} catch (err) {
			alert(err.message);
		}
	};

	return (
		<Form onSubmit={handleLogin}>
			<Form.Group className='mb-3' controlId='formBasicEmail'>
				<Form.Label>Username</Form.Label>
				<Form.Control type='email' placeholder='Enter email' ref={usernameRef}/>
			</Form.Group>

			<Form.Group className='mb-3' controlId='formBasicPassword'>
				<Form.Label>Password</Form.Label>
				<Form.Control type='password' placeholder='Password' ref={passwordRef}/>
			</Form.Group>
			<Button variant='primary' type='submit'>
				Submit
			</Button>
		</Form>
	);
};

export default LoginPage;
