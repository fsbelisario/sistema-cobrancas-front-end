import { useState } from 'react';
import editIcon from '../../assets/edit-icon.svg';
import logoutIcon from '../../assets/logout-icon.svg';
import userIcon from '../../assets/user-icon.svg';
import NavbarItem from '../NavbarItem';
import styles from './styles.module.scss';

function UserProfile() {
  const [isVisible, setIsVisible] = useState(false);

  function handleIsVisible() {
    setIsVisible(!isVisible);
  }

  return (
    <div className={styles.content__wrapper}>
      <button onClick={handleIsVisible}>
        <img src={userIcon} alt='User Avatar' />
      </button>
      {isVisible && 
        <div className={styles.menuProfile}>
          <NavbarItem key='Menu_1' image={editIcon} title='Editar' />
          <NavbarItem key='Menu_2' image={logoutIcon} title='Deslogar' />
        </div>
      }
    </div>
  );
}

export default UserProfile;