import { Alert } from "bootstrap";
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

  const alterarStatusCliente = (clienteParaAlterar) => {
    setClientes(
      clientes.map((cliente) => {
        if (cliente == clienteParaAlterar) cliente.ativo = !cliente.ativo;
        return cliente;
      })
    );
  };

  return (
    <div className="container d-flex flex-column min-vh-100">
      <div className="col-auto p-2 d-flex flex-row justify-content-center align-items-center">
        <p className="m-0" style={{ color: "var(--highlight" }}>
          Clientes
        </p>
      </div>
      <div
        className={`col my-2 px-3 rounded-4 d-flex flex-column gap-2 shadow`}
        style={{ backgroundColor: "var(--primary)", color: "var(--white)" }}
      >
        <div className="row">
          <div className="col">Nome</div>
          <div className="col">Email</div>
          <div className="col">CPF</div>
          <div className="col">Ativo</div>
          <div className="col-auto d-flex gap-2">Ação</div>
        </div>
        {clientes.map((cliente) => {
          return (
            <div
              className="row py-2 px-3 rounded-pill"
              style={{ backgroundColor: "#0000002f" }}
            >
              <div className="col">Nome: {cliente.nome}</div>
              <div className="col">Email: {cliente.email}</div>
              <div className="col">CPF: {cliente.cpf}</div>
              <div className="col">
                Ativo:{" "}
                <span
                  style={{
                    color: cliente.ativo ? "var(--primary)" : "var(--red)",
                  }}
                >
                  {cliente.ativo ? "✓" : "x"}
                </span>
              </div>
              <div className="col-auto p-0 d-flex gap-2">
                <button
                  className="btn btn-inverted"
                  onClick={() => {
                    navigate("/novo-cliente");
                  }}
                >
                  Editar
                </button>
                <button
                  className={`btn ${cliente.ativo && "btn-danger"}`}
                  onClick={() => {
                    // Alert(`Remover cliente ${cliente.nome}?`);
                    alterarStatusCliente(cliente);
                  }}
                >
                  {cliente.ativo ? "Desativar" : "Ativar"}
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
