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
import EnrollUser from './pages/EnrollUser';
import './style.css';

export function RestrictedRoutes(props) {
  const { token } = useContext(AuthContext);

  return (
    <Route render={() => (token ? props.children : <Redirect to='/' />)} />
  )
}

function Routes() {
  const [token, setToken] = useState('');

  return (
    <AuthContext.Provider
      value={{
        token, setToken
      }}
    >
      <Router>
        <Switch>
          {/* <Route exact path='/' component={Login} /> */}
          {<Route path="/cadastro" component={EnrollUser} />}
        </Switch>
      </Router>
    </AuthContext.Provider >
  );
}

export default Routes;