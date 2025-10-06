import React from "react";
import Card from "../../../../Components/Card/Card";
import styles from "./DetalhesProduto.module.css";
import { useLocation, useNavigate, useParams } from "react-router";

const DetalhesProduto = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const produto = state?.produto;
  const navigate = useNavigate();

  const name = produto?.name || "Produto Exemplo";
  const image =
    produto?.image ||
    "https://5.imimg.com/data5/SELLER/Default/2025/2/489993770/BE/UU/EI/38951135/big-elephant-21inch-soft-stuffed-toy-random-colour-1-05kg-am3146-500x500.webp";
  const price = produto?.price || "89,99";

  return (
    <div
      className="container-fluid px-2 d-flex flex-column"
      style={{ height: "calc(100vh - 82px)" }}
    >
      <Card>
        <div className="col overflow-auto h-100">
          <div className="row py-1 gap-2">
            <div className="col">
              <div
                className="row h-50 p-2 rounded-1 d-flex justify-content-center align-items-center"
                style={{ backgroundColor: "var(--secondary)" }}
              >
                <img
                  src={image}
                  alt={`Capa de ${name}`}
                  className={styles.product_card_img}
                />
              </div>
            </div>
            <div className="col">
              <h2>{name}</h2>
              <p>Preço: {price}</p>
              <button
                className="btn btn-inverted"
                onClick={() => navigate("/carrinho")}
              >
                Adicionar ao Carrinho
              </button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DetalhesProduto;
