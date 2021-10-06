import {
  useContext,
  useState
} from 'react';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch
} from 'react-router-dom';
import { useLocalStorage } from 'react-use';
import AuthContext from './contexts/AuthContext';
import './index.scss';
import Billing from './pages/Billing/index';
import EnrollClient from './pages/EnrollClient/index';
import EnrollUser from './pages/EnrollUser';
import Home from './pages/Home/index';
import Login from './pages/Login';

export function RestrictedRoutes(props) {
  const { token } = useContext(AuthContext);

  return (
    <Route render={() => (token ? props.children : <Redirect to='/' />)} />
  );
};

function Routes() {
  const [tokenLS, setTokenLS, removeTokenLS] = useLocalStorage('token', '');
  const [token, setToken] = useState(tokenLS || '');

  return (
    <AuthContext.Provider
      value={{
        token, setToken, 
        tokenLS, setTokenLS, removeTokenLS
      }}
    >
      <Router>
        <Switch>
          {<Route exact path='/' component={Login} />}
          {<Route path='/cadastro' component={EnrollUser} />}
          {<Route path='/home' component={Home} />}
          {<Route path='/cobranças' component={Billing} />}
          {<Route path='/clientes' component={EnrollClient} />}
        </Switch>
      </Router>
    </AuthContext.Provider >
  );
};

export default Routes;