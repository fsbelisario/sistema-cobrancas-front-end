import {
  Modal
} from '@mui/material';
import { useRef, useState } from 'react';
import closeIcon from '../../assets/close-icon.svg';
import emailIcon from '../../assets/email-icon.svg';
import phoneIcon from '../../assets/phone-icon.svg';
import styles from './styles.module.scss';

function ModalDetailsClient({ client }) {
  const [openModal, setOpenModal] = useState(true);

  const thisClient = useRef();
  thisClient.current = client;

  function handleDetailsClient() {
    setOpenModal(!openModal);
  }

  return(
    <Modal
      open={openModal}
      onClose={handleDetailsClient}
      className={styles.modal__wrapper}
    >
      <div className={styles.content__wrapper}>
        <div className={styles.modal__title}>
          <div>
            <div>{thisClient.current.name}</div>
            <div>{thisClient.current.tax_id}</div>
          </div>
          <img src={closeIcon} alt='' onClick={handleDetailsClient} />
        </div>
        <div className={styles.modal__content}>
          <div className={styles.modal__info__client}>
          <div className={styles.main__info__client}>
            <div>
                <img src={emailIcon} alt='' />
                <div>{thisClient.current.email}</div>
            </div>
            <div>
                <img src={phoneIcon} alt='' />
                <div>{thisClient.current.phone}</div>
            </div>
          </div>
          </div>
          <div className={styles.modal__info__billing}>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default ModalDetailsClient;