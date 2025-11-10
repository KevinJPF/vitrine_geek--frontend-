import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useGetData } from "../../../Hooks/useGetData";

const Dashboard = () => {
  const { getApiData } = useGetData();
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    dataInicio: "2025-10-01",
    dataFim: "2025-11-18",
  });

  // Filtros adicionais
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [filtroSelecionado, setFiltroSelecionado] = useState({
    produtoId: null,
    categoriaId: null,
  });

  const [stats, setStats] = useState({
    totalVendas: 0,
    clientes: 0,
    produtos: 0,
    receita: 0,
  });

  const [vendasPorCategoria, setVendasPorCategoria] = useState([]);
  const [vendasPorProduto, setVendasPorProduto] = useState([]);
  const [historicoPorMes, setHistoricoPorMes] = useState([]);

  // Função para buscar dados de pedidos
  const fetchPedidosPeriodo = async () => {
    try {
      let url = `pedidos/periodo?dataInicio=${dateRange.dataInicio}&dataFim=${dateRange.dataFim}`;

      if (filtroSelecionado.produtoId) {
        url += `&produtoId=${filtroSelecionado.produtoId}`;
      }

      if (filtroSelecionado.categoriaId) {
        url += `&categoriaId=${filtroSelecionado.categoriaId}`;
      }

      const result = await getApiData(url);
      return result;
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
      return [];
    }
  };

  // Função para buscar produtos
  const fetchProdutos = async () => {
    try {
      const result = await getApiData("produtos");
      return result;
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      return [];
    }
  };

  // Função para buscar categorias
  const fetchCategorias = async () => {
    try {
      const result = await getApiData("produtos/categorias");
      return result;
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
      return [];
    }
  };

  // Função para processar dados dos pedidos
  const processarDados = (pedidos) => {
    if (!pedidos || pedidos.length === 0) {
      setStats({
        totalVendas: 0,
        clientes: 0,
        produtos: 0,
        receita: 0,
      });
      setVendasPorCategoria([]);
      setVendasPorProduto([]);
      setHistoricoPorMes([]);
      return;
    }

    // Calcular estatísticas gerais
    const clientesUnicos = new Set(pedidos.map((p) => p.nome_cliente)).size;
    const produtosUnicos = new Set(pedidos.map((p) => p.produto_id)).size;
    const receitaTotal = pedidos.reduce(
      (sum, p) => sum + parseFloat(p.valor_total_item),
      0
    );

    setStats({
      totalVendas: pedidos.length,
      clientes: clientesUnicos,
      produtos: produtosUnicos,
      receita: receitaTotal,
    });

    // Agrupar vendas por categoria
    const vendasCategoria = {};
    pedidos.forEach((pedido) => {
      const categoria = pedido.categoria_nome || "Sem Categoria";
      if (!vendasCategoria[categoria]) {
        vendasCategoria[categoria] = {
          nome: categoria,
          quantidade: 0,
          valor: 0,
        };
      }
      vendasCategoria[categoria].quantidade += pedido.quantidade;
      vendasCategoria[categoria].valor += parseFloat(pedido.valor_total_item);
    });

    setVendasPorCategoria(Object.values(vendasCategoria));

    // Agrupar vendas por produto (top 10)
    const vendasProduto = {};
    pedidos.forEach((pedido) => {
      const produto = pedido.produto_nome;
      if (!vendasProduto[produto]) {
        vendasProduto[produto] = {
          nome: produto,
          quantidade: 0,
          valor: 0,
        };
      }
      vendasProduto[produto].quantidade += pedido.quantidade;
      vendasProduto[produto].valor += parseFloat(pedido.valor_total_item);
    });

    const topProdutos = Object.values(vendasProduto)
      .sort((a, b) => b.quantidade - a.quantidade)
      .slice(0, 10);

    setVendasPorProduto(topProdutos);

    // Agrupar vendas por mês
    const vendasMes = {};
    pedidos.forEach((pedido) => {
      const data = new Date(pedido.atualizado_em);
      const mesAno = `${String(data.getMonth() + 1).padStart(
        2,
        "0"
      )}/${data.getFullYear()}`;

      if (!vendasMes[mesAno]) {
        vendasMes[mesAno] = {
          mes: mesAno,
          quantidade: 0,
          receita: 0,
        };
      }
      vendasMes[mesAno].quantidade += pedido.quantidade;
      vendasMes[mesAno].receita += parseFloat(pedido.valor_total_item);
    });

    const historico = Object.values(vendasMes).sort((a, b) => {
      const [mesA, anoA] = a.mes.split("/");
      const [mesB, anoB] = b.mes.split("/");
      return new Date(anoA, mesA - 1) - new Date(anoB, mesB - 1);
    });

    setHistoricoPorMes(historico);
  };

  // Carregar dados ao montar o componente
  useEffect(() => {
    const carregarDadosIniciais = async () => {
      const [produtosData, categoriasData] = await Promise.all([
        fetchProdutos(),
        fetchCategorias(),
      ]);

      setProdutos(produtosData || []);
      setCategorias(categoriasData || []);
    };

    carregarDadosIniciais();
  }, []);

  // Carregar pedidos quando filtros mudarem
  useEffect(() => {
    const carregarDados = async () => {
      setLoading(true);
      const pedidos = await fetchPedidosPeriodo();
      processarDados(pedidos);
      setLoading(false);
    };

    carregarDados();
  }, [dateRange, filtroSelecionado]);

  const COLORS = ["#4e79a7", "#f28e2b", "#e15759", "#76b7b2", "#59a14f"];

  return (
    <div className="container-fluid vh-100 d-flex flex-column">
      {/* Área de filtros destacada */}
      <div className="row py-2 px-2">
        <div className="col-12">
          <div className=" py-2">
            <div className="row g-2 align-items-end">
              {/* Período */}
              <div className="col-12 col-md-6 col-lg-3">
                <label className="form-label fw-semibold small mb-1">
                  Data Início
                </label>
                <input
                  type="date"
                  className="form-control"
                  value={dateRange.dataInicio}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, dataInicio: e.target.value })
                  }
                />
              </div>

              <div className="col-12 col-md-6 col-lg-3">
                <label className="form-label fw-semibold small mb-1">
                  Data Fim
                </label>
                <input
                  type="date"
                  className="form-control"
                  value={dateRange.dataFim}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, dataFim: e.target.value })
                  }
                />
              </div>

              {/* Categoria */}
              <div className="col-12 col-md-6 col-lg-3">
                <label className="form-label fw-semibold small mb-1">
                  Categoria
                </label>
                <select
                  className="form-select"
                  value={filtroSelecionado.categoriaId || ""}
                  onChange={(e) => {
                    setFiltroSelecionado({
                      ...filtroSelecionado,
                      categoriaId: e.target.value
                        ? Number(e.target.value)
                        : null,
                      produtoId: null,
                    });
                  }}
                >
                  <option value="">Todas as Categorias</option>
                  {categorias.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nome}
                    </option>
                  ))}
                </select>
              </div>

              {/* Produto */}
              <div className="col-12 col-md-6 col-lg-3">
                <label className="form-label fw-semibold small mb-1">
                  Produto
                </label>
                <select
                  className="form-select"
                  value={filtroSelecionado.produtoId || ""}
                  onChange={(e) => {
                    setFiltroSelecionado({
                      ...filtroSelecionado,
                      produtoId: e.target.value ? Number(e.target.value) : null,
                      categoriaId: null,
                    });
                  }}
                >
                  <option value="">Todos os Produtos</option>
                  {produtos.map((prod) => (
                    <option key={prod.id} value={prod.id}>
                      {prod.nome_produto}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Indicador de filtro ativo */}
            {(filtroSelecionado.produtoId || filtroSelecionado.categoriaId) && (
              <div className="mt-3">
                <span className="badge bg-primary me-2">
                  {filtroSelecionado.produtoId
                    ? `Produto: ${
                        produtos.find(
                          (p) => p.id === filtroSelecionado.produtoId
                        )?.nome_produto
                      }`
                    : `Categoria: ${
                        categorias.find(
                          (c) => c.id === filtroSelecionado.categoriaId
                        )?.nome
                      }`}
                </span>
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() =>
                    setFiltroSelecionado({
                      produtoId: null,
                      categoriaId: null,
                    })
                  }
                >
                  <i className="bi bi-x-circle me-1"></i>
                  Limpar Filtros
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Conteúdo com scroll */}
      <div className="row flex-grow-1 overflow-auto">
        <div className="col p-3">
          {loading ? (
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ minHeight: "400px" }}
            >
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Carregando...</span>
              </div>
            </div>
          ) : (
            <div
              className="p-3 rounded-4 d-flex flex-column shadow"
              style={{
                backgroundColor: "var(--primary)",
                color: "var(--white)",
              }}
            >
              {/* Cards resumo */}
              <div className="row g-4 mb-4">
                <div className="col-12 col-md-3">
                  <div className="card text-center shadow-sm">
                    <div className="card-body">
                      <h5 className="card-title">Total de Vendas</h5>
                      <p className="card-text fs-3 fw-bold">
                        {stats.totalVendas}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-md-3">
                  <div className="card text-center shadow-sm">
                    <div className="card-body">
                      <h5 className="card-title">Clientes</h5>
                      <p className="card-text fs-3 fw-bold">{stats.clientes}</p>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-md-3">
                  <div className="card text-center shadow-sm">
                    <div className="card-body">
                      <h5 className="card-title">Produtos</h5>
                      <p className="card-text fs-3 fw-bold">{stats.produtos}</p>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-md-3">
                  <div className="card text-center shadow-sm">
                    <div className="card-body">
                      <h5 className="card-title">Receita Total</h5>
                      <p className="card-text fs-3 fw-bold">
                        R${" "}
                        {stats.receita.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Gráficos */}
              <div className="row g-4">
                {/* Histórico mensal */}
                <div className="col-12">
                  <div className="card rounded-4 shadow-sm">
                    <div className="card-body">
                      <h5 className="card-title mb-3 text-center">
                        Histórico de Vendas por Mês
                      </h5>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={historicoPorMes}>
                          <XAxis dataKey="mes" />
                          <YAxis
                            yAxisId="left"
                            orientation="left"
                            stroke="#4e79a7"
                          />
                          <YAxis
                            yAxisId="right"
                            orientation="right"
                            stroke="#f28e2b"
                          />
                          <Tooltip
                            formatter={(value, name) => {
                              if (name === "receita") {
                                return `R$ ${value.toLocaleString("pt-BR", {
                                  minimumFractionDigits: 2,
                                })}`;
                              }
                              return value;
                            }}
                          />
                          <Legend />
                          <Bar
                            yAxisId="left"
                            dataKey="quantidade"
                            fill="#4e79a7"
                            name="Quantidade"
                            radius={[5, 5, 0, 0]}
                          />
                          <Bar
                            yAxisId="right"
                            dataKey="receita"
                            fill="#f28e2b"
                            name="Receita (R$)"
                            radius={[5, 5, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Vendas por categoria */}
                <div className="col-12 col-lg-6">
                  <div className="card rounded-4 shadow-sm">
                    <div className="card-body">
                      <h5 className="card-title mb-3 text-center">
                        Vendas por Categoria
                      </h5>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={vendasPorCategoria}
                            dataKey="valor"
                            nameKey="nome"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            label={(entry) =>
                              `${entry.nome}: R$ ${entry.valor.toFixed(2)}`
                            }
                          >
                            {vendasPorCategoria.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value) =>
                              `R$ ${value.toLocaleString("pt-BR", {
                                minimumFractionDigits: 2,
                              })}`
                            }
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Top produtos */}
                <div className="col-12 col-lg-6">
                  <div className="card rounded-4 shadow-sm">
                    <div className="card-body">
                      <h5 className="card-title mb-3 text-center">
                        Top 10 Produtos Mais Vendidos
                      </h5>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={vendasPorProduto} layout="horizontal">
                          <XAxis type="number" />
                          <YAxis dataKey="nome" type="category" width={100} />
                          <Tooltip
                            formatter={(value, name) => {
                              if (name === "valor") {
                                return `R$ ${value.toLocaleString("pt-BR", {
                                  minimumFractionDigits: 2,
                                })}`;
                              }
                              return value;
                            }}
                          />
                          <Legend />
                          <Bar
                            dataKey="quantidade"
                            fill="#4e79a7"
                            name="Qtd"
                            radius={[0, 5, 5, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
