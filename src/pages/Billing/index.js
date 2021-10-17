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
import CardBill from '../../components/CardBill';
import Navbar from '../../components/Navbar';
import UserProfile from '../../components/UserProfile';
import AuthContext from '../../contexts/AuthContext';
import styles from './styles.module.scss';

function Billing() {
  const { 
    token, setToken, tokenLS,
    updateBillingsList, setUpdateBillingsList
  } = useContext(AuthContext);

  const history = useHistory();

  const [billList, setBillList] = useState([]);
  const [listClients, setListClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [requestResult, setRequestResult] = useState();

  useEffect(() => {
    setToken(tokenLS);
    if (!token) {
      history.push('/');
      return;
    };

    async function retrieveClients() {
      try {
        setRequestResult();
        setLoading(true);

        const response = await fetch('https://academy-bills.herokuapp.com/clients/options', {
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

        setListClients(requestData);
      } catch (error) {
        setRequestResult(error.message);
      } finally {
        setLoading(false);
      };
    };

    async function getBillings() {
      try {
        setRequestResult();
        setLoading(true);

        const response = await fetch('https://academy-bills.herokuapp.com/billings', {
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

        setBillList(requestData);
      } catch (error) {
        setRequestResult(error.message);
      } finally {
        setLoading(false);
      };
    };

    retrieveClients();
    getBillings();

    if (updateBillingsList) {
      getBillings();
      setUpdateBillingsList(false);
    };
  }, [token, setToken, tokenLS, updateBillingsList, setUpdateBillingsList, history]);

  function handleAlertClose() {
    setRequestResult();
  };

  return (
    <div className={styles.content__wrapper}>
      <Navbar />
      <div className={styles.main__content}>
        <UserProfile />
        <div className={styles.content}>
          <div className={styles.table__title}>
            <div className={styles.info__id}>ID</div>
            <div className={styles.info__name}>Cliente</div>
            <div className={styles.info__description}>Descrição</div>
            <div>Valor</div>
            <div>Status</div>
            <div>Vencimento</div>
          </div>
          {billList.map((bill) => 
            <CardBill key={bill.id} bill={bill} listClients={listClients} />
          )}

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

export default Billing;