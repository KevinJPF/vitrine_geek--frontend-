import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const RegistrarCliente = () => {
  const navigate = useNavigate();

  const [dadosCliente, setDadosCliente] = useState({
    nome: "",
    genero: "",
    cpf: "",
    nascimento: "",
    email: "",
    telefone: "",
    senha: "",
    enderecos: [],
    cartoes: [],
  });
  const [senhaParaConfirmar, setSenhaParaConfirmar] = useState("");

  const compararSenha = (senhaOriginal, senhaParaConfirmar) => {
    const isEqual = senhaParaConfirmar == senhaOriginal;
    if (isEqual) console.log("ingual");
    return isEqual;
  };

  useEffect(() => {
    console.log(dadosCliente);
  }, [dadosCliente]);

  return (
    <div className="container d-flex flex-column min-vh-100">
      <div
        className="col-auto p-2 d-flex flex-row justify-content-center align-items-center"
        style={{ borderBottom: "1px solid black" }}
      >
        <p className="m-0" style={{ color: "var(--highlight" }}>
          Novo Cliente
        </p>
      </div>
      <div className="col my-2 d-flex flex-column gap-2">
        <div className="row gap-2">
          <div className="col">
            <div className="row">Nome:</div>
            <div className="row">
              <input
                type="text"
                value={dadosCliente.nome}
                onChange={(e) => {
                  setDadosCliente({ ...dadosCliente, nome: e.target.value });
                }}
              />
            </div>
          </div>
          <div className="col">
            <div className="row">Gênero:</div>
            <div className="row">
              <input
                type="text"
                value={dadosCliente.genero}
                onChange={(e) => {
                  setDadosCliente({ ...dadosCliente, genero: e.target.value });
                }}
              />
            </div>
          </div>
        </div>
        <div className="row gap-2">
          <div className="col">
            <div className="row">Data Nasc.:</div>
            <div className="row">
              <input
                type="text"
                value={dadosCliente.nascimento}
                onChange={(e) => {
                  setDadosCliente({
                    ...dadosCliente,
                    nascimento: e.target.value,
                  });
                }}
              />
            </div>
          </div>
          <div className="col">
            <div className="row">CPF:</div>
            <div className="row">
              <input
                type="text"
                value={dadosCliente.cpf}
                onChange={(e) => {
                  setDadosCliente({ ...dadosCliente, cpf: e.target.value });
                }}
              />
            </div>
          </div>
        </div>
        <div className="row gap-2">
          <div className="col">
            <div className="row">Email:</div>
            <div className="row">
              <input
                type="text"
                value={dadosCliente.email}
                onChange={(e) => {
                  setDadosCliente({ ...dadosCliente, email: e.target.value });
                }}
              />
            </div>
          </div>
          <div className="col">
            <div className="row">Telefone:</div>
            <div className="row">
              <input
                type="text"
                value={dadosCliente.telefone}
                onChange={(e) => {
                  setDadosCliente({
                    ...dadosCliente,
                    telefone: e.target.value,
                  });
                }}
              />
            </div>
          </div>
        </div>
        <div className="row gap-2">
          <div className="col">
            <div className="row">Senha:</div>
            <div className="row">
              <input
                type="text"
                value={dadosCliente.senha}
                onChange={(e) => {
                  setDadosCliente({ ...dadosCliente, senha: e.target.value });
                  compararSenha(senhaParaConfirmar, e.target.value);
                }}
              />
            </div>
          </div>
          <div className="col">
            <div className="row">Confirmar Senha:</div>
            <div className="row">
              <input
                type="text"
                value={senhaParaConfirmar}
                onChange={(e) => {
                  setSenhaParaConfirmar(e.target.value);
                  compararSenha(dadosCliente.senha, e.target.value);
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="col-auto d-flex justify-content-end gap-2 py-2">
        <button
          className="btn btn-inverted"
          onClick={() => {
            navigate("/clientes");
          }}
        >
          Cancelar
        </button>
        <button
          className="btn"
          onClick={() => {
            navigate("/registrar-cliente");
          }}
        >
          Confirmar
        </button>
      </div>
    </div>
  );
};

export default RegistrarCliente;
