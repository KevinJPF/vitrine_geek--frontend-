import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useFetchData } from "../../../Hooks/useFetchData";

const ListarClientes = () => {
  const navigate = useNavigate();
  const { fetchApiData } = useFetchData("clientes");
  const [clientes, setClientes] = useState([]);

  const alterarStatusCliente = (clienteParaAlterar) => {
    setClientes(
      clientes.map((cliente) => {
        if (cliente == clienteParaAlterar)
          cliente.cliente_ativo = !cliente.cliente_ativo;
        return cliente;
      })
    );
  };

  useEffect(() => {
    const fetchClientes = async () => {
      const result = await fetchApiData("clientes");
      console.log(result);
      setClientes(result);
    };

    fetchClientes();
  }, []);

  return (
    <div className="container d-flex flex-column min-vh-100">
      <div className="col-auto p-2 d-flex flex-row justify-content-center align-items-center">
        <p className="m-0" style={{ color: "var(--highlight" }}>
          Clientes
        </p>
      </div>
      <div
        className={`col my-2 rounded-4 d-flex flex-column shadow`}
        style={{
          backgroundColor: "var(--primary)",
          color: "var(--white)",
        }}
      >
        <div
          className="row"
          style={{
            backgroundColor: "var(--highlight)",
            color: "var(--secondary)",
            borderBottom: "2px solid var(--secondary)",
            borderRadius: "16px 16px 0px 0px",
          }}
        >
          <div
            className="col-2 d-flex justify-content-center"
            style={{
              borderRight: "2px solid var(--highlight)",
            }}
          >
            nome_cliente
          </div>
          <div
            className="col-3  d-flex justify-content-center"
            style={{
              borderRight: "2px solid var(--highlight)",
            }}
          >
            Email
          </div>
          <div
            className="col-2  d-flex justify-content-center"
            style={{
              borderRight: "2px solid var(--highlight)",
            }}
          >
            CPF
          </div>
          <div
            className="col-2  d-flex justify-content-center"
            style={{
              borderRight: "2px solid var(--highlight)",
            }}
          >
            cliente_ativo
          </div>
          <div className="col-3  d-flex justify-content-center">Ação</div>
        </div>
        <div
          className="col overflow-hidden"
          style={{
            // backgroundColor: "#0000001f",
            borderRadius: "0px 0px 16px 16px",
          }}
        >
          {clientes.map((cliente, index) => {
            return (
              <div
                key={index}
                className="row py-2"
                style={{
                  backgroundColor: index % 2 == 0 ? "#ffffff10" : "#ffffff1f",
                  borderBottom: "2px solid var(--secondary)",
                  color: "var(--secondary)",
                }}
              >
                <div
                  className="col-2"
                  style={{
                    borderRight: "2px solid var(--secondary)",
                  }}
                >
                  {cliente.nome_cliente}
                </div>
                <div
                  className="col-3"
                  style={{
                    borderRight: "2px solid var(--secondary)",
                  }}
                >
                  {cliente.email}
                </div>
                <div
                  className="col-2"
                  style={{
                    borderRight: "2px solid var(--secondary)",
                  }}
                >
                  {cliente.cpf}
                </div>
                <div
                  className="col-2 label d-flex justify-content-center"
                  style={{
                    color: cliente.cliente_ativo
                      ? "var(--green)"
                      : "var(--red)",
                    borderRight: "2px solid var(--secondary)",
                  }}
                >
                  {cliente.cliente_ativo ? "✓" : "x"}
                </div>
                <div className="col-3 gap-2 d-flex justify-content-center">
                  <button
                    className="btn btn-inverted"
                    onClick={() => {
                      localStorage.setItem("indexCliente", index);
                      navigate("/registrar-cliente", {
                        state: { cliente },
                      });
                    }}
                  >
                    Editar
                  </button>
                  <button
                    className={`btn ${
                      cliente.cliente_ativo ? "btn-danger" : "btn-green"
                    }`}
                    onClick={() => {
                      // Alert(`Remover cliente ${cliente.nome_cliente}?`);
                      alterarStatusCliente(cliente);
                    }}
                  >
                    {cliente.cliente_ativo ? "Desativar" : "Ativar"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="col-auto d-flex justify-content-between py-2">
        <button
          className="btn btn-outline"
          onClick={() => {
            navigate("/");
          }}
        >
          Voltar
        </button>
        <button
          className="btn"
          onClick={async () => {
            navigate("/registrar-cliente");
          }}
        >
          Adicionar
        </button>
      </div>
    </div>
  );
};

export default ListarClientes;
