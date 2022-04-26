import ReactDOM from 'react-dom'
import { StrictMode } from 'react'
import App from './App/App'
import "./index.css"
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './AuthContext/Authcontext';
import { FetchProvider } from './Fetch/AuthFetchContext';

window.onload = () => {
    ReactDOM.render( 
    <StrictMode>
            <AuthProvider>
            <FetchProvider>
                <Router>
                    <App/>
                </Router>
            </FetchProvider>
            </AuthProvider>
    </StrictMode>, document.getElementById('root'));
}
