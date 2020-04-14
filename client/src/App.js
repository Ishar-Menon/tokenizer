import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';

import PrivateRoute from './components/routing/PrivateRoute';
import Alert from './components/layouts/Alert';
import Navbar from './components/layouts/Navbar';
import Landing from './components/layouts/Landing';
import Dashboard from './components/layouts/Dashboard';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import ProductRegister from './components/products/productResgister';
import Marketplace from './components/products/Marketplace';
import TokenSale from './components/token/TokenSale';

// Redux
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/auth';
import {
  loadUserProductsBought,
  loadUserProductsSold,
} from './actions/userProducts';

function App() {
  useEffect(() => {
    store.dispatch(loadUser());
    store.dispatch(loadUserProductsBought());
    store.dispatch(loadUserProductsSold());
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Route exact path='/' component={Landing} />
          <section className='container'>
            <Alert />
            <Switch>
              <Route exact path='/register' component={Register} />
              <Route exact path='/login' component={Login} />
              <PrivateRoute exact path='/tokenSale' component={TokenSale} />
              <PrivateRoute
                exact
                path='/product/register'
                component={ProductRegister}
              />
              <PrivateRoute exact path='/dashboard' component={Dashboard} />
              <PrivateRoute exact path='/marketplace' component={Marketplace} />
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
  );
}

export default App;
