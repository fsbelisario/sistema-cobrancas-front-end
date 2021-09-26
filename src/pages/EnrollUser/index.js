import { Button, TextField } from '@material-ui/core';
import { useForm } from 'react-hook-form';
import { Link, useHistory } from 'react-router-dom';
import academy from '../../assets/logo-academy.svg';
import { PasswordInput } from './../../components/PasswordInput/index';
import styles from './styles.module.scss';

function EnrollUser() {
  const { register, handleSubmit } = useForm();
  const history = useHistory();

  async function onSubmit(data) {

    const body = {
      name: data.name,
      email: data.email,
      password: data.password
    };

    console.log(body);

    const response = await fetch('http://localhost:3003/users', {
      method: 'POST',
      mode: 'cors',
      credentials: 'same-origin',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(body)
    });

    if(response.ok) {
      console.log('Conta cadastrada com sucesso! ' + response.json());
      history.push('/');
      return;
    }

    const requestData = await response.json();
    console.log(requestData);
  }

  return (
    <div className={styles.content__wrapper}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <img src={academy} alt="Logo Academy" />
        <label>
          <h4>Nome</h4>
          <TextField {...register("name", { required: true })} 
            variant="standard" 
          />
        </label>
        <label>
          <h4>E-mail</h4>
          <TextField {...register("email", { required: true })} 
            placeholder="exemplo@gmail.com" 
            variant="standard" 
          />
        </label>
        <label>
          <h4>Senha</h4>
          <PasswordInput register={() => register("password", { required: true })} 
            id="password" 
            className={styles.password__input} 
            variant="standard" 
          />
        </label>
        <Button className={styles.button__states} 
          type="submit" 
          disabled={false} 
          variant="contained">Criar conta
        </Button>
      </form>
      <footer>Já possui uma conta? <Link to="/">Acesse agora!</Link></footer>
    </div>
  );
}

export default EnrollUser;