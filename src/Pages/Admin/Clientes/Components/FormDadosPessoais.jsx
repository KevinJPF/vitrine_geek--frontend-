import Input, { MasksEnum } from "../../../../Components/Input/Input";
import Dropdown from "react-bootstrap/Dropdown";

const FormDadosPessoais = ({
  dadosCliente,
  setDadosCliente,
  validacaoCampos,
  setValidacaoCampos,
  senhaParaConfirmar,
  setSenhaParaConfirmar,
  validateEmail,
  compararSenha,
}) => {
  const handleChange = (field, value) => {
    setDadosCliente({ ...dadosCliente, [field]: value });
  };

  const validarSenha = () => {
    if (dadosCliente.senha && senhaParaConfirmar) {
      setValidacaoCampos({
        ...validacaoCampos,
        senha: compararSenha(dadosCliente.senha, senhaParaConfirmar),
      });
    }
  };

  const generos = ["Masculino", "Feminino", "Outro"];
  const tiposTelefone = ["Celular", "Fixo"];

  return (
    <div className="row px-3 pb-3">
      {/* Dados Pessoais */}
      <div className="row gap-2">
        <div className="col-3 p-0">
          <Input
            label="Nome:"
            data_cy="input-nome-cliente"
            isRequired
            value={dadosCliente.nome_cliente}
            isCorrect={validacaoCampos.nome_cliente}
            onChange={(value) => handleChange("nome_cliente", value)}
          />
        </div>
        <div className="col-2 p-0">
          <Input
            label="CPF:"
            data_cy="input-cpf-cliente"
            isRequired
            maskType={MasksEnum.CPF}
            value={dadosCliente.cpf}
            isCorrect={validacaoCampos.cpf}
            onChange={(value) => handleChange("cpf", value)}
          />
        </div>
        <div className="col-2 p-0">
          <Input
            label="Data Nasc.:"
            data_cy="input-data-nascimento"
            isRequired
            maskType={MasksEnum.DATE}
            value={dadosCliente.data_nascimento}
            isCorrect={validacaoCampos.data_nascimento}
            onChange={(value) => handleChange("data_nascimento", value)}
          />
        </div>
        <div className="col-auto p-0">
          <label className="row label ps-2" style={{ flexWrap: "nowrap" }}>
            Gênero:
            <span className="col ps-1" style={{ color: "var(--red)" }}>
              *
            </span>
          </label>
          <Dropdown className="p-0">
            <Dropdown.Toggle
              variant="success"
              id="dropdown-genero"
              data-cy="dropdown-genero"
            >
              {dadosCliente.genero || "Selecione o gênero"}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {generos.map((g) => (
                <Dropdown.Item
                  key={g}
                  data-cy={`dropdown-genero-${g.toLowerCase()}`}
                  onClick={() => handleChange("genero", g)}
                >
                  {g}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>

      {/* Contato */}
      <div className="row gap-2">
        <div className="col-3 p-0">
          <Input
            label="Email:"
            data_cy="input-email-cliente"
            isRequired
            value={dadosCliente.email}
            isCorrect={validacaoCampos.email}
            onChange={(value) => handleChange("email", value)}
            onBlur={() =>
              setValidacaoCampos({
                ...validacaoCampos,
                email: validateEmail(dadosCliente.email),
              })
            }
          />
        </div>
        <div className="col-1 p-0">
          <Input
            label="DDD:"
            data_cy="input-ddd"
            isRequired
            isOnlyNumbers
            maxLength={2}
            value={dadosCliente.telefone_ddd}
            isCorrect={validacaoCampos.telefone_ddd}
            onChange={(value) => handleChange("telefone_ddd", value)}
          />
        </div>
        <div className="col-2 p-0">
          <Input
            label="Telefone:"
            data_cy="input-telefone"
            isRequired
            maskType={
              dadosCliente.telefone_tipo === "Celular"
                ? MasksEnum.CEL
                : MasksEnum.PHONE
            }
            value={dadosCliente.telefone_numero}
            isCorrect={validacaoCampos.telefone_numero}
            onChange={(value) => handleChange("telefone_numero", value)}
          />
        </div>
        <div className="col-auto p-0">
          <label className="row label ps-2" style={{ flexWrap: "nowrap" }}>
            Tipo Telefone:
            <span className="col ps-1" style={{ color: "var(--red)" }}>
              *
            </span>
          </label>
          <Dropdown className="p-0">
            <Dropdown.Toggle
              variant="success"
              id="dropdown-tipo-telefone"
              data-cy="dropdown-tipo-telefone"
            >
              {dadosCliente.telefone_tipo || "Selecione o tipo"}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {tiposTelefone.map((tipo) => (
                <Dropdown.Item
                  key={tipo}
                  data-cy={`dropdown-tipo-telefone-${tipo.toLowerCase()}`}
                  onClick={() => handleChange("telefone_tipo", tipo)}
                >
                  {tipo}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>

      {/* Senha */}
      <div className="row gap-2">
        <div className="col-3 p-0">
          <Input
            label="Senha:"
            data_cy="input-senha"
            isRequired
            isPassword
            value={dadosCliente.senha}
            isCorrect={validacaoCampos.senha}
            onChange={(value) => handleChange("senha", value)}
            onBlur={validarSenha}
          />
        </div>
        <div className="col-3 p-0">
          <Input
            label="Confirma Senha:"
            data_cy="input-confirmar-senha"
            isRequired
            isPassword
            value={senhaParaConfirmar}
            isCorrect={validacaoCampos.senha}
            onChange={(value) => setSenhaParaConfirmar(value)}
            onBlur={validarSenha}
          />
        </div>
      </div>
    </div>
  );
};

export default FormDadosPessoais;
