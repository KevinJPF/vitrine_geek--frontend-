import { useEffect, useState } from "react";
import { useGetData } from "../../../Hooks/useGetData";
import { usePatchData } from "../../../Hooks/usePatchData";
import PopupModal from "../../../Components/PopupModal/PopupModal";
import { Dropdown } from "react-bootstrap";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

const ListarPedidos = () => {
  const { getApiData } = useGetData();
  const { patchApiData } = usePatchData();
  const [pedidos, setPedidos] = useState([]);
  const [pedidoSelecionado, setPedidoSelecionado] = useState();
  const [popupGerenciarPedido, setPopupGerenciarPedido] = useState(false);
  const [novoStatus, setNovoStatus] = useState({
    status_id: null,
    status_nome: "",
  });

  const alterarStatusPedido = async (pedidoParaAlterar, targetStatus) => {
    if (!pedidoParaAlterar || !targetStatus) return;

    try {
      // TODO: tentamos aplicar a alteração via API
      await patchApiData(`pedidos`, pedidoParaAlterar.id_pedido, {
        status_id: targetStatus.status_id,
      });

      // atualização local otimista
      setPedidos((prev) =>
        prev.map((p) =>
          p.id_pedido === pedidoParaAlterar.id_pedido
            ? {
                ...p,
                status_nome: targetStatus.status_nome,
                atualizado_em: new Date().toISOString(),
              }
            : p
        )
      );
    } catch (err) {
      console.error("Erro ao alterar status do pedido:", err);
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, []);

  const fetchPedidos = async () => {
    const result = await getApiData("pedidos");
    console.log(result);
    setPedidos(result);
  };

  const getAllowedTransitions = (currentStatus) => {
    switch (currentStatus) {
      case "EM_PROCESSAMENTO":
        return [
          { status_id: 2, status_nome: "APROVADA" },
          { status_id: 3, status_nome: "REPROVADA" },
        ];
      case "APROVADA":
        return [{ status_id: 4, status_nome: "EM_TRANSPORTE" }];
      case "EM_TRANSPORTE":
        return [{ status_id: 5, status_nome: "ENTREGUE" }];
      case "EM_TROCA":
        return [
          { status_id: 7, status_nome: "TROCA_AUTORIZADA" },
          { status_id: 9, status_nome: "TROCA_RECUSADA" },
        ];
      case "TROCA_AUTORIZADA":
        return [{ status_id: 8, status_nome: "TROCADO" }];
      default:
        return []; // nenhuma transição permitida por padrão
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "EM_PROCESSAMENTO":
        return "var(--secondary)";
      case "APROVADA":
        return "#00fffbff";
      case "REPROVADA":
        return "#ff5100ff";
      case "EM_TRANSPORTE":
        return "#4169E1";
      case "ENTREGUE":
        return "var(--green)";
      case "EM_TROCA":
        return "#aa00ffff";
      case "TROCA_AUTORIZADA":
        return "#7300ffff";
      case "TROCADO":
        return "#ff00d9ff";
      case "TROCA_RECUSADA":
        return "#ff8400ff";
      default:
        return "var(--secondary)";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "EM_PROCESSAMENTO":
        return "Em Processamento";
      case "APROVADA":
        return "Aprovada";
      case "REPROVADA":
        return "Reprovada";
      case "EM_TRANSPORTE":
        return "Em Transporte";
      case "ENTREGUE":
        return "Entregue";
      case "EM_TROCA":
        return "Troca Solicitada";
      case "TROCA_AUTORIZADA":
        return "Troca Autorizada";
      case "TROCADO":
        return "Trocado";
      case "TROCA_RECUSADA":
        return "Troca Recusada";
      default:
        return status;
    }
  };

  return (
    <div className="container d-flex flex-column min-vh-100">
      <div className="col-auto p-2 d-flex flex-row justify-content-center align-items-center">
        <p className="m-0" style={{ color: "var(--highlight)" }}>
          Pedidos
        </p>
      </div>
      <div
        className={`col my-2 rounded-4 d-flex flex-column shadow`}
        style={{
          backgroundColor: "var(--primary)",
          color: "var(--white)",
        }}
      >
        {/* Cabeçalho da tabela */}
        <div
          className="row"
          style={{
            backgroundColor: "var(--highlight)",
            color: "var(--secondary)",
            borderBottom: "2px solid var(--secondary)",
            borderRadius: "16px 16px 0px 0px",
          }}
        >
          <div className="col-1 d-flex justify-content-center">Código</div>
          <div className="col-2 d-flex justify-content-center">Comprador</div>
          <div className="col-2 d-flex justify-content-center">Realizado</div>
          <div className="col-2 d-flex justify-content-center">Atualizado</div>
          <div className="col-1 d-flex justify-content-center">Valor</div>
          <div className="col-2 d-flex justify-content-center">Status</div>
          <div className="col-2 d-flex justify-content-center">Ação</div>
        </div>

        {/* Corpo da tabela */}
        <div
          className="col overflow-auto"
          style={{
            borderRadius: "0px 0px 16px 16px",
          }}
        >
          {pedidos.map((pedido, index) => {
            return (
              <div
                key={index}
                className="row py-2"
                style={{
                  backgroundColor: index % 2 === 0 ? "#ffffff10" : "#ffffff1f",
                  borderBottom: "2px solid var(--secondary)",
                  color: "var(--secondary)",
                }}
              >
                <div
                  className="col-1"
                  style={{ borderRight: "2px solid var(--secondary)" }}
                >
                  {pedido.id_pedido}
                </div>
                <div
                  className="col-2"
                  style={{ borderRight: "2px solid var(--secondary)" }}
                >
                  {pedido.nome_cliente}
                </div>
                <div
                  className="col-2 text-truncate text-center"
                  style={{ borderRight: "2px solid var(--secondary)" }}
                >
                  {format(parseISO(pedido.criado_em), "dd/MM/yy - HH:mm", {
                    locale: ptBR,
                  })}
                </div>
                <div
                  className="col-2 text-truncate text-center"
                  style={{ borderRight: "2px solid var(--secondary)" }}
                >
                  {format(parseISO(pedido.atualizado_em), "dd/MM/yy - HH:mm", {
                    locale: ptBR,
                  })}
                </div>
                <div
                  className="col-1"
                  style={{ borderRight: "2px solid var(--secondary)" }}
                >
                  R$ {pedido.valor_total}
                </div>
                <div
                  className="col-2 text-center"
                  style={{
                    color: getStatusColor(pedido.status_nome),
                    borderRight: "2px solid var(--secondary)",
                  }}
                >
                  <strong>{getStatusText(pedido.status_nome)}</strong>
                </div>
                <div className="col-2 d-flex justify-content-center">
                  <button
                    className={`btn btn-inverted ${
                      [
                        "ENTREGUE",
                        "REPROVADA",
                        "TROCADO",
                        "TROCA_RECUSADA",
                      ].includes(pedido.status_nome)
                        ? "btn-disabled"
                        : ""
                    }`}
                    onClick={() => {
                      if (
                        [
                          "ENTREGUE",
                          "REPROVADA",
                          "TROCADO",
                          "TROCA_RECUSADA",
                        ].includes(pedido.status_nome)
                      )
                        return;
                      setPedidoSelecionado(pedido);
                      setPopupGerenciarPedido(true);
                    }}
                  >
                    Gerenciar
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <PopupModal
          isOpen={popupGerenciarPedido}
          title={"Gerenciar Status do Pedido #" + pedidoSelecionado?.id_pedido}
          cancel_data_cy={"btn-cancelar-status-pedido"}
          confirm_data_cy={"btn-salvar-status-pedido"}
          onCancel={() => {
            setPopupGerenciarPedido(false);
            setNovoStatus("");
          }}
          onConfirm={async () => {
            if (!novoStatus) return;
            await alterarStatusPedido(pedidoSelecionado, novoStatus);
            setPopupGerenciarPedido(false);
            setNovoStatus("");
            fetchPedidos();
          }}
        >
          <div className="col">
            <div className="row justify-content-center">
              <div className="col-auto">
                Status atual do pedido:{" "}
                <strong style={{ color: "var(--highlight)" }}>
                  {getStatusText(pedidoSelecionado?.status_nome)}
                </strong>
              </div>
            </div>
            <div className="row mt-2 justify-content-center">
              Atualizar para:
              <div className="col-auto">
                <Dropdown className="p-0">
                  <Dropdown.Toggle
                    variant="success"
                    id="dropdown-novo-status-pedido"
                    data-cy="dropdown-novo-status-pedido"
                  >
                    {novoStatus.status_nome || "Selecione o Status"}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {getAllowedTransitions(pedidoSelecionado?.status_nome).map(
                      (status) => (
                        <Dropdown.Item
                          key={status.status_id}
                          data-cy={`dropdown-status-${status.status_nome.toLowerCase()}`}
                          onClick={() => setNovoStatus(status)}
                        >
                          {status.status_nome}
                        </Dropdown.Item>
                      )
                    )}
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
          </div>
        </PopupModal>
      </div>
    </div>
  );
};

export default ListarPedidos;
