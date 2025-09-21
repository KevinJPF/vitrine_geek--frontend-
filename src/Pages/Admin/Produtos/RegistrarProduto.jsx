import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import styles from "./Produtos.module.css";
import Input, { MasksEnum } from "../../../Components/Input/Input";
import PopupModal from "../../../Components/PopupModal/PopupModal";
import SwitchButton from "../../../Components/SwitchButton/SwitchButton";
import useValidation from "../../../Hooks/useValidation";
import Dropdown from "react-bootstrap/Dropdown";
import Alert from "react-bootstrap/Alert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faImage } from "@fortawesome/free-solid-svg-icons";

const RegistrarProduto = () => {
  // #region Variaveis
  const navigate = useNavigate();

  const { validateRequired } = useValidation();

  const { state } = useLocation();
  const produto = state?.produto; // produto passado pela tela de listagem

  const [dadosProduto, setDadosProduto] = useState({
    nome: (produto && produto.nome) ?? "",
    categoria: (produto && produto.categoria) ?? "",
    preco: (produto && produto.preco) ?? "",
    descricao: (produto && produto.descricao) ?? "",
    codigoBarras: (produto && produto.codigoBarras) ?? "",
    grupoPrecificacao: (produto && produto.grupoPrecificacao) ?? "",
    ativo: (produto && produto.ativo) ?? true,
    imagens: (produto && produto.imagens) ?? [
      {
        nome: "Imagem Principal",
        url: "https://via.placeholder.com/300x200",
        isPrincipal: true,
      },
    ],
    opcoes: (produto && produto.opcoes) ?? [
      {
        nome: "Tamanho",
        opcoes: ["P", "M", "G"],
        obrigatoria: true,
      },
    ],
  });

  const [novaImagem, setNovaImagem] = useState({
    nome: "",
    url: "",
    isPrincipal: false,
  });

  const [novaOpcao, setNovaOpcao] = useState({
    nome: "",
    opcoes: [],
    obrigatoria: false,
  });

  const [novaOpcaoItem, setNovaOpcaoItem] = useState("");

  const [validacaoCampos, setValidacaoCampos] = useState({
    nome: null,
    categoria: null,
    preco: null,
    descricao: null,
    codigoBarras: null,
    grupoPrecificacao: null,
    imagem: {},
    opcao: {},
  });

  const [mostrarPopupImagens, setMostrarPopupImagens] = useState(false);
  const [mostrarPopupOpcoes, setMostrarPopupOpcoes] = useState(false);
  const [mostrarAlertaErro, setMostrarAlertaErro] = useState(false);

  const categoriasProduto = [
    "Roupas",
    "Calçados",
    "Acessórios",
    "Eletrônicos",
    "Casa",
    "Esporte",
  ];
  const gruposPrecificacao = ["Básico", "Premium", "Promocional", "Sazonal"];
  // #endregion

  // #region Funcoes
  const validarTodosCamposImagem = async () => {
    let isInvalido = false;
    let camposInvalidos = { ...validacaoCampos };

    if (!novaImagem.nome || !validateRequired(novaImagem.nome)) {
      camposInvalidos.imagem.nome = false;
      isInvalido = true;
    }
    if (!novaImagem.url || !validateRequired(novaImagem.url)) {
      camposInvalidos.imagem.url = false;
      isInvalido = true;
    }

    setValidacaoCampos(camposInvalidos);
    return !isInvalido;
  };

  const salvarImagem = async () => {
    if (await validarTodosCamposImagem()) {
      if (novaImagem.index !== null && novaImagem.index !== undefined) {
        setDadosProduto((prev) => {
          const updatedImagens = [...(prev.imagens || [])];
          updatedImagens[novaImagem.index] = novaImagem;

          return {
            ...prev,
            imagens: updatedImagens,
          };
        });
      } else {
        setDadosProduto({
          ...dadosProduto,
          imagens: [...dadosProduto.imagens, novaImagem],
        });
      }
      setMostrarPopupImagens(false);
    }
  };

  const validarTodosCamposOpcao = async () => {
    let isInvalido = false;
    let camposInvalidos = { ...validacaoCampos };

    if (!novaOpcao.nome || !validateRequired(novaOpcao.nome)) {
      camposInvalidos.opcao.nome = false;
      isInvalido = true;
    }
    if (novaOpcao.opcoes.length === 0) {
      camposInvalidos.opcao.opcoes = false;
      isInvalido = true;
    }

    setValidacaoCampos(camposInvalidos);
    return !isInvalido;
  };

  const salvarOpcao = async () => {
    if (await validarTodosCamposOpcao()) {
      if (novaOpcao.index !== null && novaOpcao.index !== undefined) {
        setDadosProduto((prev) => {
          const updatedOpcoes = [...(prev.opcoes || [])];
          updatedOpcoes[novaOpcao.index] = novaOpcao;

          return {
            ...prev,
            opcoes: updatedOpcoes,
          };
        });
      } else {
        setDadosProduto({
          ...dadosProduto,
          opcoes: [...dadosProduto.opcoes, novaOpcao],
        });
      }
      setMostrarPopupOpcoes(false);
    }
  };

  const validarTodosCamposProduto = async () => {
    let isInvalido = false;
    let camposInvalidos = { ...validacaoCampos };

    if (!validateRequired(dadosProduto.nome)) {
      camposInvalidos.nome = false;
      isInvalido = true;
    }
    if (!validateRequired(dadosProduto.categoria)) {
      camposInvalidos.categoria = false;
      isInvalido = true;
    }
    if (!validateRequired(dadosProduto.preco)) {
      camposInvalidos.preco = false;
      isInvalido = true;
    }
    if (!validateRequired(dadosProduto.descricao)) {
      camposInvalidos.descricao = false;
      isInvalido = true;
    }
    if (!validateRequired(dadosProduto.codigoBarras)) {
      camposInvalidos.codigoBarras = false;
      isInvalido = true;
    }
    if (!validateRequired(dadosProduto.grupoPrecificacao)) {
      camposInvalidos.grupoPrecificacao = false;
      isInvalido = true;
    }
    if (dadosProduto.imagens.length <= 0) {
      camposInvalidos.imagem = false;
      isInvalido = true;
    }

    setValidacaoCampos(camposInvalidos);
    return !isInvalido;
  };

  const salvarProduto = async () => {
    if (await validarTodosCamposProduto()) {
      localStorage.setItem(
        state?.produto ? "editProduto" : "novoProduto",
        JSON.stringify(dadosProduto)
      );
      navigate("/admin/produtos");
    } else {
      setMostrarAlertaErro(true);
    }
  };

  const adicionarOpcaoItem = () => {
    if (
      novaOpcaoItem.trim() &&
      !novaOpcao.opcoes.includes(novaOpcaoItem.trim())
    ) {
      setNovaOpcao({
        ...novaOpcao,
        opcoes: [...novaOpcao.opcoes, novaOpcaoItem.trim()],
      });
      setNovaOpcaoItem("");
    }
  };

  const removerOpcaoItem = (index) => {
    setNovaOpcao({
      ...novaOpcao,
      opcoes: novaOpcao.opcoes.filter((_, i) => i !== index),
    });
  };
  // #endregion

  return (
    <>
      <div className="container d-flex flex-column min-vh-100">
        <div className="col-auto p-2 d-flex flex-row justify-content-center align-items-center">
          <p className="m-0" style={{ color: "var(--highlight)" }}>
            {produto ? "Editar" : "Novo"} Produto
          </p>
        </div>
        <div
          className={`col my-2 pb-2 rounded-4 d-flex flex-column gap-2 shadow overflow-hidden`}
          style={{ backgroundColor: "var(--primary)", color: "var(--white)" }}
        >
          <div
            className="row justify-content-center"
            style={{
              backgroundColor: "var(--highlight)",
              borderBottom: "2px solid var(--secondary)",
              color: "var(--secondary)",
            }}
          >
            Informações do Produto
          </div>
          <div className="row px-3 pb-3">
            <div className="row gap-2">
              <div className="col-4 p-0">
                <div className="row">
                  <Input
                    label={"Nome do Produto:"}
                    isRequired={true}
                    value={dadosProduto.nome}
                    isCorrect={validacaoCampos.nome}
                    onChange={(value) => {
                      setDadosProduto({
                        ...dadosProduto,
                        nome: value,
                      });
                    }}
                  />
                </div>
              </div>
              <div className="col-auto p-0">
                <div className="row label ps-2" style={{ flexWrap: "nowrap" }}>
                  Categoria:
                  <span className="col ps-1" style={{ color: "var(--red)" }}>
                    *
                  </span>
                </div>
                <div className="row">
                  <Dropdown className="p-0">
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                      {dadosProduto.categoria || "Selecione a categoria"}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      {categoriasProduto.map((categoria, index) => (
                        <Dropdown.Item
                          key={index}
                          onClick={() =>
                            setDadosProduto({
                              ...dadosProduto,
                              categoria: categoria,
                            })
                          }
                        >
                          {categoria}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>
              <div className="col-2 p-0">
                <div className="row">
                  <Input
                    label={"Preço (R$):"}
                    isRequired={true}
                    maskType={MasksEnum.CURRENCY}
                    value={dadosProduto.preco}
                    isCorrect={validacaoCampos.preco}
                    onChange={(value) => {
                      setDadosProduto({ ...dadosProduto, preco: value });
                    }}
                  />
                </div>
              </div>
              <div className="col-2 p-0">
                <div className="row">
                  <Input
                    label={"Código de Barras:"}
                    isRequired={true}
                    value={dadosProduto.codigoBarras}
                    isCorrect={validacaoCampos.codigoBarras}
                    isOnlyNumbers={true}
                    onChange={(value) => {
                      setDadosProduto({
                        ...dadosProduto,
                        codigoBarras: value,
                      });
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="row gap-2 mt-2">
              <div className="col-4 p-0">
                <div className="row">
                  <Input
                    label={"Descrição:"}
                    isRequired={true}
                    value={dadosProduto.descricao}
                    isCorrect={validacaoCampos.descricao}
                    onChange={(value) => {
                      setDadosProduto({
                        ...dadosProduto,
                        descricao: value,
                      });
                    }}
                  />
                </div>
              </div>
              <div className="col-auto p-0">
                <div className="row label ps-2" style={{ flexWrap: "nowrap" }}>
                  Grupo de Precificação:
                  <span className="col ps-1" style={{ color: "var(--red)" }}>
                    *
                  </span>
                </div>
                <div className="row">
                  <Dropdown className="p-0">
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                      {dadosProduto.grupoPrecificacao || "Selecione o grupo"}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      {gruposPrecificacao.map((grupo, index) => (
                        <Dropdown.Item
                          key={index}
                          onClick={() =>
                            setDadosProduto({
                              ...dadosProduto,
                              grupoPrecificacao: grupo,
                            })
                          }
                        >
                          {grupo}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>
              <div className="col-auto p-0 d-flex align-items-end">
                <div className="row gap-2">
                  <div className="col">Ativo:</div>
                  <div className="col">
                    <SwitchButton
                      label="Produto Ativo"
                      checked={dadosProduto.ativo}
                      onChange={() => {
                        setDadosProduto({
                          ...dadosProduto,
                          ativo: !dadosProduto.ativo,
                        });
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className="row justify-content-center"
            style={{
              backgroundColor: "var(--highlight)",
              borderBottom: `2px solid ${
                validacaoCampos.imagem === false
                  ? "var(--red)"
                  : "var(--secondary)"
              }`,
              color:
                validacaoCampos.imagem === false
                  ? "var(--red)"
                  : "var(--secondary)",
            }}
          >
            Imagens do Produto
          </div>
          <div className="row px-3 overflow-x-auto overflow-y-hidden pb-1 gap-2">
            {dadosProduto.imagens.map((imagem, index) => (
              <div
                key={index}
                className={`col-auto ${styles.endereco_card}`}
                onClick={() => {
                  setNovaImagem({ ...imagem, index: index });
                  setValidacaoCampos({ ...validacaoCampos, imagem: {} });
                  setMostrarPopupImagens(true);
                }}
              >
                <div
                  className="row mt-1 overflow-hidden"
                  style={{
                    flexWrap: "nowrap",
                  }}
                >
                  <div
                    className="col"
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      flex: "1 1 auto",
                    }}
                  >
                    <FontAwesomeIcon icon={faImage} className="me-1" />
                    {imagem.nome} {imagem.isPrincipal && "★"}
                  </div>
                  <div
                    className={`${"col-auto px-2"} ${styles.delete_icon}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setDadosProduto((prev) => {
                        const updatedImagens = [
                          ...prev.imagens.filter(
                            (_, indexImg) => indexImg !== index
                          ),
                        ];

                        return {
                          ...prev,
                          imagens: updatedImagens,
                        };
                      });
                    }}
                  >
                    <FontAwesomeIcon icon={faTrash} size="xs" />
                  </div>
                </div>
                <div className="row">
                  <div
                    className="col"
                    style={{
                      overflow: "hidden",
                      textWrap: "nowrap",
                      textOverflow: "ellipsis",
                      flex: "1 1 auto",
                      fontSize: "0.8em",
                    }}
                  >
                    {imagem.url}
                  </div>
                </div>
              </div>
            ))}
            <div
              className={`col-auto ${styles.add_card}`}
              style={{ minHeight: "75px" }}
              onClick={() => {
                setNovaImagem({
                  nome: "",
                  url: "",
                  isPrincipal: false,
                });
                setValidacaoCampos({ ...validacaoCampos, imagem: {} });
                setMostrarPopupImagens(true);
              }}
            >
              +
            </div>
          </div>

          <div
            className="row justify-content-center"
            style={{
              backgroundColor: "var(--highlight)",
              borderBottom: "2px solid var(--secondary)",
              color: "var(--secondary)",
            }}
          >
            Opções de Personalização
          </div>
          <div className="row px-3 overflow-x-auto overflow-y-hidden pb-1 gap-2">
            {dadosProduto.opcoes.map((opcao, index) => (
              <div
                key={index}
                className={`col-auto ${styles.cartao_card}`}
                onClick={() => {
                  setNovaOpcao({ ...opcao, index: index });
                  setValidacaoCampos({ ...validacaoCampos, opcao: {} });
                  setMostrarPopupOpcoes(true);
                }}
              >
                <div
                  className="row mt-1 overflow-hidden"
                  style={{
                    flexWrap: "nowrap",
                  }}
                >
                  <div
                    className="col"
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      flex: "1 1 auto",
                    }}
                  >
                    {opcao.nome} {opcao.obrigatoria && "*"}
                  </div>
                  <div
                    className={`${"col-auto px-2"} ${styles.delete_icon}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setDadosProduto((prev) => {
                        const updatedOpcoes = [
                          ...prev.opcoes.filter(
                            (_, indexOpcao) => indexOpcao !== index
                          ),
                        ];

                        return {
                          ...prev,
                          opcoes: updatedOpcoes,
                        };
                      });
                    }}
                  >
                    <FontAwesomeIcon icon={faTrash} size="xs" />
                  </div>
                </div>
                <div className="row">
                  <div
                    className="col"
                    style={{
                      overflow: "hidden",
                      textWrap: "nowrap",
                      textOverflow: "ellipsis",
                      flex: "1 1 auto",
                      fontSize: "0.8em",
                    }}
                  >
                    {opcao.opcoes.join(", ")}
                  </div>
                </div>
              </div>
            ))}
            <div
              className={`col-auto ${styles.add_card}`}
              style={{ minHeight: "75px" }}
              onClick={() => {
                setNovaOpcao({
                  nome: "",
                  opcoes: [],
                  obrigatoria: false,
                });
                setValidacaoCampos({ ...validacaoCampos, opcao: {} });
                setMostrarPopupOpcoes(true);
              }}
            >
              +
            </div>
          </div>

          <div className="row px-3">
            {mostrarAlertaErro && (
              <Alert variant={"danger"}>
                Os campos (
                {Object.entries(validacaoCampos)
                  .filter((campo) => campo[1] === false)
                  .map((campo, index) => {
                    return `${index > 0 ? ", " : ""}${campo[0]}`;
                  })}
                ) estão com valores inválidos.
              </Alert>
            )}
          </div>
        </div>
        <div className="col-auto d-flex justify-content-end gap-2 py-2">
          <button
            className="btn btn-outline"
            onClick={() => {
              navigate("/admin/produtos");
            }}
          >
            Cancelar
          </button>
          <button
            className="btn"
            onClick={() => {
              salvarProduto();
            }}
          >
            Confirmar
          </button>
        </div>
      </div>

      {/* Popup Modal para Imagens */}
      <PopupModal
        isOpen={mostrarPopupImagens}
        title={"Nova Imagem"}
        onCancel={() => {
          setMostrarPopupImagens(false);
        }}
        onConfirm={() => {
          salvarImagem();
        }}
      >
        <div className="col d-flex flex-column gap-3">
          <div className="row gap-2">
            <div className="col">
              <div className="row label ps-2" style={{ flexWrap: "nowrap" }}>
                Nome da Imagem:
                <span className="col ps-1" style={{ color: "var(--red)" }}>
                  *
                </span>
              </div>
              <div className="row">
                <Input
                  value={novaImagem.nome}
                  isCorrect={validacaoCampos.imagem.nome}
                  onChange={(value) => {
                    setNovaImagem({
                      ...novaImagem,
                      nome: value,
                    });
                  }}
                />
              </div>
            </div>
          </div>
          <div className="row gap-2">
            <div className="col">
              <div className="row label ps-2" style={{ flexWrap: "nowrap" }}>
                URL da Imagem:
                <span className="col ps-1" style={{ color: "var(--red)" }}>
                  *
                </span>
              </div>
              <div className="row">
                <Input
                  value={novaImagem.url}
                  isCorrect={validacaoCampos.imagem.url}
                  onChange={(value) => {
                    setNovaImagem({
                      ...novaImagem,
                      url: value,
                    });
                  }}
                />
              </div>
            </div>
          </div>
          <div
            className="row mt-2 gap-2 justify-content-center align-items-center bg-white rounded-pill"
            style={{ color: "var(--secondary)", flexWrap: "nowrap" }}
          >
            Imagem Principal:
            <SwitchButton
              checked={novaImagem.isPrincipal}
              onChange={() => {
                setNovaImagem({
                  ...novaImagem,
                  isPrincipal: !novaImagem.isPrincipal,
                });
              }}
            />
          </div>
        </div>
      </PopupModal>

      {/* Popup Modal para Opções */}
      <PopupModal
        isOpen={mostrarPopupOpcoes}
        title={"Nova Opção de Personalização"}
        onCancel={() => {
          setMostrarPopupOpcoes(false);
        }}
        onConfirm={() => {
          salvarOpcao();
        }}
      >
        <div className="col d-flex flex-column gap-3">
          <div className="row gap-2">
            <div className="col">
              <div className="row label ps-2" style={{ flexWrap: "nowrap" }}>
                Nome da Opção:
                <span className="col ps-1" style={{ color: "var(--red)" }}>
                  *
                </span>
              </div>
              <div className="row">
                <Input
                  value={novaOpcao.nome}
                  isCorrect={validacaoCampos.opcao.nome}
                  onChange={(value) => {
                    setNovaOpcao({
                      ...novaOpcao,
                      nome: value,
                    });
                  }}
                />
              </div>
            </div>
          </div>
          <div className="row gap-2">
            <div className="col">
              <div className="row label ps-2">Adicionar Item:</div>
              <div className="row d-flex gap-2">
                <div className="col">
                  <Input
                    value={novaOpcaoItem}
                    onChange={(value) => {
                      setNovaOpcaoItem(value);
                    }}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        adicionarOpcaoItem();
                      }
                    }}
                  />
                </div>
                <div className="col-auto">
                  <button className="btn btn-sm" onClick={adicionarOpcaoItem}>
                    Adicionar
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <div className="row label ps-2">
                Itens da Opção:
                <span className="col ps-1" style={{ color: "var(--red)" }}>
                  *
                </span>
              </div>
              <div className="row">
                <div className="col d-flex flex-wrap gap-1">
                  {novaOpcao.opcoes.map((item, index) => (
                    <span
                      key={index}
                      className="badge bg-secondary d-flex align-items-center gap-1"
                      style={{ cursor: "pointer" }}
                    >
                      {item}
                      <FontAwesomeIcon
                        icon={faTrash}
                        size="xs"
                        onClick={() => removerOpcaoItem(index)}
                      />
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div
            className="row mt-2 gap-2 justify-content-center align-items-center bg-white rounded-pill"
            style={{ color: "var(--secondary)", flexWrap: "nowrap" }}
          >
            Opção Obrigatória:
            <SwitchButton
              checked={novaOpcao.obrigatoria}
              onChange={() => {
                setNovaOpcao({
                  ...novaOpcao,
                  obrigatoria: !novaOpcao.obrigatoria,
                });
              }}
            />
          </div>
        </div>
      </PopupModal>
    </>
  );
};

export default RegistrarProduto;
