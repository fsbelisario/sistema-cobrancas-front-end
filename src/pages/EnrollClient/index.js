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

function EnrollClient() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const {
    token, setToken,
    tokenLS
  } = useContext(AuthContext);

  const history = useHistory();

  const [addressDetails, setAddressDetails] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [reference, setReference] = useState('');
  const [requestError, setRequestError] = useState('');
  const [state, setState] = useState('');
  const [street, setStreet] = useState('');
  const [taxId, setTaxId] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [zipCodeError, setZipCodeError] = useState('');

  useEffect(() => {
    setToken(tokenLS);

    if (!token) {
      history.push('/');
      return;
    };

  }, [token, setToken, tokenLS, history]);

  useEffect(() => {
    setZipCodeError('');
    setStreet('');
    setDistrict('');
    setCity('');
    setState('');

    async function retrieveAddress() {
      setLoading(true);

      const response = await fetch(`https://viacep.com.br/ws/${zipCode}/json/`);

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

    if (zipCode.length === 8 && !!Number(zipCode)) {
      retrieveAddress();
    };

    setLoading(false);
  }, [zipCode]);

  async function onSubmit(data) {
    if (!!zipCodeError) {
      return;
    };

    const body = {
      name: name,
      email: email,
      taxId: taxId,
      phone: phone,
      zipCode: zipCode && zipCode,
      street: street && street,
      number: number && number,
      addressDetails: addressDetails && addressDetails,
      district: district && district,
      reference: reference && reference,
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
        setLoading(true);

        setTimeout(() => {
          history.push('/clientes');
        }, 2000);

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
    history.push('/clientes');
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
                    {...register('clientName', { required: true })}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    color='secondary'
                    variant='outlined'
                    error={errors.clientName}
                  />
                  {errors.clientName && <p>O campo Nome é obrigatório!</p>}
                </label>

                <label>
                  {errors.clientEmail ? <h4 className={styles.input__error}>E-mail</h4> : <h4>E-mail</h4>}
                  <TextField
                    {...register('clientEmail', { required: true })}
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={styles.fieldset}
                    color='secondary'
                    variant='outlined'
                    error={errors.clientEmail}
                  />
                  {errors.clientEmail && <p>O campo E-mail é obrigatório!</p>}
                </label>
              </div>

              <div className={styles.input__wrapper}>
                <label>
                  {errors.clientTax_id ? <h4 className={styles.input__error}>CPF</h4> : <h4>CPF</h4>}
                  <TextField
                    {...register('clientTax_id',
                      { required: true, minLength: 11, maxLength: 11, pattern: /^[0-9]+$/i })
                    }
                    value={taxId}
                    onChange={(e) => setTaxId(e.target.value)}
                    className={styles.fieldset}
                    color='secondary'
                    variant='outlined'
                    error={errors.clientTax_id}
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
                    {...register('clientPhone',
                      { required: true, minLength: 10, maxLength: 11, pattern: /^[0-9]+$/i })
                    }
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={styles.fieldset}
                    color='secondary'
                    id='clientPhone'
                    variant='outlined'
                    error={errors.clientPhone}
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
                  {(errors.zipCode || zipCodeError) ? <h4 className={styles.input__error}>CEP</h4> : <h4>CEP</h4>}
                  <TextField
                    {...register('zipCode',
                      { minLength: 8, maxLength: 8, pattern: /^[0-9]+$/i })
                    }
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    className={styles.fieldset}
                    color='secondary'
                    variant='outlined'
                    error={errors.zip_code || zipCodeError}
                  />
                  {zipCodeError && <p>{zipCodeError}</p>}
                  {(errors.zipCode?.type === 'minLength' || errors.zipCode?.type === 'maxLength')
                    && <p>O CEP deve conter 8 caracteres</p>
                  }
                  {errors.zipCode?.type === 'pattern' && <p>O CEP deve conter apenas números</p>}
                </label>

                <label>
                  <h4>Logradouro</h4>
                  <TextField
                    className={styles.fieldset}
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    color='secondary'
                    variant='outlined'
                  />
                </label>
              </div>

              <div className={styles.input__wrapper}>
                <label>
                  <h4>Número</h4>
                  <TextField
                    className={styles.fieldset}
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    color='secondary'
                    variant='outlined'
                  />
                </label>

                <label>
                  <h4>Complemento</h4>
                  <TextField
                    className={styles.fieldset}
                    value={addressDetails}
                    onChange={(e) => setAddressDetails(e.target.value)}
                    color='secondary'
                    variant='outlined'
                  />
                </label>
              </div>

              <div className={styles.input__wrapper}>
                <label>
                  <h4>Bairro</h4>
                  <TextField
                    className={styles.fieldset}
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    color='secondary'
                    variant='outlined'
                  />
                </label>

                <label>
                  <h4>Ponto de referência</h4>
                  <TextField
                    className={styles.fieldset}
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    color='secondary'
                    variant='outlined'
                  />
                </label>
              </div>

              <div className={styles.input__wrapper}>
                <label>
                  <h4>Cidade</h4>
                  <TextField
                    className={styles.fieldset}
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    color='secondary'
                    variant='outlined'
                  />
                </label>

                <label>
                  {errors.state ? <h4 className={styles.input__error}>Estado</h4> : <h4>Estado</h4>}
                  <TextField
                    {...register('state',
                      { minLength: 2, maxLength: 2 })
                    }
                    className={styles.fieldset}
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    color='secondary'
                    variant='outlined'
                    error={errors.state}
                  />
                  {(errors.state?.type === 'minLength' || errors.state?.type === 'maxLength')
                    && <p>O Estado deve conter 2 caracteres</p>
                  }
                  {errors.state?.type === 'pattern' && <p>O CEP deve conter apenas números</p>}
                </label>
              </div>

              <Snackbar
                className={styles.snackbar}
                open={!!requestError}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                autoHideDuration={3000}
                onClose={handleAlertClose}
              >
                <Alert severity={requestError === 'Cliente cadastrado com sucesso.' ? 'success' : 'error'}>
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
                  disabled={!name || !email || !taxId || !phone}
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