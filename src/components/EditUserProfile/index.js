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
  useState,
  useContext
} from 'react';
import { useForm } from 'react-hook-form';
import AuthContext from '../../contexts/AuthContext';
import closeIcon from '../../assets/close-icon.svg';
import PasswordInput from './../../components/PasswordInput';
import styles from './styles.module.scss';

function EditUserProfile({ user }) {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { token } = useContext(AuthContext);

  const [requestError, setRequestError] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(true);

  async function onSubmit(data) {
    const body = {
      name: data.name,
      email: data.email,
      password: data.password === '' ?  user.password : data.password,
      phone: data.phone === '' ? user.phone : data.phone,
      tax_id: data.tax_id === '' ? user.tax_id : data.tax_id
    };

    setRequestError('');
    setLoading(true);

    const response = await fetch('http://localhost:3003/profile', {
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

  function handleTabClose() {
    setOpen(!open);
  };

  return (
    <Modal
      open={open}
      onClose={handleTabClose}
      className={styles.content__wrapper}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <img src={closeIcon} alt='' onClick={handleTabClose} />
        <label>
          {errors.name ? <h4 className={styles.input__error}>Nome</h4> : <h4>Nome</h4>}
          <TextField
            {...register('name', { required: true })}
            id='name'
            defaultValue={user.name}
            variant='standard'
            error={!!errors.name}
          />
          {!!errors.name && <p>O campo Nome é obrigatório!</p>}
        </label>
        <label>
          {errors.email ? <h4 className={styles.input__error}>E-mail</h4> : <h4>E-mail</h4>}
          <TextField
            {...register('email', { required: true })}
            id='email'
            defaultValue={user.email}
            variant='standard'
            error={!!errors.email}
          />
          {!!errors.email && <p>O campo E-mail é obrigatório!</p>}
        </label>
        <label>
          {errors.password ? <h4 className={styles.input__error}>Nova senha</h4> : <h4>Nova senha</h4>}
          <PasswordInput
            register={() => register('password')}
            id='password'
            className={styles.password__input}
            variant='standard'
            error={!!errors.password}
          />
          <p className={styles.input__warning}>Deixe esse campo vazio para não editar sua senha atual</p>
        </label>
        <label>
          {errors.phone ? <h4 className={styles.input__error}>Telefone</h4> : <h4>Telefone</h4>}
          <TextField
            {...register('phone')}
            id='phone'
            defaultValue={user.phone}
            placeholder='(71) 9999-9999'
            variant='standard'
            error={!!errors.phone}
          />
        </label>
        <label>
          {errors.tax_id ? <h4 className={styles.input__error}>CPF</h4> : <h4>CPF</h4>}
          <TextField
            {...register('tax_id')}
            id='tax_id'
            defaultValue={user.tax_id}
            placeholder='000.000.000-00'
            variant='standard'
            error={!!errors.tax_id}
          />
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
          disabled={false}
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