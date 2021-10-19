import {
  Alert,
  Backdrop,
  Button,
  CircularProgress,
  Snackbar,
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
import CardBill from '../../components/CardBill';
import Navbar from '../../components/Navbar';
import UserProfile from '../../components/UserProfile';
import AuthContext from '../../contexts/AuthContext';
import styles from './styles.module.scss';

function Billing() {
  const { register, handleSubmit } = useForm();

  const {
    token, setToken, tokenLS,
    updateBillingsList, setUpdateBillingsList
  } = useContext(AuthContext);

  const history = useHistory();

  const [billList, setBillList] = useState([]);
  const [currentList, setCurrentList] = useState([]);
  const [isDescSort, setIsDescSort] = useState(false);
  const [listClients, setListClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [requestResult, setRequestResult] = useState();
  const [searchBills, setSearchBills] = useState([]);
  const [search, setSearch] = useState('');

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

    retrieveClients();

    async function getBillings() {
      setIsDescSort(false);

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

        requestData.sort((a, b) => {
          if (a.name > b.name) {
            return 1;
          };

          if (a.name < b.name) {
            return -1;
          };

          return 0;
        });

        setBillList(requestData);
      } catch (error) {
        setRequestResult(error.message);
      } finally {
        setLoading(false);
      };
    };

    getBillings();

    if (updateBillingsList) {
      getBillings();
      setUpdateBillingsList(false);
    };
  }, [token, setToken, tokenLS, history, setUpdateBillingsList, updateBillingsList]);

  useEffect(() => {
    let listManipulation;

    if (searchBills.length > 0) {
      listManipulation = searchBills;
    } else {
      listManipulation = billList;
    };

    if (isDescSort) {
      listManipulation.sort((a, b) => {
        if (a.name < b.name) {
          return 1;
        };

        if (a.name > b.name) {
          return -1;
        };

        return 0;
      });
    } else {
      listManipulation.sort((a, b) => {
        if (a.name > b.name) {
          return 1;
        };

        if (a.name < b.name) {
          return -1;
        };

        return 0;
      });
    };

    setCurrentList(listManipulation);

    console.log(currentList);
  }, [isDescSort, searchBills, billList]);

  function handleSearch(data) {
    setSearch('');

    const search = data.search;
    let searchedBills = [];

    for (const bill of billList) {
      if ((bill.name.toLowerCase()).includes(search.trim().toLowerCase())
        || (bill.email.toLowerCase()).includes(search.trim().toLowerCase())
        || (bill.tax_id).includes(search.trim())
        || (String(bill.id).includes(search.trim()))
      ) {
        searchedBills.push(bill);
      };
    };

    if (search.length !== 0 && searchedBills.length === 0) {
      setSearch('Sem resultados');
    };

    setSearchBills(searchedBills);
  };

  function handleAlertClose() {
    setRequestResult();
  };

  function handleSortByName() {
    setIsDescSort(!isDescSort);
  };

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
              <form onSubmit={handleSubmit(handleSearch)}>
                <TextField
                  {...register('search')}
                  color='secondary'
                  placeholder='Procurar por Nome ou ID'
                />
                <Button className={styles.search__button} type='submit'>
                  <img src={searchIcon} alt='' />
                  Buscar
                </Button>
              </form>
            </div>
          </ThemeProvider>
          <div className={styles.table__title}>
            <div className={styles.info__id}>ID</div>
            <div className={styles.info__name} onClick={handleSortByName}>
              Cliente
              <img src={sortArrow} alt='' className={isDescSort ? `${styles.sortArrowUp}` : ''} />
            </div>
            <div className={styles.info__description}>Descrição</div>
            <div>Valor</div>
            <div>Status</div>
            <div>Vencimento</div>
          </div>
          {(currentList.length > 0)
            && ((search.length !== 0)
              ? <div className={styles.cardNoResult}>Sem resultados...</div>
              : currentList.map((bill) => <CardBill key={bill.id} bill={bill} listClients={listClients} />)
            )
          }
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