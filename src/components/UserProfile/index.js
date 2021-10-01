import {
  useContext,
  useState
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

  const history = useHistory();
  
  const { setToken } = useContext(AuthContext);

  function handleIsVisible() {
    setIsVisible(!isVisible);
    setEditProfile(false);
  }

  function handleEditProfile() {
    setEditProfile(!editProfile);
    setIsVisible(!isVisible);
  }

  function handleLogout() {
    setToken('');
    localStorage.clear();
    history.push('/');
  }

  console.log(localStorage);

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
      {editProfile && <EditUserProfile />}
    </div>
  );
}

export default UserProfile;