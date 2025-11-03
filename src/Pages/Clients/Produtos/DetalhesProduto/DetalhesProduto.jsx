import React from "react";
import Card from "../../../../Components/Card/Card";
import styles from "./DetalhesProduto.module.css";
import { useLocation, useNavigate, useParams } from "react-router";
import { usePostData } from "../../../../Hooks/usePostData";

const DetalhesProduto = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const { postApiData } = usePostData();
  const produto = state?.produto;
  const navigate = useNavigate();

  const dadosProduto = {
    id_produto: produto?.id_produto || id || 1,
    nome_produto: produto?.name || "Produto Exemplo",
    url_image:
      produto?.image ||
      "https://5.imimg.com/data5/SELLER/Default/2025/2/489993770/BE/UU/EI/38951135/big-elephant-21inch-soft-stuffed-toy-random-colour-1-05kg-am3146-500x500.webp",
    valor_venda: produto?.price || "89,99",
    descricao: produto?.description || "Descrição do Produto Exemplo",
  };

  const addProdutoCarrinho = async () => {
    try {
      let resposta = {};
      resposta = await postApiData("carrinhos", {
        ...dadosProduto,
        quantidade: 1,
        id_cliente: 1,
      });

      console.log(resposta);
      if (resposta.campos_invalidos) {
        console.log(resposta.campos_invalidos);
        return;
      }
      navigate("/carrinho");
    } catch (error) {
      console.log(error);
    }
  };

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
                  src={dadosProduto.url_image}
                  alt={`Capa de ${dadosProduto.nome_produto}`}
                  className={styles.product_card_img}
                />
              </div>
            </div>
            <div className="col">
              <h2>{dadosProduto.nome_produto}</h2>
              <p>{dadosProduto.descricao}</p>
              <p>Preço: {dadosProduto.valor_venda}</p>
              <button
                data-cy="btn-adicionar-ao-carrinho"
                className="btn btn-inverted"
                onClick={() => addProdutoCarrinho()}
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
