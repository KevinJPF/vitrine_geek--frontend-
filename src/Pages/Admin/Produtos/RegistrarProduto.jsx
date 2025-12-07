import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import styles from "./Produtos.module.css";
import Input, { MasksEnum } from "../../../Components/Input/Input";
import PopupModal from "../../../Components/PopupModal/PopupModal";
import SwitchButton from "../../../Components/SwitchButton/SwitchButton";
import useValidation from "../../../Hooks/useValidation";
import Dropdown from "react-bootstrap/Dropdown";
import Alert from "react-bootstrap/Alert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faImage } from "@fortawesome/free-solid-svg-icons";
import { useGetData } from "../../../Hooks/useGetData";
import { usePostData } from "../../../Hooks/usePostData";
import { usePutData } from "../../../Hooks/usePutData";
import toast from "react-hot-toast";

const RegistrarProduto = () => {
  // #region Variaveis
  const { id } = useParams();
  const navigate = useNavigate();
  const { getApiData } = useGetData();
  const { postApiData } = usePostData();
  const { putApiData } = usePutData();

  const { validateRequired } = useValidation();

  const { state } = useLocation();
  const produto = state?.produto;

  const [categorias, setCategorias] = useState([]);
  const [gruposPrecificacao, setGruposPrecificacao] = useState([]);

  const [dadosProduto, setDadosProduto] = useState({
    id: (produto && produto.id) ?? null,
    codigo: (produto && produto.codigo) ?? "",
    nome_produto: (produto && produto.nome_produto) ?? "",
    fabricante_id: (produto && produto.fabricante_id) ?? null,
    ano_lancamento: (produto && produto.ano_lancamento) ?? "",
    descricao: (produto && produto.descricao) ?? "",
    codigo_barras: (produto && produto.codigo_barras) ?? "",
    altura: (produto && produto.altura) ?? "",
    largura: (produto && produto.largura) ?? "",
    profundidade: (produto && produto.profundidade) ?? "",
    peso: (produto && produto.peso) ?? "",
    grupo_precificacao_id: (produto && produto.grupo_precificacao_id) ?? "",
    valor_venda: (produto && produto.valor_venda) ?? "",
    quantidade_disponivel: (produto && produto.quantidade_disponivel) ?? "",
    ativo: (produto && produto.ativo) ?? 1,
    categorias: (produto && produto.categorias) ?? [],
    imagens: (produto && produto.imagens) ?? [],
  });

  const [novaImagem, setNovaImagem] = useState({
    url_imagem: "",
    ordem: 1,
    principal: 0,
  });

  const [validacaoCampos, setValidacaoCampos] = useState({
    codigo: null,
    nome_produto: null,
    ano_lancamento: null,
    descricao: null,
    codigo_barras: null,
    altura: null,
    largura: null,
    profundidade: null,
    peso: null,
    grupo_precificacao_id: null,
    valor_venda: null,
    categorias: null,
    imagem: {},
  });

  const [mostrarPopupImagens, setMostrarPopupImagens] = useState(false);
  const [mostrarAlertaErro, setMostrarAlertaErro] = useState(false);

  // #endregion

  // #region Funcoes
  // Carregar dados ao montar o componente
  useEffect(() => {
    const carregarDadosIniciais = async () => {
      const [categoriasData, gruposPrecificacaoData] = await Promise.all([
        fetchCategorias(),
        fetchGruposPrecificacao(),
      ]);

      setCategorias(categoriasData || []);
      setGruposPrecificacao(gruposPrecificacaoData || []);
    };

    carregarDadosIniciais();
    if (!produto && id) {
      getApiData(`produtos/${id}`).then((data) => {
        console.log(data.message);
        if (data.message) navigate("/admin/produtos");
        else setDadosProduto(data);
      });
    }
  }, []);

  const fetchCategorias = async () => {
    try {
      const result = await getApiData("produtos/categorias");
      return result;
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
      return [];
    }
  };

  const fetchGruposPrecificacao = async () => {
    try {
      const result = await getApiData("produtos/precificacao");
      return result;
    } catch (error) {
      console.error("Erro ao buscar grupos precificacao:", error);
      return [];
    }
  };

  const validarTodosCamposImagem = async () => {
    let isInvalido = false;
    let camposInvalidos = { ...validacaoCampos };

    if (!novaImagem.url_imagem || !validateRequired(novaImagem.url_imagem)) {
      camposInvalidos.imagem.url_imagem = false;
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
        const proximaOrdem =
          Math.max(0, ...dadosProduto.imagens.map((img) => img.ordem || 0)) + 1;
        setDadosProduto({
          ...dadosProduto,
          imagens: [
            ...dadosProduto.imagens,
            { ...novaImagem, ordem: proximaOrdem },
          ],
        });
      }
      setMostrarPopupImagens(false);
    }
  };

  const validarTodosCamposProduto = async () => {
    let isInvalido = false;
    let camposInvalidos = { ...validacaoCampos };

    if (!validateRequired(dadosProduto.codigo)) {
      camposInvalidos.codigo = false;
      isInvalido = true;
    }
    if (!validateRequired(dadosProduto.nome_produto)) {
      camposInvalidos.nome_produto = false;
      isInvalido = true;
    }
    if (!validateRequired(dadosProduto.descricao)) {
      camposInvalidos.descricao = false;
      isInvalido = true;
    }
    if (!validateRequired(dadosProduto.codigo_barras)) {
      camposInvalidos.codigo_barras = false;
      isInvalido = true;
    }
    if (!validateRequired(dadosProduto.quantidade_disponivel)) {
      camposInvalidos.quantidade_disponivel = false;
      isInvalido = true;
    }
    if (!validateRequired(dadosProduto.valor_venda)) {
      camposInvalidos.valor_venda = false;
      isInvalido = true;
    }
    if (!validateRequired(dadosProduto.grupo_precificacao_id)) {
      camposInvalidos.grupo_precificacao_id = false;
      isInvalido = true;
    }
    if (dadosProduto.categorias.length <= 0) {
      camposInvalidos.categorias = false;
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
      let resposta = {};
      if (produto || id) {
        resposta = await putApiData("produtos", produto.id, dadosProduto);
      } else {
        resposta = await postApiData("produtos", dadosProduto);
      }
      console.log(resposta);
      if (resposta.campos_invalidos) {
        toast.error(resposta.campos_invalidos);
        return;
      }
      navigate("/admin/produtos");
    } else {
      setMostrarAlertaErro(true);
    }
  };

  const adicionarCategoria = (categoria) => {
    const jaAdicionada = dadosProduto.categorias.some(
      (c) => c.id === categoria.id
    );
    if (!jaAdicionada) {
      setDadosProduto({
        ...dadosProduto,
        categorias: [...dadosProduto.categorias, categoria],
      });
    }
  };

  const removerCategoria = (categoriaId) => {
    setDadosProduto({
      ...dadosProduto,
      categorias: dadosProduto.categorias.filter((c) => c.id !== categoriaId),
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
              <div className="col-1 p-0">
                <div className="row">
                  <Input
                    label={"Cód.:"}
                    isRequired={true}
                    value={dadosProduto.nome_produto}
                    isCorrect={validacaoCampos.nome_produto}
                    onChange={(value) => {
                      setDadosProduto({
                        ...dadosProduto,
                        nome_produto: value,
                      });
                    }}
                  />
                </div>
              </div>
              <div className="col-4 p-0">
                <div className="row">
                  <Input
                    label={"Nome do Produto:"}
                    isRequired={true}
                    value={dadosProduto.codigo}
                    isCorrect={validacaoCampos.codigo}
                    onChange={(value) => {
                      setDadosProduto({
                        ...dadosProduto,
                        codigo: value,
                      });
                    }}
                  />
                </div>
              </div>
              <div className="col-2 p-0">
                <div className="row">
                  <Input
                    label={"Ano Lançamento:"}
                    isRequired={false}
                    value={dadosProduto.ano_lancamento}
                    isCorrect={validacaoCampos.ano_lancamento}
                    isOnlyNumbers={true}
                    onChange={(value) => {
                      setDadosProduto({
                        ...dadosProduto,
                        ano_lancamento: value,
                      });
                    }}
                  />
                </div>
              </div>
              <div className="col-2 p-0">
                <div className="row">
                  <Input
                    label={"Código de Barras:"}
                    isRequired={true}
                    value={dadosProduto.codigo_barras}
                    isCorrect={validacaoCampos.codigo_barras}
                    isOnlyNumbers={true}
                    onChange={(value) => {
                      setDadosProduto({
                        ...dadosProduto,
                        codigo_barras: value,
                      });
                    }}
                  />
                </div>
              </div>
              <div className="col-2 p-0">
                <div className="row">
                  <Input
                    label={"Quantidade:"}
                    isRequired={true}
                    value={dadosProduto.quantidade_disponivel}
                    isCorrect={validacaoCampos.quantidade_disponivel}
                    maxLength={5}
                    isOnlyNumbers={true}
                    onChange={(value) => {
                      setDadosProduto({
                        ...dadosProduto,
                        quantidade_disponivel: value,
                      });
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="row gap-2 mt-2">
              <div className="col-6 p-0">
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
              <div className="col-2 p-0">
                <div className="row">
                  <Input
                    label={"Valor Venda (R$):"}
                    isRequired={true}
                    maskType={MasksEnum.CURRENCY}
                    value={dadosProduto.valor_venda}
                    isCorrect={validacaoCampos.valor_venda}
                    onChange={(value) => {
                      setDadosProduto({ ...dadosProduto, valor_venda: value });
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
                      {gruposPrecificacao.find(
                        (g) => g.id === dadosProduto.grupo_precificacao_id
                      )
                        ? gruposPrecificacao.find(
                            (g) => g.id === dadosProduto.grupo_precificacao_id
                          )?.nome +
                          " (" +
                          gruposPrecificacao.find(
                            (g) => g.id === dadosProduto.grupo_precificacao_id
                          )?.percentual_lucro +
                          "%)"
                        : "Selecione o grupo"}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      {gruposPrecificacao.map((grupo) => (
                        <Dropdown.Item
                          key={grupo.id}
                          onClick={() =>
                            setDadosProduto({
                              ...dadosProduto,
                              grupo_precificacao_id: grupo.id,
                            })
                          }
                        >
                          {grupo.nome} {`(${grupo.percentual_lucro}%)`}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>
            </div>
            <div className="row gap-2 mt-2">
              <div className="col-2 p-0">
                <div className="row">
                  <Input
                    label={"Altura (cm):"}
                    isRequired={false}
                    maskType={MasksEnum.DECIMAL}
                    value={dadosProduto.altura}
                    isCorrect={validacaoCampos.altura}
                    onChange={(value) => {
                      setDadosProduto({ ...dadosProduto, altura: value });
                    }}
                  />
                </div>
              </div>
              <div className="col-2 p-0">
                <div className="row">
                  <Input
                    label={"Largura (cm):"}
                    isRequired={false}
                    maskType={MasksEnum.DECIMAL}
                    value={dadosProduto.largura}
                    isCorrect={validacaoCampos.largura}
                    onChange={(value) => {
                      setDadosProduto({ ...dadosProduto, largura: value });
                    }}
                  />
                </div>
              </div>
              <div className="col-2 p-0">
                <div className="row">
                  <Input
                    label={"Profundidade (cm):"}
                    isRequired={false}
                    maskType={MasksEnum.DECIMAL}
                    value={dadosProduto.profundidade}
                    isCorrect={validacaoCampos.profundidade}
                    onChange={(value) => {
                      setDadosProduto({ ...dadosProduto, profundidade: value });
                    }}
                  />
                </div>
              </div>
              <div className="col-2 p-0">
                <div className="row">
                  <Input
                    label={"Peso (g):"}
                    isRequired={false}
                    maskType={MasksEnum.DECIMAL}
                    value={dadosProduto.peso}
                    isCorrect={validacaoCampos.peso}
                    onChange={(value) => {
                      setDadosProduto({ ...dadosProduto, peso: value });
                    }}
                  />
                </div>
              </div>
              <div className="col-auto p-0 d-flex align-items-end">
                <div className="row gap-2">
                  <div className="col">Ativo:</div>
                  <div className="col">
                    <SwitchButton
                      label="Produto Ativo"
                      checked={dadosProduto.ativo === 1}
                      onChange={() => {
                        setDadosProduto({
                          ...dadosProduto,
                          ativo: dadosProduto.ativo === 1 ? 0 : 1,
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
                validacaoCampos.categorias === false
                  ? "var(--red)"
                  : "var(--secondary)"
              }`,
              color:
                validacaoCampos.categorias === false
                  ? "var(--red)"
                  : "var(--secondary)",
            }}
          >
            Categorias do Produto
          </div>
          <div className="row px-3 pb-3">
            <div className="row mt-2">
              <div className="col d-flex flex-wrap justify-content-center gap-2">
                {categorias.map((categoria, index) => (
                  <div
                    key={index}
                    className={`col-auto ${styles.cartao_card} ${
                      dadosProduto.categorias.find((c) => c.id === categoria.id)
                        ? styles.selected_card
                        : ""
                    }`}
                    onClick={() => {
                      dadosProduto.categorias.find((c) => c.id === categoria.id)
                        ? removerCategoria(categoria.id)
                        : adicionarCategoria(categoria);
                    }}
                  >
                    <div
                      className="row d-flex m-1 overflow-hidden justify-content-center"
                      style={{
                        flexWrap: "nowrap",
                      }}
                    >
                      <div
                        className="col-auto"
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {categoria.nome}
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
                        {categoria.descricao}
                      </div>
                    </div>
                  </div>
                ))}
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
                    Imagem {imagem.ordem} {imagem.principal === 1 && "★"}
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
                    {imagem.url_imagem}
                  </div>
                </div>
              </div>
            ))}
            <div
              className={`col-auto ${styles.add_card}`}
              style={{ minHeight: "75px" }}
              onClick={() => {
                setNovaImagem({
                  url_imagem: "",
                  ordem: dadosProduto.imagens.length + 1,
                  principal: 0,
                });
                setValidacaoCampos({ ...validacaoCampos, imagem: {} });
                setMostrarPopupImagens(true);
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
                URL da Imagem:
                <span className="col ps-1" style={{ color: "var(--red)" }}>
                  *
                </span>
              </div>
              <div className="row">
                <Input
                  value={novaImagem.url_imagem}
                  isCorrect={validacaoCampos.imagem.url_imagem}
                  onChange={(value) => {
                    setNovaImagem({
                      ...novaImagem,
                      url_imagem: value,
                    });
                  }}
                />
              </div>
            </div>
          </div>
          <div className="row gap-2">
            <div className="col-3">
              <div className="row label ps-2" style={{ flexWrap: "nowrap" }}>
                Ordem:
              </div>
              <div className="row">
                <Input
                  value={novaImagem.ordem}
                  isOnlyNumbers={true}
                  onChange={(value) => {
                    setNovaImagem({
                      ...novaImagem,
                      ordem: parseInt(value) || 1,
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
              checked={novaImagem.principal === 1}
              onChange={() => {
                setNovaImagem({
                  ...novaImagem,
                  principal: novaImagem.principal === 1 ? 0 : 1,
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
