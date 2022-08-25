import { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import apiEndpoints from "../../../api/apiVars";
import { Button, Snackbar, IconButton } from "@mui/material/";
import AddIcon from "@mui/icons-material/Add";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import { Link } from "react-router-dom";

// interface IProduto {
//     "id_produto": 1,
//     "nome": "Monitor",
//     "descricao": "Monitor para computadores",
//     "preco": "1000.00",
//     "data_criacao": "2022-08-23T00:00:00.000Z",
//     "data_atualizacao": "2022-08-23T00:00:00.000Z",
//   }

function ConsultaCompras() {
  const [listaCompras, setListaCompras] = useState([]);
  const [snackBarShow, setSnackBarShow] = useState<boolean>(false);
  const [snackBarMessage, setSnackBarMessage] = useState<string>("");

  function showSnackBarFunc(message: string) {
    setSnackBarShow(true);
    setSnackBarMessage(message);
  }
  
  useEffect(() => {
    async function consultarTodasCompras() {
      // Fetch headers reference
      //   const fetchHeaders = {
      //     method: "GET", // *GET, POST, PUT, DELETE, etc.
      //     mode: "cors", // no-cors, *cors, same-origin
      //     cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      //     credentials: "same-origin", // include, *same-origin, omit
      //     headers: {
      //       "Content-Type": "application/json",
      //       // 'Content-Type': 'application/x-www-form-urlencoded',
      //     },
      //     redirect: "follow", // manual, *follow, error
      //     referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      //     // body: JSON.stringify(data), // body data type must match "Content-Type" header
      //   };

      const response = await fetch(apiEndpoints.compra, {
        method: "GET",
      }).catch(console.error);

      if (response) {
        const comprasJson = await response.json();
        setListaCompras(comprasJson);
      }
    }

    consultarTodasCompras();
  }, []);

  function atualizaListaCompras() {
    if (listaCompras.length === 0) {
      return <Typography>Não foram localizadas compras!</Typography>;
    } else {
      return (
        <Container sx={{ width: "100%", bgcolor: "background.paper" }}>
          <Typography variant="h3">Consulta de compras</Typography>
          {listaCompras.map((compra: any, index) => (
            <Accordion key={index}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id={`accordion-${compra.id_compra}`}
              >
                <Typography variant="h6">{`Compra realizada em ${new Date(
                  compra.data_criacao
                ).toLocaleDateString("pt-br", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                })}`}</Typography>
              </AccordionSummary>
              <AccordionDetails
                sx={{ diplay: "flex", alignItems: "flex-start" }}
              >
                <Typography>{`Valor total: R$ ${compra.total}`}</Typography>
                <Typography>{`Data de criação: ${new Date(
                  compra.data_criacao
                ).toLocaleDateString("pt-br", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                })}`}</Typography>
                <Typography>{`Status da compra: ${compra.tb_status_compra_dom.dsc_status_compra}`}</Typography>
                <Typography>{`Tipo de pagamento: ${compra.tb_tipo_pagamento_dom.dsc_tipo_pagamento}`}</Typography>
                <Typography variant="h6">Produtos comprados:</Typography>
                {compra.tb_produtos.map((produto: any, index: any) => (
                  <div key={index}>
                    <Typography>{`${produto.nome} - ${produto.tb_compra_produto.qtd_compra} ud.`}</Typography>
                  </div>
                ))}
                <Link to={`/compras/editarcompra/${compra.id_compra}`}>
                  <Button startIcon={<EditIcon />}>Editar</Button>
                </Link>
              </AccordionDetails>
            </Accordion>
          ))}
        </Container>
      );
    }
  }

  const handleSnackbarClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackBarShow(false);
  };

  const snackBarAction = (
    <>
      <Button color="secondary" size="small" onClick={handleSnackbarClose}>
        FECHAR
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleSnackbarClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  );

  return (
    <Container>
      {atualizaListaCompras()}
      <br />
      <Link to="/compras/novacompra">
        <Button startIcon={<AddIcon />} variant="contained">
          Nova compra
        </Button>
      </Link>
      <Snackbar
        open={snackBarShow}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackBarMessage}
        action={snackBarAction}
      />
    </Container>
  );
}

export default ConsultaCompras;
