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
  useContext,
  useState
} from 'react';
import { useForm } from 'react-hook-form';
import closeIcon from '../../assets/close-icon.svg';
import AuthContext from '../../contexts/AuthContext';
import PasswordInput from './../../components/PasswordInput';
import styles from './styles.module.scss';

function EditUserProfile({ user }) {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const { token } = useContext(AuthContext);

  const [email, setEmail] = useState(user.current.email);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(user.current.name);
  const [open, setOpen] = useState(true);
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState(user.current.phone);
  const [requestError, setRequestError] = useState('');
  const [taxId, setTaxId] = useState(user.current.tax_id);

  async function onSubmit(data) {
    let newPhone = phone;
    let newTaxId = taxId;

    if (user.current.phone && phone === '') {
      newPhone = '';
    };

    if (user.current.tax_id && taxId === '') {
      newTaxId = '';
    };

    const body = {
      name: name,
      email: email,
      password: password === '' ? user.current.password : password,
      phone: newPhone,
      taxId: newTaxId
    };

    setRequestError('');
    setLoading(true);

    const response = await fetch('https://academy-bills.herokuapp.com/profile', {
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
        setOpen(!open);
      }, 2000);

      return;
    };

    setLoading(false);

    setRequestError(requestData);
  };

  function handleAlertClose() {
    setRequestError('');
  };

  function handleModalClose() {
    setOpen(!open);
  };

  return (
    <Modal
      open={open}
      onClose={handleModalClose}
      className={styles.content__wrapper}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <img src={closeIcon} alt='' onClick={handleModalClose} />
        <label>
          <h4>Nome</h4>
          <TextField
            value={name}
            onChange={(e) => setName(e.target.value)}
            variant='standard'
          />
        </label>
        <label>
          <h4>E-mail</h4>
          <TextField
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant='standard'
          />
        </label>
        <label>
          {errors.password ? <h4 className={styles.input__error}>Nova senha</h4> : <h4>Nova senha</h4>}
          <PasswordInput
            register={() => register('password', { minLength: 5 })}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.password__input}
            variant='standard'
            error={!!errors.password}
          />
          {errors.password?.type === 'minLength'
            ? <p>A senha deve conter no mínimo 5 caracteres</p>
            : <p className={styles.input__warning}>Deixe o campo vazio para não editar sua senha atual</p>
          }
        </label>
        <label>
          {errors.phone ? <h4 className={styles.input__error}>Telefone</h4> : <h4>Telefone</h4>}
          <TextField
            {...register('phone', { minLength: 10, maxLength: 11, pattern: /^[0-9]+$/i })}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder='(71) 9999-9999'
            variant='standard'
            error={!!errors.phone}
          />
          {(errors.phone?.type === 'minLength' || errors.phone?.type === 'maxLength')
            && <p>O telefone deve conter entre 10 a 11 caracteres</p>
          }
          {errors.phone?.type === 'pattern' && <p>O telefone deve conter apenas números</p>}
        </label>
        <label>
          {errors.tax_id ? <h4 className={styles.input__error}>CPF</h4> : <h4>CPF</h4>}
          <TextField
            {...register('tax_id', { minLength: 11, maxLength: 11, pattern: /^[0-9]+$/i })}
            value={taxId}
            onChange={(e) => setTaxId(e.target.value)}
            placeholder='000.000.000-00'
            variant='standard'
            error={!!errors.tax_id}
          />
          {(errors.tax_id?.type === 'minLength' || errors.tax_id?.type === 'maxLength')
            && <p>O CPF deve conter 11 caracteres</p>
          }
          {errors.tax_id?.type === 'pattern' && <p>O CPF deve conter apenas números</p>}
        </label>

        <Snackbar
          className={styles.snackbar}
          open={!!requestError}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          autoHideDuration={3000}
          onClose={handleAlertClose}
        >
          <Alert severity={requestError === 'Perfil do usuário atualizado com sucesso.'
            ? 'success'
            : 'error'}
          >
            {requestError}
          </Alert>
        </Snackbar>

        <Button
          className={styles.button__states}
          type='submit'
          disabled={!name || !email}
          variant='contained'
        >
          Editar conta
        </Button>

        <Backdrop sx={{
          color: 'var(--color-white)',
          zIndex: (theme) => theme.zIndex.drawer + 1
        }}
          open={loading}>
          <CircularProgress color='inherit' />
        </Backdrop>
      </form>
    </Modal>
  );
};

export default EditUserProfile;