import Input, { MasksEnum } from "../../../../Components/Input/Input";
import SwitchButton from "../../../../Components/SwitchButton/SwitchButton";

const FormDadosEndereco = ({
  novoEndereco,
  setNovoEndereco,
  validacaoCampos,
  setValidacaoCampos,
  fetchCepData,
}) => {
  const handleChange = (field, value) => {
    setNovoEndereco({ ...novoEndereco, [field]: value });
  };

  return (
    <div className="col d-flex flex-column gap-3">
      <div className="row gap-2">
        <div className="col">
          <div className="row">
            <Input
              label={"Nome:"}
              data_cy="input-nome-endereco"
              isRequired={true}
              value={novoEndereco.nome_endereco}
              isCorrect={validacaoCampos.endereco.nome_endereco}
              onChange={(value) => handleChange("nome_endereco", value)}
            />
          </div>
        </div>
        <div className="col">
          <div className="row">
            <Input
              label={"Tipo de Residência:"}
              data_cy="input-tipo-residencia"
              isRequired={true}
              value={novoEndereco.tipo_residencia}
              isCorrect={validacaoCampos.endereco.tipo_residencia}
              onChange={(value) => handleChange("tipo_residencia", value)}
            />
          </div>
        </div>
        <div className="col">
          <div className="row">
            <Input
              label={"Tipo de Logradouro:"}
              data_cy="input-tipo-logradouro"
              isRequired={true}
              value={novoEndereco.tipo_logradouro}
              isCorrect={validacaoCampos.endereco.tipo_logradouro}
              onChange={(value) => handleChange("tipo_logradouro", value)}
            />
          </div>
        </div>
        <div className="col">
          <div className="row">
            <Input
              label={"CEP:"}
              data_cy="input-cep"
              isRequired={true}
              value={novoEndereco.cep}
              maskType={MasksEnum.CEP}
              isCorrect={validacaoCampos.endereco.cep}
              onChange={(value) => handleChange("cep", value)}
              onBlur={async () => {
                return; // ! desabilitado temporariamente
                const cepData = await fetchCepData(novoEndereco.cep);
                if (cepData.erro) {
                  setValidacaoCampos({
                    ...validacaoCampos,
                    endereco: {
                      ...validacaoCampos.endereco,
                      cep: false,
                    },
                  });
                }
                setNovoEndereco({
                  ...novoEndereco,
                  pais: cepData.erro ? "" : "Brasil",
                  estado: cepData.uf || "",
                  cidade: cepData.localidade || "",
                  bairro: cepData.bairro || "",
                  logradouro: cepData.logradouro || "",
                });
              }}
            />
          </div>
        </div>
      </div>
      <div className="row gap-2">
        <div className="col">
          <div className="row">
            <Input
              label={"País:"}
              data_cy="input-pais"
              isRequired={true}
              value={novoEndereco.pais}
              isCorrect={validacaoCampos.endereco.pais}
              onChange={(value) => handleChange("pais", value)}
            />
          </div>
        </div>
        <div className="col">
          <div className="row">
            <Input
              label={"UF:"}
              data_cy="input-estado"
              isRequired={true}
              value={novoEndereco.estado}
              isCorrect={validacaoCampos.endereco.estado}
              maxLength={2}
              onChange={(value) => handleChange("estado", value)}
            />
          </div>
        </div>
        <div className="col">
          <div className="row">
            <Input
              label={"Cidade:"}
              data_cy="input-cidade"
              isRequired={true}
              value={novoEndereco.cidade}
              isCorrect={validacaoCampos.endereco.cidade}
              onChange={(value) => handleChange("cidade", value)}
            />
          </div>
        </div>
        <div className="col">
          <div className="row">
            <Input
              label={"Bairro:"}
              data_cy="input-bairro"
              isRequired={true}
              value={novoEndereco.bairro}
              isCorrect={validacaoCampos.endereco.bairro}
              onChange={(value) => handleChange("bairro", value)}
            />
          </div>
        </div>
      </div>
      <div className="row gap-2">
        <div className="col">
          <div className="row">
            <Input
              label={"Logradouro:"}
              data_cy="input-logradouro"
              isRequired={true}
              value={novoEndereco.logradouro}
              isCorrect={validacaoCampos.endereco.logradouro}
              onChange={(value) => handleChange("logradouro", value)}
            />
          </div>
        </div>
        <div className="col">
          <div className="row">
            <Input
              label={"Número:"}
              data_cy="input-numero"
              isRequired={true}
              value={novoEndereco.numero}
              isCorrect={validacaoCampos.endereco.numero}
              isOnlyNumbers={true}
              maxLength={10}
              onChange={(value) => handleChange("numero", value)}
            />
          </div>
        </div>
        <div className="col-6 p-0">
          <div className="row">
            <Input
              label={"Observação:"}
              data_cy="input-obs-endereco"
              value={novoEndereco.obs_endereco}
              onChange={(value) => handleChange("obs_endereco", value)}
            />
          </div>
        </div>
      </div>
      <div
        className="row mt-2 gap-2 justify-content-center align-items-center bg-white rounded-pill"
        style={{ color: "var(--secondary)", flexWrap: "nowrap" }}
      >
        Cobrança:
        <SwitchButton
          checked={novoEndereco.endereco_cobranca}
          data_cy="switch-endereco-cobranca"
          onChange={() => {
            setNovoEndereco({
              ...novoEndereco,
              endereco_cobranca: !novoEndereco.endereco_cobranca,
              endereco_entrega: true,
            });
          }}
        />
        Entrega:
        <SwitchButton
          checked={novoEndereco.endereco_entrega}
          data_cy="switch-endereco-entrega"
          onChange={() => {
            setNovoEndereco({
              ...novoEndereco,
              endereco_entrega: !novoEndereco.endereco_entrega,
              endereco_cobranca: true,
            });
          }}
        />
        Favorito:
        <SwitchButton
          checked={novoEndereco.favorito}
          data_cy="switch-endereco-favorito"
          onChange={() => handleChange("favorito", !novoEndereco.favorito)}
        />
      </div>
    </div>
  );
};

export default FormDadosEndereco;
