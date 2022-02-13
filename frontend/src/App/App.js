import React, { useContext } from 'react';
import Login from '../Login/Login';
import Register from '../Register/Register'
import { Redirect, Route, Switch, useRouteMatch} from 'react-router-dom'
import "./app.css"
import { LoginProvider } from '../Login/logincontext';
import { RegisterProvider } from '../Register/registercontext';
import { AuthContext } from '../AuthContext/Authcontext';
import Home from '../Pages/Home/Home';
import MainPanel from '../Pages/MainPanel/MainPanel';

const App = () => {
  let { path } = useRouteMatch();
  const AuthCon = useContext(AuthContext)
  return <>
    <div className='App_main'>
        <Switch>
          <Route path={`${path}login`} render={ () =>
            AuthCon.isAuthenticated() ? <Redirect to='/'/> :
            <LoginProvider>
              <Login/>
            </LoginProvider>
          }>
          </Route>
          <Route path={`${path}register`} render={ () =>
            AuthCon.isAuthenticated() ? <Redirect to='/'/> :
            <RegisterProvider>
              <Register/>
            </RegisterProvider>
          }>
          </Route>
          <Route path='*' render={ () => 
            AuthCon.isAuthenticated() ? <MainPanel/> :
            <Home/>
          }>
          </Route>
        </Switch>
    </div>
  </>
};

export default App;

