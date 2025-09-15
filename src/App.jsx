import { BrowserRouter, Routes, Route } from "react-router";
import "./App.css";
import Home from "./Pages/Home/Home";
import ListarClientes from "./Pages/Admin/Clientes/ListarClientes";
import RegistrarCliente from "./Pages/Admin/Clientes/RegistrarCliente";
import SideMenu from "./Components/SideMenu/SideMenu";
import ListarProdutos from "./Pages/Admin/Produtos/ListarProdutos";
import RegistrarProduto from "./Pages/Admin/Produtos/RegistrarProduto";
import Dashboard from "./Pages/Admin/Dashboard/Dashboard";
import ListarPedidos from "./Pages/Admin/ListarPedidos/ListarPedidos";
import Header from "./Components/Header/Header";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <Header />
              <Home />
            </div>
          }
        />
        // #region Admin
        <Route
          path="/dashboard"
          element={
            <div className="row">
              <div className="col-auto p-0">
                <SideMenu />
              </div>
              <div className="col">
                <Dashboard />
              </div>
            </div>
          }
        />
        <Route
          path="/clientes"
          element={
            <div className="row">
              <div className="col-auto p-0">
                <SideMenu />
              </div>
              <div className="col">
                <ListarClientes />
              </div>
            </div>
          }
        />
        <Route path="/registrar-cliente" element={<RegistrarCliente />} />
        <Route path="/editar-cliente/:id" element={<RegistrarCliente />} />
        <Route
          path="/produtos"
          element={
            <div className="row">
              <div className="col-auto p-0">
                <SideMenu />
              </div>
              <div className="col">
                <ListarProdutos />
              </div>
            </div>
          }
        />
        <Route path="/registrar-produto" element={<RegistrarProduto />} />
        <Route
          path="/pedidos"
          element={
            <div className="row">
              <div className="col-auto p-0">
                <SideMenu />
              </div>
              <div className="col">
                <ListarPedidos />
              </div>
            </div>
          }
        />
        //#endregion
      </Routes>
    </BrowserRouter>
  );
}

export default App;
