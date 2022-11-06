import { Routes, Route } from 'react-router-dom';
import React, { Suspense } from 'react';

import Page404 from './components/pages/errors/404';
import { getUser } from './components/lib/jwt';

import PanelRiders from './components/restaurants/riders/PanelRiders';
import Home from './components/restaurants/home/Home';
import PanelReportingOrders from './components/restaurants/reporting/PanelReportingOrders';
import PanelReportingResumenOrders from './components/restaurants/reporting/PanelReportingResumenOrders';
import PanelReviews from './components/restaurants/reviews/PanelReviews';
import UsersPage from './components/pages/UsersPage';
import RequireAuth from './components/lib/auth/RequireAuth';
import RequireRol from './components/lib/auth/RequireRole';
import OrdersPage from './components/pages/OrdersPage';
import RestaurantsPage from './components/pages/RestaurantsPage';
import ZonesPage from './components/pages/ZonesPage';

// const OrdersPage = React.lazy(() => import('./components/pages/OrdersPage'));
const RiderPage = React.lazy(() => import('./components/pages/RiderPage'));
const HomePage = React.lazy(() => import('./components/pages/HomePage'));
const TrackingPage = React.lazy(() => import('./components/pages/TrackingPage'));

function App() {
  const user = getUser();

  return (
    <Suspense fallback={<>...</>}>
      <Routes>
        <Route
          index
          path='/login'
          element={
            <React.Suspense>
              <HomePage />
            </React.Suspense>
          }
        />
        <Route
          path='/rider'
          exact
          element={
            <React.Suspense>
              <RiderPage />
            </React.Suspense>
          }
        />
        <Route element={<RequireAuth />}>
          <Route element={<RequireRol isAllowed={user && user.role === 'Admin'} />}>
            <Route path='/riders' element={<PanelRiders />} />
            <Route path='/users' element={<UsersPage />} />
            <Route path='/reporting/resumen' element={<PanelReportingResumenOrders />} />
            <Route path='/restaurants' element={<RestaurantsPage />} />
            <Route path='/zones' element={<ZonesPage />} />
          </Route>
          <Route path='/reporting' exact element={<PanelReportingOrders />} />
          <Route path='/orders' exact element={<OrdersPage />} />
          <Route path='/reviews' element={<PanelReviews />} />
          <Route path='/' exact element={<Home />} />
        </Route>
        <Route
          path='*'
          element={
            <React.Suspense>
              <Page404 />
            </React.Suspense>
          }
        />
        <Route path='/tracking/:id' element={<TrackingPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;
