import { Link } from 'react-router-dom';
import Card from '../UI/Card';
import Content from '../UI/Content';

const HomePage = () => {
	return (
		<div>
			<Content>
				<Card>
					<h2>
						Bienvedid@ a la web de gestión del reparto de Tepuy
						Burger/Umbrella
					</h2>
					<Link to='/rider'>Iniciar Sesión</Link>
				</Card>
			</Content>
		</div>
	);
};

export default HomePage;
