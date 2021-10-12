import {
  Alert,
  Backdrop,
  Button,
  CircularProgress,
  InputAdornment,
  MenuItem,
  Snackbar,
  TextField
} from '@mui/material';
import {
  createTheme,
  ThemeProvider
} from '@mui/material/styles';
import {
  useContext,
  useEffect,
  useState
} from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import UserProfile from '../../components/UserProfile';
import AuthContext from '../../contexts/AuthContext';
import styles from './styles.module.scss';

function EnrollBill() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const {
    token, setToken,
    tokenLS
  } = useContext(AuthContext);

  const history = useHistory();

  const [clientId, setClientId] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('');
  const [value, setValue] = useState('');
  const [dueDate, setDueDate] = useState('');

  const [listClients, setListClients] = useState([]);

  const [requestError, setRequestError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setToken(tokenLS);

    if (!token) {
      history.push('/');
      return;
    };

    async function retrieveClients() {
      setRequestError('');
      setLoading(true);

      const response = await fetch('https://academy-bills.herokuapp.com/clients/options', {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const requestData = await response.json();
      
      if (response.ok) {
        setListClients(requestData);
        setLoading(false);
        return;
      };

      setRequestError(requestData);
      setLoading(false);
    }

    retrieveClients();
  }, [token, setToken, tokenLS, history]);


  async function onSubmit() {
    const body = {
      clientId: clientId,
      description: description,
      status: status,
      value: Number(value.replace(',', '')),
      dueDate: dueDate
    };

    setRequestError('');
    setLoading(true);

    const response = await fetch('https://academy-bills.herokuapp.com/billings', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });

    const requestData = await response.json();

    console.log(requestData);

    if (response.ok) {
      setRequestError(requestData);
      setLoading(true);
      setTimeout(() => {
        history.push('/cobrancas');
      }, 2000);

      return;
    };

    setRequestError(requestData);
    setLoading(false);
  };

  function handleAlertClose() {
    setRequestError('');
  };

  function cancelButton() {
    history.push('/cobrancas');
  };

  const statusOption = [
    {
      id: 'status_1',
      name: 'Pago'
    },
    {
      id: 'status_2',
      name: 'Pendente'
    }
  ];

  const theme = createTheme({
    palette: {
      secondary: {
        main: '#DA0175'
      }
    }
  });

  const menuItemStyle = {
    display: 'flex',
    fontSize: '0.75rem',
    justifyContent: 'space-between'
  }

  return (
    <div className={styles.content__wrapper}>
      <Navbar />
      <div className={styles.main__content}>
        <UserProfile />
        <div className={styles.content}>
          <ThemeProvider theme={theme}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className={styles.input__wrapper}>
                <label>
                  <h4>Cliente</h4>
                  <TextField
                    select
                    {...register('clientId', { required: true })}
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    color='secondary'
                    fullWidth
                    variant='outlined'
                    error={errors.clientId}
                  >
                    {listClients.map((option) => (
                      <MenuItem key={option.id} value={option.id} className={styles.input__option} sx={menuItemStyle}>
                        <div>{option.name}</div>
                        <div className={styles.option__id}>{`#${option.id}`}</div>
                      </MenuItem>
                    ))}
                  </TextField>
                </label>
              </div>

              <div className={styles.input__wrapper}>
                <label>
                  <h4>Descrição</h4>
                  <TextField
                    {...register('description', { required: true })}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    color='secondary'
                    fullWidth
                    multiline
                    maxRows={2}
                    variant='outlined'
                    error={errors.description}
                  />
                  <h6>A descrição informada será impressa no boleto</h6>
                </label>
              </div>

              <div className={styles.input__wrapper}>
                <label>
                  <h4>Status</h4>
                  <TextField
                    select
                    placeHolder='Selecione um valor'
                    {...register('status', { required: true })}
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    color='secondary'
                    fullWidth
                    variant='outlined'
                    error={errors.status}
                  >
                    {statusOption.map((option) => (
                      <MenuItem key={option.id} value={option.name} sx={menuItemStyle}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </label>
              </div>

              <div className={styles.input__wrapper}>
                <label className={styles.divided__label}>
                  <h4>Valor</h4>
                  <TextField
                    {...register('value', { required: true })}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                    }}
                    color='secondary'
                    id='clientPhone'
                    placeholder='0,00'
                    variant='outlined'
                    error={errors.value}
                  />
                </label>
                
                <label className={styles.divided__label}>
                  <h4>Vencimento</h4>
                  <TextField
                    type='date'
                    {...register('dueDate', { required: true })}
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    color='secondary'
                    variant='outlined'
                    error={errors.dueDate}
                  />
                </label>
              </div>

              <Snackbar
                className={styles.snackbar}
                open={!!requestError}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                autoHideDuration={3000}
                onClose={handleAlertClose}
              >
                <Alert severity={requestError === 'Cobrança cadastrada com sucesso.' ? 'success' : 'error'}>
                  {requestError}
                </Alert>
              </Snackbar>

              <div className={styles.button__wrapper}>
                <Button
                  className={`${styles.button__states} ${styles.button__cancel}`}
                  onClick={cancelButton}
                >
                  Cancelar
                </Button>
                <Button
                  className={styles.button__states}
                  type='submit'
                  disabled={!clientId || !description || !status || !value || !dueDate}
                  variant='contained'
                >
                  Criar Cobrança
                </Button>
              </div>

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
          </ThemeProvider>
        </div>
      </div>
    </div>
  );
};

export default EnrollBill;