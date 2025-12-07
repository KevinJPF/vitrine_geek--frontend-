import { useEffect, useState } from "react";
import { useGetData } from "../../../Hooks/useGetData";

const ListarLogs = () => {
  const { getApiData } = useGetData();
  const [tipoLog, setTipoLog] = useState("pedidos"); // "pedidos" ou "produtos"
  const [logsPedidos, setLogsPedidos] = useState([]);
  const [logsProdutos, setLogsProdutos] = useState([]);

  const fetchLogsPedidos = async () => {
    try {
      const result = await getApiData("pedidos/logs");
      console.log("Logs de Pedidos:", result);
      setLogsPedidos(result);
    } catch (error) {
      console.error("Erro ao buscar logs de pedidos:", error);
    }
  };

  const fetchLogsProdutos = async () => {
    try {
      const result = await getApiData("produtos/logs");
      console.log("Logs de Produtos:", result);
      setLogsProdutos(result);
    } catch (error) {
      console.error("Erro ao buscar logs de produtos:", error);
    }
  };

  const formatarData = (dataISO) => {
    const data = new Date(dataISO);
    return data.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const traduzirTipoAlteracao = (tipo) => {
    const tipos = {
      atualizacao: "Atualização",
      criacao: "Criação",
      inativacao: "Inativação",
      ativacao: "Ativação",
      diminuicao_estoque: "Diminuição Estoque",
      aumento_estoque: "Aumento Estoque",
    };
    return tipos[tipo] || tipo;
  };

  useEffect(() => {
    fetchLogsPedidos();
    fetchLogsProdutos();
  }, []);

  const logsAtivos = tipoLog === "pedidos" ? logsPedidos : logsProdutos;

  return (
    <div className="container d-flex flex-column min-vh-100">
      <div className="col-auto p-2 d-flex flex-row justify-content-center align-items-center">
        <p className="m-0" style={{ color: "var(--highlight)" }}>
          Logs do Sistema
        </p>
      </div>

      {/* Botões de alternância */}
      <div className="col-auto d-flex justify-content-center gap-2 mb-3">
        <button
          className={`btn ${tipoLog === "pedidos" ? "" : "btn-outline"}`}
          onClick={() => setTipoLog("pedidos")}
        >
          Logs de Pedidos
        </button>
        <button
          className={`btn ${tipoLog === "produtos" ? "" : "btn-outline"}`}
          onClick={() => setTipoLog("produtos")}
        >
          Logs de Produtos
        </button>
      </div>

      <div
        className={`col my-2 rounded-4 d-flex flex-column shadow`}
        style={{
          backgroundColor: "var(--primary)",
          color: "var(--white)",
        }}
      >
        {/* Cabeçalho da tabela - Logs de Pedidos */}
        {tipoLog === "pedidos" && (
          <>
            <div
              className="row"
              style={{
                backgroundColor: "var(--highlight)",
                color: "var(--secondary)",
                borderBottom: "2px solid var(--secondary)",
                borderRadius: "16px 16px 0px 0px",
              }}
            >
              <div className="col-2 d-flex justify-content-center">
                Data/Hora
              </div>
              <div className="col-1 d-flex justify-content-center">Tipo</div>
              <div className="col-2 d-flex justify-content-center">Motivo</div>
              <div className="col-2 d-flex justify-content-center">
                Status Anterior
              </div>
              <div className="col-2 d-flex justify-content-center">
                Status Novo
              </div>
              <div className="col-1 d-flex justify-content-center">
                Pedido ID
              </div>
              <div className="col-2 d-flex justify-content-center">Usuário</div>
            </div>

            {/* Corpo da tabela - Logs de Pedidos */}
            <div
              className="col overflow-auto"
              style={{
                borderRadius: "0px 0px 16px 16px",
              }}
            >
              {logsAtivos.length === 0 ? (
                <div
                  className="row py-3 d-flex justify-content-center"
                  style={{ color: "var(--secondary)" }}
                >
                  Nenhum log de pedido encontrado
                </div>
              ) : (
                logsAtivos.map((log, index) => {
                  return (
                    <div
                      key={log.id}
                      className="row py-2"
                      style={{
                        backgroundColor:
                          index % 2 === 0 ? "#ffffff10" : "#ffffff1f",
                        borderBottom: "2px solid var(--secondary)",
                        color: "var(--secondary)",
                      }}
                    >
                      <div
                        className="col-2 text-truncate"
                        style={{ borderRight: "2px solid var(--secondary)" }}
                      >
                        {formatarData(log.data_alteracao)}
                      </div>
                      <div
                        className="col-1"
                        style={{ borderRight: "2px solid var(--secondary)" }}
                      >
                        {traduzirTipoAlteracao(log.tipo_alteracao)}
                      </div>
                      <div
                        className="col-2 text-truncate"
                        style={{ borderRight: "2px solid var(--secondary)" }}
                        title={log.motivo}
                      >
                        {log.motivo}
                      </div>
                      <div
                        className="col-2 d-flex justify-content-center"
                        style={{ borderRight: "2px solid var(--secondary)" }}
                      >
                        {log.nome_status_ant ?? "-"}
                      </div>
                      <div
                        className="col-2 d-flex justify-content-center"
                        style={{ borderRight: "2px solid var(--secondary)" }}
                      >
                        {log.nome_status_novo ?? "-"}
                      </div>
                      <div
                        className="col-1 d-flex justify-content-center"
                        style={{ borderRight: "2px solid var(--secondary)" }}
                      >
                        {log.pedido_id}
                      </div>
                      <div className="col-2 d-flex justify-content-center">
                        {log.nome_cliente}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}

        {/* Cabeçalho da tabela - Logs de Produtos */}
        {tipoLog === "produtos" && (
          <>
            <div
              className="row"
              style={{
                backgroundColor: "var(--highlight)",
                color: "var(--secondary)",
                borderBottom: "2px solid var(--secondary)",
                borderRadius: "16px 16px 0px 0px",
              }}
            >
              <div className="col-1 d-flex justify-content-center">
                Data/Hora
              </div>
              <div className="col-2 d-flex justify-content-center">
                Tipo Alteração
              </div>
              <div className="col-2 d-flex justify-content-center">Motivo</div>
              <div className="col-1 d-flex justify-content-center">
                Est. Ant.
              </div>
              <div className="col-1 d-flex justify-content-center">
                Est. Novo
              </div>
              <div className="col-1 d-flex justify-content-center">
                Estado Ant.
              </div>
              <div className="col-1 d-flex justify-content-center">
                Estado Novo
              </div>
              <div className="col-1 d-flex justify-content-center">Produto</div>
              <div className="col-2 d-flex justify-content-center">Usuário</div>
            </div>

            {/* Corpo da tabela - Logs de Produtos */}
            <div
              className="col overflow-auto"
              style={{
                borderRadius: "0px 0px 16px 16px",
              }}
            >
              {logsAtivos.length === 0 ? (
                <div
                  className="row py-3 d-flex justify-content-center"
                  style={{ color: "var(--secondary)" }}
                >
                  Nenhum log de produto encontrado
                </div>
              ) : (
                logsAtivos.map((log, index) => {
                  return (
                    <div
                      key={log.id}
                      className="row py-2"
                      style={{
                        backgroundColor:
                          index % 2 === 0 ? "#ffffff10" : "#ffffff1f",
                        borderBottom: "2px solid var(--secondary)",
                        color: "var(--secondary)",
                      }}
                    >
                      <div
                        className="col-1 text-truncate"
                        style={{ borderRight: "2px solid var(--secondary)" }}
                      >
                        {formatarData(log.data_alteracao)}
                      </div>
                      <div
                        className="col-2"
                        style={{ borderRight: "2px solid var(--secondary)" }}
                      >
                        {traduzirTipoAlteracao(log.tipo_alteracao)}
                      </div>
                      <div
                        className="col-2 text-truncate"
                        style={{ borderRight: "2px solid var(--secondary)" }}
                        title={log.motivo}
                      >
                        {log.motivo}
                      </div>
                      <div
                        className="col-1 d-flex justify-content-center"
                        style={{ borderRight: "2px solid var(--secondary)" }}
                      >
                        {log.estoque_ant ?? "-"}
                      </div>
                      <div
                        className="col-1 d-flex justify-content-center"
                        style={{ borderRight: "2px solid var(--secondary)" }}
                      >
                        {log.estoque_novo ?? "-"}
                      </div>
                      <div
                        className="col-1 d-flex justify-content-center"
                        style={{ borderRight: "2px solid var(--secondary)" }}
                      >
                        {log.estado_ant
                          ? log.estado_ant == 1
                            ? "Ativo"
                            : "Inativo"
                          : "-"}
                      </div>
                      <div
                        className="col-1 d-flex justify-content-center"
                        style={{ borderRight: "2px solid var(--secondary)" }}
                      >
                        {log.estado_novo
                          ? log.estado_novo == 1
                            ? "Ativo"
                            : "Inativo"
                          : "-"}
                      </div>
                      <div
                        className="col-1 text-truncate"
                        style={{ borderRight: "2px solid var(--secondary)" }}
                      >
                        {log.nome_produto}
                      </div>
                      <div className="col-2 text-truncate">
                        {log.nome_cliente}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ListarLogs;
