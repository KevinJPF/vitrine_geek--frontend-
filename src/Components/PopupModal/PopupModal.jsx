import ReactDOM from "react-dom";
import styles from "./PopupModal.module.css";
const PopupModal = ({ isOpen, children, title, onCancel, onConfirm }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className={styles.modal_overlay} id="modal-popup">
      <div className={styles.modal}>
        <div className={styles.modal_header}>{title}</div>
        <div className={styles.modal_body}>
          <div className={styles.modal_content}>{children}</div>
        </div>
        <div className={styles.buttons_container}>
          {onCancel && (
            <button className="btn btn-outline" onClick={onCancel}>
              Cancelar
            </button>
          )}
          {onConfirm && (
            <button className="btn" onClick={onConfirm}>
              Confirmar
            </button>
          )}
        </div>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
};

export default PopupModal;
