import styles from './styles.module.scss';

function CardHomeItem({ className, onClick, title, number }) {
  return (
    <div className={`${styles.item} ${className}`} onClick={onClick}>
      <p>{title}</p>
      <div>{number}</div>
    </div>
  );
};

export default CardHomeItem;