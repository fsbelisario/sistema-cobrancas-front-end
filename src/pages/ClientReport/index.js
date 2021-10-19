import {
  Alert,
  Backdrop,
  Button,
  CircularProgress, Snackbar,
  TextField
} from '@mui/material';
import {
  createTheme,
  ThemeProvider
} from '@mui/material/styles';
import {
  useContext,
  useEffect,
  useState
} from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
import searchIcon from '../../assets/search-icon.svg';
import sortArrow from '../../assets/sort-arrow.svg';
import CardClient from '../../components/CardClient';
import Navbar from '../../components/Navbar';
import UserProfile from '../../components/UserProfile';
import AuthContext from '../../contexts/AuthContext';
import styles from './styles.module.scss';

function ClientReport() {
  const { register } = useForm();

  const {
    token, setToken,
    tokenLS,
    updateClientsList, setUpdateClientsList
  } = useContext(AuthContext);

  const history = useHistory();

  const [clientList, setClientList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [requestResult, setRequestResult] = useState();
  const [isDescSort, setIsDescSort] = useState(false);

  useEffect(() => {
    
    setToken(tokenLS);
    if (!token) {
      history.push('/');
      return;
    };

    async function getClientsList() {
      try {
        setRequestResult();
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
        
        requestData.sort((a, b) => {
          if(a.name > b.name) {
            return 1;
          };
      
          if (a.name < b.name) {
            return -1;
          };
          
          return 0;
        });
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

  function handleAlertClose() {
    setRequestResult();
  };

  function handleSortByName() {
    setIsDescSort(!isDescSort);
  };

  /*function handleSearch(data) {
    setSearch('');
    
    const search = data.search;
    let searchedClients = [];

    for (const client of clientList) {
      if((client.name.toLowerCase()).includes(search.toLowerCase())
          || (client.email.toLowerCase()).includes(search.toLowerCase())
          || (client.tax_id).includes(search)
        ) {
        searchedClients.push(client);
      };
    };

    if(search.length !== 0 && searchedClients.length === 0) {
      setSearch('Sem resultados');
    };

    setSearchClients(searchedClients);
  };*/

  const theme = createTheme({
    palette: {
      secondary: {
        main: '#DA0175'
      }
    }
  });

  return (
    <div className={styles.content__wrapper}>
      <Navbar />
      <div className={styles.main__content}>
        <UserProfile />
        <div className={styles.content}>
          <ThemeProvider theme={theme}>
            <div className={styles.search__wrapper}>
              <div>

              </div>
              <form>
                <TextField
                  {...register('search')}
                  color='secondary'
                  placeholder='Procurar por Nome, E-mail ou CPF'
                />
                <Button className={styles.search__button} type='submit'>
                  <img src={searchIcon} alt='' />
                  Buscar
                </Button>
              </form>
            </div>
          </ThemeProvider>
          <div className={styles.table__title}>
            <div className={styles.table__client} onClick={handleSortByName}>
              Cliente
              <img src={sortArrow} alt='' className={isDescSort ? `${styles.sortArrowUp}` : ''} />
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

export default ClientReport;