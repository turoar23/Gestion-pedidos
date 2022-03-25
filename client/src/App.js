import { Switch, Route, Link } from 'react-router-dom';
import React, { Suspense } from 'react';

// import Orders from './components/pages/Orders';
// import Rider from './components/pages/Rider';
// import RiderLogin from './components/pages/RiderLogin';

const OrdersPage = React.lazy(() => import('./components/pages/OrdersPage'));
const RiderPage = React.lazy(() => import('./components/pages/RiderPage'));
const RiderLoginPage = React.lazy(() => import('./components/pages/RiderLoginPage'));

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
					<OrdersPage />
				</Route>
				<Route path='/rider' exact>
					<RiderLoginPage />
				</Route>
				<Route path='/rider/:riderId'>
					<RiderPage />
				</Route>
			</Switch>
		</Suspense>
	);
}

export default App;
