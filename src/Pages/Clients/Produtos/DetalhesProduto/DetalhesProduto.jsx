import React, { useEffect, useState } from "react";
import Card from "../../../../Components/Card/Card";
import styles from "./DetalhesProduto.module.css";
import { useLocation, useNavigate, useParams } from "react-router";
import { usePostData } from "../../../../Hooks/usePostData";
import { useGetData } from "../../../../Hooks/useGetData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBox,
  faRuler,
  faWeight,
  faBarcode,
  faCalendar,
  faTag,
  faShoppingCart,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

const DetalhesProduto = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const { getApiData } = useGetData();
  const { postApiData } = usePostData();
  const produto = state?.produto;
  const navigate = useNavigate();

  const [dadosProduto, setDadosProduto] = useState(null);
  const [imagemAtual, setImagemAtual] = useState(0);
  const [quantidade, setQuantidade] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setLoading(true);
      getApiData(`produtos/${id}`)
        .then((data) => {
          console.log(data);
          if (data.message) {
            navigate("/produtos");
          } else {
            setDadosProduto(data);
          }
        })
        .finally(() => setLoading(false));
    } else if (produto) {
      setDadosProduto(produto);
      setLoading(false);
    }
  }, [id]);

  const addProdutoCarrinho = async () => {
    try {
      const resposta = await postApiData("carrinhos", {
        id_produto: dadosProduto.id,
        quantidade: quantidade,
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

  const proximaImagem = () => {
    if (dadosProduto?.imagens) {
      setImagemAtual((prev) =>
        prev === dadosProduto.imagens.length - 1 ? 0 : prev + 1
      );
    }
  };

  const imagemAnterior = () => {
    if (dadosProduto?.imagens) {
      setImagemAtual((prev) =>
        prev === 0 ? dadosProduto.imagens.length - 1 : prev - 1
      );
    }
  };

  if (loading) {
    return (
      <div
        className="container-fluid px-2 d-flex flex-column justify-content-center align-items-center"
        style={{ height: "calc(100vh - 82px)" }}
      >
        <p style={{ color: "var(--highlight)" }}>Carregando produto...</p>
      </div>
    );
  }

  if (!dadosProduto) {
    return (
      <div
        className="container-fluid px-2 d-flex flex-column justify-content-center align-items-center"
        style={{ height: "calc(100vh - 82px)" }}
      >
        <p style={{ color: "var(--red)" }}>Produto não encontrado</p>
        <button className="btn" onClick={() => navigate("/produtos")}>
          Voltar para Produtos
        </button>
      </div>
    );
  }

  const imagemPrincipal =
    dadosProduto.imagens && dadosProduto.imagens.length > 0
      ? dadosProduto.imagens[imagemAtual].url_imagem
      : "https://via.placeholder.com/400x400?text=Sem+Imagem";

  return (
    <div
      className="container-fluid px-2 d-flex flex-column"
      style={{ height: "calc(100vh - 82px)" }}
    >
      <Card>
        <div className="col overflow-auto h-100">
          <div className="row py-3 px-3 gap-4">
            {/* Coluna da Imagem */}
            <div className="col-12 col-lg-5">
              <div className="position-relative">
                <div
                  className="rounded-3 d-flex justify-content-center align-items-center overflow-hidden"
                  style={{
                    backgroundColor: "var(--secondary)",
                    minHeight: "400px",
                    maxHeight: "500px",
                  }}
                >
                  <img
                    src={imagemPrincipal}
                    alt={`${dadosProduto.nome_produto}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      padding: "20px",
                    }}
                  />
                </div>

                {/* Controles de navegação de imagens */}
                {dadosProduto.imagens && dadosProduto.imagens.length > 1 && (
                  <>
                    <button
                      onClick={imagemAnterior}
                      className="btn btn-sm position-absolute top-50 start-0 translate-middle-y ms-2"
                      style={{
                        backgroundColor: "rgba(0,0,0,0.5)",
                        color: "white",
                        border: "none",
                      }}
                    >
                      <FontAwesomeIcon icon={faChevronLeft} />
                    </button>
                    <button
                      onClick={proximaImagem}
                      className="btn btn-sm position-absolute top-50 end-0 translate-middle-y me-2"
                      style={{
                        backgroundColor: "rgba(0,0,0,0.5)",
                        color: "white",
                        border: "none",
                      }}
                    >
                      <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                    <div
                      className="position-absolute bottom-0 start-50 translate-middle-x mb-2"
                      style={{
                        backgroundColor: "rgba(0,0,0,0.5)",
                        padding: "5px 10px",
                        borderRadius: "10px",
                        color: "white",
                        fontSize: "0.8em",
                      }}
                    >
                      {imagemAtual + 1} / {dadosProduto.imagens.length}
                    </div>
                  </>
                )}
              </div>

              {/* Miniaturas */}
              {dadosProduto.imagens && dadosProduto.imagens.length > 1 && (
                <div className="d-flex gap-2 mt-3 overflow-auto">
                  {dadosProduto.imagens.map((imagem, index) => (
                    <div
                      key={imagem.id}
                      onClick={() => setImagemAtual(index)}
                      className="rounded-2 overflow-hidden"
                      style={{
                        minWidth: "80px",
                        width: "80px",
                        height: "80px",
                        backgroundColor: "var(--secondary)",
                        cursor: "pointer",
                        border:
                          imagemAtual === index
                            ? "3px solid var(--highlight)"
                            : "3px solid transparent",
                      }}
                    >
                      <img
                        src={imagem.url_imagem}
                        alt={`Miniatura ${index + 1}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Coluna das Informações */}
            <div className="col-12 col-lg-6">
              {/* Código e Disponibilidade */}
              <div className="d-flex justify-content-between align-items-start mb-2">
                <span
                  className="badge"
                  style={{
                    backgroundColor: "var(--secondary)",
                    color: "var(--white)",
                    fontSize: "0.9em",
                  }}
                >
                  Cód: {dadosProduto.codigo}
                </span>
                <span
                  className="badge"
                  style={{
                    backgroundColor:
                      dadosProduto.quantidade_disponivel > 0
                        ? "var(--green)"
                        : "var(--red)",
                    color: "var(--white)",
                    fontSize: "0.9em",
                  }}
                >
                  {dadosProduto.quantidade_disponivel > 0
                    ? `${dadosProduto.quantidade_disponivel} em estoque`
                    : "Indisponível"}
                </span>
              </div>

              {/* Nome do Produto */}
              <h2 style={{ color: "var(--highlight)", marginBottom: "10px" }}>
                {dadosProduto.nome_produto}
              </h2>

              {/* Categorias */}
              {dadosProduto.categorias &&
                dadosProduto.categorias.length > 0 && (
                  <div className="mb-3">
                    {dadosProduto.categorias.map((categoria) => (
                      <span
                        key={categoria.id}
                        className="badge me-2"
                        style={{
                          backgroundColor: "var(--highlight)",
                          color: "var(--secondary)",
                          fontSize: "0.85em",
                        }}
                      >
                        <FontAwesomeIcon icon={faTag} className="me-1" />
                        {categoria.nome}
                      </span>
                    ))}
                  </div>
                )}

              {/* Descrição */}
              <p
                style={{
                  color: "var(--secondary)",
                  fontSize: "1em",
                  lineHeight: "1.6",
                  marginBottom: "20px",
                }}
              >
                {dadosProduto.descricao}
              </p>

              {/* Preço */}
              <div className="mb-4">
                <span style={{ color: "var(--secondary)", fontSize: "0.9em" }}>
                  Preço:
                </span>
                <h3 style={{ color: "var(--green)", margin: "5px 0" }}>
                  R$ {parseFloat(dadosProduto.valor_venda).toFixed(2)}
                </h3>
              </div>

              {/* Informações Técnicas */}
              <div
                className="rounded-3 p-3 mb-4"
                style={{
                  backgroundColor: "rgba(0,0,0,0.05)",
                  border: "1px solid var(--secondary)",
                }}
              >
                <h5
                  style={{
                    color: "var(--highlight)",
                    marginBottom: "15px",
                    fontSize: "1em",
                  }}
                >
                  Informações Técnicas
                </h5>
                <div className="row g-3">
                  {dadosProduto.codigo_barras && (
                    <div className="col-6">
                      <div className="d-flex align-items-center gap-2">
                        <FontAwesomeIcon
                          icon={faBarcode}
                          style={{ color: "var(--secondary)" }}
                        />
                        <div>
                          <small style={{ color: "var(--secondary)" }}>
                            Código de Barras
                          </small>
                          <div style={{ fontWeight: "600" }}>
                            {dadosProduto.codigo_barras}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {dadosProduto.ano_lancamento && (
                    <div className="col-6">
                      <div className="d-flex align-items-center gap-2">
                        <FontAwesomeIcon
                          icon={faCalendar}
                          style={{ color: "var(--secondary)" }}
                        />
                        <div>
                          <small style={{ color: "var(--secondary)" }}>
                            Ano de Lançamento
                          </small>
                          <div style={{ fontWeight: "600" }}>
                            {dadosProduto.ano_lancamento}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {dadosProduto.peso && (
                    <div className="col-6">
                      <div className="d-flex align-items-center gap-2">
                        <FontAwesomeIcon
                          icon={faWeight}
                          style={{ color: "var(--secondary)" }}
                        />
                        <div>
                          <small style={{ color: "var(--secondary)" }}>
                            Peso
                          </small>
                          <div style={{ fontWeight: "600" }}>
                            {dadosProduto.peso}g
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {dadosProduto.altura &&
                    dadosProduto.largura &&
                    dadosProduto.profundidade && (
                      <div className="col-6">
                        <div className="d-flex align-items-center gap-2">
                          <FontAwesomeIcon
                            icon={faRuler}
                            style={{ color: "var(--secondary)" }}
                          />
                          <div>
                            <small style={{ color: "var(--secondary)" }}>
                              Dimensões (A x L x P)
                            </small>
                            <div style={{ fontWeight: "600" }}>
                              {dadosProduto.altura} x {dadosProduto.largura} x{" "}
                              {dadosProduto.profundidade} cm
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                </div>
              </div>

              {/* Quantidade e Adicionar ao Carrinho */}
              {dadosProduto.quantidade_disponivel > 0 && (
                <div className="d-flex gap-3 align-items-center">
                  <div>
                    <label
                      style={{
                        color: "var(--secondary)",
                        fontSize: "0.9em",
                        marginBottom: "5px",
                        display: "block",
                      }}
                    >
                      Quantidade:
                    </label>
                    <div className="d-flex align-items-center gap-2">
                      <button
                        className="btn btn-sm"
                        onClick={() =>
                          setQuantidade(Math.max(1, quantidade - 1))
                        }
                        style={{ minWidth: "40px" }}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={quantidade}
                        onChange={(e) =>
                          setQuantidade(
                            Math.max(
                              1,
                              Math.min(
                                dadosProduto.quantidade_disponivel,
                                parseInt(e.target.value) || 1
                              )
                            )
                          )
                        }
                        min="1"
                        max={dadosProduto.quantidade_disponivel}
                        style={{
                          width: "60px",
                          textAlign: "center",
                          border: "2px solid var(--secondary)",
                          borderRadius: "4px",
                          padding: "5px",
                        }}
                      />
                      <button
                        className="btn btn-sm"
                        onClick={() =>
                          setQuantidade(
                            Math.min(
                              dadosProduto.quantidade_disponivel,
                              quantidade + 1
                            )
                          )
                        }
                        style={{ minWidth: "40px" }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex-grow-1">
                    <label
                      style={{
                        color: "transparent",
                        fontSize: "0.9em",
                        marginBottom: "5px",
                        display: "block",
                      }}
                    >
                      .
                    </label>
                    <button
                      data-cy="btn-adicionar-ao-carrinho"
                      className="btn btn-inverted w-100"
                      onClick={() => addProdutoCarrinho()}
                      style={{ padding: "10px 20px" }}
                    >
                      <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
                      Adicionar ao Carrinho
                    </button>
                  </div>
                </div>
              )}

              {dadosProduto.quantidade_disponivel <= 0 && (
                <div
                  className="alert alert-warning"
                  style={{
                    backgroundColor: "rgba(255, 193, 7, 0.1)",
                    border: "1px solid var(--red)",
                    color: "var(--red)",
                  }}
                >
                  <FontAwesomeIcon icon={faBox} className="me-2" />
                  Produto indisponível no momento
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DetalhesProduto;
