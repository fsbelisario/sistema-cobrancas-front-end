import {
  Backdrop,
  Button,
  CircularProgress
} from '@mui/material';
import {
  useContext,
  useEffect,
  useState
} from 'react';
import { useHistory } from 'react-router';
import CardClient from '../../components/CardClient';
import Navbar from '../../components/Navbar';
import UserProfile from '../../components/UserProfile';
import AuthContext from '../../contexts/AuthContext';
import styles from './styles.module.scss';

function ListClient() {
  const {
    token, setToken,
    tokenLS,
    updateClientsList, setUpdateClientsList
  } = useContext(AuthContext);

  const history = useHistory();

  const [clientList, setClientList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [requestResult, setRequestResult] = useState('');

  useEffect(() => {
    setToken(tokenLS);
    if (!token) {
      history.push('/');
      return;
    };

    async function getClientsList() {
      try {
        setRequestResult('');
        setLoading(true);

        const response = await fetch('https://academy-bills.herokuapp.com/clients', {
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

        setClientList(requestData);
      } catch (error) {
        setRequestResult(error.message);
      } finally {
        setLoading(false);
      };
    };

    getClientsList();

    if (updateClientsList) {
      getClientsList();
      setUpdateClientsList(false);
    };
  }, [token, setToken, tokenLS, history, updateClientsList, setUpdateClientsList]);

  function enrollClient() {
    history.push('/adicionar-cliente');
  };

  return (
    <div className={styles.content__wrapper}>
      <Navbar />
      <div className={styles.main__content}>
        <UserProfile />
        <div className={styles.content}>
          <Button
            className={styles.button__client}
            onClick={enrollClient}
            variant='contained'
          >
            Adicionar cliente
          </Button>
          <div className={styles.table__title}>
            <div className={styles.table__client}>
              Cliente
            </div>
            <div className={styles.table__others}>
              <div>Cobranças Feitas</div>
              <div>Cobranças Recebidas</div>
              <div>Status</div>
            </div>
            <div className={styles.blank__space}>
            </div>
          </div>
          {clientList.map((client) => <CardClient key={client.id} client={client} />)}
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

export default ListClient;