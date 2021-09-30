import styles from './styles.module.scss';

function CardHome(image, title, body) {
  return(
    <div className={styles.card__wrapper}>
      <header>
        <img src={image} alt='' />
        <p>{title}</p>
      </header>
      <div>
        {body}
      </div>
    </div>
  );
}

export default CardHome;