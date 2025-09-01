// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalVendas: 0,
    clientes: 0,
    produtos: 0,
    receita: 0,
  });

  const [historico, setHistorico] = useState([]);

  useEffect(() => {
    // Mock dos dados
    setStats({
      totalVendas: 124,
      clientes: 58,
      produtos: 32,
      receita: 15420.75,
    });

    // Histórico detalhado por categoria
    setHistorico([
      { mes: "Jan", Eletronicos: 5, Roupas: 4, Acessorios: 3 },
      { mes: "Fev", Eletronicos: 8, Roupas: 6, Acessorios: 4 },
      { mes: "Mar", Eletronicos: 12, Roupas: 8, Acessorios: 5 },
      { mes: "Abr", Eletronicos: 9, Roupas: 7, Acessorios: 4 },
      { mes: "Mai", Eletronicos: 14, Roupas: 10, Acessorios: 6 },
      { mes: "Jun", Eletronicos: 11, Roupas: 5, Acessorios: 3 },
    ]);
  }, []);

  return (
    <div className="container min-vh-100">
      <div className="col-auto p-2 d-flex flex-row justify-content-center align-items-center">
        <p className="m-0" style={{ color: "var(--highlight)" }}>
          Dashboard
        </p>
      </div>

      <div
        className={`col my-2 p-2 rounded-4 d-flex flex-column shadow`}
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
                <h5 className="card-title">Vendas</h5>
                <p className="card-text fs-3 fw-bold">{stats.totalVendas}</p>
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
                <h5 className="card-title">Receita</h5>
                <p className="card-text fs-3 fw-bold">
                  R$ {stats.receita.toLocaleString("pt-BR")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Gráfico histórico */}
        <div className="card rounded-4 shadow-sm">
          <div className="card-body">
            <h5 className="card-title mb-3 text-center">
              Histórico de Vendas por Categoria
            </h5>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={historico}>
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="Eletronicos"
                  stackId="a"
                  fill="#4e79a7"
                  radius={[5, 5, 0, 0]}
                />
                <Bar dataKey="Roupas" stackId="a" fill="#f28e2b" />
                <Bar dataKey="Acessorios" stackId="a" fill="#e15759" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
