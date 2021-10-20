import { useState } from 'react';
import editIcon from '../../assets/edit-client-icon.svg';
import emailIcon from '../../assets/email-icon.svg';
import phoneIcon from '../../assets/phone-icon.svg';
import ModalDetailsClient from '../ModalDetailsClient';
import ModalEditClient from '../ModalEditClient';
import styles from './styles.module.scss';

function CardClient({ client }) {
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);

  function formatPhone(phone) {
    return `(${phone.substr(0, 2)})${phone.substr(2, 5)}-${phone.substr(7)}`;
  };

  function handleEditClient() {
    setOpenEditModal(true);
  };

  function handleDetailsClient() {
    setOpenDetailsModal(true);
  };

  return (
    <div className={styles.card__wrapper}>
      <div className={styles.info__client}>
        <div className={styles.client__name} onClick={handleDetailsClient}>
          {client.name}
        </div>
        <div>
          <img src={emailIcon} alt='' />
          <div>{client.email}</div>
        </div>
        <div>
          <img src={phoneIcon} alt='' />
          <div>{formatPhone(client.phone)}</div>
        </div>
      </div>
      <div className={styles.info__billing}>
        <div className={styles.charges__made}>
          {Number((client.billings / 100)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </div>
        <div className={styles.charges__received}>
          {Number((client.payments / 100)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </div>
        <div className={client.status === 'EM DIA'
          ? `${styles.status} ${styles.text__green}`
          : `${styles.status} ${styles.text__red}`}
        >
          {client.status}
        </div>
      </div>
      <button
        className={styles.edit__button}
        onClick={handleEditClient}
      >
        <img src={editIcon} alt='' />
      </button>
      <ModalEditClient
        client={client}
        openEditModal={openEditModal}
        setOpenEditModal={setOpenEditModal}
      />
      <ModalDetailsClient
        client={client}
        openDetailsModal={openDetailsModal}
        setOpenDetailsModal={setOpenDetailsModal} />
    </div>
  );
};

export default CardClient;