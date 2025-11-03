import React from "react";
import Card from "../../../../Components/Card/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";

const PedidoConfirmado = () => {
  const navigate = useNavigate();

  return (
    <div
      className="container-fluid px-2 d-flex flex-column"
      style={{ height: "calc(100vh - 82px)" }}
    >
      <Card>
        <div className="col d-flex flex-column justify-content-start align-items-center overflow-auto h-100">
          <div
            className="col-auto shadow my-4 d-flex justify-content-center align-items-center p-3 rounded-circle"
            style={{
              backgroundColor: "var(--highlight)",
              aspectRatio: "1",
              fill: "var(--primary)",
              fontSize: "10rem",
            }}
          >
            <FontAwesomeIcon
              icon={faCheck}
              style={{ color: "var(--primary)" }}
            />
          </div>
          <div
            className="col-auto"
            style={{
              color: "var(--highlight)",
              fontSize: "5rem",
              textShadow: "2px 2px rgba(0, 0, 0, 0.2)",
            }}
          >
            Pedido Confirmado
          </div>
          <div
            className="col-auto"
            style={{
              fontSize: "2rem",
            }}
          >
            Seu pedido foi concluído e assim que o pagamento for confirmado o
            seu pedido será separado para entrega.
          </div>
          <div className="col-auto d-flex gap-2 mt-4">
            <button className="btn btn-inverted" onClick={() => navigate("/")}>
              Inicio
            </button>
            <button
              data-cy="btn-meus-pedidos"
              className="btn btn-inverted"
              onClick={() => navigate("/meus-pedidos")}
            >
              Meus Pedidos
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PedidoConfirmado;
