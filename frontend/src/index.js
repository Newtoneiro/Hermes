import ReactDOM from 'react-dom'
import { StrictMode } from 'react'
import App from './App/App'
import "./index.css"
import { BrowserRouter as Router } from 'react-router-dom';

ReactDOM.render( 
<StrictMode>
    <Router>
        <App/>
    </Router>
</StrictMode>, document.getElementById('root'));
