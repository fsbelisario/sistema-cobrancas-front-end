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
      <NavbarItem key='Navbar_1' image={homeIcon} title='Home' />
      <NavbarItem key='Navbar_2' image={billIcon} title='Cobranças' />
      <NavbarItem key='Navbar_3' image={clientIcon} title='Clientes' />
      <button className={styles.button__addBilling}>
        Criar cobrança
      </button>
    </div>
  );
}

export default Navbar;