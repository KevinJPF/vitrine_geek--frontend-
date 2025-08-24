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
          nomeEndereco: "Casa",
          tipoResidencia: "Apartamento",
          tipoLogradouro: "Rua",
          cep: "12345-678",
          pais: "Brasil",
          estado: "SP",
          cidade: "São Paulo",
          bairro: "Jardins",
          numero: "123",
          logradouro: "Rua das Flores",
          observacoes: "Portaria 24h",
          isCobranca: true,
          isEntrega: true,
          isFavorito: true,
        },
        {
          nomeEndereco: "Trabalho",
          tipoResidencia: "Comercial",
          tipoLogradouro: "Avenida",
          cep: "87654-321",
          pais: "Brasil",
          estado: "RJ",
          cidade: "Rio de Janeiro",
          bairro: "Centro",
          numero: "456",
          logradouro: "Avenida Central",
          observacoes: "Prédio Azul, 5º andar",
          isCobranca: false,
          isEntrega: true,
          isFavorito: false,
        },
      ],
      cartoes: [
        {
          nomeCartao: "Cartão Pessoal",
          numeroCartao: "4111111111111111",
          nomeImpresso: "KEVIN J P FRANCISCO",
          bandeira: "Visa",
          codigoSeguranca: "123",
          isFavorito: true,
        },
      ],
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
          nomeEndereco: "Casa dos Pais",
          tipoResidencia: "Casa",
          tipoLogradouro: "Travessa",
          cep: "34567-890",
          pais: "Brasil",
          estado: "MG",
          cidade: "Belo Horizonte",
          bairro: "Savassi",
          numero: "89",
          logradouro: "Travessa da Serra",
          observacoes: "Cachorro bravo no portão",
          isCobranca: true,
          isEntrega: false,
          isFavorito: false,
        },
      ],
      cartoes: [
        {
          nomeCartao: "Cartão Trabalho",
          numeroCartao: "5500000000000004",
          nomeImpresso: "KEVIN FRANCISCO",
          bandeira: "Mastercard",
          codigoSeguranca: "456",
          isFavorito: false,
        },
        {
          nomeCartao: "Cartão Emergência",
          numeroCartao: "340000000000009",
          nomeImpresso: "K J P FRANCISCO",
          bandeira: "American Express",
          codigoSeguranca: "789",
          isFavorito: false,
        },
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
          nomeEndereco: "Chácara",
          tipoResidencia: "Casa",
          tipoLogradouro: "Estrada",
          cep: "11223-445",
          pais: "Brasil",
          estado: "SP",
          cidade: "Atibaia",
          bairro: "Zona Rural",
          numero: "SN",
          logradouro: "Estrada do Lago",
          observacoes: "Entrada de terra após a ponte",
          isCobranca: false,
          isEntrega: false,
          isFavorito: false,
        },
      ],
      cartoes: [
        {
          nomeCartao: "Cartão Nubank",
          numeroCartao: "5274838273827483",
          nomeImpresso: "KEVIN JULIANO",
          bandeira: "Mastercard",
          codigoSeguranca: "321",
          isFavorito: false,
        },
      ],
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
                  {cliente.nome}
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
                    color: cliente.ativo ? "var(--green)" : "var(--red)",
                    borderRight: "2px solid var(--secondary)",
                  }}
                >
                  {cliente.ativo ? "✓" : "x"}
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
                      cliente.ativo ? "btn-danger" : "btn-green"
                    }`}
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
