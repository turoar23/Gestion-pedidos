import { Switch, Route } from 'react-router-dom';

import PanelRiders from '../admin/riders/PanelRiders';
import Home from '../admin/Home';
import MainContainer from '../layout/admin/MainContainer';
import PanelReportingOrders from '../admin/reporting/PanelReportingOrders';
import PanelReportingResumenOrders from '../admin/reporting/PanelReportingResumenOrders';
import PanelReviews from '../admin/reviews/PanelReviews';
import LoginPage from './LoginPage';
import RequireAuth from './RequireAuth';
// import Dashboard from '../admin/mui/Dashboard';

const AdminPage = () => {
	return (
		<Switch>
			<MainContainer>
				<Route path='/admin/riders' component={PanelRiders}></Route>
				<Route
					path='/admin/reporting'
					exact={true}
					component={PanelReportingOrders}
				></Route>
				<Route
					path='/admin/reporting/resumen'
					component={PanelReportingResumenOrders}
				></Route>
				<Route path='/admin/reviews' component={PanelReviews}></Route>
				<Route path='/admin/'>
					<RequireAuth>
						<Home />
					</RequireAuth>
				</Route>
			</MainContainer>
		</Switch>
	);
	// return <Dashboard />;
};

export default AdminPage;
