import { Button, TextField } from '@material-ui/core';
import { Link } from 'react-router-dom';
import academy from '../../assets/logo-academy.svg';
import styles from './styles.module.scss';

function EnrollUser() {

  return (
    <div className={styles.content__wrapper}>
      <form>
        <img src={academy} alt="Logo Academy" />
        <h4>Nome</h4>
        <TextField className="textField" id="name" variant="standard" required />
        <h4>E-mail</h4>
        <TextField id="email" variant="standard" placeholder="exemplo@gmail.com" required />
        <h4>Senha</h4>
        <TextField id="password" variant="standard" required />
        <Button type="submit" variant="contained" disabled={true}>Criar conta</Button>
      </form>
      <footer>Já possui uma conta? <Link to="/">Acesse agora!</Link></footer>
    </div>
  );
}

export default EnrollUser;