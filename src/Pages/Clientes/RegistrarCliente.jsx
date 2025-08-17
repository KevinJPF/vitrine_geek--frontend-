import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import Styles from "./Clientes.module.css";
import Input from "../../Components/Input/Input";
import PopupModal from "../../Components/PopupModal/PopupModal";
import SwitchButton from "../../Components/SwitchButton/SwitchButton";
import useValidation from "../../Hooks/useValidation";
import Dropdown from "react-bootstrap/Dropdown";
import Alert from "react-bootstrap/Alert";

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
      { nome: "Casa", logradouro: "José Dantas 131" },
    ],
    cartoes: (cliente && cliente.cartoes) ?? [
      { nomeCartao: "Nubank", numeroCartao: "1234-1234-1234-1234" },
      { nomeCartao: "Santander", numeroCartao: "4321-4321-4321-4321" },
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
    isCobranca: false,
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
      setDadosCliente({
        ...dadosCliente,
        enderecos: [...dadosCliente.enderecos, novoEndereco],
      });
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
      setDadosCliente({
        ...dadosCliente,
        cartoes: [...dadosCliente.cartoes, novoCartao],
      });
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
      dadosCliente.senha.length <= 0
    ) {
      camposInvalidos.senha = false;
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
            Novo Cliente
          </p>
        </div>
        <div
          className={`col my-2 px-3 pb-2 rounded-4 d-flex flex-column gap-2 shadow`}
          style={{ backgroundColor: "var(--primary)", color: "var(--white)" }}
        >
          <div
            className="row label justify-content-center"
            style={{
              borderBottom: "2px solid var(--highlight)",
            }}
          >
            Dados Pessoais
          </div>
          <div className="row">
            <div className="row gap-2">
              <div className="col">
                <div className="row label ps-2">Nome:</div>
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
              <div className="col-auto">
                <div className="row label ps-2">Gênero:</div>
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
              <div className="col">
                <div className="row label ps-2">Data Nasc.:</div>
                <div className="row">
                  <Input
                    type="text"
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
              <div className="col">
                <div className="row label ps-2">CPF:</div>
                <div className="row">
                  <Input
                    type="text"
                    isOnlyNumbers={true}
                    value={dadosCliente.cpf}
                    isCorrect={validacaoCampos.cpf}
                    maxLength={11}
                    onChange={(value) => {
                      setDadosCliente({ ...dadosCliente, cpf: value });
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="row gap-2">
              <div className="col">
                <div className="row label ps-2">Email:</div>
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
              <div className="col">
                <div className="row label ps-2">Telefone:</div>
                <div className="row">
                  <Input
                    type="text"
                    isOnlyNumbers={true}
                    maxLength={11}
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
            </div>
            <div className="row gap-2">
              <div className="col">
                <div className="row label ps-2">Senha:</div>
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
              <div className="col">
                <div className="row label ps-2">Confirmar Senha:</div>
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
            className="row label justify-content-center"
            style={{
              borderBottom: "2px solid var(--highlight)",
            }}
          >
            Endereços
          </div>
          <div className="row overflow-x-auto overflow-y-hidden pb-1 gap-2">
            {dadosCliente.enderecos.map((endereco, index) => (
              <div key={index} className={`col-auto ${Styles.endereco_card}`}>
                <div className="row">
                  {endereco.nome} {endereco.isFavorito && "★"}
                </div>
                <div className="row">{endereco.logradouro}</div>
              </div>
            ))}
            <div
              className={`col-auto ${Styles.add_card}`}
              onClick={() => {
                setNovoEndereco({});
                setValidacaoCampos({ ...validacaoCampos, endereco: {} });
                setMostrarPopupEnderecos(true);
              }}
            >
              +
            </div>
          </div>
          <div
            className="row label justify-content-center"
            style={{
              borderBottom: "2px solid var(--highlight)",
            }}
          >
            Cartões
          </div>
          <div className="row overflow-x-auto overflow-y-hidden pb-1 gap-2">
            {dadosCliente.cartoes.map((cartao, index) => (
              <div key={index} className={`col-auto ${Styles.cartao_card}`}>
                <div className="row">
                  {cartao.nomeCartao} {cartao.isFavorito && "★"}
                </div>
                <div className="row">{cartao.numeroCartao}</div>
              </div>
            ))}
            <div
              className={`col-auto ${Styles.add_card}`}
              onClick={() => {
                setNovoCartao({});
                setValidacaoCampos({ ...validacaoCampos, cartao: {} });
                setMostrarPopupCartoes(true);
              }}
            >
              +
            </div>
          </div>
          <div className="row">
            {mostrarAlertaErro && (
              <Alert variant={"danger"}>
                Existem campos com valores inválidos.
              </Alert>
            )}
          </div>
        </div>
        <div className="col-auto d-flex justify-content-end gap-2 py-2">
          <button
            className="btn btn-inverted"
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
              <div className="row label ps-2">Nome:</div>
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
              <div className="row label ps-2">Tipo de Residência:</div>
              <div className="row">
                <Input
                  value={novoEndereco.tipoResidencia}
                  isCorrect={validacaoCampos.endereco.nomeEndereco}
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
              <div className="row label ps-2">Tipo de Logradouro:</div>
              <div className="row">
                <Input
                  value={novoEndereco.tipoLogradouro}
                  isCorrect={validacaoCampos.endereco.nomeEndereco}
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
              <div className="row label ps-2">CEP:</div>
              <div className="row">
                <Input
                  value={novoEndereco.cep}
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
              <div className="row label ps-2">País:</div>
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
              <div className="row label ps-2">Estado:</div>
              <div className="row">
                <Input
                  value={novoEndereco.estado}
                  isCorrect={validacaoCampos.endereco.estado}
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
              <div className="row label ps-2">Cidade:</div>
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
              <div className="row label ps-2">Bairro:</div>
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
              <div className="row label ps-2">Logradouro:</div>
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
              <div className="row label ps-2">Número:</div>
              <div className="row">
                <Input
                  value={novoEndereco.numero}
                  isCorrect={validacaoCampos.endereco.numero}
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
            style={{ color: "var(--secondary)" }}
          >
            Cobrança:
            <SwitchButton
              checked={novoEndereco.isCobranca}
              onChange={(value) => {
                setNovoEndereco({
                  ...novoEndereco,
                  isCobranca: !novoEndereco.isCobranca,
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
              <div className="row label ps-2">Nome do Cartão:</div>
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
              <div className="row label ps-2">Número do Cartão:</div>
              <div className="row">
                <Input
                  value={novoCartao.numeroCartao}
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
              <div className="row label ps-2">Nome Impresso no Cartão:</div>
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
              <div className="row label ps-2">Bandeira do Cartão:</div>
              <div className="row">
                <Input
                  value={novoCartao.bandeira}
                  isCorrect={validacaoCampos.cartao.bandeira}
                  onChange={(value) => {
                    setNovoCrato({
                      ...novoCartao,
                      bandeira: value,
                    });
                  }}
                />
              </div>
            </div>
            <div className="col">
              <div className="row label ps-2">Código de Segurança:</div>
              <div className="row">
                <Input
                  value={novoCartao.codigoSeguranca}
                  isCorrect={validacaoCampos.cartao.codigoSeguranca}
                  onChange={(value) => {
                    setNovoCartao({
                      ...novoCartao,
                      codigoSeguranca: value,
                    });
                  }}
                />
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
