import { Button } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import CardClient from '../../components/CardClient';
import Navbar from '../../components/Navbar';
import UserProfile from '../../components/UserProfile';
import AuthContext from '../../contexts/AuthContext';
import styles from './styles.module.scss';

function ListClient() {
  const { token, setToken, tokenLS } = useContext(AuthContext);
  const history = useHistory();
  const [clientList, setClientList] = useState([]);

  useEffect(() => {
    setToken(tokenLS);

    if(!token) {
      history.push('/');
      return;
    };

    async function getProfile() {
      const response = await fetch('https://academy-bills.herokuapp.com/clients', {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const requestData = await response.json();

      setClientList(requestData);
    }

    getProfile();
    
  }, [token, setToken, tokenLS, history]);

  function enrollClient() {
    history.push('/adicionar-cliente');
  }

  return(
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
        </div>
      </div>
    </div>
  );
}

export default ListClient;