import {
  Typography,
  Container,
  Snackbar,
  IconButton,
  useForkRef,
} from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import { Button } from "@mui/material/";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import InputAdornment from "@mui/material/InputAdornment";
import { Link, useParams } from "react-router-dom";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import apiEndpoints from "../../../api/apiVars";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import SaveIcon from "@mui/icons-material/Save";

function EditarCompra() {
  const { id } = useParams();
  const [compraSelecionada, setCompraSelecionada] = useState<any>();
  const [idTipoPagamento, setIdTipoPagamento] = useState(1);
  const [arrayTipoPagamento, setArrayTipoPagamento] = useState([
    "Carregando...",
  ]);
  const [idStatusCompra, setIdStatusCompra] = useState(1);
  const [arrayStatusCompra, setArrayStatusCompra] = useState<any>([
    "Carregando...",
  ]);
  const [compraFound, setCompraFound] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [listaProdutos, setListaProdutos] = useState<any>([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState<any>(1);
  const [qtdSelecionada, setQtdSelecionada] = useState(1);
  const [precoSelecionado, setPrecoSelecionado] = useState(0);
  const [arrayCompraProduto, setArrayCompraProduto] = useState<any>([]);
  const [errorSnackBar, setErrorSnackBar] = useState(false);
  const [errorTextQtdSelecionada, setErrorTextQtdSelecionada] = useState("");

  useEffect(() => {
    async function fetchGetCompraSelecionada() {
      const response: Response | void = await fetch(
        `${apiEndpoints.compra}/${id}`,
        {
          method: "GET",
        }
      ).catch((error) => {
        setErrorSnackBar(true);
      });

      if (response && response.status === 200) {
        const jsonResponse = await response.json();
        console.log(jsonResponse);

        setCompraSelecionada(jsonResponse);
        setIdTipoPagamento(jsonResponse.id_tipo_pagamento);
        setIdStatusCompra(jsonResponse.id_status_compra);
        setTotal(Number(jsonResponse.total));
        setArrayCompraProduto(
          jsonResponse.tb_produtos.map((produto: any) => {
            return [
              produto.id_produto,
              produto.tb_compra_produto.qtd_compra,
              Date.now(),
            ];
          })
        );
      }
    }

    async function fetchGetTipoPagamento() {
      const response: Response | void = await fetch(
        apiEndpoints.tipoPagamento,
        {
          method: "GET",
        }
      ).catch((error) => {
        setErrorSnackBar(true);
      });

      if (response && response.status === 200) {
        const jsonResponse = await response.json();
        setArrayTipoPagamento(jsonResponse);
      }
    }

    async function fetchGetStatusCompra() {
      const response: Response | void = await fetch(apiEndpoints.statusCompra, {
        method: "GET",
      }).catch((error) => {
        setErrorSnackBar(true);
      });

      if (response && response.status === 200) {
        const jsonResponse = await response.json();
        setArrayStatusCompra(jsonResponse);
      }
    }

    async function consultarTodosProdutos() {
      const response = await fetch(apiEndpoints.produto, {
        method: "GET",
      }).catch(console.error);

      if (response) {
        const produtosJson = await response.json();
        setListaProdutos(produtosJson);
        setPrecoSelecionado(
          (produtosJson.filter((produto: any) => produto.id_produto === 1)[0]
            .preco)
        );
        setCompraFound(true);
      }
    }

    fetchGetCompraSelecionada();
    fetchGetTipoPagamento();
    fetchGetStatusCompra();
    consultarTodosProdutos();

    console.log(arrayCompraProduto);
  }, []);

  function routeCompraNotFound() {
    if (compraFound && listaProdutos) {
      return (
        <Container>
          <Typography variant="h3">Editar compra</Typography>
          <br />
          <FormControl size="medium" sx={{ m: 1, minWidth: 250 }}>
            <InputLabel id="demo-simple-select-label">
              Tipo de pagamento
            </InputLabel>
            <Select
              labelId="tipo-pagamento-select-label"
              id="tipo-pagamento-select"
              value={idTipoPagamento.toString()}
              label="Tipo de pagamento"
              onChange={handleTipoPagamentoChange}
              autoWidth
            >
              {arrayTipoPagamento.map((tipoPagamento: any, index: any) => (
                <MenuItem
                  value={tipoPagamento.id_tipo_pagamento}
                  key={tipoPagamento.dsc_tipo_pagamento}
                >
                  {tipoPagamento.dsc_tipo_pagamento}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <br />
          <FormControl size="medium" sx={{ m: 1, minWidth: 250 }}>
            <InputLabel id="status-compra-select-label">
              Status da compra
            </InputLabel>
            <Select
              labelId="status-compra-select-label"
              id="demo-simple-select"
              value={idStatusCompra.toString()}
              label="Status da compra"
              onChange={handleStatusCompraChange}
              autoWidth
            >
              {arrayStatusCompra.map((statusCompra: any, index: any) => (
                <MenuItem
                  value={statusCompra.id_status_compra}
                  key={statusCompra.dsc_status_compra}
                >
                  {statusCompra.dsc_status_compra}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <br />
          <br />
          <Typography variant="h6">Seleção de produtos</Typography>
          <Typography variant="subtitle1">{`Valor total: R$ ${total}`}</Typography>
          <br />
          <Box>
            <FormControl size="medium" sx={{ m: 1, minWidth: 250 }}>
              <InputLabel id="status-compra-produto-label">Produto</InputLabel>
              <Select
                labelId="produto-select-label"
                id="produto-select"
                value={produtoSelecionado}
                label="Produto"
                onChange={handleProdutoSelecionado}
                autoWidth
              >
                {listaProdutos.map((produto: any, index: any) => (
                  <MenuItem
                    value={Number(produto.id_produto)}
                    key={produto.nome}
                  >
                    {produto.nome}
                  </MenuItem>
                ))}
                {/* {listaProdutos
              .filter(
                (produto: any) =>
                  arrayCompraProduto
                    .map((compraProduto: any) => compraProduto[0])
                    .indexOf(produto.id_produto) === -1
              )
              .map((produto: any, index: any) => (
                <MenuItem value={Number(produto.id_produto)} key={produto.id_produto}>
                  {produto.descricao} ( 
                  {produto.id_produto})
                </MenuItem>
              ))} */}
              </Select>
            </FormControl>
            <TextField
              id="preco-textfield"
              disabled
              label="Preço"
              value={precoSelecionado}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">R$</InputAdornment>
                ),
              }}
            />
            <TextField
              id="qtd-textfield"
              required
              label="Quantidade"
              value={qtdSelecionada}
              error={errorTextQtdSelecionada.length > 0}
              helperText={errorTextQtdSelecionada}
              onChange={handleQtdSelecionada}
            />
            <Button
              sx={{ m: "0.5rem" }}
              startIcon={<AddIcon />}
              color="secondary"
              variant="contained"
              onClick={handleIncluirProduto}
            >
              Incluir
            </Button>
            <Typography variant="h6">Produtos incluídos:</Typography>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Produto</TableCell>
                    <TableCell align="right">Preço</TableCell>
                    <TableCell align="right">Quantidade</TableCell>
                    <TableCell align="right">Total</TableCell>
                    <TableCell align="right">Excluir</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {arrayCompraProduto.map((compraProduto: any, index: any) => (
                    <TableRow
                      key={index}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {
                          listaProdutos.find(
                            (produto: any) =>
                              produto.id_produto === compraProduto[0]
                          ).nome
                        }
                      </TableCell>
                      <TableCell align="right">
                        {
                          listaProdutos.find(
                            (produto: any) =>
                              produto.id_produto === compraProduto[0]
                          ).preco
                        }
                      </TableCell>
                      <TableCell align="right">{compraProduto[1]}</TableCell>
                      <TableCell align="right">
                        {listaProdutos.find(
                          (produto: any) =>
                            produto.id_produto === compraProduto[0]
                        ).preco * compraProduto[1]}
                      </TableCell>
                      <TableCell align="right">
                        {" "}
                        <IconButton
                          size="small"
                          aria-label="close"
                          color="error"
                          onClick={() => {
                            handleExcluirCompraProduto(index);
                          }}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          <br />
          <br />
          <Container>
            <Link to="/compras">
              <Button
                sx={{ m: "0.5rem" }}
                startIcon={<CloseIcon />}
                color="info"
                variant="contained"
              >
                Cancelar
              </Button>
            </Link>
            <Button
              sx={{ m: "0.5rem" }}
              startIcon={<SaveIcon />}
              variant="contained"
              onClick={handleSubmit}
            >
              Salvar alterações
            </Button>
            <br />
            <br />
            <br />
            <Button
              sx={{ m: "0.5rem" }}
              startIcon={<SaveIcon />}
              variant="contained"
              color="error"
              onClick={handleDelete}
            >
              Deletar
            </Button>
          </Container>
        </Container>
      );
    } else {
      return (
        <>
          <Typography variant="body1">
            `Erro ao requisitar os dados da compra de indentificador número $
            {id}`
          </Typography>
        </>
      );
    }
  }

  function handleSubmit() {
    async function fetchPostSubmit() {
      const novaCompra = {
        id_tipo_pagamento: idTipoPagamento,
        id_status_compra: idStatusCompra,
        total: total,
      };

      const response: Response | void = await fetch(
        `${apiEndpoints.compra}/${id}`,
        {
          method: "PUT",
          body: JSON.stringify(novaCompra),
          // mode: 'no-cors',
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      ).catch((error) => {
        setErrorSnackBar(true);
      });

      if (response && response.status === 200) {
        let jsonResponse = await response.json();

        Promise.all(
          compraSelecionada.tb_produtos.map(
            (produto: any) =>
              new Promise((resolve, reject) => {
                fetch(
                  `${apiEndpoints.compraProduto}/${produto.tb_compra_produto.id_compra_produto}`,
                  {
                    method: "DELETE",
                  }
                );
              })
          )
        )
          .then((response) => {
            console.log(response);
          })
          .catch((error) => console.error(error));

        Promise.all(
          arrayCompraProduto.map(
            (compraProduto: any) =>
              new Promise((resolve, reject) => {
                fetch(apiEndpoints.compraProduto, {
                  method: "POST",
                  body: JSON.stringify({
                    id_produto: compraProduto[0],
                    id_compra: Number(id),
                    qtd_compra: compraProduto[1],
                  }),
                  // mode: 'no-cors',
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                  },
                });
              })
          )
        )
          .then((response) => {
            window.open("/compras");
          })
          .catch((error) => console.error(error));

        window.open("/compras");
      }
    }

    fetchPostSubmit();
  }

  const handleSnackbarClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setErrorSnackBar(false);
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

  function handleTipoPagamentoChange(event: any) {
    setIdTipoPagamento(Number(event.target.value));
  }

  function handleStatusCompraChange(event: any) {
    setIdStatusCompra(Number(event.target.value));
  }

  function handleProdutoSelecionado(event: any) {
    setProdutoSelecionado(event.target.value);
    setPrecoSelecionado(
      listaProdutos.filter(
        (produto: any) => produto.id_produto === event.target.value
      )[0].preco
    );
  }

  function handleQtdSelecionada(event: any) {
    if (Number(event.target.value) >= 0 && Number(event.target.value) <= 50) {
      setErrorTextQtdSelecionada("");
      setQtdSelecionada(Number(event.target.value));
    } else {
      if (Number(event.target.value) === 0) {
        setErrorTextQtdSelecionada(
          "A quantidade mínima a ser comprada não pode ser zero"
        );
      } else {
        setErrorTextQtdSelecionada(
          "A quantidade máxima por compra é de 50 itens."
        );
      }
    }
  }

  function handleIncluirProduto() {
    setArrayCompraProduto([
      ...arrayCompraProduto,
      [produtoSelecionado, qtdSelecionada, Date.now()],
    ]);
    setTotal(total + Number(precoSelecionado) * Number(qtdSelecionada));
  }

  function handleExcluirCompraProduto(index: any) {
    let newArrayCompraProduto = arrayCompraProduto;
    newArrayCompraProduto.splice(index, 1);

    console.log(newArrayCompraProduto);

    setArrayCompraProduto(newArrayCompraProduto);

    let novoTotal = newArrayCompraProduto.reduce((acc: number, cur: any) => {
      return (
        acc +
        cur[1] *
          Number(
            listaProdutos.find((produto: any) => produto.id_produto === cur[0])
              .preco
          )
      );
    }, 0);

    setTotal(novoTotal);
  }

  function handleDelete() {
    async function fetchDeleteCompraSelecionada() {
      const response: Response | void = await fetch(
        `${apiEndpoints.compra}/${id}`,
        {
          method: "DELETE",
        }
      ).catch((error) => {
        setErrorSnackBar(true);
      });

      if (response && response.status === 200) {
        const jsonResponse = await response.json();
        window.open("/compras");
      }
    }

    fetchDeleteCompraSelecionada();
  }

  return (
    <Box
      component="form"
      sx={{
        "& .MuiTextField-root": { m: 1, maxWidth: "50ch" },
      }}
      noValidate
      autoComplete="off"
    >
      {routeCompraNotFound()}
      <Snackbar
        open={errorSnackBar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message="Houve um erro ao tentar adicionar a compra"
        action={snackBarAction}
      />
    </Box>
  );
}

export default EditarCompra;
