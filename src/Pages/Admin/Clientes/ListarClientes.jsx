import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useGetData } from "../../../Hooks/useGetData";
import { usePatchData } from "../../../Hooks/usePatchData";

const ListarClientes = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { getApiData } = useGetData();
  const { patchApiData } = usePatchData();
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
    fetchClientes();
  }, [location]);

  const fetchClientes = async () => {
    const result = await getApiData("clientes");
    // console.log(result);
    setClientes(result);
  };

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
            Nome
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
            Ativo
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
                data-cy="card-cliente"
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
                    textWrap: "nowrap",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                  }}
                >
                  {cliente.nome_cliente}
                </div>
                <div
                  className="col-3"
                  style={{
                    borderRight: "2px solid var(--secondary)",
                    textWrap: "nowrap",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
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
                  data-cy="status-cliente"
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
                    data-cy="btn-editar-cliente"
                    className="btn btn-inverted"
                    onClick={() => {
                      localStorage.setItem("indexCliente", index);
                      navigate(`/admin/editar-cliente/${cliente.id_cliente}`, {
                        state: { cliente },
                      });
                    }}
                  >
                    Editar
                  </button>
                  <button
                    data-cy={`btn-${
                      cliente.cliente_ativo ? "desativar" : "ativar"
                    }-cliente`}
                    className={`btn ${
                      cliente.cliente_ativo ? "btn-danger" : "btn-green"
                    }`}
                    onClick={async () => {
                      if (
                        (
                          await patchApiData(
                            "clientes/ativar-desativar",
                            cliente.id_cliente
                          )
                        ).status === 200
                      )
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
      <div className="col-auto d-flex justify-content-end py-2">
        <button
          className="btn"
          onClick={async () => {
            await navigate("/admin/registrar-cliente");
          }}
        >
          Adicionar
        </button>
      </div>
    </div>
  );
};

export default ListarClientes;
