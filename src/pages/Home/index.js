import Navbar from '../../components/Navbar';
import styles from './styles.module.scss';

function Home() {

  return (
    <div className={styles.content__wrapper}>
      <Navbar />
    </div>
  );
}

export default Home;