import { useRef } from 'react';
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

        const token = await login(username, password);

        setJwt(token.token);
        history.push('/admin');
	};

	return (
		<form onSubmit={handleLogin}>
			<label>Username</label>
			<input type='text' ref={usernameRef} required />
			<label>Password</label>
			<input type='password' ref={passwordRef} required />
			<button>Login</button>
		</form>
	);
};

export default LoginPage;
