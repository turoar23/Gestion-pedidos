import { Routes, Route } from 'react-router-dom';
import React, { Fragment, Suspense } from 'react';

import LoginPage from './components/pages/LoginPage';
import Page404 from './components/pages/errors/404';
import { getUser } from './components/lib/jwt';

import PanelRiders from './components/admin/riders/PanelRiders';
import Home from './components/admin/Home';
import PanelReportingOrders from './components/admin/reporting/PanelReportingOrders';
import PanelReportingResumenOrders from './components/admin/reporting/PanelReportingResumenOrders';
import PanelReviews from './components/admin/reviews/PanelReviews';
import UsersPage from './components/pages/UsersPage';
import RequireAuth from './components/auth/RequireAuth';

const OrdersPage = React.lazy(() => import('./components/pages/OrdersPage'));
const RiderPage = React.lazy(() => import('./components/pages/rider/RiderPage'));
const HomePage = React.lazy(() => import('./components/pages/HomePage'));
const RiderLoginPage = React.lazy(() => import('./components/pages/rider/RiderLoginPage'));

function App() {
  const user = getUser();

  return (
    <Suspense fallback={<>...</>}>
      <Routes>
        <Route
          index
          path='/'
          element={
            <React.Suspense>
              <HomePage />
            </React.Suspense>
          }
        />
        <Route
          path='/orders'
          element={
            <React.Suspense>
              <OrdersPage />
            </React.Suspense>
          }
        />
        <Route
          path='/rider'
          exact
          element={
            <React.Suspense>
              <RiderLoginPage />
            </React.Suspense>
          }
        />
        <Route
          path='/rider/:riderId'
          element={
            <React.Suspense>
              <RiderPage />
            </React.Suspense>
          }
        />
        <Route
          path='/admin/login'
          element={
            <React.Suspense>
              <LoginPage />
            </React.Suspense>
          }
        />
        <Route element={<RequireAuth isAllowed={user && user.role === 'Admin'} />}>
          <Route path='/admin/riders' element={<PanelRiders />} />
          <Route path='/admin/users' element={<UsersPage />} />
          <Route path='/admin/reporting/resumen' element={<PanelReportingResumenOrders />} />
        </Route>
        <Route element={<RequireAuth isAllowed={user} />}>
          <Route path='/admin/reporting' exact element={<PanelReportingOrders />} />
          <Route path='/admin/orders' exact element={<OrdersPage />} />
          <Route path='/admin/reviews' element={<PanelReviews />} />
          <Route path='/admin' exact element={<Home />} />
        </Route>
        <Route
          path='*'
          element={
            <React.Suspense>
              <Page404 />
            </React.Suspense>
          }
        />
      </Routes>
    </Suspense>
  );
}

export default App;
