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
  const [zipCodeSearch, setZipCodeSearch] = useState('');
  const [zipCodeError, setZipCodeError] = useState('');
  const [street, setStreet] = useState('');
  const [district, setDistrict] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [stateError, setStateError] = useState('');

  useEffect(() => {
    setToken(localStorage.getItem('token'));

    if (!token) {
      history.push('/');
      return;
    };

  }, [token, setToken, history]);

  useEffect(() => {
    setZipCodeError('');
    setStreet('');
    setDistrict('');
    setCity('');
    setState('');

    if (zipCodeSearch.length === 8 && !!Number(zipCodeSearch)) {
      retrieveAddress();
    };

  }, [zipCodeSearch]);

  async function retrieveAddress() {
    const response = await fetch(`https://viacep.com.br/ws/${zipCodeSearch}/json/`);

    if (response.ok) {
      const requestData = await response.json();

      if (!requestData.erro) {
        setZipCodeError('');

        setStreet(requestData.logradouro);
        setDistrict(requestData.bairro);
        setCity(requestData.localidade);
        setState(requestData.uf);

        return;
      };

      setZipCodeError('CEP inválido.');
    } else {
      setZipCodeError('CEP inválido.');
    };
  };

  async function onSubmit(data) {
    if (!!zipCodeError) {
      return;
    };

    if (!!zipCodeSearch && zipCodeSearch.length !== 8) {
      setZipCodeError('O CEP deve conter 8 caracteres numéricos.');
      return;
    };

    if (!!zipCodeSearch && !Number(zipCodeSearch)) {
      setZipCodeError('O CEP deve conter apenas números.');
      return;
    };

    if (!!state && state.length !== 2) {
      setStateError('O estado deve conter 2 caracteres.');
      return;
    };

    const body = {
      name: data.clientName,
      email: data.clientEmail,
      taxId: data.clientTax_id,
      phone: data.clientPhone,
      zipCode: zipCodeSearch && zipCodeSearch,
      street: street && street,
      number: data.number && data.number,
      addressDetails: data.address_details && data.address_details,
      district: district && district,
      reference: data.reference && data.reference,
      city: city && city,
      state: state && state
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
                  {!!zipCodeError ? <h4 className={styles.input__error}>CEP</h4> : <h4>CEP</h4>}
                  <TextField
                    className={styles.fieldset}
                    value={zipCodeSearch}
                    onChange={(e) => setZipCodeSearch(e.target.value)}
                    color='secondary'
                    id='zip_code'
                    variant='outlined'
                    error={!!zipCodeError}
                  />
                  {!!zipCodeError && <p>{zipCodeError}</p>}
                </label>

                <label>
                  {errors.street ? <h4 className={styles.input__error}>Logradouro</h4> : <h4>Logradouro</h4>}
                  <TextField
                    className={styles.fieldset}
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    color='secondary'
                    id='street'
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
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    color='secondary'
                    id='district'
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
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    color='secondary'
                    id='city'
                    variant='outlined'
                  />
                </label>

                <label>
                  {!!stateError ? <h4 className={styles.input__error}>Estado</h4> : <h4>Estado</h4>}
                  <TextField
                    className={styles.fieldset}
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    color='secondary'
                    id='state'
                    error={!!stateError}
                    variant='outlined'
                  />
                  {!!stateError && <p>{stateError}</p>}
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