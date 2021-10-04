import Navbar from '../../components/Navbar';
import UserProfile from '../../components/UserProfile';
import styles from './styles.module.scss';
import {
  useEffect,
  useContext
} from 'react';
import { useHistory } from 'react-router-dom';
import AuthContext from '../../contexts/AuthContext';

function Billing() {
  const { token, setToken, tokenLS } = useContext(AuthContext);

  const history = useHistory();

  useEffect(() => {
    setToken(tokenLS);

    if (!token) {
      history.push('/');
      return;
    };
    
  }, [token, setToken, tokenLS, history]);

  return (
    <div className={styles.content__wrapper}>
      <Navbar />
      <div className={styles.main__content}>
        <UserProfile />
        <div className={styles.content}>
          Você não possui nenhuma cobrança cadastrada.
        </div>
      </div>
    </div>
  );
};

export default Billing;