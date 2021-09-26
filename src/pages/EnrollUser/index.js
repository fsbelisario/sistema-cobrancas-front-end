import { Button, TextField } from '@material-ui/core';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import academy from '../../assets/logo-academy.svg';
import styles from './styles.module.scss';

function EnrollUser() {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log("Conta criada com sucesso!");
    console.log(data);
  }

  return (
    <div className={styles.content__wrapper}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <img src={academy} alt="Logo Academy" />
        <label>
          <h4>Nome</h4>
          <TextField {...register("name", { required: true })} variant="standard" />
        </label>
        <label>
          <h4>E-mail</h4>
          <TextField {...register("email", { required: true })} placeholder="exemplo@gmail.com" variant="standard" />
        </label>
        <label>
          <h4>Senha</h4>
          <TextField {...register("password", { required: true })} type="password" variant="standard" />
        </label>
        <Button type="submit" variant="contained" disabled={false} className={styles.button__states}>Criar conta</Button>
      </form>
      <footer>Já possui uma conta? <Link to="/">Acesse agora!</Link></footer>
    </div>
  );
}

export default EnrollUser;