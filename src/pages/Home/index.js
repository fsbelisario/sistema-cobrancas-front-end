import {
  useContext,
  useEffect
} from 'react';
import { useHistory } from 'react-router';
import billIcon from '../../assets/card-billing-icon.svg';
import clientIcon from '../../assets/card-client-icon.svg';
import CardHome from '../../components/CardHome';
import CardHomeItem from '../../components/CardHomeItem';
import Navbar from '../../components/Navbar';
import UserProfile from '../../components/UserProfile';
import AuthContext from '../../contexts/AuthContext';
import styles from './styles.module.scss';

function Home() {
  const { token, setToken, tokenLS } = useContext(AuthContext);
  const history = useHistory();

  useEffect(() => {
    setToken(tokenLS);

    if(!token) {
      history.push('/');
      return;
    };
    
  }, [token, setToken, tokenLS, history]);

  return (
    <div className={styles.content__wrapper}>
      <Navbar />
      <div className={styles.main__content}>
        <UserProfile />
        <div className={styles.cards}>
          <CardHome
            key='client'
            icon={clientIcon}
            title='Clientes'
            CardHomeItem={[
              <CardHomeItem
                key='client_item_1'
                className={styles.item__red}
                title='Inadimplentes'
                number='0'
              />,
              <CardHomeItem
                key='client_item_2'
                className={styles.item__green}
                title='Em dia'
                number='0'
              />
            ]}
          />
          <CardHome
            key='bill'
            icon={billIcon}
            title='Cobranças'
            CardHomeItem={[
              <CardHomeItem
                key='bill_item_1'
                className={styles.item__blue}
                title='Previstas'
                number='0'
              />,
              <CardHomeItem
                key='bill_item_2'
                className={styles.item__red}
                title='Vencidas'
                number='0'
              />,
              <CardHomeItem
                key='bill_item_3'
                className={styles.item__green}
                title='Pagas'
                number='0'
              />
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;