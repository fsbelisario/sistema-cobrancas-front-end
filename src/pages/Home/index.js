import billIcon from '../../assets/card-billing-icon.svg';
import clientIcon from '../../assets/card-client-icon.svg';
import CardHome from '../../components/CardHome';
import CardHomeItem from '../../components/CardHomeItem';
import Navbar from '../../components/Navbar';
import styles from './styles.module.scss';

function Home() {

  return (
    <div className={styles.content__wrapper}>
      <Navbar />
      <div className={styles.main__content}>
        <div className={styles.cards}>
          <CardHome 
            icon={clientIcon}
            title='Clientes'
            CardHomeItem={[
              <CardHomeItem className={styles.item__red} title='Inadimplentes' number='0' />,
              <CardHomeItem className={styles.item__green} title='Em dia' number='0' />
            ]}
          />
          <CardHome 
            icon={billIcon}
            title='Cobranças'
            CardHomeItem={[
              <CardHomeItem className={styles.item__blue} title='Previstas' number='0' />,
              <CardHomeItem className={styles.item__red} title='Vencidas' number='0' />,
              <CardHomeItem className={styles.item__green} title='Pagas' number='0' />
            ]}
          />
        </div>
      </div>
    </div>
  );
}

export default Home;