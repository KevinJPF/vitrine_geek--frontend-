import React from "react";
import Card from "../../../../Components/Card/Card";
import ItemCarrinho from "../../Carrinho/Components/ItemCarrinho";

const ListagemPedidos = () => {
  return (
    <div
      className="container-fluid px-2 d-flex flex-column"
      style={{ height: "calc(100vh - 82px)" }}
    >
      <Card cardName={"Meus Pedidos"}>
        <div className="col overflow-auto h-100">
          <div
            className="col p-0 rounded-2"
            style={{ backgroundColor: "var(--secondary)" }}
          >
            <div
              className="row d-flex justify-content-center"
              style={{ borderBottom: "2px solid var(--primary)" }}
            >
              Pedido #1213
            </div>
            <div className="row d-flex justify-content-center pb-1">
              <ItemCarrinho
                name={"Zorua de Hisui (Pokemon)"}
                image={"https://i.redd.it/um1dcq0lsl191.jpg"}
                value={"89,99"}
                quantity={1}
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ListagemPedidos;
