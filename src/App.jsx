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
import ChatbotWidget from "./Components/ChatbotWidget/ChatbotWidget";

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
        // #endregion
        <Route
          path="/"
          element={
            <div>
              {/* <ChatbotWidget /> */}
              <Header />
              <Home />
            </div>
          }
        />
        // #region Clientes
        <Route
          path="/produtos"
          element={
            <div>
              <Header />
              <ListagemProdutos />
            </div>
          }
        />
        <Route
          path="/detalhes-produto/:id"
          element={
            <div>
              <Header />
              <DetalhesProduto />
            </div>
          }
        />
        <Route
          path="/sobre"
          element={
            <div>
              <Header />
              <Sobre />
            </div>
          }
        />
        <Route
          path="/carrinho"
          element={
            <div>
              <Header />
              <Carrinho />
            </div>
          }
        />
        <Route
          path="/checkout"
          element={
            <div>
              <Header />
              <Checkout />
            </div>
          }
        />
        <Route
          path="/pedido-confirmado"
          element={
            <div>
              <Header />
              <PedidoConfirmado />
            </div>
          }
        />
        <Route
          path="/meus-pedidos"
          element={
            <div>
              <Header />
              <ListagemPedidos />
            </div>
          }
        />
        // #endregion
      </Routes>
    </BrowserRouter>
  );
}

export default App;
