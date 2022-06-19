import { Switch, Route } from 'react-router-dom';

import PanelRiders from '../admin/riders/PanelRiders';
import Home from '../admin/Home';
import MainContainer from '../layout/admin/MainContainer';
import PanelReportingOrders from '../admin/reporting/PanelReportingOrders';
import PanelReportingResumenOrders from '../admin/reporting/PanelReportingResumenOrders';
import PanelReviews from '../admin/reviews/PanelReviews';
// import Dashboard from '../admin/mui/Dashboard';

const AdminPage = () => {
	return (
		<Switch>
			<MainContainer>
				<Route
					path='/admin/riders'
					component={PanelRiders}
					exact
				></Route>
				<Route
					path='/admin/reporting'
					exact
					component={PanelReportingOrders}
				></Route>
				<Route
					path='/admin/reporting/resumen'
					component={PanelReportingResumenOrders}
				></Route>
				<Route path='/admin/reviews' component={PanelReviews}></Route>
				<Route path='/admin' exact component={Home} />
			</MainContainer>
		</Switch>
	);
	// return <Dashboard />;
};

export default AdminPage;
