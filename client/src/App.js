import { Switch, Route } from 'react-router-dom';
import React, { Suspense } from 'react';
import RequireAuth from './components/auth/RequireAuth';
import LoginPage from './components/pages/LoginPage';
import page404 from './components/pages/errors/404';

// import Orders from './components/pages/Orders';
// import Rider from './components/pages/Rider';
// import RiderLogin from './components/pages/RiderLogin';

const OrdersPage = React.lazy(() => import('./components/pages/OrdersPage'));
const RiderPage = React.lazy(() => import('./components/pages/rider/RiderPage'));
const AdminPage = React.lazy(() => import('./components/pages/AdminPage'));
const HomePage = React.lazy(() => import('./components/pages/HomePage'));
const RiderLoginPage = React.lazy(() =>
	import('./components/pages/rider/RiderLoginPage')
);

function App() {
	return (
		<Suspense fallback={<p>Loading ...</p>}>
			<Switch>
				<Route path='/' exact>
					<HomePage />
				</Route>
				<Route path='/orders'>
					<OrdersPage />
				</Route>
				{/* App of the riders */}
				<Route path='/rider' exact>
					<RiderLoginPage />
				</Route>
				<Route path='/rider/:riderId'>
					<RiderPage />
				</Route>
				<Route path='/admin/login' ><LoginPage /></Route>
				{/*  */}
				{/* Import all the routes and nav from admin */}
				<RequireAuth>
					<AdminPage />
				</RequireAuth>
				<Route path='*' component={page404} />
			</Switch>
		</Suspense>
	);
}

export default App;
