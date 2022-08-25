import { useEffect, useState, useContext } from "react";
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

import "./ConsultaProdutos.scss";

// interface IProduto {
//     "id_produto": 1,
//     "nome": "Monitor",
//     "descricao": "Monitor para computadores",
//     "preco": "1000.00",
//     "data_criacao": "2022-08-23T00:00:00.000Z",
//     "data_atualizacao": "2022-08-23T00:00:00.000Z",
//   }

function ConsultaProdutos() {
  const [listaProdutos, setListaProdutos] = useState([]);
  const [snackBarShow, setSnackBarShow] = useState<boolean>(false);
  const [snackBarMessage, setSnackBarMessage] = useState<string>("");

  function showSnackBarFunc(message: string) {
    setSnackBarShow(true);
    setSnackBarMessage(message);
  }
  
  useEffect(() => {
    async function consultarTodosProdutos() {
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

      const response = await fetch(apiEndpoints.produto, {
        method: "GET",
      }).catch(console.error);

      if (response) {
        const produtosJson = await response.json();
        setListaProdutos(produtosJson);
      }
    }

    consultarTodosProdutos();
  }, []);

  function atualizaListaProdutos() {
    if (listaProdutos.length === 0) {
      return <Typography>Não foram localizados produtos!</Typography>;
    } else {
      return (
        <Container sx={{ width: "100%", bgcolor: "background.paper" }}>
          <Typography variant="h3">Consulta de produtos</Typography>
          {listaProdutos.map((produto: any, index) => (
            <Accordion key={index}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id={`accordion-${produto.nome}`}
              >
                <Typography variant="h6">{produto.nome}</Typography>
              </AccordionSummary>
              <AccordionDetails
                sx={{ diplay: "flex", alignItems: "flex-start" }}
              >
                <Typography>{produto.descricao}</Typography>
                <Typography>{`Preço: R$ ${produto.preco}`}</Typography>
                <Typography>{`Data de inclusão: ${new Date(
                  produto.data_criacao
                ).toLocaleDateString("pt-br", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                })}`}</Typography>
                <Typography>{`Data de atualização: ${new Date(
                  produto.data_atualizacao
                ).toLocaleDateString("pt-br", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                })}`}</Typography>
                <Link to={`/produtos/editarproduto/${produto.id_produto}`}>
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
      {atualizaListaProdutos()}
      <br />
      <Link to="/produtos/novoproduto">
        <Button startIcon={<AddIcon />} variant="contained">
          Novo produto
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

export default ConsultaProdutos;
