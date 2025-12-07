import { BrowserRouter, Routes, Route } from "react-router";
import "./App.css";
// Clients
import Header from "./Components/Header/Header";
import Home from "./Pages/Home/Home";
import ListagemProdutos from "./Pages/Clients/Produtos/ListagemProdutos";
import Sobre from "./Pages/Clients/Sobre/Sobre";
import Carrinho from "./Pages/Clients/Carrinho/Carrinho";
// Admin
import SideMenu from "./Components/SideMenu/SideMenu";
import Dashboard from "./Pages/Admin/Dashboard/Dashboard";
import ListarClientes from "./Pages/Admin/Clientes/ListarClientes";
import RegistrarCliente from "./Pages/Admin/Clientes/RegistrarCliente";
import ListarProdutos from "./Pages/Admin/Produtos/ListarProdutos";
import RegistrarProduto from "./Pages/Admin/Produtos/RegistrarProduto";
import ListarPedidos from "./Pages/Admin/ListarPedidos/ListarPedidos";
import DetalhesProduto from "./Pages/Clients/Produtos/DetalhesProduto/DetalhesProduto";
import Checkout from "./Pages/Clients/Checkout/Checkout";
import PedidoConfirmado from "./Pages/Clients/Pedidos/PedidoConfirmado/PedidoConfirmado";
import ListagemPedidos from "./Pages/Clients/Pedidos/ListagemPedidos/ListagemPedidos";
import { Toaster } from "react-hot-toast";
import ListarLogs from "./Pages/Admin/ListarLogs/ListarLogs";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        // #region Admin
        <Route
          path="/admin/dashboard"
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
          path="/admin/clientes"
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
        <Route path="/admin/registrar-cliente" element={<RegistrarCliente />} />
        <Route
          path="/admin/editar-cliente/:id"
          element={<RegistrarCliente />}
        />
        <Route
          path="/admin/produtos"
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
        <Route path="/admin/registrar-produto" element={<RegistrarProduto />} />
        <Route
          path="/admin/registrar-produto/:id"
          element={<RegistrarProduto />}
        />
        <Route
          path="/admin/pedidos"
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
        <Route
          path="/admin/logs"
          element={
            <div className="row">
              <div className="col-auto p-0">
                <SideMenu />
              </div>
              <div className="col">
                <ListarLogs />
              </div>
            </div>
          }
        />
        // #endregion
        <Route
          path="/"
          element={
            <div>
              <Header />
              <ListagemProdutos />
              <Toaster position="bottom-right" reverseOrder={false} />
            </div>
          }
        />
        // #region Clientes
        <Route
          path={"/produtos"}
          element={
            <div>
              <Header />
              <ListagemProdutos />
              <Toaster position="bottom-right" reverseOrder={false} />
            </div>
          }
        />
        <Route
          path="/detalhes-produto/:id"
          element={
            <div>
              <Header />
              <DetalhesProduto />
              <Toaster position="bottom-right" reverseOrder={false} />
            </div>
          }
        />
        <Route
          path="/sobre"
          element={
            <div>
              <Header />
              <Sobre />
              <Toaster position="bottom-right" reverseOrder={false} />
            </div>
          }
        />
        <Route
          path="/carrinho"
          element={
            <div>
              <Header />
              <Carrinho />
              <Toaster position="bottom-right" reverseOrder={false} />
            </div>
          }
        />
        <Route
          path="/checkout"
          element={
            <div>
              <Header />
              <Checkout />
              <Toaster position="bottom-right" reverseOrder={false} />
            </div>
          }
        />
        <Route
          path="/pedido-confirmado"
          element={
            <div>
              <Header />
              <PedidoConfirmado />
              <Toaster position="bottom-right" reverseOrder={false} />
            </div>
          }
        />
        <Route
          path="/meus-pedidos"
          element={
            <div>
              <Header />
              <ListagemPedidos />
              <Toaster position="bottom-right" reverseOrder={false} />
            </div>
          }
        />
        // #endregion
      </Routes>
    </BrowserRouter>
  );
}

export default App;
