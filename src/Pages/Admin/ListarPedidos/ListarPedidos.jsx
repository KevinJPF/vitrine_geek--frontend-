import { useState } from "react";
import { useNavigate } from "react-router";

const ListarPedidos = () => {
  const navigate = useNavigate();
  const [pedidos] = useState([
    {
      numero: "PED-001",
      comprador: "João Silva",
      endereco: "Rua das Flores, 123 - Centro",
      valor: 159.8,
      status: "preparando",
    },
    {
      numero: "PED-002",
      comprador: "Maria Santos",
      endereco: "Av. Principal, 456 - Jardim Europa",
      valor: 89.9,
      status: "enviado",
    },
    {
      numero: "PED-003",
      comprador: "Pedro Costa",
      endereco: "Rua do Comércio, 789 - Vila Nova",
      valor: 249.7,
      status: "em rota",
    },
    {
      numero: "PED-004",
      comprador: "Ana Oliveira",
      endereco: "Travessa da Paz, 321 - Bairro Alto",
      valor: 79.9,
      status: "entregue",
    },
    {
      numero: "PED-005",
      comprador: "Carlos Ferreira",
      endereco: "Rua dos Pinheiros, 654 - Centro",
      valor: 199.8,
      status: "preparando",
    },
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case "preparando":
        return "var(--highlight)";
      case "enviado":
        return "#FFA500";
      case "em rota":
        return "#4169E1";
      case "entregue":
        return "var(--green)";
      default:
        return "var(--secondary)";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "preparando":
        return "Preparando";
      case "enviado":
        return "Enviado";
      case "em rota":
        return "Em Rota";
      case "entregue":
        return "Entregue";
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
          <div className="col-2 d-flex justify-content-center">Número</div>
          <div className="col-2 d-flex justify-content-center">Comprador</div>
          <div className="col-3 d-flex justify-content-center">Endereço</div>
          <div className="col-2 d-flex justify-content-center">Valor</div>
          <div className="col-2 d-flex justify-content-center">Status</div>
          <div className="col-1 d-flex justify-content-center">Ação</div>
        </div>

        {/* Corpo da tabela */}
        <div
          className="col overflow-hidden"
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
                  className="col-2"
                  style={{ borderRight: "2px solid var(--secondary)" }}
                >
                  {pedido.numero}
                </div>
                <div
                  className="col-2"
                  style={{ borderRight: "2px solid var(--secondary)" }}
                >
                  {pedido.comprador}
                </div>
                <div
                  className="col-3 text-truncate"
                  style={{ borderRight: "2px solid var(--secondary)" }}
                  title={pedido.endereco}
                >
                  {pedido.endereco}
                </div>
                <div
                  className="col-2"
                  style={{ borderRight: "2px solid var(--secondary)" }}
                >
                  R$ {pedido.valor.toFixed(2)}
                </div>
                <div
                  className="col-2 d-flex justify-content-center"
                  style={{
                    color: getStatusColor(pedido.status),
                    borderRight: "2px solid var(--secondary)",
                  }}
                >
                  {getStatusText(pedido.status)}
                </div>
                <div className="col-1 d-flex justify-content-center">
                  <button
                    className="btn btn-inverted"
                    onClick={() => {
                      // Funcionalidade do popup será implementada posteriormente
                      console.log("Gerenciar pedido:", pedido.numero);
                    }}
                  >
                    Gerenciar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Botão inferior */}
      <div className="col-auto d-flex justify-content-start py-2">
        <button className="btn btn-outline" onClick={() => navigate("/")}>
          Voltar
        </button>
      </div>
    </div>
  );
};

export default ListarPedidos;
