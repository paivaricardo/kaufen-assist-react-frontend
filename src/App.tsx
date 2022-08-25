import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import "./App.css";
import AppBarKaufen from "./components/AppBarKaufen";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ConsultaProdutos from "./pages/Produtos/ConsultaProdutos";
import BoasVindas from "./pages/BoasVindas";
import ConsultaCompras from "./pages/Compras/ConsultaCompras";
import SobrePagina from "./pages/Sobre";
import CriarProduto from "./pages/Produtos/CriarProduto";
import EditarProduto from "./pages/Produtos/EditarProduto";
import CriarCompra from "./pages/Compras/CriarCompra";
import EditarCompra from "./pages/Compras/EditarCompra";

function App() {

  return (
    <>
      <CssBaseline />
        <div className="App">
          <Container maxWidth="xl">
            <Router>
              <AppBarKaufen />
              <Routes>
                <Route path="/produtos" element={<ConsultaProdutos />} />
                <Route
                  path="/produtos/novoproduto"
                  element={<CriarProduto />}
                />
                <Route
                  path="/produtos/editarproduto/:id"
                  element={<EditarProduto />}
                />
                <Route path="/compras" element={<ConsultaCompras />} />
                <Route
                  path="/compras/novacompra"
                  element={<CriarCompra />}
                />
                <Route
                  path="/compras/editarcompra/:id"
                  element={<EditarCompra />}
                />
                <Route path="/sobre" element={<SobrePagina />} />
                <Route path="/" element={<BoasVindas />} />
              </Routes>
            </Router>
          </Container>
        </div>
    </>
  );
}

export default App;
