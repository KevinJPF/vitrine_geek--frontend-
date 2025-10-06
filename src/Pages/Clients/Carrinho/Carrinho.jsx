import React from "react";
import Card from "../../../Components/Card/Card";
import Input from "../../../Components/Input/Input";
import ItemCarrinho from "./Components/ItemCarrinho";
import { useNavigate } from "react-router";

const Carrinho = () => {
  const navigate = useNavigate();

  return (
    <div
      className="container-fluid px-2 d-flex flex-column"
      style={{ height: "calc(100vh - 82px)" }}
    >
      <Card>
        <div className="col py-1 overflow-auto h-100">
          <div className="row gap-2 h-100">
            {/* Carrinho */}
            <div
              className="col-7 p-0 rounded-2 h-100"
              style={{ backgroundColor: "var(--secondary)" }}
            >
              <div
                className="row d-flex justify-content-center"
                style={{ borderBottom: "2px solid var(--primary)" }}
              >
                Carrinho
              </div>
              <div className="row d-flex justify-content-center">
                <ItemCarrinho
                  name={"Zorua de Hisui (Pokemon)"}
                  image={"https://i.redd.it/um1dcq0lsl191.jpg"}
                  value={"89,99"}
                  quantity={1}
                />
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
                  <button className="btn" onClick={() => navigate("/checkout")}>
                    Continuar para Pagamento
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

export default Carrinho;
