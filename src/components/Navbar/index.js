import billIcon from '../../assets/billing-icon.svg';
import clientIcon from '../../assets/client-icon.svg';
import homeIcon from '../../assets/home-icon.svg';
import academy from '../../assets/logo-academy-white.svg';
import styles from './styles.module.scss';

const items = [
  {
    image: homeIcon,
    text: 'Home'
  },
  {
    image: billIcon,
    text: 'Cobranças'
  },
  {
    image: clientIcon,
    text: 'Clientes'
  },
];

function Navbar() {
  return (
    <div className={styles.Navbar__wrapper}>
      <img src={academy} alt='Logo Academy' />
      {items.map((item, index) => (
        <button
          key={`NavbarItem ${index}`}
          value={index}
        >
          <img src={item.image} alt='' />
          <p>{item.text}</p>
        </button>
      ))}
      <button className={styles.button__addBilling}>
        Criar cobrança
      </button>
    </div>
  );
}

export default Navbar;