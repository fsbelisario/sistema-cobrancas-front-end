import billIcon from '../../assets/billing-icon.svg';
import clientIcon from '../../assets/client-icon.svg';
import homeIcon from '../../assets/home-icon.svg';
import academy from '../../assets/logo-academy-white.svg';
import styles from './styles.module.scss';


function Navbar() {
  const menuItems = [
    {
      image: homeIcon,
      text: 'Home',
      url: '/home'
    },
    {
      image: billIcon,
      text: 'Cobranças',
      url: '#'
    },
    {
      image: clientIcon,
      text: 'Clientes',
      url: '#'
    },
  ]

  return (
    <div className={styles.Navbar__wrapper}>
      <img src={academy} alt='Logo Academy' />
      {menuItems.map((item) => {
        return(
          <button>
            <img src={item.image} alt='' />
            <p>{item.text}</p>
          </button>
        )
      })}
      <button className={styles.button__addBilling}>
        Criar cobrança
      </button>
    </div>
  );
}

export default Navbar;