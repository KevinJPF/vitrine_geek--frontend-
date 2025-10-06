import React from "react";
import Card from "../../../Components/Card/Card";
import { useNavigate } from "react-router";
import Input from "../../../Components/Input/Input";

const Checkout = () => {
  const navigate = useNavigate();

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
                  <div
                    className="col-auto p-0"
                    style={{ cursor: "pointer", color: "var(--primary)" }}
                  >
                    Mudar Endereço de Entrega
                  </div>
                </div>
                <div className="col px-2">
                  <div className="col">
                    Entrega para 'Kevin Juliano Pires Francisco' no endereço
                    'Casa'
                  </div>
                  <div
                    className="col"
                    style={{ opacity: 0.7, fontSize: "1.2rem" }}
                  >
                    Rua José Dantas 131, Casa Vila Maluf, Suzano, SP, 08685080,
                    Brasil
                  </div>
                </div>
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
                  <div
                    className="col-auto p-0"
                    style={{ cursor: "pointer", color: "var(--primary)" }}
                  >
                    Mudar Método de Pagamento
                  </div>
                </div>
                <div className="row d-flex align-items-center">
                  <div className="col px-2">
                    <div className="col">
                      Pagando com Nubank ****.****.****.4444
                    </div>
                    <div
                      className="col"
                      style={{ opacity: 0.7, fontSize: "1.2rem" }}
                    >
                      1x sem juros
                    </div>
                  </div>
                  <div className="col-auto">R$ 89,99</div>
                </div>
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
                <div className="row d-flex align-items-center">
                  <div className="col px-2">
                    <div className="col">Pelúcia - Zorua de Hisui</div>
                    <div
                      className="col"
                      style={{ opacity: 0.7, fontSize: "1.2rem" }}
                    >
                      x1 unidade
                    </div>
                  </div>
                  <div className="col-auto">R$ 89,99</div>
                </div>
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
                    <Input />
                    <button className="btn btn-outline">Aplicar</button>
                  </div>
                </div>
                Cupom de Desconto
              </div>
              <div className="row d-flex justify-content-center">
                <div className="row d-flex justify-content-between px-2 py-1">
                  <div className="col">Subtotal</div>
                  <div className="col-auto p-0">R$ 0,00</div>
                </div>
                <div className="row d-flex justify-content-between px-2 py-1">
                  <div className="col">Desconto</div>
                  <div className="col-auto p-0">R$ 0,00</div>
                </div>
                <div className="row d-flex justify-content-between px-2 py-1">
                  <div className="col">Total</div>
                  <div className="col-auto p-0">R$ 0,00</div>
                </div>
                <div className="row-auto d-flex justify-content-center p-2">
                  <button
                    className="btn"
                    onClick={() => navigate("/pedido-confirmado")}
                  >
                    Finalizar Compra
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Checkout;
