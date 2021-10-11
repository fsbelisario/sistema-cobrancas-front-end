import {
  useContext,
  useEffect,
  useState
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

  const [overdueClients, setOverdueClients] = useState(0);
  const [onTimeClients, setOnTimeClients] = useState(0);
  const [overdueBillings, setOverdueBillings] = useState(0);
  const [dueBillings, setDueBillings] = useState(0);
  const [paidBillings, setPaidBillings] = useState(0);

  useEffect(() => {
    setToken(tokenLS);

    if (!token) {
      history.push('/');

      return;
    };

  }, [token, setToken, tokenLS, history]);

  useEffect(() => {
    async function retrieveData() {
      const response = await fetch('https://academy-bills.herokuapp.com/management', {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const requestData = await response.json();

      setOverdueClients(requestData.overdueClients)
      setOnTimeClients(requestData.onTimeClients)
      setOverdueBillings(requestData.overdueBillings)
      setDueBillings(requestData.dueBillings)
      setPaidBillings(requestData.paidBillings)

      console.log(requestData);
    };

    retrieveData();
  }, [])

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
                number={overdueClients}
              />,
              <CardHomeItem
                key='client_item_2'
                className={styles.item__green}
                title='Em dia'
                number={onTimeClients}
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
                number={Number((dueBillings / 100)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              />,
              <CardHomeItem
                key='bill_item_2'
                className={styles.item__red}
                title='Vencidas'
                number={Number((overdueBillings / 100)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              />,
              <CardHomeItem
                key='bill_item_3'
                className={styles.item__green}
                title='Pagas'
                number={Number((paidBillings / 100)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              />
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;