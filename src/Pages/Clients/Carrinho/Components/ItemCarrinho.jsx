import React from "react";
import styles from "./ItemCarrinho.module.css";

const ItemCarrinho = ({
  name,
  image,
  value,
  quantity,
  onDelete,
  onIncreaseQuantity,
  onDecreaseQuantity,
}) => {
  return (
    <div className={`${styles.container}`}>
      <div className="col-auto">
        <div className={`${styles.product_card_img_wrapper}`}>
          <img
            src={image}
            alt={`Capa de ${name}`}
            className={styles.product_card_img}
          />
        </div>
      </div>
      <div className="col d-flex flex-column justify-content-center">
        <div className="row-12 h-100 d-flex flex-row align-items-center gap-2 p-2">
          <div className="col h-100 d-flex flex-column justify-content-between">
            <div className={styles.product_name}>{name}</div>
            <div className={`row-auto d-flex gap-2`}>
              <button className="btn" onClick={onDecreaseQuantity}>
                -
              </button>
              {quantity}
              <button className="btn" onClick={onIncreaseQuantity}>
                +
              </button>
            </div>
          </div>
          <div className={styles.product_card_price}>R$ {value}</div>
          <button className="btn btn-danger" onClick={onDelete}>
            Remover
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemCarrinho;
