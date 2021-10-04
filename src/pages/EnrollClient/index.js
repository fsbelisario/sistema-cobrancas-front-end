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
  const { token, setToken, tokenLS } = useContext(AuthContext);
  const history = useHistory();

  const [requestError, setRequestError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setToken(tokenLS);

    if (!token) {
      history.push('/');
      return;
    };

  }, [token, setToken, tokenLS, history]);

  async function onSubmit(data) {
    const body = {
      name: data.clientName,
      email: data.clientEmail,
      taxId: data.clientTax_id,
      phone: data.clientPhone,
      zipCode: data.zip_code && data.zip_code,
      street: data.street && data.street,
      number: data.number && data.number,
      addressDetails: data.address_details && data.address_details,
      district: data.district && data.district,
      reference: data.reference && data.reference,
      city: data.city && data.city,
      state: data.state && data.state
    };

    setRequestError('');
    setLoading(true);

    try {
      const response = await fetch('https://academy-bills.herokuapp.com/clients', {
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
    } catch (error) {
      setRequestError(error.message);
    };
  };

  function handleAlertClose() {
    setRequestError('');
  };

  function cancelButton() {
    history.push('/home');
  };

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
                  {errors.clientName ? <h4 className={styles.input__error}>Nome</h4> : <h4>Nome</h4>}
                  <TextField
                    className={styles.fieldset}
                    color='secondary'
                    error={!!errors.clientName}
                    id='clientName'
                    {...register('clientName', { required: true })}
                    variant='outlined'
                  />
                  {!!errors.clientName && <p>O campo Nome é obrigatório!</p>}
                </label>

                <label>
                  {errors.clientEmail ? <h4 className={styles.input__error}>E-mail</h4> : <h4>E-mail</h4>}
                  <TextField
                    className={styles.fieldset}
                    color='secondary'
                    id='clientEmail'
                    error={!!errors.clientEmail}
                    {...register('clientEmail', { required: true })}
                    variant='outlined'
                  />
                  {!!errors.clientEmail && <p>O campo E-mail é obrigatório!</p>}
                </label>
              </div>

              <div className={styles.input__wrapper}>
                <label>
                  {errors.clientTax_id ? <h4 className={styles.input__error}>CPF</h4> : <h4>CPF</h4>}
                  <TextField
                    className={styles.fieldset}
                    color='secondary'
                    id='clientTax_id'
                    error={!!errors.clientTax_id}
                    {...register('clientTax_id',
                      { required: true, minLength: 11, maxLength: 11, pattern: /^[0-9]+$/i })
                    }
                    variant='outlined'
                  />
                  {errors.clientTax_id?.type === 'required' && <p>O campo CPF é obrigatório!</p>}
                  {(errors.clientTax_id?.type === 'minLength' || errors.clientTax_id?.type === 'maxLength')
                    && <p>O CPF deve conter 11 caracteres</p>
                  }
                  {errors.clientTax_id?.type === 'pattern' && <p>O CPF deve conter apenas números</p>}
                </label>

                <label>
                  {errors.clientPhone ? <h4 className={styles.input__error}>Telefone</h4> : <h4>Telefone</h4>}
                  <TextField
                    className={styles.fieldset}
                    color='secondary'
                    id='clientPhone'
                    error={!!errors.clientPhone}
                    {...register('clientPhone',
                      { required: true, minLength: 10, maxLength: 11, pattern: /^[0-9]+$/i })
                    }
                    variant='outlined'
                  />
                  {errors.clientPhone?.type === 'required' && <p>O campo Telefone é obrigatório!</p>}
                  {(errors.clientPhone?.type === 'minLength' || errors.clientPhone?.type === 'maxLength')
                    && <p>O telefone deve conter entre 10 a 11 caracteres</p>
                  }
                  {errors.clientPhone?.type === 'pattern' && <p>O telefone deve conter apenas números</p>}
                </label>
              </div>

              <div className={styles.input__wrapper}>
                <label>
                  {errors.zip_code ? <h4 className={styles.input__error}>CEP</h4> : <h4>CEP</h4>}
                  <TextField
                    className={styles.fieldset}
                    color='secondary'
                    id='zip_code'
                    {...register('zip_code', { minLength: 8, maxLength: 8, pattern: /^[0-9]+$/i })}
                    variant='outlined'
                    error={!!errors.zip_code}
                  />
                  {(errors.zip_code?.type === 'minLength' || errors.zip_code?.type === 'maxLength')
                    && <p>O CEP deve conter 8 caracteres</p>
                  }
                  {errors.zip_code?.type === 'pattern' && <p>O CEP deve conter apenas números</p>}
                </label>

                <label>
                  {errors.street ? <h4 className={styles.input__error}>Logradouro</h4> : <h4>Logradouro</h4>}
                  <TextField
                    className={styles.fieldset}
                    color='secondary'
                    error={!!errors.street}
                    id='street'
                    {...register('street')}
                    variant='outlined'
                  />
                </label>
              </div>

              <div className={styles.input__wrapper}>
                <label>
                  {errors.number ? <h4 className={styles.input__error}>Número</h4> : <h4>Número</h4>}
                  <TextField
                    className={styles.fieldset}
                    color='secondary'
                    id='number'
                    error={!!errors.number}
                    {...register('number')}
                    variant='outlined'
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
                    id='address_details'
                    error={!!errors.address_details}
                    {...register('address_details')}
                    variant='outlined'
                  />
                </label>
              </div>

              <div className={styles.input__wrapper}>
                <label>
                  {errors.district ? <h4 className={styles.input__error}>Bairro</h4> : <h4>Bairro</h4>}
                  <TextField
                    className={styles.fieldset}
                    color='secondary'
                    id='district'
                    error={!!errors.district}
                    {...register('district')}
                    variant='outlined'
                  />
                </label>

                <label>
                  {errors.reference ? <h4 className={styles.input__error}>Ponto de referência</h4> : <h4>Ponto de referência</h4>}
                  <TextField
                    className={styles.fieldset}
                    color='secondary'
                    id='reference'
                    error={!!errors.reference}
                    {...register('reference')}
                    variant='outlined'
                  />
                </label>
              </div>

              <div className={styles.input__wrapper}>
                <label>
                  {errors.city ? <h4 className={styles.input__error}>Cidade</h4> : <h4>Cidade</h4>}
                  <TextField
                    className={styles.fieldset}
                    color='secondary'
                    id='city'
                    error={!!errors.city}
                    {...register('city')}
                    variant='outlined'
                  />
                </label>

                <label>
                  {errors.state ? <h4 className={styles.input__error}>Estado</h4> : <h4>Estado</h4>}
                  <TextField
                    className={styles.fieldset}
                    color='secondary'
                    id='state'
                    error={!!errors.state}
                    {...register('state', { minLength: 2, maxLength: 2, pattern: /^[A-Za-z]+$/i })}
                    variant='outlined'
                  />
                  {(errors.state?.type === 'minLength' || errors.state?.type === 'maxLength')
                    && <p>Escreva a sigla do Estado com apenas 2 caracteres. Ex: Bahia = BA</p>
                  }
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