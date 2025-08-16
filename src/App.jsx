import { BrowserRouter, Routes, Route } from "react-router";
import "./App.css";
import Home from "./Pages/Home/Home";
import ListarClientes from "./Pages/Clientes/ListarClientes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/clientes" element={<ListarClientes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
