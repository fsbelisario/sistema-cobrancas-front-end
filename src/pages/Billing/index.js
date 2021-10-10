import {
  Backdrop,
  CircularProgress
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
  const { token, setToken, tokenLS } = useContext(AuthContext);
  const history = useHistory();
  const [billList, setBillList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setToken(tokenLS);
    if (!token) {
      history.push('/');
      return;
    };

    async function getBillings() {

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
      setBillList(requestData);

      setLoading(false);
    }

    getBillings();
  }, [token, setToken, tokenLS, history]);

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
          {billList.map((bill) => <CardBill key={bill.id} bill={bill} />)}
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