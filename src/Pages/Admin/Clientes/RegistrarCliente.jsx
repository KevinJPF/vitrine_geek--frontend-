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
  // #endregion

  useEffect(() => {
    getApiData("cartoes/bandeiras").then((data) => {
      setBandeiras(data);
    });
    if (!cliente && id) {
      getApiData(`clientes/${id}`).then((data) => {
        console.log(data.message);
        if (data.message) navigate("/clientes");
        else setDadosCliente(data);
      });
    }
  }, []);

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
        if (cliente || id) {
          await putApiData("clientes", cliente.id_cliente, dadosCliente);
        } else {
          await postApiData("clientes", dadosCliente);
        }
        navigate("/clientes");
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
                <div className="row">
                  <Input
                    label={"Nome:"}
                    isRequired={true}
                    value={dadosCliente.nome_cliente}
                    isCorrect={validacaoCampos.nome_cliente}
                    onChange={(value) => {
                      setDadosCliente({
                        ...dadosCliente,
                        nome_cliente: value,
                      });
                    }}
                  />
                </div>
              </div>
              <div className="col-2 p-0">
                <div className="row">
                  <Input
                    label={"CPF:"}
                    isRequired={true}
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
                <div className="row">
                  <Input
                    label={"Data Nasc.:"}
                    isRequired={true}
                    maskType={MasksEnum.DATE}
                    value={dadosCliente.data_nascimento}
                    isCorrect={validacaoCampos.data_nascimento}
                    onChange={(value) => {
                      setDadosCliente({
                        ...dadosCliente,
                        data_nascimento: value,
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
                <div className="row">
                  <Input
                    type="text"
                    label={"Email:"}
                    isRequired={true}
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
              <div className="col-1 p-0">
                <div className="row">
                  <Input
                    label={"DDD:"}
                    isRequired={true}
                    isOnlyNumbers={true}
                    maxLength={2}
                    value={dadosCliente.telefone_ddd}
                    isCorrect={validacaoCampos.telefone_ddd}
                    onChange={(value) => {
                      setDadosCliente({
                        ...dadosCliente,
                        telefone_ddd: value,
                      });
                    }}
                  />
                </div>
              </div>
              <div className="col-2 p-0">
                <div className="row">
                  <Input
                    label={"Telefone:"}
                    isRequired={true}
                    maskType={
                      dadosCliente.telefone_tipo === "Celular"
                        ? MasksEnum.CEL
                        : MasksEnum.PHONE
                    }
                    value={dadosCliente.telefone_numero}
                    isCorrect={validacaoCampos.telefone_numero}
                    onChange={(value) => {
                      // const ddd = value.replace(/\D/g, "").slice(0, 2);
                      // console.log(ddd);
                      const numero = value.replace(/\D/g, "").slice(-9);
                      console.log(numero);
                      setDadosCliente({
                        ...dadosCliente,
                        telefone_numero: value,
                      });
                    }}
                  />
                </div>
              </div>
              <div className="col-auto p-0">
                <div className="row label ps-2" style={{ flexWrap: "nowrap" }}>
                  Tipo Telefone:
                  <span className="col ps-1" style={{ color: "var(--red)" }}>
                    *
                  </span>
                </div>
                <div className="row">
                  <Dropdown className="p-0">
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                      {dadosCliente.telefone_tipo || "Selecione o tipo"}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item
                        onClick={() =>
                          setDadosCliente({
                            ...dadosCliente,
                            telefone_tipo: "Celular",
                            telefone_numero: "",
                          })
                        }
                      >
                        Celular
                      </Dropdown.Item>

                      <Dropdown.Item
                        onClick={() =>
                          setDadosCliente({
                            ...dadosCliente,
                            telefone_tipo: "Fixo",
                            telefone_numero: "",
                          })
                        }
                      >
                        Fixo
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>
            </div>
            <div className="row gap-2">
              <div className="col-3 p-0">
                <div className="row">
                  <Input
                    value={dadosCliente.senha}
                    label={"Senha:"}
                    isRequired={true}
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
                <div className="row">
                  <Input
                    value={senhaParaConfirmar}
                    label={"Confirma Senha:"}
                    isRequired={true}
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
              setDadosCliente({
                nome_cliente: "Maria Oliveira",
                genero: "Feminino",
                cpf: "321.654.987-00",
                data_nascimento: "05/08/1997",
                email: "maria.oliveira@example.com",
                telefone_ddd: "21",
                telefone_numero: "99876-4321",
                telefone_tipo: "Celular",
                senha: "Maria2025@",
                cliente_ativo: true,
                enderecos: [
                  {
                    endereco_cobranca: true,
                    endereco_entrega: true,
                    favorito: true,
                    cep: "22041-001",
                    nome_endereco: "Apartamento Copacabana",
                    pais: "Brasil",
                    cidade: "Rio de Janeiro",
                    logradouro: "Av. Atlântica",
                    numero: "2000",
                    estado: "RJ",
                    bairro: "Copacabana",
                    tipo_logradouro: "Avenida",
                    tipo_residencia: "Apartamento",
                    obs_endereco: "Frente para a praia",
                  },
                ],
                cartoes: [
                  {
                    favorito: true,
                    nome_cartao: "Cartão Principal",
                    numero_cartao: "5555.4444.3333.2222",
                    nome_impresso: "Maria Oliveira",
                    codigo_seguranca: "456",
                    id_bandeira: 2,
                  },
                ],
              });
              setSenhaParaConfirmar("Maria2025@");
            }}
          >
            TESTE 1
          </button>
          <button
            className="btn btn-outline"
            onClick={() => {
              setDadosCliente({
                nome_cliente: "João Silva",
                genero: "Masculino",
                cpf: "987.654.321-11",
                data_nascimento: "22/03/1995",
                email: "joao.silva@example.com",
                telefone_ddd: "11",
                telefone_numero: "91234-5678",
                telefone_tipo: "Celular",
                senha: "Joao2025@",
                cliente_ativo: false,
                enderecos: [
                  {
                    endereco_cobranca: true,
                    endereco_entrega: true,
                    favorito: true,
                    cep: "04055-001",
                    nome_endereco: "Casa Vila Mariana",
                    pais: "Brasil",
                    cidade: "São Paulo",
                    logradouro: "Rua Domingos de Morais",
                    numero: "1234",
                    estado: "SP",
                    bairro: "Vila Mariana",
                    tipo_logradouro: "Rua",
                    tipo_residencia: "Casa",
                    obs_endereco: "Próximo ao metrô",
                  },
                ],
                cartoes: [
                  {
                    favorito: true,
                    nome_cartao: "Cartão Reserva",
                    numero_cartao: "4111.2222.3333.4444",
                    nome_impresso: "João Silva",
                    codigo_seguranca: "789",
                    id_bandeira: 1,
                  },
                ],
              });
              setSenhaParaConfirmar("Joao2025@");
            }}
          >
            TESTE 2
          </button>
          <button
            className="btn btn-outline"
            onClick={() => {
              navigate("/clientes");
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
                  value={novoEndereco.nome_endereco}
                  isCorrect={validacaoCampos.endereco.nome_endereco}
                  onChange={(value) => {
                    setNovoEndereco({
                      ...novoEndereco,
                      nome_endereco: value,
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
                  value={novoEndereco.tipo_residencia}
                  isCorrect={validacaoCampos.endereco.tipo_residencia}
                  onChange={(value) => {
                    setNovoEndereco({
                      ...novoEndereco,
                      tipo_residencia: value,
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
                  value={novoEndereco.tipo_logradouro}
                  isCorrect={validacaoCampos.endereco.tipo_logradouro}
                  onChange={(value) => {
                    setNovoEndereco({
                      ...novoEndereco,
                      tipo_logradouro: value,
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
                  onBlur={async () => {
                    const cepData = await fetchCepData(novoEndereco.cep);
                    if (cepData.erro) {
                      setValidacaoCampos({
                        ...validacaoCampos,
                        endereco: {
                          ...validacaoCampos.endereco,
                          cep: false,
                        },
                      });
                    }
                    setNovoEndereco({
                      ...novoEndereco,
                      pais: cepData.erro ? "" : "Brasil",
                      estado: cepData.uf || "",
                      cidade: cepData.localidade || "",
                      bairro: cepData.bairro || "",
                      logradouro: cepData.logradouro || "",
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
                  value={novoEndereco.obs_endereco}
                  onChange={(value) => {
                    setNovoEndereco({
                      ...novoEndereco,
                      obs_endereco: value,
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
              checked={novoEndereco.endereco_cobranca}
              onChange={() => {
                setNovoEndereco({
                  ...novoEndereco,
                  endereco_cobranca: !novoEndereco.endereco_cobranca,
                  endereco_entrega: true,
                });
              }}
            />
            Entrega:
            <SwitchButton
              checked={novoEndereco.endereco_entrega}
              onChange={() => {
                setNovoEndereco({
                  ...novoEndereco,
                  endereco_entrega: !novoEndereco.endereco_entrega,
                  endereco_cobranca: true,
                });
              }}
            />
            Favorito:
            <SwitchButton
              checked={novoEndereco.favorito}
              onChange={() => {
                setNovoEndereco({
                  ...novoEndereco,
                  favorito: !novoEndereco.favorito,
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
              <div className="row ">
                <Input
                  label={"Nome do Cartão:"}
                  isRequired={true}
                  value={novoCartao.nome_cartao}
                  isCorrect={validacaoCampos.cartao.nome_cartao}
                  onChange={(value) => {
                    setNovoCartao({
                      ...novoCartao,
                      nome_cartao: value,
                    });
                  }}
                />
              </div>
            </div>
            <div className="col">
              <div className="row">
                <Input
                  label={"Número do Cartão:"}
                  isRequired={true}
                  value={novoCartao.numero_cartao}
                  maskType={MasksEnum.CREDIT_CARD}
                  isOnlyNumbers={true}
                  maxLength={16}
                  isCorrect={validacaoCampos.cartao.numero_cartao}
                  onChange={(value) => {
                    setNovoCartao({
                      ...novoCartao,
                      numero_cartao: value,
                    });
                  }}
                />
              </div>
            </div>
          </div>
          <div className="row gap-2">
            <div className="col">
              <div className="row">
                <Input
                  label={"Nome Impresso no Cartão:"}
                  isRequired={true}
                  value={novoCartao.nome_impresso}
                  isCorrect={validacaoCampos.cartao.nome_impresso}
                  onChange={(value) => {
                    setNovoCartao({
                      ...novoCartao,
                      nome_impresso: value,
                    });
                  }}
                />
              </div>
            </div>
            <div className="col">
              <div className="row">
                <Input
                  label={"Código de Segurança:"}
                  isRequired={true}
                  value={novoCartao.codigo_seguranca}
                  isCorrect={validacaoCampos.cartao.codigo_seguranca}
                  isOnlyNumbers={true}
                  maxLength={3}
                  onChange={(value) => {
                    setNovoCartao({
                      ...novoCartao,
                      codigo_seguranca: value,
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
                    {bandeiras.find(
                      (bandeira) =>
                        bandeira.id_bandeira === novoCartao.id_bandeira
                    )?.nome_bandeira || "Selecione a bandeira"}
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    {bandeiras &&
                      bandeiras.map((bandeira, index) => (
                        <Dropdown.Item
                          key={index}
                          onClick={() =>
                            setNovoCartao({
                              ...novoCartao,
                              id_bandeira: bandeira.id_bandeira,
                            })
                          }
                        >
                          {bandeira.nome_bandeira}
                        </Dropdown.Item>
                      ))}
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
                  checked={novoCartao.favorito}
                  onChange={() => {
                    setNovoCartao({
                      ...novoCartao,
                      favorito: !novoCartao.favorito,
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
