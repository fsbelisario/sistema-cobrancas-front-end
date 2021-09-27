import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Link,
  useHistory
} from 'react-router-dom';
import PasswordInput from './../../components/PasswordInput';
import {
  Alert,
  Button,
  Snackbar,
  TextField
} from '@mui/material';
import academy from '../../assets/logo-academy.svg';
import styles from './styles.module.scss';

function EnrollUser() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const history = useHistory();

  const [requestError, setRequestError] = useState('');

  async function onSubmit(data) {
    const body = {
      name: data.name,
      email: data.email,
      password: data.password
    };

    setRequestError('');

    const response = await fetch('http://localhost:3003/users', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(body)
    });

    if (response.ok) {
      console.log('Conta cadastrada com sucesso! ' + response.json());
      history.push('/');
      return;
    };

    const requestData = await response.json();
    setRequestError(requestData);
  };

  function handleAlertClose() {
    setRequestError('');
  };

  return (
    <div className={styles.content__wrapper}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <img src={academy} alt='Logo Academy' />
        <label>
          {errors.name ? <h4 className={styles.input__error}>Nome</h4> : <h4>Nome</h4>}
          <TextField {...register('name', { required: true })}
            variant='standard'
            error={!!errors.name}
          />
          {errors.name ? <p>O campo Nome é obrigatório!</p> : ''}
        </label>
        <label>
          {errors.email ? <h4 className={styles.input__error}>E-mail</h4> : <h4>E-mail</h4>}
          <TextField {...register('email', { required: true })}
            id='email'
            placeholder='exemplo@gmail.com'
            variant='standard'
            error={!!errors.email}
          />
          {errors.email ? <p>O campo E-mail é obrigatório!</p> : ''}
        </label>
        <label>
          {errors.password ? <h4 className={styles.input__error}>Senha</h4> : <h4>Senha</h4>}
          <PasswordInput register={() => register('password', { required: true })}
            id='password'
            className={styles.password__input}
            variant='standard'
            error={!!errors.password}
          />
          {errors.password ? <p>O campo Senha é obrigatório!</p> : ''}
        </label>

        <Snackbar className={styles.snackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          open={requestError}
          autoHideDuration={6000}
          onClose={handleAlertClose}>
          <Alert severity='error'>
            {requestError}
          </Alert>
        </Snackbar>

        <Button className={styles.button__states}
          type='submit'
          disabled={false}
          variant='contained'>Criar conta
        </Button>
      </form>
      <footer>Já possui uma conta? <Link to='/'>Acesse agora!</Link></footer>
    </div>
  );
};

export default EnrollUser;