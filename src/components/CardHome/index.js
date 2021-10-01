import styles from './styles.module.scss';

function CardHome({ icon, title , CardHomeItem }) {
  return(
    <div className={styles.card__wrapper}>
      <header>
        <img src={icon} alt='' />
        <p>{title}</p>
      </header>
      <main>
        {CardHomeItem}
      </main>
    </div>
  );
}

export default CardHome;