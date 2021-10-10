import {
  Alert,
  Backdrop,
  Button,
  CircularProgress,
  Modal,
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
  useRef,
  useState
} from 'react';
import { useForm } from 'react-hook-form';
import closeIcon from '../../assets/close-icon.svg';
import AuthContext from '../../contexts/AuthContext';
import styles from './styles.module.scss';

function ModalEditClient({ client }) {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const {
    setUpdateClientsList,
    token
  } = useContext(AuthContext);

  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(true);
  const [requestError, setRequestError] = useState('');
  const [state, setState] = useState('');
  const [stateError, setStateError] = useState('');
  const [street, setStreet] = useState('');
  const [zipCodeSearch, setZipCodeSearch] = useState('');
  const [zipCodeError, setZipCodeError] = useState('');

  const thisClient = useRef();
  thisClient.current = client;

  useEffect(() => {
    setZipCodeError('');

    setStreet('');

    setDistrict('');

    setCity('');

    setState('');

    async function retrieveAddress() {
      setLoading(true);

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

    if (zipCodeSearch.length === 8 && !!Number(zipCodeSearch)) {
      retrieveAddress();
    };

    setLoading(false);
  }, [zipCodeSearch, openModal]);

  async function onSubmit(data) {
    if (!!zipCodeError) {
      return;
    };

    if (!!zipCodeSearch && zipCodeSearch.length !== 8) {
      setZipCodeError('O CEP deve conter 8 caracteres numéricos');
      return;
    };

    if (!!zipCodeSearch && !Number(zipCodeSearch)) {
      setZipCodeError('O CEP deve conter apenas números');
      return;
    };

    if (!!state && state.length !== 2) {
      setStateError('O Estado deve conter 2 caracteres');
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

    const response = await fetch(`https://academy-bills.herokuapp.com/clients/${thisClient.current.id}`, {
      method: 'PUT',
      mode: 'cors',
      headers: {
        'Content-type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });

    const requestData = await response.json();

    if (response.ok) {
      setRequestError(requestData);

      setLoading(true);

      setTimeout(() => {
        setOpenModal(!openModal);
      }, 2000);

      setUpdateClientsList(true);

      return;
    };

    setRequestError(requestData);
    setLoading(false);
  };

  function handleAlertClose() {
    setRequestError('');
  };

  function handleEditClient() {
    setRequestError('');
    setZipCodeSearch('');
    setOpenModal(!openModal);
  }

  const theme = createTheme({
    palette: {
      secondary: {
        main: '#DA0175'
      }
    }
  });

  return (
    <Modal
      open={openModal}
      onClose={handleEditClient}
      className={styles.modal__wrapper}
    >
      <ThemeProvider theme={theme}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <img src={closeIcon} alt='' onClick={handleEditClient} />
          <div className={styles.input__wrapper}>
            <label>
              {errors.clientName ? <h4 className={styles.input__error}>Nome</h4> : <h4>Nome</h4>}
              <TextField
                className={styles.fieldset}
                color='secondary'
                defaultValue={thisClient.current.name}
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
                defaultValue={thisClient.current.email}
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
                defaultValue={thisClient.current.tax_id}
                id='clientTax_id'
                inputProps={{ maxLength: 11 }}
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
                defaultValue={thisClient.current.phone}
                id='clientPhone'
                inputProps={{ maxLength: 11 }}
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
                inputProps={{ maxLength: 8 }}
                color='secondary'
                id='zip_code'
                variant='outlined'
                error={!!zipCodeError}
              />
              {zipCodeError && <p>{zipCodeError}</p>}
            </label>

            <label>
              {errors.street ? <h4 className={styles.input__error}>Logradouro</h4> : <h4>Logradouro</h4>}
              <TextField
                className={styles.fieldset}
                value={thisClient.current.street || street}
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
                defaultValue={thisClient.current.number}
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
                defaultValue={thisClient.current.address_details}
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
                value={thisClient.current.district || district}
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
                defaultValue={thisClient.current.reference}
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
                value={thisClient.current.city || city}
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
                value={state || thisClient.current.state}
                onChange={(e) => setState(e.target.value)}
                color='secondary'
                id='state'
                inputProps={{ maxLength: 2 }}
                error={!!stateError}
                variant='outlined'
              />
              {stateError && <p>{stateError}</p>}
            </label>
          </div>

          <Snackbar
            className={styles.snackbar}
            open={!!requestError}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            autoHideDuration={3000}
            onClose={handleAlertClose}
          >
            <Alert severity={requestError === 'Cadastro do cliente atualizado com sucesso.' ? 'success' : 'error'}>
              {requestError}
            </Alert>
          </Snackbar>

          <div className={styles.button__wrapper}>
            <Button
              className={`${styles.button__states} ${styles.button__cancel}`}
              onClick={handleEditClient}
            >
              Cancelar
            </Button>
            <Button
              className={styles.button__states}
              type='submit'
              variant='contained'
            >
              Editar Cliente
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
    </Modal>
  );
};

export default ModalEditClient;