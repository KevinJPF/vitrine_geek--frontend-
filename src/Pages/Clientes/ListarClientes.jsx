import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const ListarClientes = () => {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([
    {
      nome: "João Silva",
      genero: "Masculino",
      cpf: "12345678901",
      nascimento: "10/05/1990",
      email: "joao.silva@email.com",
      telefone: "11987654321",
      senha: "123456",
      ativo: true,
      enderecos: [
        {
          nome: "Casa",
          logradouro: "Rua das Flores, 123",
        },
      ],
      cartoes: [{ nomeCartao: "Nubank", numeroCartao: "1234-5678-9012-3456" }],
    },
    {
      nome: "Maria Oliveira",
      genero: "Feminino",
      cpf: "98765432109",
      nascimento: "22/11/1988",
      email: "maria.oliveira@email.com",
      telefone: "11999998888",
      senha: "maria@123",
      ativo: true,
      enderecos: [
        {
          nome: "Apartamento",
          logradouro: "Av. Central, 456",
        },
      ],
      cartoes: [
        { nomeCartao: "Santander", numeroCartao: "4444-3333-2222-1111" },
      ],
    },
    {
      nome: "Pedro Costa",
      genero: "Masculino",
      cpf: "45678912300",
      nascimento: "03/03/1995",
      email: "pedro.costa@email.com",
      telefone: "11955554444",
      senha: "pedro@99",
      ativo: false,
      enderecos: [
        {
          nome: "Casa",
          logradouro: "Rua José Alves, 89",
        },
      ],
      cartoes: [{ nomeCartao: "Itaú", numeroCartao: "8888-7777-6666-5555" }],
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

  useEffect(() => {
    const novoCliente = localStorage.getItem("novoCliente");
    const editcliente = localStorage.getItem("editCliente");
    const index = localStorage.getItem("indexCliente");

    if (editcliente && index !== null) {
      setClientes((old) => {
        const updated = [...old];
        updated[index] = JSON.parse(editcliente);
        return updated;
      });
      localStorage.removeItem("editCliente");
      localStorage.removeItem("indexCliente");
    }

    if (novoCliente) {
      setClientes((old) => [...old, JSON.parse(novoCliente)]);
      localStorage.removeItem("novoCliente");
    }
  }, []);

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
        {clientes.map((cliente, index) => {
          return (
            <div
              key={index}
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
                    localStorage.setItem("indexCliente", index);
                    navigate("/registrar-cliente", {
                      state: { cliente },
                    });
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
