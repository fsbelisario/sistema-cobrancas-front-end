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
import AuthContext from './contexts/AuthContext';
import './index.scss';
import EnrollUser from './pages/EnrollUser';
import Home from './pages/Home/index';
import Login from './pages/Login';

export function RestrictedRoutes(props) {
  const { token } = useContext(AuthContext);

  return (
    <Route render={() => (token ? props.children : <Redirect to='/' />)} />
  )
}

function Routes() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  return (
    <AuthContext.Provider
      value={{
        token, setToken
      }}
    >
      <Router>
        <Switch>
          {<Route exact path='/' component={Login} />}
          {<Route path="/cadastro" component={EnrollUser} />}
          {<Route path="/home" component={Home} />}
        </Switch>
      </Router>
    </AuthContext.Provider >
  );
}

export default Routes;