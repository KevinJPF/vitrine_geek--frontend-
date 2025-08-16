import { useState } from "react";
import { useNavigate } from "react-router";

const ListarClientes = () => {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([
    {
      nome: "Kevin",
      email: "kevin@email.com",
      cpf: "111.222.333-44",
      ativo: true,
    },
    {
      nome: "Karina",
      email: "karina@email.com",
      cpf: "444.333.222-11",
      ativo: true,
    },
    {
      nome: "Pedro",
      email: "pedro@email.com",
      cpf: "999.888.777-66",
      ativo: true,
    },
    {
      nome: "Lucas",
      email: "lucas@email.com",
      cpf: "666.777.888-99",
      ativo: false,
    },
  ]);

  return (
    <div className="container d-flex flex-column min-vh-100">
      <div
        className="col-auto p-2 d-flex flex-row justify-content-center align-items-center"
        style={{ borderBottom: "1px solid black" }}
      >
        <p className="m-0" style={{ color: "var(--highlight" }}>
          Clientes
        </p>
      </div>
      <div className="col my-2 d-flex flex-column overflow-y-auto overflow-x-hidden gap-2 bg-bslack">
        {clientes.map((cliente) => {
          return (
            <div className="row">
              <div className="col ">nome: {cliente.nome}</div>
              <div className="col">email: {cliente.email}</div>
              <div className="col">cpf: {cliente.cpf}</div>
              <div className="col">ativo: {cliente.ativo ? "✓" : "x"}</div>
              <div className="col-auto d-flex gap-2">
                <button
                  className="btn"
                  onClick={() => {
                    navigate("/novo-cliente");
                  }}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    navigate("/novo-cliente");
                  }}
                >
                  Excluir
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <div className="col-auto d-flex justify-content-between py-2">
        <button
          className="btn btn-inverted"
          onClick={() => {
            navigate("/");
          }}
        >
          Back
        </button>
        <button
          className="btn"
          onClick={() => {
            navigate("/registrar-cliente");
          }}
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default ListarClientes;
