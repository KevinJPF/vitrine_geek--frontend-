import React, { useEffect, useState } from "react";
import Card from "../../../../Components/Card/Card";
import { useGetData } from "../../../../Hooks/useGetData";
import PopupModal from "../../../../Components/PopupModal/PopupModal";
import { usePostData } from "../../../../Hooks/usePostData";

const ListagemPedidos = () => {
  const { getApiData } = useGetData();
  const { postApiData } = usePostData();
  const [pedidos, setPedidos] = useState([]);
  const [mostrarPopupTroca, setMostrarPopupTroca] = useState(false);
  const [pedidoParaTroca, setPedidoParaTroca] = useState(null);
  const [produtosSelecionados, setProdutosSelecionados] = useState({});

  useEffect(() => {
    fetchPedidos();
  }, []);

  const fetchPedidos = async () => {
    const result = await getApiData("pedidos/cliente/1");
    setPedidos(result || []);
  };

  const parseNumber = (v) => {
    if (v == null) return 0;
    return Number(String(v).replace(",", "."));
  };

  const formatCurrency = (v) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(parseNumber(v));

  const formatDate = (iso) => {
    try {
      return new Date(iso).toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return iso;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "EM_PROCESSAMENTO":
        return "Em Processamento";
      case "APROVADA":
        return "Aprovada";
      case "REPROVADA":
        return "Reprovada";
      case "EM_TRANSPORTE":
        return "Em Transporte";
      case "ENTREGUE":
        return "Entregue";
      case "EM_TROCA":
        return "Troca Solicitada";
      case "TROCA_AUTORIZADA":
        return "Troca Autorizada";
      case "TROCADO":
        return "Trocado";
      case "TROCA_RECUSADA":
        return "Troca Recusada";
      default:
        return status;
    }
  };

  const toggleProdutoSelecionado = (key) => {
    setProdutosSelecionados((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleConfirmTroca = async () => {
    const selecionados = Object.keys(produtosSelecionados).filter(
      (k) => produtosSelecionados[k]
    );
    if (selecionados.length === 0) {
      alert("Selecione ao menos um produto para solicitar a troca.");
      return;
    }

    try {
      let resposta = {};

      const toNumber = (v) => {
        if (v == null) return 0;
        if (typeof v === "number") return v;
        if (typeof v === "string") {
          const normalized = v.replace(/\s+/g, "").replace(",", ".");
          const n = Number(normalized);
          return Number.isFinite(n) ? n : 0;
        }
        return 0;
      };

      // Monta array de produtos selecionados conforme exigido pela API (inclui id_pedido)
      const produtosPayload = selecionados.map((produtoPayload) => {
        const produtoSelecionado = pedidoParaTroca.produtos[produtoPayload - 1];

        const unidadeNum = toNumber(
          produtoSelecionado?.valor_venda ?? produtoSelecionado?.preco ?? 0
        );
        const quantidade = Number(produtoSelecionado?.quantidade ?? 1) || 1;
        const totalItemRaw = unidadeNum * quantidade;
        const totalItem = Math.round(totalItemRaw * 100) / 100;
        return {
          produto_id: produtoSelecionado.id,
          quantidade,
          valor_unitario: Number(unidadeNum.toFixed(2)),
          valor_total: Number(totalItem.toFixed(2)),
        };
      });

      pedidoParaTroca.produtos = produtosPayload;
      pedidoParaTroca.status_id = 6;

      resposta = await postApiData("pedidos", pedidoParaTroca);

      console.log(resposta);
      if (resposta.campos_invalidos) {
        console.log(resposta.campos_invalidos);
        return;
      }
    } catch (error) {
      console.log(error);
    }

    setMostrarPopupTroca(false);
    setPedidoParaTroca(null);
    setProdutosSelecionados({});
    fetchPedidos();
  };

  return (
    <div
      className="container-fluid px-2 d-flex flex-column"
      style={{ height: "calc(100vh - 82px)" }}
    >
      <Card cardName={"Meus Pedidos"}>
        <div className="col overflow-auto h-100">
          <div
            className="col p-2 mb-4 rounded-2"
            style={{ backgroundColor: "var(--secondary)" }}
          >
            {pedidos.length === 0 && (
              <div className="text-center py-4">Nenhum pedido encontrado.</div>
            )}

            {pedidos
              .slice()
              .reverse()
              .map((pedido) => (
                <div
                  key={pedido.id_pedido ?? pedido.id ?? pedido.pedido_id}
                  className="mb-3 rounded overflow-hidden"
                  style={{
                    backgroundColor: "var(--bg)",
                    border: "1px solid var(--primary)",
                  }}
                >
                  {/* Cabeçalho do pedido */}
                  <div
                    className="d-flex justify-content-between align-items-center mb-2 p-2"
                    style={{
                      backgroundColor: "var(--primary)",
                      color: "var(--secondary)",
                    }}
                  >
                    <div className="row-auto">
                      <strong>Pedido #{pedido.id_pedido ?? "-"}</strong>
                      <div style={{ fontSize: 12, color: "var(--muted)" }}>
                        {formatDate(pedido.criado_em)}
                      </div>
                    </div>
                    <div
                      className="row d-flex align-items-center gap-3"
                      style={{ textWrap: "nowrap" }}
                    >
                      <div className="col">
                        <strong>
                          Status: {getStatusText(pedido.status_nome) ?? "-"}
                        </strong>
                        <div style={{ fontSize: 12, color: "var(--muted)" }}>
                          {pedido.status_descricao ?? "-"}
                        </div>
                      </div>
                      {pedido.status_nome === "ENTREGUE" && (
                        <div className="col">
                          <button
                            className="btn btn-highlight"
                            onClick={() => {
                              setPedidoParaTroca(pedido);
                              const sel = {};
                              (pedido.produtos || []).forEach((p) => {
                                const key =
                                  p.id ??
                                  p.produto_id ??
                                  `${pedido.id_pedido}_${p.produto_id}`;
                                sel[key] = false;
                              });
                              setProdutosSelecionados(sel);
                              setMostrarPopupTroca(true);
                            }}
                          >
                            Trocar Itens
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="row-auto text-end">
                      <div style={{ fontWeight: 600 }}>
                        {formatCurrency(pedido.valor_total)}
                      </div>
                      <div style={{ fontSize: 12, color: "var(--muted)" }}>
                        Produtos: {formatCurrency(pedido.valor_produtos)} •
                        Frete: {formatCurrency(pedido.valor_frete)}
                      </div>
                    </div>
                  </div>

                  {/* Itens do pedido (exibir somente dados relevantes) */}
                  <div>
                    {Array.isArray(pedido.produtos) &&
                      pedido.produtos.map((item, index) => (
                        <div
                          key={
                            item.id ??
                            item.produto_id ??
                            `${pedido.id_pedido}_${item.produto_id}`
                          }
                          className="d-flex align-items-center mb-2 px-2"
                          style={{
                            gap: 12,
                            borderBottom:
                              index < pedido.produtos.length - 1
                                ? "1px solid var(--white)"
                                : "none",
                          }}
                        >
                          <img
                            src={item.url_imagem}
                            alt={item.nome_produto}
                            style={{
                              width: 64,
                              height: 64,
                              objectFit: "cover",
                              borderRadius: 6,
                            }}
                          />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 600 }}>
                              {item.nome_produto}
                            </div>
                            <div
                              style={{ fontSize: 13, color: "var(--muted)" }}
                            >
                              {item.codigo ? `Cód.: ${item.codigo} • ` : ""}
                              {item.descricao ? `Desc.: ${item.descricao}` : ""}
                            </div>
                          </div>
                          <div className="text-end" style={{ minWidth: 120 }}>
                            <div>{item.quantidade}x</div>
                            <div style={{ fontSize: 14 }}>
                              {formatCurrency(
                                item.valor_unitario ?? item.valor_venda
                              )}
                            </div>
                            <div style={{ fontWeight: 600 }}>
                              {formatCurrency(item.valor_total)}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </Card>

      <PopupModal
        isOpen={mostrarPopupTroca}
        title={`Solicitar Troca - Pedido #${pedidoParaTroca?.id_pedido ?? ""}`}
        cancel_data_cy={"btn-cancelar-troca"}
        confirm_data_cy={"btn-confirmar-troca"}
        onCancel={() => {
          setMostrarPopupTroca(false);
          setPedidoParaTroca(null);
          setProdutosSelecionados({});
        }}
        onConfirm={handleConfirmTroca}
      >
        <div style={{ maxHeight: 320, overflow: "auto", minWidth: 420 }}>
          {!pedidoParaTroca && <div>Nenhum pedido selecionado.</div>}
          {pedidoParaTroca && Array.isArray(pedidoParaTroca.produtos) && (
            <div className="d-flex flex-column gap-2">
              {pedidoParaTroca.produtos.map((produto) => {
                const key =
                  produto.id ??
                  produto.produto_id ??
                  `${pedidoParaTroca.id_pedido}_${produto.produto_id}`;
                return (
                  <label
                    key={key}
                    className="d-flex align-items-center justify-content-between"
                    style={{
                      padding: "8px 10px",
                      backgroundColor: "var(--bg)",
                      borderRadius: 6,
                      border: "1px solid var(--primary)",
                    }}
                  >
                    <div
                      style={{ display: "flex", gap: 12, alignItems: "center" }}
                    >
                      <input
                        type="checkbox"
                        checked={!!produtosSelecionados[key]}
                        onChange={() => toggleProdutoSelecionado(key)}
                      />
                      <div>
                        <div className="row">
                          <div className="col-auto">
                            <img
                              src={produto.url_imagem}
                              alt={produto.nome_produto}
                              style={{
                                width: 64,
                                height: 64,
                                objectFit: "cover",
                                borderRadius: 6,
                              }}
                            />
                          </div>
                          <div className="col">
                            <div style={{ fontWeight: 600 }}>
                              {produto.nome_produto}
                            </div>
                            <div
                              style={{ fontSize: 12, color: "var(--muted)" }}
                            >
                              {produto.quantidade}x •{" "}
                              {formatCurrency(
                                produto.valor_unitario ?? produto.valor_venda
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>
                      {formatCurrency(produto.valor_total)}
                    </div>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      </PopupModal>
    </div>
  );
};

export default ListagemPedidos;
