import Navbar from '../../components/Navbar';
import UserProfile from '../../components/UserProfile';
import styles from './styles.module.scss';

function Billing() {
  return (
    <div className={styles.content__wrapper}>
      <Navbar />
      <div className={styles.main__content}>
        <UserProfile />
        <div className={styles.content}>
          O conteúdo vai aqui!
        </div>
      </div>
    </div>
  );
};

export default Billing;