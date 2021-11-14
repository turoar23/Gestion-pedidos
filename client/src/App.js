import { Switch, Route, Link } from 'react-router-dom';
import React, { Suspense } from 'react';

// import Orders from './components/pages/Orders';
// import Rider from './components/pages/Rider';
// import RiderLogin from './components/pages/RiderLogin';

const Orders = React.lazy(() => import('./components/pages/Orders'));
const Rider = React.lazy(() => import('./components/pages/Rider'));
const RiderLogin = React.lazy(() => import('./components/pages/RiderLogin'));

function App() {
	return (
		<Suspense fallback={
			<p>Loading ...</p>
		}>
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
				<Route path='/rider/:riderId'>
					<Rider />
				</Route>
			</Switch>
		</Suspense>
	);
}

export default App;
