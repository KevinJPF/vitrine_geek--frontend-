import Input, { MasksEnum } from "../../../../Components/Input/Input";
import Dropdown from "react-bootstrap/Dropdown";
import SwitchButton from "../../../../Components/SwitchButton/SwitchButton";

const FormDadosCartao = ({
  novoCartao,
  setNovoCartao,
  validacaoCampos,
  bandeiras,
}) => {
  const handleChange = (field, value) => {
    setNovoCartao({ ...novoCartao, [field]: value });
  };

  return (
    <div
      className="col d-flex flex-column gap-3"
      style={{ textWrap: "nowrap" }}
    >
      <div className="row gap-2">
        {/* Nome do Cartão */}
        <div className="col">
          <div className="row ">
            <Input
              label={"Nome do Cartão:"}
              data_cy="input-nome-cartao"
              isRequired={true}
              value={novoCartao.nome_cartao}
              isCorrect={validacaoCampos.cartao.nome_cartao}
              onChange={(value) => handleChange("nome_cartao", value)}
            />
          </div>
        </div>
        {/* Numero do Cartão */}
        <div className="col">
          <div className="row">
            <Input
              label={"Número do Cartão:"}
              data_cy="input-numero-cartao"
              isRequired={true}
              value={novoCartao.numero_cartao}
              maskType={MasksEnum.CREDIT_CARD}
              isOnlyNumbers={true}
              maxLength={16}
              isCorrect={validacaoCampos.cartao.numero_cartao}
              onChange={(value) => handleChange("numero_cartao", value)}
            />
          </div>
        </div>
      </div>
      <div className="row gap-2">
        {/* Nome Impresso no Cartão */}
        <div className="col">
          <div className="row">
            <Input
              label={"Nome Impresso no Cartão:"}
              data_cy="input-nome-impresso"
              isRequired={true}
              value={novoCartao.nome_impresso}
              isCorrect={validacaoCampos.cartao.nome_impresso}
              onChange={(value) => handleChange("nome_impresso", value)}
            />
          </div>
        </div>
        {/* Código de Segurança */}
        <div className="col">
          <div className="row">
            <Input
              label={"Código de Segurança:"}
              data_cy="input-codigo-seguranca"
              isRequired={true}
              value={novoCartao.codigo_seguranca}
              isCorrect={validacaoCampos.cartao.codigo_seguranca}
              isOnlyNumbers={true}
              maxLength={3}
              onChange={(value) => handleChange("codigo_seguranca", value)}
            />
          </div>
        </div>
        {/* Bandeira do Cartão */}
        <div className="col-auto p-0">
          <div className="row label ps-2" style={{ flexWrap: "nowrap" }}>
            Bandeira do Cartão:
            <span className="col ps-1" style={{ color: "var(--red)" }}>
              *
            </span>
          </div>
          <div className="row">
            <Dropdown className="col p-0">
              <Dropdown.Toggle
                variant="success"
                data-cy="dropdown-id-bandeira"
                id="dropdown-basic"
              >
                {bandeiras.find(
                  (bandeira) => bandeira.id_bandeira === novoCartao.id_bandeira
                )?.nome_bandeira || "Selecione a bandeira"}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {bandeiras &&
                  bandeiras.map((bandeira, index) => (
                    <Dropdown.Item
                      key={index}
                      onClick={() => handleChange("id_bandeira", index + 1)}
                      data-cy={`dropdown-id-bandeira-${bandeira.nome_bandeira.toLowerCase()}`}
                    >
                      {bandeira.nome_bandeira}
                    </Dropdown.Item>
                  ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </div>
      <div className="row mt-2 gap-2">
        {/* Favorito */}
        <div className="col">
          <div
            className="row mt-2 gap-2 justify-content-center align-items-center bg-white rounded-pill"
            style={{ color: "var(--secondary)" }}
          >
            Favorito:
            <SwitchButton
              data_cy={"switch-cartao-favorito"}
              checked={novoCartao.favorito}
              onChange={() => handleChange("favorito", !novoCartao.favorito)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormDadosCartao;
