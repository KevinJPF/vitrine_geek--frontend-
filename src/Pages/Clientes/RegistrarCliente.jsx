import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import styles from "./Clientes.module.css";
import Input, { MasksEnum } from "../../Components/Input/Input";
import PopupModal from "../../Components/PopupModal/PopupModal";
import SwitchButton from "../../Components/SwitchButton/SwitchButton";
import useValidation from "../../Hooks/useValidation";
import Dropdown from "react-bootstrap/Dropdown";
import Alert from "react-bootstrap/Alert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

const RegistrarCliente = () => {
  // #region Variaveis
  const navigate = useNavigate();

  const {
    validateRequired,
    validateCPF,
    validateEmail,
    validatePhone,
    validateCEP,
    validateCreditCard,
    validateDate,
    validatePassword,
  } = useValidation();

  const { state } = useLocation();
  const cliente = state?.cliente; // cliente passado pela tela de listagem
  const [dadosCliente, setDadosCliente] = useState({
    nome: (cliente && cliente.nome) ?? "",
    genero: (cliente && cliente.genero) ?? "",
    cpf: (cliente && cliente.cpf) ?? "",
    nascimento: (cliente && cliente.nascimento) ?? "",
    email: (cliente && cliente.email) ?? "",
    telefone: (cliente && cliente.telefone) ?? "",
    senha: (cliente && cliente.senha) ?? "",
    ativo: (cliente && cliente.ativo) ?? true,
    enderecos: (cliente && cliente.enderecos) ?? [
      {
        nomeEndereco: "Casa dos Pais",
        tipoResidencia: "Casa",
        tipoLogradouro: "Travessa",
        cep: "34567-890",
        pais: "Brasil",
        estado: "MG",
        cidade: "Belo Horizonte",
        bairro: "Savassi",
        numero: "89",
        logradouro: "Travessa da Serra",
        observacoes: "Cachorro bravo no portão",
        isCobranca: true,
        isEntrega: false,
        isFavorito: false,
      },
    ],
    cartoes: (cliente && cliente.cartoes) ?? [
      {
        nomeCartao: "Cartão Pessoal",
        numeroCartao: "4111111111111111",
        nomeImpresso: "KEVIN J P FRANCISCO",
        bandeira: "Visa",
        codigoSeguranca: "123",
        isFavorito: true,
      },
      {
        nomeCartao: "Cartão Nubank",
        numeroCartao: "5274838273827483",
        nomeImpresso: "KEVIN JULIANO",
        bandeira: "Mastercard",
        codigoSeguranca: "321",
        isFavorito: false,
      },
    ],
  });
  const [novoEndereco, setNovoEndereco] = useState({
    nomeEndereco: "",
    tipoResidencia: "",
    tipoLogradouro: "",
    cep: "",
    pais: "",
    estado: "",
    cidade: "",
    bairro: "",
    numero: "",
    logradouro: "",
    observacoes: "",
    isCobranca: true,
    isEntrega: false,
    isFavorito: false,
  });
  const [novoCartao, setNovoCartao] = useState({
    nomeCartao: "",
    numeroCartao: "",
    nomeImpresso: "",
    bandeira: "",
    codigoSeguranca: "",
    isFavorito: false,
  });
  const [validacaoCampos, setValidacaoCampos] = useState({
    nome: null,
    genero: null,
    nascimento: null,
    cpf: null,
    email: null,
    telefone: null,
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
  // #endregion

  // #region Funcoes
  const compararSenha = (senhaOriginal, senhaParaConfirmar) => {
    const isEqual = senhaParaConfirmar == senhaOriginal;
    if (isEqual) console.log("ingual");
    return isEqual;
  };

  const validarTodosCamposEndereco = async () => {
    let isInvalido = false;
    let camposInvalidos = validacaoCampos;

    if (
      !novoEndereco.nomeEndereco ||
      !validateRequired(novoEndereco.nomeEndereco)
    ) {
      camposInvalidos.endereco.nomeEndereco = false;
      isInvalido = true;
    }
    if (
      !novoEndereco.tipoResidencia ||
      !validateRequired(novoEndereco.tipoResidencia)
    ) {
      camposInvalidos.endereco.tipoResidencia = false;
      isInvalido = true;
    }
    if (
      !novoEndereco.tipoLogradouro ||
      !validateRequired(novoEndereco.tipoLogradouro)
    ) {
      camposInvalidos.endereco.tipoLogradouro = false;
      isInvalido = true;
    }
    if (!novoEndereco.pais || !validateRequired(novoEndereco.pais)) {
      camposInvalidos.endereco.pais = false;
      isInvalido = true;
    }
    if (!novoEndereco.estado || !validateRequired(novoEndereco.estado)) {
      camposInvalidos.endereco.estado = false;
      isInvalido = true;
    }
    if (!novoEndereco.cidade || !validateRequired(novoEndereco.cidade)) {
      camposInvalidos.endereco.cidade = false;
      isInvalido = true;
    }
    if (!novoEndereco.bairro || !validateRequired(novoEndereco.bairro)) {
      camposInvalidos.endereco.bairro = false;
      isInvalido = true;
    }
    if (!novoEndereco.numero || !validateRequired(novoEndereco.numero)) {
      camposInvalidos.endereco.numero = false;
      isInvalido = true;
    }
    if (
      !novoEndereco.logradouro ||
      !validateRequired(novoEndereco.logradouro)
    ) {
      camposInvalidos.endereco.logradouro = false;
      isInvalido = true;
    }
    if (
      !novoEndereco.observacoes ||
      !validateRequired(novoEndereco.observacoes)
    ) {
      camposInvalidos.endereco.observacoes = false;
      isInvalido = true;
    }
    if (!novoEndereco.cep || !validateCEP(novoEndereco.cep)) {
      camposInvalidos.endereco.cep = false;
      isInvalido = true;
    }

    setValidacaoCampos({ ...validacaoCampos, camposInvalidos });
    return !isInvalido;
  };

  const salvarEndereco = async () => {
    if (await validarTodosCamposEndereco()) {
      if (novoEndereco.index !== null) {
        setDadosCliente((prev) => {
          const updatedEnderecos = [...(prev.enderecos || [])];
          updatedEnderecos[novoEndereco.index] = novoEndereco;

          return {
            ...prev,
            enderecos: updatedEnderecos,
          };
        });
      } else {
        setDadosCliente({
          ...dadosCliente,
          enderecos: [...dadosCliente.enderecos, novoEndereco],
        });
      }
      setMostrarPopupEnderecos(false);
    }
  };

  const validarTodosCamposCartao = async () => {
    let isInvalido = false;
    let camposInvalidos = validacaoCampos;

    if (!novoCartao.nomeCartao || !validateRequired(novoCartao.nomeCartao)) {
      camposInvalidos.cartao.nomeCartao = false;
      isInvalido = true;
    }
    if (
      !novoCartao.numeroCartao ||
      !validateCreditCard(novoCartao.numeroCartao, true)
    ) {
      camposInvalidos.cartao.numeroCartao = false;
      isInvalido = true;
    }
    if (
      !novoCartao.nomeImpresso ||
      !validateRequired(novoCartao.nomeImpresso)
    ) {
      camposInvalidos.cartao.nomeImpresso = false;
      isInvalido = true;
    }
    if (!novoCartao.bandeira || !validateRequired(novoCartao.bandeira)) {
      camposInvalidos.cartao.bandeira = false;
      isInvalido = true;
    }
    if (
      !novoCartao.codigoSeguranca ||
      !validateRequired(novoCartao.codigoSeguranca)
    ) {
      camposInvalidos.cartao.codigoSeguranca = false;
      isInvalido = true;
    }
    setValidacaoCampos({ ...validacaoCampos, camposInvalidos });
    return !isInvalido;
  };

  const salvarCartao = async () => {
    if (await validarTodosCamposCartao()) {
      if (novoCartao.index !== null) {
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

    if (!validateRequired(dadosCliente.nome)) {
      camposInvalidos.nome = false;
      isInvalido = true;
    }
    if (!validateRequired(dadosCliente.genero)) {
      camposInvalidos.genero = false;
      isInvalido = true;
    }
    if (!validateDate(dadosCliente.nascimento)) {
      camposInvalidos.nascimento = false;
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
    if (!validatePhone(dadosCliente.telefone)) {
      camposInvalidos.telefone = false;
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
    if (await validarTodosCamposCliente()) {
      localStorage.setItem(
        state?.cliente ? "editCliente" : "novoCliente",
        JSON.stringify(dadosCliente)
      );
      navigate(-1);
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
            Dados Pessoais
          </div>
          <div className="row px-3 pb-3">
            <div className="row gap-2">
              <div className="col-3 p-0">
                <div className="row label ps-2" style={{ flexWrap: "nowrap" }}>
                  Nome:
                  <span className="col ps-1" style={{ color: "var(--red)" }}>
                    *
                  </span>
                </div>
                <div className="row">
                  <Input
                    type="text"
                    value={dadosCliente.nome}
                    isCorrect={validacaoCampos.nome}
                    onChange={(value) => {
                      setDadosCliente({
                        ...dadosCliente,
                        nome: value,
                      });
                    }}
                  />
                </div>
              </div>
              <div className="col-2 p-0">
                <div className="row label ps-2" style={{ flexWrap: "nowrap" }}>
                  CPF:
                  <span className="col ps-1" style={{ color: "var(--red)" }}>
                    *
                  </span>
                </div>
                <div className="row">
                  <Input
                    type="text"
                    maskType={MasksEnum.CPF}
                    value={dadosCliente.cpf}
                    isCorrect={validacaoCampos.cpf}
                    onChange={(value) => {
                      setDadosCliente({ ...dadosCliente, cpf: value });
                    }}
                  />
                </div>
              </div>
              <div className="col-2 p-0">
                <div className="row label ps-2" style={{ flexWrap: "nowrap" }}>
                  Data Nasc.:
                  <span className="col ps-1" style={{ color: "var(--red)" }}>
                    *
                  </span>
                </div>
                <div className="row">
                  <Input
                    type="text"
                    maskType={MasksEnum.DATE}
                    value={dadosCliente.nascimento}
                    isCorrect={validacaoCampos.nascimento}
                    onChange={(value) => {
                      setDadosCliente({
                        ...dadosCliente,
                        nascimento: value,
                      });
                    }}
                  />
                </div>
              </div>
              <div className="col-auto p-0">
                <div className="row label ps-2" style={{ flexWrap: "nowrap" }}>
                  Gênero:
                  <span className="col ps-1" style={{ color: "var(--red)" }}>
                    *
                  </span>
                </div>
                <div className="row">
                  <Dropdown className="p-0">
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                      {dadosCliente.genero || "Selecione o gênero"}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item
                        onClick={() =>
                          setDadosCliente({
                            ...dadosCliente,
                            genero: "Masculino",
                          })
                        }
                      >
                        Masculino
                      </Dropdown.Item>

                      <Dropdown.Item
                        onClick={() =>
                          setDadosCliente({
                            ...dadosCliente,
                            genero: "Feminino",
                          })
                        }
                      >
                        Feminino
                      </Dropdown.Item>

                      <Dropdown.Item
                        onClick={() =>
                          setDadosCliente({ ...dadosCliente, genero: "Outro" })
                        }
                      >
                        Outro
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>
            </div>
            <div className="row gap-2">
              <div className="col-3 p-0">
                <div className="row label ps-2" style={{ flexWrap: "nowrap" }}>
                  Email:
                  <span className="col ps-1" style={{ color: "var(--red)" }}>
                    *
                  </span>
                </div>
                <div className="row">
                  <Input
                    type="text"
                    value={dadosCliente.email}
                    isCorrect={validacaoCampos.email}
                    onChange={(value) => {
                      setDadosCliente({
                        ...dadosCliente,
                        email: value,
                      });
                    }}
                    onBlur={() => {
                      setValidacaoCampos({
                        ...validacaoCampos,
                        email: validateEmail(dadosCliente.email),
                      });
                    }}
                  />
                </div>
              </div>
              <div className="col-2 p-0">
                <div className="row label ps-2" style={{ flexWrap: "nowrap" }}>
                  Telefone:
                  <span className="col ps-1" style={{ color: "var(--red)" }}>
                    *
                  </span>
                </div>
                <div className="row">
                  <Input
                    type="text"
                    maskType={MasksEnum.PHONE}
                    value={dadosCliente.telefone}
                    isCorrect={validacaoCampos.telefone}
                    onChange={(value) => {
                      setDadosCliente({
                        ...dadosCliente,
                        telefone: value,
                      });
                    }}
                  />
                </div>
              </div>
              <div className="col-3 p-0">
                <div className="row label ps-2" style={{ flexWrap: "nowrap" }}>
                  Senha:
                  <span className="col ps-1" style={{ color: "var(--red)" }}>
                    *
                  </span>
                </div>
                <div className="row">
                  <Input
                    value={dadosCliente.senha}
                    isCorrect={validacaoCampos.senha}
                    isPassword={true}
                    // isCorrect={false}
                    onChange={(value) => {
                      setDadosCliente({
                        ...dadosCliente,
                        senha: value,
                      });
                    }}
                    onBlur={() => {
                      if (
                        dadosCliente.senha.length > 0 &&
                        senhaParaConfirmar.length > 0
                      ) {
                        setValidacaoCampos({
                          ...validacaoCampos,
                          senha: compararSenha(
                            dadosCliente.senha,
                            senhaParaConfirmar
                          ),
                        });
                      }
                    }}
                  />
                </div>
              </div>
              <div className="col-3 p-0">
                <div className="row label ps-2" style={{ flexWrap: "nowrap" }}>
                  Confirmar Senha:
                  <span className="col ps-1" style={{ color: "var(--red)" }}>
                    *
                  </span>
                </div>
                <div className="row">
                  <Input
                    value={senhaParaConfirmar}
                    isPassword={true}
                    isCorrect={validacaoCampos.senha}
                    onChange={(value) => {
                      setSenhaParaConfirmar(value);
                    }}
                    onBlur={() => {
                      if (
                        dadosCliente.senha.length > 0 &&
                        senhaParaConfirmar.length > 0
                      ) {
                        setValidacaoCampos({
                          ...validacaoCampos,
                          senha: compararSenha(
                            dadosCliente.senha,
                            senhaParaConfirmar
                          ),
                        });
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div
            className="row justify-content-center"
            style={{
              backgroundColor: "var(--highlight)",
              borderBottom: `2px solid ${
                validacaoCampos.endereco == false
                  ? "var(--red)"
                  : "var(--secondary)"
              }`,
              color:
                validacaoCampos.endereco == false
                  ? "var(--red)"
                  : "var(--secondary)",
            }}
          >
            Endereços
          </div>
          <div className="row px-3 overflow-x-auto overflow-y-hidden pb-1 gap-2">
            {dadosCliente.enderecos.map((endereco, index) => (
              <div
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
                    {endereco.nomeEndereco} {endereco.isFavorito && "★"}
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
              className={`col-auto ${styles.add_card}`}
              style={{ minHeight: "75px" }}
              onClick={() => {
                setNovoEndereco({
                  isCobranca: true,
                  isEntrega: false,
                  isFavorito: false,
                });
                setValidacaoCampos({ ...validacaoCampos, endereco: {} });
                setMostrarPopupEnderecos(true);
              }}
            >
              +
            </div>
          </div>
          <div
            className="row justify-content-center"
            style={{
              backgroundColor: "var(--highlight)",
              borderBottom: `2px solid ${
                validacaoCampos.cartao == false
                  ? "var(--red)"
                  : "var(--secondary)"
              }`,
              color:
                validacaoCampos.cartao == false
                  ? "var(--red)"
                  : "var(--secondary)",
            }}
          >
            Cartões
          </div>
          <div className="row px-3 overflow-x-auto overflow-y-hidden pb-1 gap-2">
            {dadosCliente.cartoes.map((cartao, index) => (
              <div
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
                    {cartao.nomeCartao} {cartao.isFavorito && "★"}
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
                    {cartao.numeroCartao}
                  </div>
                </div>
              </div>
            ))}
            <div
              className={`col-auto ${styles.add_card}`}
              style={{ minHeight: "75px" }}
              onClick={() => {
                setNovoCartao({});
                setValidacaoCampos({ ...validacaoCampos, cartao: {} });
                setMostrarPopupCartoes(true);
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
                  .filter((campo) => campo[1] == false)
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
              navigate(-1);
            }}
          >
            Cancelar
          </button>
          <button
            className="btn"
            onClick={() => {
              salvarCliente();
            }}
          >
            Confirmar
          </button>
        </div>
      </div>
      <PopupModal
        isOpen={mostrarPopupEnderecos}
        title={"Novo Endereço"}
        onCancel={() => {
          setMostrarPopupEnderecos(false);
        }}
        onConfirm={() => {
          salvarEndereco();
        }}
      >
        <div className="col d-flex flex-column gap-3">
          <div className="row gap-2">
            <div className="col">
              <div className="row label ps-2" style={{ flexWrap: "nowrap" }}>
                Nome:
                <span className="col ps-1" style={{ color: "var(--red)" }}>
                  *
                </span>
              </div>
              <div className="row">
                <Input
                  value={novoEndereco.nomeEndereco}
                  isCorrect={validacaoCampos.endereco.nomeEndereco}
                  onChange={(value) => {
                    setNovoEndereco({
                      ...novoEndereco,
                      nomeEndereco: value,
                    });
                  }}
                />
              </div>
            </div>
            <div className="col">
              <div className="row label ps-2" style={{ flexWrap: "nowrap" }}>
                Tipo de Residência:
                <span className="col ps-1" style={{ color: "var(--red)" }}>
                  *
                </span>
              </div>
              <div className="row">
                <Input
                  value={novoEndereco.tipoResidencia}
                  isCorrect={validacaoCampos.endereco.tipoResidencia}
                  onChange={(value) => {
                    setNovoEndereco({
                      ...novoEndereco,
                      tipoResidencia: value,
                    });
                  }}
                />
              </div>
            </div>
            <div className="col">
              <div className="row label ps-2" style={{ flexWrap: "nowrap" }}>
                Tipo de Logradouro:
                <span className="col ps-1" style={{ color: "var(--red)" }}>
                  *
                </span>
              </div>
              <div className="row">
                <Input
                  value={novoEndereco.tipoLogradouro}
                  isCorrect={validacaoCampos.endereco.tipoLogradouro}
                  onChange={(value) => {
                    setNovoEndereco({
                      ...novoEndereco,
                      tipoLogradouro: value,
                    });
                  }}
                />
              </div>
            </div>
            <div className="col">
              <div className="row label ps-2" style={{ flexWrap: "nowrap" }}>
                CEP:
                <span className="col ps-1" style={{ color: "var(--red)" }}>
                  *
                </span>
              </div>
              <div className="row">
                <Input
                  value={novoEndereco.cep}
                  maskType={MasksEnum.CEP}
                  isCorrect={validacaoCampos.endereco.cep}
                  onChange={(value) => {
                    setNovoEndereco({
                      ...novoEndereco,
                      cep: value,
                    });
                  }}
                />
              </div>
            </div>
          </div>
          <div className="row gap-2">
            <div className="col">
              <div className="row label ps-2" style={{ flexWrap: "nowrap" }}>
                País:
                <span className="col ps-1" style={{ color: "var(--red)" }}>
                  *
                </span>
              </div>
              <div className="row">
                <Input
                  value={novoEndereco.pais}
                  isCorrect={validacaoCampos.endereco.pais}
                  onChange={(value) => {
                    setNovoEndereco({
                      ...novoEndereco,
                      pais: value,
                    });
                  }}
                />
              </div>
            </div>
            <div className="col">
              <div className="row label ps-2" style={{ flexWrap: "nowrap" }}>
                UF:
                <span className="col ps-1" style={{ color: "var(--red)" }}>
                  *
                </span>
              </div>
              <div className="row">
                <Input
                  value={novoEndereco.estado}
                  isCorrect={validacaoCampos.endereco.estado}
                  maxLength={2}
                  onChange={(value) => {
                    setNovoEndereco({
                      ...novoEndereco,
                      estado: value,
                    });
                  }}
                />
              </div>
            </div>
            <div className="col">
              <div className="row label ps-2" style={{ flexWrap: "nowrap" }}>
                Cidade:
                <span className="col ps-1" style={{ color: "var(--red)" }}>
                  *
                </span>
              </div>
              <div className="row">
                <Input
                  value={novoEndereco.cidade}
                  isCorrect={validacaoCampos.endereco.cidade}
                  onChange={(value) => {
                    setNovoEndereco({
                      ...novoEndereco,
                      cidade: value,
                    });
                  }}
                />
              </div>
            </div>
            <div className="col">
              <div className="row label ps-2" style={{ flexWrap: "nowrap" }}>
                Bairro:
                <span className="col ps-1" style={{ color: "var(--red)" }}>
                  *
                </span>
              </div>
              <div className="row">
                <Input
                  value={novoEndereco.bairro}
                  isCorrect={validacaoCampos.endereco.bairro}
                  onChange={(value) => {
                    setNovoEndereco({
                      ...novoEndereco,
                      bairro: value,
                    });
                  }}
                />
              </div>
            </div>
          </div>
          <div className="row gap-2">
            <div className="col">
              <div className="row label ps-2" style={{ flexWrap: "nowrap" }}>
                Logradouro:
                <span className="col ps-1" style={{ color: "var(--red)" }}>
                  *
                </span>
              </div>
              <div className="row">
                <Input
                  value={novoEndereco.logradouro}
                  isCorrect={validacaoCampos.endereco.logradouro}
                  onChange={(value) => {
                    setNovoEndereco({
                      ...novoEndereco,
                      logradouro: value,
                    });
                  }}
                />
              </div>
            </div>
            <div className="col">
              <div className="row label ps-2">
                Número:
                <span className="col ps-1" style={{ color: "var(--red)" }}>
                  *
                </span>
              </div>
              <div className="row">
                <Input
                  value={novoEndereco.numero}
                  isCorrect={validacaoCampos.endereco.numero}
                  isOnlyNumbers={true}
                  maxLength={10}
                  onChange={(value) => {
                    setNovoEndereco({
                      ...novoEndereco,
                      numero: value,
                    });
                  }}
                />
              </div>
            </div>
            <div className="col-6 p-0">
              <div className="row label ps-2">Observação:</div>
              <div className="row">
                <Input
                  value={novoEndereco.observacoes}
                  onChange={(value) => {
                    setNovoEndereco({
                      ...novoEndereco,
                      observacoes: value,
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
            Cobrança:
            <SwitchButton
              checked={novoEndereco.isCobranca}
              onChange={(value) => {
                setNovoEndereco({
                  ...novoEndereco,
                  isCobranca: !novoEndereco.isCobranca,
                  isEntrega: true,
                });
              }}
            />
            Entrega:
            <SwitchButton
              checked={novoEndereco.isEntrega}
              onChange={(value) => {
                setNovoEndereco({
                  ...novoEndereco,
                  isEntrega: !novoEndereco.isEntrega,
                  isCobranca: true,
                });
              }}
            />
            Favorito:
            <SwitchButton
              checked={novoEndereco.isFavorito}
              onChange={(value) => {
                setNovoEndereco({
                  ...novoEndereco,
                  isFavorito: !novoEndereco.isFavorito,
                });
              }}
            />
          </div>
        </div>
      </PopupModal>

      <PopupModal
        isOpen={mostrarPopupCartoes}
        title={"Novo Cartão"}
        onCancel={() => {
          setMostrarPopupCartoes(false);
        }}
        onConfirm={() => {
          salvarCartao();
        }}
      >
        <div
          className="col d-flex flex-column gap-3"
          style={{ textWrap: "nowrap" }}
        >
          <div className="row gap-2">
            <div className="col">
              <div className="row label ps-2">
                Nome do Cartão:
                <span className="col ps-1" style={{ color: "var(--red)" }}>
                  *
                </span>
              </div>
              <div className="row ">
                <Input
                  value={novoCartao.nomeCartao}
                  isCorrect={validacaoCampos.cartao.nomeCartao}
                  onChange={(value) => {
                    setNovoCartao({
                      ...novoCartao,
                      nomeCartao: value,
                    });
                  }}
                />
              </div>
            </div>
            <div className="col">
              <div className="row label ps-2">
                Número do Cartão:
                <span className="col ps-1" style={{ color: "var(--red)" }}>
                  *
                </span>
              </div>
              <div className="row">
                <Input
                  value={novoCartao.numeroCartao}
                  maskType={MasksEnum.CREDIT_CARD}
                  isOnlyNumbers={true}
                  maxLength={16}
                  isCorrect={validacaoCampos.cartao.numeroCartao}
                  onChange={(value) => {
                    setNovoCartao({
                      ...novoCartao,
                      numeroCartao: value,
                    });
                  }}
                />
              </div>
            </div>
          </div>
          <div className="row gap-2">
            <div className="col">
              <div className="row label ps-2" style={{ flexWrap: "nowrap" }}>
                Nome Impresso no Cartão:
                <span className="col ps-1" style={{ color: "var(--red)" }}>
                  *
                </span>
              </div>
              <div className="row">
                <Input
                  value={novoCartao.nomeImpresso}
                  isCorrect={validacaoCampos.cartao.nomeImpresso}
                  onChange={(value) => {
                    setNovoCartao({
                      ...novoCartao,
                      nomeImpresso: value,
                    });
                  }}
                />
              </div>
            </div>
            <div className="col">
              <div className="row label ps-2" style={{ flexWrap: "nowrap" }}>
                Código de Segurança:
                <span className="col ps-1" style={{ color: "var(--red)" }}>
                  *
                </span>
              </div>
              <div className="row">
                <Input
                  value={novoCartao.codigoSeguranca}
                  isCorrect={validacaoCampos.cartao.codigoSeguranca}
                  isOnlyNumbers={true}
                  maxLength={3}
                  onChange={(value) => {
                    setNovoCartao({
                      ...novoCartao,
                      codigoSeguranca: value,
                    });
                  }}
                />
              </div>
            </div>
            <div className="col-auto p-0">
              <div className="row label ps-2" style={{ flexWrap: "nowrap" }}>
                Bandeira do Cartão:
                <span className="col ps-1" style={{ color: "var(--red)" }}>
                  *
                </span>
              </div>
              <div className="row">
                <Dropdown className="col p-0">
                  <Dropdown.Toggle variant="success" id="dropdown-basic">
                    {novoCartao.bandeira || "Selecione a bandeira"}
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item
                      onClick={() =>
                        setNovoCartao({
                          ...novoCartao,
                          bandeira: "MasterCard",
                        })
                      }
                    >
                      MasterCard
                    </Dropdown.Item>

                    <Dropdown.Item
                      onClick={() =>
                        setNovoCartao({
                          ...novoCartao,
                          bandeira: "VISA",
                        })
                      }
                    >
                      VISA
                    </Dropdown.Item>

                    <Dropdown.Item
                      onClick={() =>
                        setNovoCartao({
                          ...novoCartao,
                          bandeira: "Elo",
                        })
                      }
                    >
                      Elo
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
          </div>
          <div className="row mt-2 gap-2">
            <div className="col">
              <div
                className="row mt-2 gap-2 justify-content-center align-items-center bg-white rounded-pill"
                style={{ color: "var(--secondary)" }}
              >
                Favorito:
                <SwitchButton
                  checked={novoCartao.isFavorito}
                  onChange={(value) => {
                    setNovoCartao({
                      ...novoCartao,
                      isFavorito: !novoCartao.isFavorito,
                    });
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </PopupModal>
    </>
  );
};

export default RegistrarCliente;
