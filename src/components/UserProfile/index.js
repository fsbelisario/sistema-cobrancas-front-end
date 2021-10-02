import {
  useContext,
  useState,
  useEffect
} from 'react';
import { useHistory } from 'react-router-dom';
import editIcon from '../../assets/edit-icon.svg';
import logoutIcon from '../../assets/logout-icon.svg';
import userIcon from '../../assets/user-icon.svg';
import AuthContext from '../../contexts/AuthContext';
import EditUserProfile from '../EditUserProfile';
import NavbarItem from '../NavbarItem';
import styles from './styles.module.scss';

function UserProfile() {
  const [isVisible, setIsVisible] = useState(false);
  const [editProfile, setEditProfile] = useState(false);
  const [user, setUser] = useState();

  const history = useHistory();

  const { token, setToken } = useContext(AuthContext);

  useEffect(() => {
    setToken(localStorage.getItem('token'));

    if(!token) {
      history.push('/');
      return;
    }
    
    async function getProfile() {
      const response = await fetch('http://localhost:3003/profile', {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
  
      const requestData = await response.json();
      setUser(requestData);
    }

    getProfile();
  }, [token, setToken, history]);

  function handleIsVisible() {
    setIsVisible(!isVisible);
    setEditProfile(false);
  };

  function handleEditProfile() {
    setEditProfile(!editProfile);
    setIsVisible(!isVisible);
  };

  function handleLogout() {
    setUser('');
    setToken('');
    localStorage.clear();
    history.push('/');
  };

  return (
    <div className={styles.content__wrapper}>
      <button onClick={handleIsVisible}>
        <img src={userIcon} alt='User Avatar' />
      </button>
      {isVisible &&
        <div className={styles.menuProfile}>
          <NavbarItem
            key='Menu_1'
            image={editIcon}
            title='Editar'
            onClick={handleEditProfile}
          />
          <NavbarItem
            key='Menu_2'
            image={logoutIcon}
            title='Deslogar'
            onClick={handleLogout}
          />
        </div>
      }
      {editProfile && <EditUserProfile user={user} />}
    </div>
  );
};

export default UserProfile;