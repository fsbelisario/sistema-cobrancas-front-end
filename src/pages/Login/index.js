import {
  Alert,
  Backdrop,
  Button,
  CircularProgress,
  Snackbar,
  TextField
} from '@mui/material';
import {
  useContext,
  useEffect,
  useState
} from 'react';
import { useForm } from 'react-hook-form';
import {
  Link,
  useHistory
} from 'react-router-dom';
import academy from '../../assets/logo-academy.svg';
import AuthContext from '../../contexts/AuthContext';
import PasswordInput from './../../components/PasswordInput';
import styles from './styles.module.scss';

function Login() {
  const { register, handleSubmit } = useForm();

  const {
    token, setToken,
    tokenLS, setTokenLS
  } = useContext(AuthContext);

  const history = useHistory();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [requestResult, setRequestResult] = useState('');

  useEffect(() => {
    if (tokenLS) {
      if (!token) {
        setToken(tokenLS);
      };
      history.push('./home');

      return;
    };
  }, [token, setToken, tokenLS, history]);

  async function onSubmit(data) {
    const body = {
      email: email,
      password: password
    };

    setRequestResult('');
    setLoading(true);

    const response = await fetch('https://academy-bills.herokuapp.com/login', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(body)
    });

    const requestData = await response.json();

    if (response.ok) {
      setToken(requestData.token);
      setTokenLS(requestData.token);
      history.push('/home');
      return;
    };

    setRequestResult(requestData);
    setLoading(false);
  };

  function handleAlertClose() {
    setRequestResult('');
  };

  return (
    <div className={styles.content__wrapper}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <img src={academy} alt='Logo Academy' />
        <label>
          <h4>E-mail</h4>
          <TextField
            placeholder='exemplo@email.com'
            type='email'
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant='standard'
          />
        </label>
        <label>
          <h4>Senha</h4>
          <PasswordInput
            register={() => register('password')}
            value={password}
            fullWidth
            onChange={(e) => setPassword(e.target.value)}
            className={styles.password__input}
            variant='standard'
          />
        </label>

        <Snackbar
          className={styles.snackbar}
          open={!!requestResult}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          autoHideDuration={3000}
          onClose={handleAlertClose}
        >
          <Alert severity='error'>
            {requestResult}
          </Alert>
        </Snackbar>

        <Button
          className={styles.button__states}
          type='submit'
          disabled={!email || !password}
          variant='contained'
        >
          Entrar
        </Button>

        <Backdrop
          sx={{
            color: 'var(--color-white)',
            zIndex: (theme) => theme.zIndex.drawer + 1
          }}
          open={loading}
        >
          <CircularProgress color='inherit' />
        </Backdrop>
      </form>

      <footer>
        Ainda não possui uma conta? <Link to='/cadastro'>Crie agora!</Link>
      </footer>
    </div>
  );
};

export default Login;