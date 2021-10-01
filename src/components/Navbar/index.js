import { NavLink } from 'react-router-dom';
import billIcon from '../../assets/billing-icon.svg';
import clientIcon from '../../assets/client-icon.svg';
import homeIcon from '../../assets/home-icon.svg';
import academy from '../../assets/logo-academy-white.svg';
import NavbarItem from '../NavbarItem';
import styles from './styles.module.scss';

function Navbar() {
  return (
    <div className={styles.Navbar__wrapper}>
      <img src={academy} alt='Logo Academy' />
      <NavLink 
        exact to='/home'
        activeClassName={styles.button__active}
        className={styles.navlink}
      >
        <NavbarItem key='Navbar_1' image={homeIcon} title='Home' />
      </NavLink>
      <NavLink
        exact to='/'
        activeClassName={styles.button__active}
        className={styles.navlink}
      >
        <NavbarItem key='Navbar_2' image={billIcon} title='Cobranças' />
      </NavLink>
      <NavLink 
        exact to='/clientes'
        activeClassName={styles.button__active}
        className={styles.navlink}
      >
        <NavbarItem key='Navbar_3' image={clientIcon} title='Clientes' />
      </NavLink>
      <button className={styles.button__addBilling}>
        Criar cobrança
      </button>
    </div>
  );
}

export default Navbar;