/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import styles from "./ListagemProdutos.module.css";
import Card from "../../../Components/Card/Card";
import ProductCard from "../../../Components/ProductCard/ProductCard";
import { useNavigate } from "react-router";
import { useGetData } from "../../../Hooks/useGetData";

const ListagemProdutos = () => {
  const navigate = useNavigate();
  const { getApiData } = useGetData();
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    fetchProdutos();
  }, []);

  const fetchProdutos = async () => {
    const result = await getApiData("produtos");
    console.log(result);
    setProdutos(result);
  };

  return (
    <div
      className="container-fluid px-2 d-flex flex-column"
      style={{ height: "calc(100vh - 82px)" }}
    >
      <Card cardName={"Produtos"}>
        <div className="col overflow-auto h-100">
          <div className={styles.product_grid}>
            {produtos.map((produto, index) => {
              if (produto.ativo)
                return (
                  <ProductCard
                    dataCy={`card-produto-${index}`}
                    key={index}
                    onClick={() =>
                      navigate(`/detalhes-produto/${produto.id}`, {
                        state: {
                          produto: {
                            id_produto: produto.id,
                            name: produto.nome_produto,
                            price: produto.valor_venda,
                            imagens: produto.imagens,
                            description: produto.descricao,
                          },
                        },
                      })
                    }
                    name={produto.nome_produto}
                    image={
                      produto.imagens?.find((imagem) => imagem.principal)
                        ?.url_imagem
                    }
                    price={produto.valor_venda}
                  />
                );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ListagemProdutos;
