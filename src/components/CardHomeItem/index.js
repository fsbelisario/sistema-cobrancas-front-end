import styles from './styles.module.scss';

function CardHomeItem({ className, title, number }) {
  return (
    <div className={`${styles.item} ${className}`}>
      <p>{title}</p>
      <div>{number}</div>
    </div>
  );
};

export default CardHomeItem;