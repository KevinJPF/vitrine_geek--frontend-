import { BrowserRouter, Routes, Route } from "react-router";
import "./App.css";
import Home from "./Pages/Home/Home";
import ListarClientes from "./Pages/Clientes/ListarClientes";
import RegistrarCliente from "./Pages/Clientes/RegistrarCliente";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/clientes" element={<ListarClientes />} />
        <Route path="/registrar-cliente" element={<RegistrarCliente />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
