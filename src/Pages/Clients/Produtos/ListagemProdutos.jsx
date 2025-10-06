import React from "react";
import Card from "../../../Components/Card/Card";
import ProductCard from "../../../Components/ProductCard/ProductCard";
import styles from "./ListagemProdutos.module.css";
import { useNavigate } from "react-router";

const ListagemProdutos = () => {
  const navigate = useNavigate();

  return (
    <div
      className="container-fluid px-2 d-flex flex-column"
      style={{ height: "calc(100vh - 82px)" }}
    >
      <Card cardName={"Produtos"}>
        <div className="col overflow-auto h-100">
          <div className={styles.product_grid}>
            {Array.from({ length: 12 }).map((_, index) => (
              <ProductCard
                key={index}
                onClick={() =>
                  navigate(`/detalhes-produto/${index}`, {
                    state: {
                      produto: {
                        name: "Zorua de Hisui",
                        price: "89,99",
                        image: "https://i.redd.it/um1dcq0lsl191.jpg",
                      },
                    },
                  })
                }
                name="Zorua de Hisui"
                image="https://i.redd.it/um1dcq0lsl191.jpg"
                price={"89,99"}
              />
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ListagemProdutos;
