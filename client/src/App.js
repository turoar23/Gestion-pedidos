import { Switch, Route, Link } from 'react-router-dom';
import Orders from './components/pages/Orders';
import Rider from './components/pages/Rider';
import RiderLogin from './components/pages/RiderLogin';

function App() {
	return (
		<Switch>
			<Route path='/' exact>
				<Link to='/rider'>Login rider</Link>
			</Route>
			<Route path='/orders'>
				<Orders />
			</Route>
			<Route path='/rider' exact>
				<RiderLogin />
			</Route>
      <Route path="/rider/:riderId">
        <Rider />
      </Route>
		</Switch>
	);
}

export default App;
