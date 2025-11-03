import React, { useEffect, useState } from "react";
import Card from "../../../Components/Card/Card";
import Input from "../../../Components/Input/Input";
import ItemCarrinho from "./Components/ItemCarrinho";
import { useNavigate } from "react-router";
import { useGetData } from "../../../Hooks/useGetData";
import { usePostData } from "../../../Hooks/usePostData";
import { usePutData } from "../../../Hooks/usePutData";

const Carrinho = () => {
  const navigate = useNavigate();
  const { getApiData } = useGetData();
  const { postApiData } = usePostData();
  const { putApiData } = usePutData();
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    fetchProdutos();
  }, []);

  const fetchProdutos = async () => {
    const result = await getApiData("carrinhos/1");
    // console.log(result);
    setProdutos(result);
  };

  const removeProdutoCarrinho = async (dadosProduto) => {
    try {
      let resposta = {};
      resposta = await postApiData("carrinhos/delete", {
        produto_id: dadosProduto.produto_id,
        id_cliente: 1,
      });

      console.log(resposta);
      if (resposta.campos_invalidos) {
        console.log(resposta.campos_invalidos);
        return;
      }

      produtos.splice(
        produtos.findIndex(
          (produto) => produto.produto_id === dadosProduto.produto_id
        ),
        1
      );
      setProdutos([...produtos]);
    } catch (error) {
      console.log(error);
    }
  };

  const alteraQuantidadeProduto = async (dadosProduto, novaQuantidade) => {
    try {
      let resposta = {};
      resposta = await putApiData(`carrinhos`, dadosProduto.produto_id, {
        id_produto: dadosProduto.produto_id,
        id_cliente: 1,
        quantidade: novaQuantidade,
        ativo: true,
      });

      if (resposta.campos_invalidos) {
        console.log(resposta.campos_invalidos);
        return;
      }

      const produtoIndex = produtos.findIndex(
        (produto) => produto.produto_id === dadosProduto.produto_id
      );
      if (produtoIndex !== -1) {
        produtos[produtoIndex].quantidade = novaQuantidade;
        setProdutos([...produtos]);
      }
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
        <div className="col py-1 overflow-auto h-100">
          <div className="row gap-2 h-100">
            {/* Carrinho */}
            <div
              className="col-7 p-0 rounded-2 h-100"
              style={{ backgroundColor: "var(--secondary)" }}
            >
              <div
                className="row d-flex justify-content-center"
                style={{ borderBottom: "2px solid var(--primary)" }}
              >
                Carrinho
              </div>
              <div className="row d-flex justify-content-center">
                {produtos.map((produto, index) => (
                  <ItemCarrinho
                    key={index}
                    name={produto.nome_produto}
                    image={produto.url_imagem}
                    value={(produto.valor_venda * produto.quantidade).toFixed(
                      2
                    )}
                    quantity={produto.quantidade}
                    onDelete={() => removeProdutoCarrinho(produto)}
                    onIncreaseQuantity={() => {
                      if (produto.quantidade < 99)
                        alteraQuantidadeProduto(
                          produto,
                          produto.quantidade + 1
                        );
                    }}
                    onDecreaseQuantity={() => {
                      if (produto.quantidade > 1)
                        alteraQuantidadeProduto(
                          produto,
                          produto.quantidade - 1
                        );
                    }}
                  />
                ))}
              </div>
            </div>
            {/* Resumo */}
            <div
              className="col p-0 rounded-2"
              style={{
                backgroundColor: "var(--secondary)",
                height: "fit-content",
              }}
            >
              <div
                className="row d-flex justify-content-center"
                style={{ borderBottom: "2px solid var(--primary)" }}
              >
                Resumo
              </div>
              {/* <div
                className="row d-flex justify-content-center"
                style={{ borderBottom: "2px solid var(--primary)" }}
              >
                <div className="row d-flex justify-content-between px-2 py-2">
                  <div className="col-auto p-0 pe-2">Cupom de Desconto</div>
                  <div className="col d-flex gap-2">
                    <Input />
                    <button className="btn btn-outline">Aplicar</button>
                  </div>
                </div>
                Cupom de Desconto
              </div> */}
              <div className="row d-flex justify-content-center">
                <div className="row d-flex justify-content-between px-2 py-1">
                  <div className="col">Subtotal</div>
                  <div className="col-auto p-0">
                    R${" "}
                    {produtos
                      .reduce(
                        (acc, produto) =>
                          acc + produto.valor_venda * produto.quantidade,
                        0
                      )
                      .toFixed(2)}
                  </div>
                </div>
                <div className="row d-flex justify-content-between px-2 py-1">
                  <div className="col">Desconto</div>
                  <div className="col-auto p-0">R$ 0,00</div>
                </div>
                <div className="row d-flex justify-content-between px-2 py-1">
                  <div className="col">Total</div>
                  <div className="col-auto p-0">
                    R${" "}
                    {produtos
                      .reduce(
                        (acc, produto) =>
                          acc + produto.valor_venda * produto.quantidade,
                        0
                      )
                      .toFixed(2)}
                  </div>
                </div>
                <div className="row-auto d-flex justify-content-center p-2">
                  <button
                    data-cy="btn-continuar-pagamento"
                    className={`btn ${
                      produtos.length <= 0 ? "btn-disabled" : ""
                    }`}
                    onClick={() => {
                      if (produtos.length <= 0) return;
                      navigate("/checkout");
                    }}
                  >
                    Continuar para Pagamento
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Carrinho;
