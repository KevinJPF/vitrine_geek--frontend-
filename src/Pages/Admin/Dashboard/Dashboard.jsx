// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
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

    setHistorico([
      { mes: "Jan", vendas: 12 },
      { mes: "Fev", vendas: 18 },
      { mes: "Mar", vendas: 25 },
      { mes: "Abr", vendas: 20 },
      { mes: "Mai", vendas: 30 },
      { mes: "Jun", vendas: 19 },
    ]);
  }, []);

  return (
    <div className="container py-4 min-vh-100">
      <h2 className="mb-4">Dashboard</h2>

      {/* Cards resumo com Bootstrap */}
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
              <p
                className="card-text fs-3 fw-bold"
                // style={{ color: "var(--green)" }}
              >
                R$ {stats.receita.toLocaleString("pt-BR")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico histórico */}
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title mb-3">Histórico de Vendas</h5>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={historico}>
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="vendas"
                fill="var(--secondary)"
                radius={[5, 5, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
