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
        <img src={closeIcon} alt='' onClick={handleDetailsClient} />
        <div className={styles.modal__title}>
          <div className={styles.info__name}>
            {thisClient.current.name}
          </div>
          <div>{thisClient.current.tax_id}</div>
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
            <div className={styles.address__info}>
              <div className={styles.inline__info}>
                <div className={styles.block__info}>
                  <h4>CEP</h4>
                  <p>{thisClient.current.zip_code}</p>
                </div>
                <div className={styles.block__info}>
                  <h4>Bairro</h4>
                  <p>{thisClient.current.district}</p>
                </div>
                <div className={styles.block__info}>
                  <h4>Cidade</h4>
                  <p>{`${thisClient.current.city}/${thisClient.current.state}`}</p>
                </div>
              </div>
              <div className={styles.inline__info}>
                <div className={styles.block__info}>
                  <h4>Logradouro</h4>
                  <p>{thisClient.current.street}</p>
                </div>
                <div className={styles.block__info}>
                  <h4>Número</h4>
                  <p>{thisClient.current.number}</p>
                </div>
              </div>
              <div className={styles.inline__info}>
                <div className={styles.block__info}>
                  <h4>Complemento</h4>
                  <p>{thisClient.current.address_details}</p>
                </div>
                <div className={styles.block__info}>
                  <h4>Ponto de Referência</h4>
                  <p>{thisClient.current.reference}</p>
                </div>
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