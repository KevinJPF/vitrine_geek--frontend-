import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import styles from "./Clientes.module.css";
import Input, { MasksEnum } from "../../../Components/Input/Input";
import PopupModal from "../../../Components/PopupModal/PopupModal";
import SwitchButton from "../../../Components/SwitchButton/SwitchButton";
import useValidation from "../../../Hooks/useValidation";
import Dropdown from "react-bootstrap/Dropdown";
import Alert from "react-bootstrap/Alert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useCepFetchData } from "../../../Hooks/useCepFetchData";
import { useGetData } from "../../../Hooks/useGetData";
import { usePostData } from "../../../Hooks/usePostData";
import { usePutData } from "../../../Hooks/usePutData";
import FormDadosPessoais from "./Components/FormDadosPessoais";
import FormDadosCartao from "./Components/FormDadosCartao";
import SectionHeader from "./Components/SectionHeader";
import FormDadosEndereco from "./Components/FormDadosEndereco";

const RegistrarCliente = () => {
  // #region Variaveis
  const { id } = useParams();
  const { state } = useLocation();
  const cliente = state?.cliente; // cliente passado pela tela de listagem
  const navigate = useNavigate();
  const { fetchCepData } = useCepFetchData();
  const { getApiData } = useGetData();
  const { postApiData } = usePostData();
  const { putApiData } = usePutData();

  const {
    validateRequired,
    validateCPF,
    validateEmail,
    validateDDD,
    validatePhone,
    validateCEP,
    validateCreditCard,
    validateDate,
    validatePassword,
  } = useValidation();

  const [bandeiras, setBandeiras] = useState([]);
  const [dadosCliente, setDadosCliente] = useState({
    nome_cliente: (cliente && cliente.nome_cliente) ?? "",
    genero: (cliente && cliente.genero) ?? "",
    cpf: (cliente && cliente.cpf) ?? "",
    data_nascimento: (cliente && cliente.data_nascimento) ?? "",
    email: (cliente && cliente.email) ?? "",
    telefone_ddd: (cliente && cliente.telefone_ddd) ?? "",
    telefone_numero: (cliente && cliente.telefone_numero) ?? "",
    telefone_tipo: (cliente && cliente.telefone_tipo) ?? "Celular",
    senha: (cliente && cliente.senha) ?? "",
    cliente_ativo: (cliente && cliente.cliente_ativo) ?? true,
    enderecos: (cliente && cliente.enderecos) ?? [],
    cartoes: (cliente && cliente.cartoes) ?? [],
  });
  const [novoEndereco, setNovoEndereco] = useState({
    nome_endereco: "",
    tipo_residencia: "",
    tipo_logradouro: "",
    cep: "",
    pais: "",
    estado: "",
    cidade: "",
    bairro: "",
    numero: "",
    logradouro: "",
    obs_endereco: "",
    endereco_cobranca: true,
    endereco_entrega: false,
    favorito: false,
  });
  const [novoCartao, setNovoCartao] = useState({
    nome_cartao: "",
    numero_cartao: "",
    nome_impresso: "",
    id_bandeira: "",
    codigo_seguranca: "",
    favorito: false,
  });
  const [validacaoCampos, setValidacaoCampos] = useState({
    nome_cliente: null,
    genero: null,
    data_nascimento: null,
    cpf: null,
    email: null,
    telefone_numero: null,
    senha: null,
    endereco: {},
    cartao: {},
  });

  const [senhaParaConfirmar, setSenhaParaConfirmar] = useState(
    (cliente && cliente.senha) ?? ""
  );
  const [mostrarPopupEnderecos, setMostrarPopupEnderecos] = useState(false);
  const [mostrarPopupCartoes, setMostrarPopupCartoes] = useState(false);
  const [mostrarAlertaErro, setMostrarAlertaErro] = useState(false);
  const [mostrarPopupErro, setMostrarPopupErro] = useState(false);
  const [erro, setErro] = useState({});
  // #endregion

  // #region useEffects
  useEffect(() => {
    getApiData("cartoes/bandeiras").then((data) => {
      setBandeiras(data);
    });
    if (!cliente && id) {
      getApiData(`clientes/${id}`).then((data) => {
        console.log(data.message);
        if (data.message) navigate("/admin/clientes");
        else setDadosCliente(data);
      });
    }
  }, []);
  // #endregion

  // #region Funcoes
  const compararSenha = (senhaOriginal, senhaParaConfirmar) => {
    const isEqual =
      senhaParaConfirmar == senhaOriginal &&
      validatePassword(dadosCliente.senha);
    if (isEqual) console.log("ingual");
    return isEqual;
  };

  const validarTodosCamposEndereco = async () => {
    let isInvalido = false;
    let camposInvalidos = validacaoCampos;

    if (
      !novoEndereco.nome_endereco ||
      !validateRequired(novoEndereco.nome_endereco)
    ) {
      camposInvalidos.endereco.nome_endereco = false;
      isInvalido = true;
    } else {
      camposInvalidos.endereco.nome_endereco = undefined;
    }

    if (
      !novoEndereco.tipo_residencia ||
      !validateRequired(novoEndereco.tipo_residencia)
    ) {
      camposInvalidos.endereco.tipo_residencia = false;
      isInvalido = true;
    } else {
      camposInvalidos.endereco.tipo_residencia = undefined;
    }

    if (
      !novoEndereco.tipo_logradouro ||
      !validateRequired(novoEndereco.tipo_logradouro)
    ) {
      camposInvalidos.endereco.tipo_logradouro = false;
      isInvalido = true;
    } else {
      camposInvalidos.endereco.tipo_logradouro = undefined;
    }

    if (!novoEndereco.pais || !validateRequired(novoEndereco.pais)) {
      camposInvalidos.endereco.pais = false;
      isInvalido = true;
    } else {
      camposInvalidos.endereco.pais = undefined;
    }

    if (!novoEndereco.estado || !validateRequired(novoEndereco.estado)) {
      camposInvalidos.endereco.estado = false;
      isInvalido = true;
    } else {
      camposInvalidos.endereco.estado = undefined;
    }

    if (!novoEndereco.cidade || !validateRequired(novoEndereco.cidade)) {
      camposInvalidos.endereco.cidade = false;
      isInvalido = true;
    } else {
      camposInvalidos.endereco.cidade = undefined;
    }

    if (!novoEndereco.bairro || !validateRequired(novoEndereco.bairro)) {
      camposInvalidos.endereco.bairro = false;
      isInvalido = true;
    } else {
      camposInvalidos.endereco.bairro = undefined;
    }

    if (!novoEndereco.numero || !validateRequired(novoEndereco.numero)) {
      camposInvalidos.endereco.numero = false;
      isInvalido = true;
    } else {
      camposInvalidos.endereco.numero = undefined;
    }

    if (
      !novoEndereco.logradouro ||
      !validateRequired(novoEndereco.logradouro)
    ) {
      camposInvalidos.endereco.logradouro = false;
      isInvalido = true;
    } else {
      camposInvalidos.endereco.logradouro = undefined;
    }

    if (!novoEndereco.cep || !validateCEP(novoEndereco.cep)) {
      camposInvalidos.endereco.cep = false;
      isInvalido = true;
    } else {
      camposInvalidos.endereco.cep = undefined;
    }

    setValidacaoCampos({ ...validacaoCampos, camposInvalidos });
    return !isInvalido;
  };

  const salvarEndereco = async () => {
    if (await validarTodosCamposEndereco()) {
      if (novoEndereco.index >= 0) {
        setDadosCliente((prev) => {
          const updatedEnderecos = [...(prev.enderecos || [])];
          updatedEnderecos[novoEndereco.index] = novoEndereco;

          return {
            ...prev,
            enderecos: updatedEnderecos,
          };
        });
      } else {
        setDadosCliente((prev) => ({
          ...prev,
          enderecos: [...(prev.enderecos || []), novoEndereco],
        }));
      }
      setMostrarPopupEnderecos(false);
    }
  };

  const validarTodosCamposCartao = async () => {
    let isInvalido = false;
    let camposInvalidos = validacaoCampos;

    if (!novoCartao.nome_cartao || !validateRequired(novoCartao.nome_cartao)) {
      camposInvalidos.cartao.nome_cartao = false;
      isInvalido = true;
    }
    if (
      !novoCartao.numero_cartao ||
      !validateCreditCard(novoCartao.numero_cartao, true)
    ) {
      camposInvalidos.cartao.numero_cartao = false;
      isInvalido = true;
    }
    if (
      !novoCartao.nome_impresso ||
      !validateRequired(novoCartao.nome_impresso)
    ) {
      camposInvalidos.cartao.nome_impresso = false;
      isInvalido = true;
    }
    if (!novoCartao.id_bandeira || !validateRequired(novoCartao.id_bandeira)) {
      camposInvalidos.cartao.bandeira = false;
      isInvalido = true;
    }
    if (
      !novoCartao.codigo_seguranca ||
      !validateRequired(novoCartao.codigo_seguranca)
    ) {
      camposInvalidos.cartao.codigo_seguranca = false;
      isInvalido = true;
    }
    setValidacaoCampos({ ...validacaoCampos, camposInvalidos });
    return !isInvalido;
  };

  const salvarCartao = async () => {
    if (await validarTodosCamposCartao()) {
      if (novoCartao.index >= 0) {
        setDadosCliente((prev) => {
          const updatedCartoes = [...(prev.cartoes || [])];
          updatedCartoes[novoCartao.index] = novoCartao;

          return {
            ...prev,
            cartoes: updatedCartoes,
          };
        });
      } else {
        setDadosCliente({
          ...dadosCliente,
          cartoes: [...dadosCliente.cartoes, novoCartao],
        });
      }
      setMostrarPopupCartoes(false);
    }
  };

  const validarTodosCamposCliente = async () => {
    let isInvalido = false;
    let camposInvalidos = validacaoCampos;

    if (!validateRequired(dadosCliente.nome_cliente)) {
      camposInvalidos.nome_cliente = false;
      isInvalido = true;
    }
    if (!validateRequired(dadosCliente.genero)) {
      camposInvalidos.genero = false;
      isInvalido = true;
    }
    if (!validateDate(dadosCliente.data_nascimento)) {
      camposInvalidos.data_nascimento = false;
      isInvalido = true;
    }
    if (!validateCPF(dadosCliente.cpf, true)) {
      camposInvalidos.cpf = false;
      isInvalido = true;
    }
    if (!validateEmail(dadosCliente.email)) {
      camposInvalidos.email = false;
      isInvalido = true;
    }
    if (!validatePhone(dadosCliente.telefone_numero)) {
      camposInvalidos.telefone_numero = false;
      isInvalido = true;
    }
    if (!validateDDD(dadosCliente.telefone_ddd)) {
      camposInvalidos.telefone_ddd = false;
      isInvalido = true;
    }
    if (
      !compararSenha(dadosCliente.senha, senhaParaConfirmar) ||
      dadosCliente.senha.length <= 0 ||
      !validatePassword(dadosCliente.senha)
    ) {
      camposInvalidos.senha = false;
      isInvalido = true;
    }
    if (dadosCliente.enderecos.length <= 0) {
      camposInvalidos.endereco = false;
      isInvalido = true;
    }
    if (dadosCliente.cartoes.length <= 0) {
      camposInvalidos.cartao = false;
      isInvalido = true;
    }
    setValidacaoCampos({ ...validacaoCampos, camposInvalidos });
    return !isInvalido;
  };

  const salvarCliente = async () => {
    console.log(dadosCliente);
    if (await validarTodosCamposCliente()) {
      try {
        let resposta = {};
        if (cliente || id) {
          resposta = await putApiData(
            "clientes",
            cliente.id_cliente,
            dadosCliente
          );
        } else {
          resposta = await postApiData("clientes", dadosCliente);
        }
        console.log(resposta);
        if (resposta.campos_invalidos) {
          setErro(resposta.campos_invalidos);
          setMostrarPopupErro(true);
          return;
        }
        navigate("/admin/clientes");
      } catch (error) {
        console.log(error);
      }
    } else {
      setMostrarAlertaErro(true);
    }
  };
  // #endregion

  return (
    <>
      <div className="container d-flex flex-column min-vh-100">
        <div className="col-auto p-2 d-flex flex-row justify-content-center align-items-center">
          <p className="m-0" style={{ color: "var(--highlight)" }}>
            {cliente ? "Editar" : "Novo"} Cliente
          </p>
        </div>
        <div
          className={`col my-2 rounded-4 d-flex flex-column gap-2 shadow overflow-hidden`}
          style={{ backgroundColor: "var(--primary)", color: "var(--white)" }}
        >
          <div className="col gap-2 overflow-auto">
            {/* Dados Pessoais */}
            <SectionHeader titulo={"Dados Pessoais"} />
            <FormDadosPessoais
              dadosCliente={dadosCliente}
              setDadosCliente={setDadosCliente}
              validacaoCampos={validacaoCampos}
              setValidacaoCampos={setValidacaoCampos}
              senhaParaConfirmar={senhaParaConfirmar}
              setSenhaParaConfirmar={setSenhaParaConfirmar}
              validateEmail={validateEmail}
              compararSenha={compararSenha}
            />
            {/* Endereços */}
            <SectionHeader titulo={"Endereços"} />
            <div className="row px-3 py-2 overflow-x-auto overflow-y-hidden gap-2">
              {dadosCliente.enderecos.map((endereco, index) => (
                <div
                  data-cy="card-endereco"
                  key={index}
                  className={`col-auto ${styles.endereco_card}`}
                  onClick={() => {
                    setNovoEndereco({ ...endereco, index: index });
                    setValidacaoCampos({ ...validacaoCampos, endereco: {} });
                    setMostrarPopupEnderecos(true);
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
                      {endereco.nome_endereco} {endereco.favorito && "★"}
                    </div>
                    {/* <div
                    className="col-auto p-0"
                    style={{ color: "var(--white)" }}
                  >
                    <FontAwesomeIcon icon={faEdit} size="xs" />
                  </div> */}
                    <div
                      className={`${"col-auto px-2"} ${styles.delete_icon}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setDadosCliente((prev) => {
                          const updatedEnderecos = [
                            ...prev.enderecos.filter(
                              (end, indexEnd) => indexEnd != index
                            ),
                          ];

                          return {
                            ...prev,
                            enderecos: updatedEnderecos,
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
                      }}
                    >
                      {endereco.logradouro}
                    </div>
                  </div>
                </div>
              ))}
              <div
                data-cy="btn-adicionar-endereco"
                className={`col-auto ${styles.add_card}`}
                style={{ minHeight: "75px" }}
                onClick={() => {
                  setNovoEndereco({
                    obs_endereco: "",
                    endereco_cobranca: true,
                    endereco_entrega: false,
                    favorito: false,
                  });
                  setValidacaoCampos({ ...validacaoCampos, endereco: {} });
                  setMostrarPopupEnderecos(true);
                }}
              >
                +
              </div>
            </div>
            {/* Cartões */}
            <SectionHeader titulo={"Cartões"} />
            <div className="row px-3 py-2 overflow-x-auto overflow-y-hidden gap-2">
              {dadosCliente.cartoes.map((cartao, index) => (
                <div
                  data-cy="card-cartao"
                  key={index}
                  className={`col-auto ${styles.cartao_card}`}
                  onClick={() => {
                    setNovoCartao({ ...cartao, index: index });
                    setValidacaoCampos({ ...validacaoCampos, cartao: {} });
                    setMostrarPopupCartoes(true);
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
                      {cartao.nome_cartao} {cartao.favorito && "★"}
                    </div>
                    <div
                      className={`${"col-auto px-2"} ${styles.delete_icon}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setDadosCliente((prev) => {
                          const updatedCartoes = [
                            ...prev.cartoes.filter(
                              (end, indexCartao) => indexCartao != index
                            ),
                          ];

                          return {
                            ...prev,
                            cartoes: updatedCartoes,
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
                      }}
                    >
                      {cartao.numero_cartao}
                    </div>
                  </div>
                </div>
              ))}
              <div
                data-cy="btn-adicionar-cartao"
                className={`col-auto ${styles.add_card}`}
                style={{ minHeight: "75px" }}
                onClick={() => {
                  setNovoCartao({
                    favorito: false,
                  });
                  setValidacaoCampos({ ...validacaoCampos, cartao: {} });
                  setMostrarPopupCartoes(true);
                }}
              >
                +
              </div>
            </div>
            {/* Erros */}
            <div className="row px-3">
              {mostrarAlertaErro && (
                <Alert variant={"danger"}>
                  Os campos (
                  {Object.entries(validacaoCampos)
                    .filter((campo) => campo[1] == false)
                    .map((campo, index) => {
                      return `${index > 0 ? ", " : ""}${campo[0]}`;
                    })}
                  ) estão com valores inválidos.
                </Alert>
              )}
            </div>
          </div>
        </div>
        {/* Botões */}
        <div className="col-auto d-flex justify-content-end gap-2 py-2">
          <button
            data-cy="btn-cancelar-cliente"
            className="btn btn-outline"
            onClick={() => {
              navigate("/admin/clientes");
            }}
          >
            Cancelar
          </button>
          <button
            data-cy="btn-confirmar-cliente"
            className="btn"
            onClick={() => {
              salvarCliente();
            }}
          >
            Confirmar
          </button>
        </div>
      </div>

      {/* Popup Endereço */}
      <PopupModal
        isOpen={mostrarPopupEnderecos}
        title={"Novo Endereço"}
        cancel_data_cy={"btn-cancelar-endereco"}
        confirm_data_cy={"btn-salvar-endereco"}
        onCancel={() => {
          setMostrarPopupEnderecos(false);
        }}
        onConfirm={() => {
          salvarEndereco();
        }}
      >
        <FormDadosEndereco
          novoEndereco={novoEndereco}
          setNovoEndereco={setNovoEndereco}
          validacaoCampos={validacaoCampos}
          setValidacaoCampos={setValidacaoCampos}
          fetchCepData={fetchCepData}
        />
      </PopupModal>

      {/* Popup Cartao */}
      <PopupModal
        isOpen={mostrarPopupCartoes}
        title={"Novo Cartão"}
        cancel_data_cy={"btn-cancelar-cartao"}
        confirm_data_cy={"btn-salvar-cartao"}
        onCancel={() => {
          setMostrarPopupCartoes(false);
        }}
        onConfirm={() => {
          salvarCartao();
        }}
      >
        <FormDadosCartao
          novoCartao={novoCartao}
          setNovoCartao={setNovoCartao}
          validacaoCampos={validacaoCampos}
          bandeiras={bandeiras}
        />
      </PopupModal>

      {/* Popup Erro */}
      <PopupModal
        isOpen={mostrarPopupErro}
        title={"Erro ao salvar Cartão"}
        onCancel={() => {
          setMostrarPopupErro(false);
        }}
      >
        <div
          className="col d-flex flex-column gap-3"
          style={{ textWrap: "nowrap" }}
        >
          {erro &&
            Object.keys(erro).map((campo) => (
              <div key={campo}>
                {campo}: {erro[campo]}
              </div>
            ))}
        </div>
      </PopupModal>
    </>
  );
};

export default RegistrarCliente;
