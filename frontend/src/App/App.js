import React from 'react';
import Login from '../Login/Login';
import Register from '../Register/Register'
import { Route, Switch, useRouteMatch} from 'react-router-dom'
import "./app.css"
import { LoginProvider } from '../Login/logincontext';
import { RegisterProvider } from '../Register/registercontext';
import { AuthProvider } from '../AuthContext/Authcontext';
import Home from '../Pages/Home/Home';

const App = () => {
  let { path, url } = useRouteMatch();
  return <>
    <div className='App_main'>
      <AuthProvider>
        <Switch>
          <Route path={`${path}login`}>
            <LoginProvider>
              <Login/>
            </LoginProvider>
          </Route>
          <Route path={`${path}register`}>
            <RegisterProvider>
              <Register/>
            </RegisterProvider>
          </Route>
          <Route path='*'>
            <Home/>
          </Route>
        </Switch>
      </AuthProvider>
    </div>
  </>
};

export default App;

