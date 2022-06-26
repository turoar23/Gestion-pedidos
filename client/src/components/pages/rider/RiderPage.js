import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import RiderContent from '../../riders/RiderContent';

const Rider = () => {
	const params = useParams();
	const riderInfo = JSON.parse(localStorage.getItem('rider'));
	const riderId = params.riderId;
	const navigate = useNavigate();

	useEffect(() => {
		document.title = 'Rider';
	}, []);

	if (riderInfo && riderInfo._id === riderId) {
		console.log('Login succesfully');
	} else {
		// Tiene que iniciar sesion
		navigate('/rider');
	}
	return <RiderContent riderId={riderId} riderName={riderInfo.name} />;
};

export default Rider;
