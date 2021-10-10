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

  const [addressDetails, setAddressDetails] = useState(client.address_details ? client.address_details : '');
  const [city, setCity] = useState(client.city ? client.city : '');
  const [district, setDistrict] = useState(client.district ? client.district : '');
  const [email, setEmail] = useState(client.email ? client.email : '');
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(client.name ? client.name : '');
  const [number, setNumber] = useState(client.number ? client.number : '');
  const [openModal, setOpenModal] = useState(true);
  const [phone, setPhone] = useState(client.phone ? client.phone : '');
  const [reference, setReference] = useState(client.reference ? client.reference : '');
  const [requestError, setRequestError] = useState('');
  const [state, setState] = useState(client.state ? client.state : '');
  const [street, setStreet] = useState(client.street ? client.street : '');
  const [taxId, setTaxId] = useState(client.tax_id ? client.tax_id : '');
  const [zipCode, setZipCode] = useState(client.zip_code ? client.zip_code : '');
  const [zipCodeError, setZipCodeError] = useState('');

  useEffect(() => {
    if (zipCode !== client.zip_code || street === '') {
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
    };
  }, [zipCode, openModal]);

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

    const response = await fetch(`https://academy-bills.herokuapp.com/clients/${client.id}`, {
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

    setZipCode('');

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
              <h4>Nome</h4>
              <TextField
                {...register('clientName', { required: true })}
                className={styles.fieldset}
                value={name}
                onChange={(e) => setName(e.target.value)}
                variant='outlined'
                color='secondary'
                error={!!errors.clientName}
              />
              {!!errors.clientName && <p>O campo Nome é obrigatório!</p>}
            </label>

            <label>
              <h4>E-mail</h4>
              <TextField
                {...register('clientEmail', { required: true })}
                className={styles.fieldset}
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                color='secondary'
                variant='outlined'
                error={!!errors.clientEmail}
              />
              {!!errors.clientEmail && <p>O campo E-mail é obrigatório!</p>}
            </label>
          </div>

          <div className={styles.input__wrapper}>
            <label>
              <h4>CPF</h4>
              <TextField
                {...register('clientTaxId',
                  { required: true, minLength: 11, maxLength: 11, pattern: /^[0-9]+$/i })
                }
                className={styles.fieldset}
                value={taxId}
                onChange={(e) => setTaxId(e.target.value)}
                color='secondary'
                inputProps={{ maxLength: 11 }}
                variant='outlined'
                error={!!errors.clientTaxId}
              />
              {errors.clientTaxId?.type === 'required' && <p>O campo CPF é obrigatório!</p>}
              {(errors.clientTaxId?.type === 'minLength' || errors.clientTaxId?.type === 'maxLength')
                && <p>O CPF deve conter 11 caracteres</p>
              }
              {errors.clientTaxId?.type === 'pattern' && <p>O CPF deve conter apenas números</p>}
            </label>

            <label>
              <h4>Telefone</h4>
              <TextField
                {...register('clientPhone',
                  { required: true, minLength: 10, maxLength: 11, pattern: /^[0-9]+$/i })
                }
                className={styles.fieldset}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                color='secondary'
                inputProps={{ maxLength: 11 }}
                variant='outlined'
                error={!!errors.clientPhone}
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
                inputProps={{ maxLength: 8 }}
                color='secondary'
                id='zip_code'
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
                className={styles.fieldset}
                value={state}
                onChange={(e) => setState(e.target.value)}
                color='secondary'
                inputProps={{ maxLength: 2 }}
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
              disabled={!name || !email || !taxId || !phone}
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