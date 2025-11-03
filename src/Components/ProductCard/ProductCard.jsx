import React from "react";
import styles from "./ProductCard.module.css";

const ProductCard = ({ name, image, price, onClick, dataCy }) => {
  return (
    <div className={styles.product_card} onClick={onClick} data-cy={dataCy}>
      <div className={styles.product_card_img_wrapper}>
        <img
          src={image}
          alt={`Capa de ${name}`}
          className={styles.product_card_img}
        />
        <div className={styles.product_card_price}>R$ {price}</div>
      </div>
      <div className={styles.product_card_title}>{name}</div>
    </div>
  );
};

export default ProductCard;
