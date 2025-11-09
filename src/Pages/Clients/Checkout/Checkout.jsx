import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useGetData } from "../../../Hooks/useGetData";
import { usePostData } from "../../../Hooks/usePostData";
import styles from "./Checkout.module.css";
import Card from "../../../Components/Card/Card";
import Input from "../../../Components/Input/Input";
import PopupModal from "../../../Components/PopupModal/PopupModal";
import useValidation from "../../../Hooks/useValidation";
import FormDadosEndereco from "../../Admin/Clientes/Components/FormDadosEndereco";
import { useCepFetchData } from "../../../Hooks/useCepFetchData";
import FormDadosCartao from "../../Admin/Clientes/Components/FormDadosCartao";

const Checkout = () => {
  const navigate = useNavigate();
  const { getApiData } = useGetData();
  const { postApiData } = usePostData();
  const { validateRequired, validateCEP, validateCreditCard } = useValidation();
  const [produtos, setProdutos] = useState([]);
  const [cliente, setCliente] = useState({});
  const [cupom, setCupom] = useState("");
  const [appliedCupom, setAppliedCupom] = useState(null);
  const [descontoAplicado, setDescontoAplicado] = useState(0);

  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [selectedCardIndex, setSelectedCardIndex] = useState(0);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const [bandeiras, setBandeiras] = useState([]);

  useEffect(() => {
    fetchProdutos();
    fetchCliente();
    fetchBandeiras();
  }, []);

  const fetchBandeiras = async () => {
    const result = await getApiData("cartoes/bandeiras");
    setBandeiras(result);
  };

  const fetchCupom = async (cupomCodigo) => {
    if (!cupomCodigo) return;
    const result = await getApiData(`pedidos/cupom?codigo=${cupomCodigo}`);
    const cupomObj = Array.isArray(result) ? result[0] : result;

    const validateCupom = (c) => {
      if (!c) return { valid: false, reason: "Cupom não encontrado." };
      if (Number(c.ativo) !== 1)
        return { valid: false, reason: "Cupom inativo." };
      if (c.quantidade != null && Number(c.quantidade) <= 0)
        return { valid: false, reason: "Cupom sem usos restantes." };
      if (
        c.id_cliente &&
        cliente?.id_cliente &&
        Number(c.id_cliente) !== Number(cliente.id_cliente)
      )
        return { valid: false, reason: "Cupom vinculado a outro cliente." };
      if (c.data_validade && new Date(c.data_validade) < new Date())
        return { valid: false, reason: "Cupom expirado." };
      return { valid: true };
    };

    const check = validateCupom(cupomObj);
    if (!check.valid) {
      console.warn("Cupom inválido:", check.reason);
      setAppliedCupom(null);
      setDescontoAplicado(0);
      return;
    }

    // calcula subtotal atual dos produtos (mesma lógica de confirmarPedido)
    const toNumber = (v) => {
      if (v == null) return 0;
      if (typeof v === "number") return v;
      if (typeof v === "string") {
        const normalized = v.replace(/\s+/g, "").replace(",", ".");
        const n = Number(normalized);
        return Number.isFinite(n) ? n : 0;
      }
      return 0;
    };
    const subtotal = produtos.reduce(
      (acc, produto) =>
        acc +
        toNumber(produto.valor_venda ?? produto.preco ?? 0) *
          (Number(produto.quantidade ?? 1) || 1),
      0
    );

    // calcula desconto: tipo_cupom_id === 1 => percentual, === 2 => valor fixo
    let desconto = 0;
    const valorCupomNum = Number(String(cupomObj.valor).replace(",", ".") || 0);
    if (Number(cupomObj.tipo_cupom_id) === 1) {
      desconto = subtotal * (valorCupomNum / 100);
    } else {
      desconto = valorCupomNum;
    }
    desconto =
      Math.round(Math.max(0, Math.min(desconto, subtotal)) * 100) / 100;

    setAppliedCupom(cupomObj);
    setDescontoAplicado(desconto);
    console.log("Cupom aplicado:", cupomObj.codigo, "desconto:", desconto);
  };

  const fetchProdutos = async () => {
    const result = await getApiData("carrinhos/1");
    setProdutos(result);
  };

  const fetchCliente = async () => {
    const result = await getApiData("clientes/1");
    setCliente(result);
    // define defaults se disponíveis
    if (result) {
      if (Array.isArray(result.enderecos) && result.enderecos.length > 0) {
        setSelectedAddressIndex(0);
      }
      if (Array.isArray(result.cartoes) && result.cartoes.length > 0) {
        setSelectedCardIndex(0);
      }
    }
  };

  const confirmarPedido = async () => {
    try {
      let resposta = {};
      const appliedDiscount = Number(descontoAplicado || 0);
      const toNumber = (v) => {
        if (v == null) return 0;
        if (typeof v === "number") return v;
        if (typeof v === "string") {
          const normalized = v.replace(/\s+/g, "").replace(",", ".");
          const n = Number(normalized);
          return Number.isFinite(n) ? n : 0;
        }
        return 0;
      };

      const totalRaw = produtos.reduce(
        (acc, produto) =>
          acc +
          toNumber(produto.valor_venda ?? produto.preco ?? 0) *
            (Number(produto.quantidade ?? 1) || 1),
        0
      );
      const totalRounded = Math.round(totalRaw * 100) / 100; // número com 2 casas

      // Monta array de produtos conforme exigido pela API (inclui id_pedido)
      const produtosPayload = produtos.map((p) => {
        const unidadeNum = toNumber(p.valor_venda ?? p.preco ?? 0);
        const quantidade = Number(p.quantidade ?? 1) || 1;
        const totalItemRaw = unidadeNum * quantidade;
        const totalItem = Math.round(totalItemRaw * 100) / 100;
        return {
          produto_id: p.id_produto ?? p.id ?? p.produto_id,
          quantidade,
          valor_unitario: Number(unidadeNum.toFixed(2)),
          valor_total: Number(totalItem.toFixed(2)),
        };
      });

      // validações mínimas
      if (!cliente.enderecos || cliente.enderecos.length === 0) {
        console.error("Cliente sem endereço cadastrado");
        return;
      }
      if (!cliente.cartoes || cliente.cartoes.length === 0) {
        console.error("Cliente sem cartão cadastrado");
        return;
      }

      // Monta pagamentos com os campos solicitados (id_pedido, id_cartao, valor_pago, aprovado)
      // Aqui usamos apenas o cartão selecionado e enviamos o valor total para ele.
      const selectedCard =
        cliente.cartoes[selectedCardIndex] ?? cliente.cartoes[0];
      const valor_desconto = appliedDiscount;
      const valor_total_final = Math.max(
        0,
        Number((totalRounded - valor_desconto).toFixed(2))
      );

      const pagamentosPayload = [
        {
          id_pedido: null,
          id_cartao:
            selectedCard.id_cartao ?? selectedCard.id ?? selectedCard.idCartao,
          valor_pago: Number(valor_total_final.toFixed(2)),
          aprovado: true,
        },
      ];

      resposta = await postApiData("pedidos", {
        id_cliente: cliente.id_cliente,
        id_endereco_entrega: cliente.enderecos[0].id_endereco,
        status_id: 1,
        valor_produtos: Number(totalRounded.toFixed(2)),
        valor_frete: 0,
        valor_desconto: Number(valor_desconto.toFixed(2)),
        valor_total: Number(valor_total_final.toFixed(2)),
        produtos: produtosPayload,
        pagamentos: pagamentosPayload,
      });

      console.log(resposta);
      if (resposta.campos_invalidos) {
        console.log(resposta.campos_invalidos);
        return;
      }
      navigate("/pedido-confirmado");
    } catch (error) {
      console.log(error);
    }
  };

  // Helpers para exibir o endereço selecionado
  const getSelectedEndereco = () => {
    if (!cliente.enderecos || cliente.enderecos.length === 0) return null;
    return cliente.enderecos[selectedAddressIndex] ?? cliente.enderecos[0];
  };

  const getSelectedCartao = () => {
    if (!cliente.cartoes || cliente.cartoes.length === 0) return null;
    return cliente.cartoes[selectedCardIndex] ?? cliente.cartoes[0];
  };

  // Modal simples para seleção de endereço
  const AddressModal = ({ open, onClose }) => {
    const [mostrarPopupEnderecos, setMostrarPopupEnderecos] = useState(false);
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
    const [validacaoCampos, setValidacaoCampos] = useState({
      cartao: {},
    });
    const { fetchCepData } = useCepFetchData();

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
          setCliente((prev) => {
            const updatedEnderecos = [...(prev.enderecos || [])];
            updatedEnderecos[novoEndereco.index] = novoEndereco;

            return {
              ...prev,
              enderecos: updatedEnderecos,
            };
          });
        } else {
          setCliente((prev) => ({
            ...prev,
            enderecos: [...(prev.enderecos || []), novoEndereco],
          }));
        }

        var resposta = await postApiData("enderecos", {
          nome_endereco: novoEndereco.nome_endereco,
          tipo_residencia: novoEndereco.tipo_residencia,
          tipo_logradouro: novoEndereco.tipo_logradouro,
          logradouro: novoEndereco.logradouro,
          numero: novoEndereco.numero,
          bairro: novoEndereco.bairro,
          cep: novoEndereco.cep,
          cidade: novoEndereco.cidade,
          estado: novoEndereco.estado,
          pais: novoEndereco.pais,
          obs_endereco: novoEndereco.obs_endereco,
          endereco_entrega: novoEndereco.endereco_entrega,
          endereco_cobranca: novoEndereco.endereco_cobranca,
          favorito: novoEndereco.favorito,
          id_cliente: cliente.id_cliente,
        });

        console.log(resposta);
        if (resposta.campos_invalidos) {
          console.log(resposta.campos_invalidos);
          return;
        }
        setMostrarPopupEnderecos(false);
      }
    };

    if (!open) return null;
    return (
      <>
        <PopupModal
          modal_data_cy="modal-endereco"
          isOpen={open}
          title={"Selecionar Endereço"}
          cancel_data_cy={"btn-cancelar-endereco"}
          onCancel={() => {
            onClose();
          }}
        >
          <div
            style={{
              maxHeight: 300,
              overflow: "auto",
              marginTop: 8,
              width: "70vw",
            }}
          >
            <div className="row px-3 py-2 overflow-x-auto overflow-y-hidden gap-2">
              {cliente.enderecos?.map((endereco, index) => (
                <div
                  data-cy={`select-endereco-${index}`}
                  key={index}
                  className={`col-auto ${styles.endereco_card} ${
                    selectedAddressIndex === index ? styles.selected : ""
                  }`}
                  onClick={() => {
                    setSelectedAddressIndex(index);
                    onClose();
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
                      {endereco.nome_endereco}
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
                      {endereco.logradouro}, {endereco.numero},{" "}
                      {endereco.bairro},{" "}
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
                      {endereco.cidade}, {endereco.estado}, {endereco.cep}
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
          </div>
        </PopupModal>
        {/* Popup Novo Endereço */}
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
      </>
    );
  };

  // Modal simples para seleção de cartão
  const PaymentModal = ({ open, onClose }) => {
    const [mostrarPopupCartoes, setMostrarPopupCartoes] = useState(false);
    const [novoCartao, setNovoCartao] = useState({
      nome_cartao: "",
      numero_cartao: "",
      nome_impresso: "",
      id_bandeira: "",
      codigo_seguranca: "",
      favorito: false,
    });
    const [validacaoCampos, setValidacaoCampos] = useState({
      endereco: {},
    });

    const validarTodosCamposCartao = async () => {
      let isInvalido = false;
      let camposInvalidos = validacaoCampos;

      if (
        !novoCartao.nome_cartao ||
        !validateRequired(novoCartao.nome_cartao)
      ) {
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
      if (
        !novoCartao.id_bandeira ||
        !validateRequired(novoCartao.id_bandeira)
      ) {
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
          setCliente((prev) => {
            const updatedCartoes = [...(prev.cartoes || [])];
            updatedCartoes[novoCartao.index] = novoCartao;

            return {
              ...prev,
              cartoes: updatedCartoes,
            };
          });
        } else {
          setCliente({
            ...cliente,
            cartoes: [...cliente.cartoes, novoCartao],
          });
        }

        var resposta = await postApiData("cartoes", {
          nome_cartao: novoCartao.nome_cartao,
          numero: novoCartao.numero_cartao,
          nome_titular: novoCartao.nome_impresso,
          codigo_seguranca: novoCartao.codigo_seguranca,
          id_bandeira: novoCartao.id_bandeira,
          favorito: false,
          id_cliente: cliente.id_cliente,
        });

        console.log(resposta);
        if (resposta.campos_invalidos) {
          console.log(resposta.campos_invalidos);
          return;
        }
        setMostrarPopupCartoes(false);
      }
    };

    if (!open) return null;
    return (
      <>
        <PopupModal
          isOpen={open}
          title={"Selecionar Cartão"}
          cancel_data_cy={"btn-cancelar-cartao"}
          onCancel={() => {
            onClose();
          }}
        >
          <div
            style={{
              maxHeight: 300,
              overflow: "auto",
              width: "70vw",
              marginTop: 8,
            }}
          >
            <div className="row px-3 py-2 overflow-x-auto overflow-y-hidden gap-2">
              {cliente.cartoes.map((cartao, index) => (
                <div
                  data-cy="card-cartao"
                  key={index}
                  className={`col-auto ${styles.cartao_card} ${
                    selectedCardIndex === index ? styles.selected : ""
                  }`}
                  onClick={() => {
                    setSelectedCardIndex(index);
                    onClose();
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
                      {cartao.nome_cartao}
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
                      ****.****.****.
                      {String(cartao.numero_cartao).slice(-4)}
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
          </div>
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
      </>
    );
  };

  return (
    <div
      className="container-fluid px-2 d-flex flex-column"
      style={{ height: "calc(100vh - 82px)" }}
    >
      <Card>
        <div className="col overflow-auto h-100">
          <div className="row gap-2 h-100">
            <div className="col-7 p-0">
              {/* Entrega */}
              <div
                className="row rounded-2 mb-2"
                style={{
                  backgroundColor: "var(--secondary)",
                  height: "fit-content",
                }}
              >
                <div
                  className="row px-2 d-flex justify-content-between"
                  style={{ borderBottom: "2px solid var(--primary)" }}
                >
                  <div className="col">Entrega</div>
                  <div className="col-auto p-0">
                    <div
                      data-cy="btn-mudar-endereco"
                      className="col-auto p-0"
                      style={{ cursor: "pointer", color: "var(--primary)" }}
                      onClick={() => setShowAddressModal(true)}
                    >
                      Mudar Endereço de Entrega
                    </div>
                  </div>
                </div>
                {getSelectedEndereco() && (
                  <div className="col px-2">
                    <div className="col">
                      Entrega para {cliente.nome_cliente ?? ""} no endereço '
                      {getSelectedEndereco().nome_endereco}'
                    </div>
                    <div
                      className="col"
                      style={{ opacity: 0.7, fontSize: "1.2rem" }}
                    >
                      {getSelectedEndereco().logradouro}{" "}
                      {getSelectedEndereco().numero},{" "}
                      {getSelectedEndereco().tipo_endereco}{" "}
                      {getSelectedEndereco().bairro},{" "}
                      {getSelectedEndereco().cidade},
                      {getSelectedEndereco().estado},{getSelectedEndereco().cep}
                      , {getSelectedEndereco().pais}
                    </div>
                  </div>
                )}
              </div>
              {/* Pagamento */}
              <div
                className="row rounded-2 mb-2"
                style={{
                  backgroundColor: "var(--secondary)",
                  height: "fit-content",
                }}
              >
                <div
                  className="row px-2 d-flex justify-content-between"
                  style={{ borderBottom: "2px solid var(--primary)" }}
                >
                  <div className="col">Pagamento</div>
                  <div className="col-auto p-0">
                    <div
                      data-cy="btn-mudar-pagamento"
                      className="col-auto p-0"
                      style={{ cursor: "pointer", color: "var(--primary)" }}
                      onClick={() => setShowPaymentModal(true)}
                    >
                      Mudar Método de Pagamento
                    </div>
                  </div>
                </div>
                {getSelectedCartao() && (
                  <div className="row d-flex align-items-center">
                    <div className="col px-2">
                      <div className="col">
                        Pagando com {getSelectedCartao().nome_cartao}{" "}
                        ****.****.****.
                        {String(getSelectedCartao().numero_cartao).slice(-4)}
                      </div>
                      <div
                        className="col"
                        style={{ opacity: 0.7, fontSize: "1.2rem" }}
                      >
                        1x sem juros
                      </div>
                    </div>
                    <div className="col-auto">
                      R${" "}
                      {produtos
                        .reduce(
                          (acc, produto) =>
                            acc +
                            produto.valor_venda * produto.quantidade -
                            descontoAplicado,
                          0
                        )
                        .toFixed(2)}
                    </div>
                  </div>
                )}
              </div>
              {/* Itens */}
              <div
                className="row rounded-2 mb-2"
                style={{
                  backgroundColor: "var(--secondary)",
                  height: "fit-content",
                }}
              >
                <div
                  className="row px-2 d-flex justify-content-between"
                  style={{ borderBottom: "2px solid var(--primary)" }}
                >
                  <div className="col">Itens</div>
                </div>
                {produtos.map((produto, index) => (
                  <div className="row d-flex align-items-center" key={index}>
                    <div className="col px-2">
                      <div>
                        <div className="col">{produto.nome_produto}</div>
                        <div
                          className="col"
                          style={{ opacity: 0.7, fontSize: "1.2rem" }}
                        >
                          x{produto.quantidade} unidade
                        </div>
                      </div>
                    </div>
                    <div className="col-auto">
                      R$ {(produto.valor_venda * produto.quantidade).toFixed(2)}
                    </div>
                  </div>
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
              <div
                className="row d-flex justify-content-center"
                style={{ borderBottom: "2px solid var(--primary)" }}
              >
                <div className="row d-flex justify-content-between px-2 py-2">
                  <div className="col-auto p-0 pe-2">Cupom de Desconto</div>
                  <div className="col d-flex gap-2">
                    <Input
                      value={cupom}
                      data_cy="input-cupom"
                      onChange={(value) => {
                        setCupom(value);
                      }}
                    />
                    <button
                      data-cy="btn-aplicar-cupom"
                      className="btn btn-outline"
                      onClick={() => fetchCupom(cupom)}
                    >
                      Aplicar
                    </button>
                  </div>
                </div>
                Cupom de Desconto
              </div>
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
                  <div className="col">
                    Desconto {appliedCupom ? `(${appliedCupom.codigo})` : ""}
                  </div>
                  <div className="col-auto p-0">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(descontoAplicado)}
                  </div>
                </div>
                <div className="row d-flex justify-content-between px-2 py-1">
                  <div className="col">Total</div>
                  <div className="col-auto p-0">
                    R${" "}
                    {produtos
                      .reduce(
                        (acc, produto) =>
                          acc +
                          produto.valor_venda * produto.quantidade -
                          descontoAplicado,
                        0
                      )
                      .toFixed(2)}
                  </div>
                </div>
                <div className="row-auto d-flex justify-content-center p-2">
                  <button
                    data-cy="btn-finalizar-compra"
                    className="btn"
                    onClick={() => confirmarPedido()}
                  >
                    Finalizar Compra
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <AddressModal
        open={showAddressModal}
        onClose={() => setShowAddressModal(false)}
      />
      <PaymentModal
        open={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
      />
    </div>
  );
};

export default Checkout;
