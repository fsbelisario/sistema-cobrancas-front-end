import {
  Alert,
  Backdrop,
  Button,
  CircularProgress,
  Snackbar,
  TextField
} from '@mui/material';
import {
  createTheme,
  ThemeProvider
} from '@mui/material/styles';
import { 
  useState, 
  useContext, 
  useEffect 
} from 'react';
import { useForm } from 'react-hook-form';
import Navbar from '../../components/Navbar';
import UserProfile from '../../components/UserProfile';
import AuthContext from '../../contexts/AuthContext';
import { useHistory } from 'react-router-dom';
import styles from './styles.module.scss';

function EnrollClient() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { token, setToken } = useContext(AuthContext);
  const history = useHistory();

  const [requestError, setRequestError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setToken(localStorage.getItem('token'));

    if(!token) {
      history.push('/');
      return;
    }
  }, [token, setToken, history]);

  async function onSubmit(data) {
    const body = {
      name: data.name,
      email: data.email,
      tax_id: data.tax_id,
      phone: data.phone,
      zip_code: data.zip_code && data.zip_code,
      street: data.street && data.street,
      number: data.number && data.number,
      address_details: data.address_details && data.address_details,
      district: data.district && data.district,
      reference: data.reference && data.reference,
      city: data.city && data.city,
      state: data.state && data.state
    };

    setRequestError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3003/clients', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });
      
      setLoading(false);

      const requestData = await response.json();

      setRequestError(requestData);

      if (response.ok) {
        setRequestError(requestData);
        history.push('/home');
        return;
      };
    } catch(error) {
      setRequestError(error.message);
    }
  };

  function handleAlertClose() {
    setRequestError('');
  };

  function cancelButton() {
    history.push('/home');
  }

  const theme = createTheme({
    palette: {
      secondary: {
        main: '#DA0175'
      }
    }
  });

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
                  {errors.name ? <h4 className={styles.input__error}>Nome</h4> : <h4>Nome</h4>}
                  <TextField
                    className={styles.fieldset}
                    color='secondary'
                    {...register('name', { required: true })}
                    id='name'
                    variant='outlined'
                    error={!!errors.name}
                  />
                  {!!errors.name && <p>O campo Nome é obrigatório!</p>}
                </label>

                <label>
                  {errors.email ? <h4 className={styles.input__error}>E-mail</h4> : <h4>E-mail</h4>}
                  <TextField
                    className={styles.fieldset}
                    color='secondary'
                    {...register('email', { required: true })}
                    id='email'
                    variant='outlined'
                    error={!!errors.email}
                  />
                  {!!errors.email && <p>O campo E-mail é obrigatório!</p>}
                </label>
              </div>

              <div className={styles.input__wrapper}>
                <label>
                  {errors.tax_id ? <h4 className={styles.input__error}>CPF</h4> : <h4>CPF</h4>}
                  <TextField
                    className={styles.fieldset}
                    color='secondary'
                    {...register('tax_id', { required: true })}
                    id='tax_id'
                    variant='outlined'
                    error={!!errors.tax_id}
                  />
                  {!!errors.tax_id && <p>O campo CPF é obrigatório!</p>}
                </label>

                <label>
                  {errors.phone ? <h4 className={styles.input__error}>Telefone</h4> : <h4>Telefone</h4>}
                  <TextField
                    className={styles.fieldset}
                    color='secondary'
                    {...register('phone', { required: true })}
                    id='phone'
                    variant='outlined'
                    error={!!errors.phone}
                  />
                  {!!errors.phone && <p>O campo Telefone é obrigatório!</p>}
                </label>
              </div>

              <div className={styles.input__wrapper}>
                <label>
                  {errors.zip_code ? <h4 className={styles.input__error}>CEP</h4> : <h4>CEP</h4>}
                  <TextField
                    className={styles.fieldset}
                    color='secondary'
                    {...register('zip_code')}
                    id='zip_code'
                    variant='outlined'
                    error={!!errors.zip_code}
                  />
                </label>

                <label>
                  {errors.street ? <h4 className={styles.input__error}>Logradouro</h4> : <h4>Logradouro</h4>}
                  <TextField
                    className={styles.fieldset}
                    color='secondary'
                    {...register('street')}
                    id='street'
                    variant='outlined'
                    error={!!errors.street}
                  />
                </label>
              </div>

              <div className={styles.input__wrapper}>
                <label>
                  {errors.number ? <h4 className={styles.input__error}>Número</h4> : <h4>Número</h4>}
                  <TextField
                    className={styles.fieldset}
                    color='secondary'
                    {...register('number')}
                    id='number'
                    variant='outlined'
                    error={!!errors.number}
                  />
                </label>

                <label>
                  {errors.address_details
                    ? <h4 className={styles.input__error}>Complemento</h4>
                    : <h4>Complemento</h4>
                  }
                  <TextField
                    className={styles.fieldset}
                    color='secondary'
                    {...register('address_details')}
                    id='address_details'
                    variant='outlined'
                    error={!!errors.address_details}
                  />
                </label>
              </div>

              <div className={styles.input__wrapper}>
                <label>
                  {errors.district ? <h4 className={styles.input__error}>Bairro</h4> : <h4>Bairro</h4>}
                  <TextField
                    className={styles.fieldset}
                    color='secondary'
                    {...register('district')}
                    id='district'
                    variant='outlined'
                    error={!!errors.district}
                  />
                </label>

                <label>
                  {errors.reference ? <h4 className={styles.input__error}>Ponto de referência</h4> : <h4>Ponto de referência</h4>}
                  <TextField
                    className={styles.fieldset}
                    color='secondary'
                    {...register('reference')}
                    id='reference'
                    variant='outlined'
                    error={!!errors.reference}
                  />
                </label>
              </div>

              <div className={styles.input__wrapper}>
                <label>
                  {errors.city ? <h4 className={styles.input__error}>Cidade</h4> : <h4>Cidade</h4>}
                  <TextField
                    className={styles.fieldset}
                    color='secondary'
                    {...register('city')}
                    id='city'
                    variant='outlined'
                    error={!!errors.city}
                  />
                </label>

                <label>
                  {errors.state ? <h4 className={styles.input__error}>Estado</h4> : <h4>Estado</h4>}
                  <TextField
                    className={styles.fieldset}
                    color='secondary'
                    {...register('state')}
                    id='state'
                    variant='outlined'
                    error={!!errors.state}
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
                <Alert severity='error'>
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
                  disabled={false}
                  variant='contained'
                >
                  Adicionar Cliente
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

export default EnrollClient;