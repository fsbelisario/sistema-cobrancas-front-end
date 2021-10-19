import {
  Alert,
  Backdrop,
  CircularProgress,
  Snackbar
} from '@mui/material';
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
  const [loading, setLoading] = useState(false);
  const [requestResult, setRequestResult] = useState();

  useEffect(() => {
    setToken(tokenLS);

    if (!token) {
      history.push('/');
      return;
    };

    async function retrieveData() {
      try {
        setRequestResult();
        setLoading(true);

        const response = await fetch('https://academy-bills.herokuapp.com/management', {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        const requestData = await response.json();

        if (!response.ok) {
          throw new Error(requestData);
        };

        setOverdueClients(requestData.overdueClients);
        setOnTimeClients(requestData.onTimeClients);
        setOverdueBillings(requestData.overdueBillings);
        setDueBillings(requestData.dueBillings);
        setPaidBillings(requestData.paidBillings);
      } catch (error) {
        setRequestResult(error.message);
      } finally {
        setLoading(false);
      };
    };

    retrieveData();
  }, [token, setToken, tokenLS, history]);

  function handleAlertClose() {
    setRequestResult();
  };

  function handleClientReports() {
    history.push('/relatorio-cliente');
  };

  function handleBillReports() {
    history.push('/relatorio-cobranca');
  };

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
                onClick={handleClientReports}
                title='Inadimplentes'
                number={overdueClients}
              />,
              <CardHomeItem
                key='client_item_2'
                className={styles.item__green}
                onClick={handleClientReports}
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
                className={styles.item__red}
                onClick={handleBillReports}
                title='Vencidas'
                number={Number((overdueBillings / 100)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              />,
              <CardHomeItem
                key='bill_item_2'
                className={styles.item__blue}
                onClick={handleBillReports}
                title='Previstas'
                number={Number((dueBillings / 100)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              />,
              <CardHomeItem
                key='bill_item_3'
                className={styles.item__green}
                onClick={handleBillReports}
                title='Pagas'
                number={Number((paidBillings / 100)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              />
            ]}
          />
          <Snackbar
            className={styles.snackbar}
            open={!!requestResult}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            autoHideDuration={3000}
            onClose={handleAlertClose}
          >
            <Alert severity='error'>
              {requestResult}
            </Alert>
          </Snackbar>
          <Backdrop
            sx={{
              color: 'var(--color-white)',
              zIndex: (theme) => theme.zIndex.drawer + 1
            }}
            open={loading}
          >
            <CircularProgress color='inherit' />
          </Backdrop>
        </div>
      </div>
    </div>
  );
};

export default Home;