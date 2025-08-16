import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Styles from "./Clientes.module.css";
import Input from "../../Components/Input/Input";

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
    enderecos: [{ nome: "Casa" }],
    cartoes: [{ nome: "Nubank" }, { nome: "Santander" }],
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
      <div className="col-auto p-2 d-flex flex-row justify-content-center align-items-center">
        <p className="m-0" style={{ color: "var(--highlight)" }}>
          Novo Cliente
        </p>
      </div>
      <div
        className={`col my-2 px-3 rounded-4 d-flex flex-column gap-2 shadow`}
        style={{ backgroundColor: "var(--primary)", color: "var(--white)" }}
      >
        <div
          className="row label justify-content-center"
          style={{
            borderBottom: "2px solid var(--highlight)",
          }}
        >
          Dados Pessoais
        </div>
        <div className="row">
          <div className="row gap-2">
            <div className="col">
              <div className="row label ps-2">Nome:</div>
              <div className="row">
                <Input
                  type="text"
                  value={dadosCliente.nome}
                  onChange={(e) => {
                    setDadosCliente({ ...dadosCliente, nome: e.target.value });
                  }}
                />
              </div>
            </div>
            <div className="col">
              <div className="row label ps-2">Gênero:</div>
              <div className="row">
                <Input
                  type="text"
                  value={dadosCliente.genero}
                  onChange={(e) => {
                    setDadosCliente({
                      ...dadosCliente,
                      genero: e.target.value,
                    });
                  }}
                />
              </div>
            </div>
          </div>
          <div className="row gap-2">
            <div className="col">
              <div className="row label ps-2">Data Nasc.:</div>
              <div className="row">
                <Input
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
              <div className="row label ps-2">CPF:</div>
              <div className="row">
                <Input
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
              <div className="row label ps-2">Email:</div>
              <div className="row">
                <Input
                  type="text"
                  value={dadosCliente.email}
                  onChange={(e) => {
                    setDadosCliente({ ...dadosCliente, email: e.target.value });
                  }}
                />
              </div>
            </div>
            <div className="col">
              <div className="row label ps-2">Telefone:</div>
              <div className="row">
                <Input
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
              <div className="row label ps-2">Senha:</div>
              <div className="row">
                <Input
                  value={dadosCliente.senha}
                  isPassword={true}
                  // isCorrect={false}
                  onChange={(e) => {
                    setDadosCliente({ ...dadosCliente, senha: e.target.value });
                    compararSenha(senhaParaConfirmar, e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="col">
              <div className="row label ps-2">Confirmar Senha:</div>
              <div className="row">
                <Input
                  value={senhaParaConfirmar}
                  isPassword={true}
                  // isCorrect={true}
                  onChange={(e) => {
                    setSenhaParaConfirmar(e.target.value);
                    compararSenha(dadosCliente.senha, e.target.value);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div
          className="row label justify-content-center"
          style={{
            borderBottom: "2px solid var(--highlight)",
          }}
        >
          Endereços
        </div>
        <div className="row gap-2">
          {dadosCliente.enderecos.map((endereco, index) => (
            <div key={index} className={`col-auto ${Styles.endereco_card}`}>
              Nome: {endereco.nome}
            </div>
          ))}
          <div className={`col-auto ${Styles.add_card}`}>+</div>
        </div>
        <div
          className="row label justify-content-center"
          style={{
            borderBottom: "2px solid var(--highlight)",
          }}
        >
          Cartões
        </div>
        <div className="row gap-2">
          {dadosCliente.cartoes.map((cartao, index) => (
            <div key={index} className={`col-auto ${Styles.cartao_card}`}>
              Nome: {cartao.nome}
            </div>
          ))}
          <div className={`col-auto ${Styles.add_card}`}>+</div>
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
