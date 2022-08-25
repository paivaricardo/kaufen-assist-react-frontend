import { Typography, Container, Snackbar, IconButton } from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { Button } from "@mui/material/";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import InputAdornment from "@mui/material/InputAdornment";
import { Link } from "react-router-dom";
import apiEndpoints from "../../../api/apiVars";

function CriarProduto() {
  const [nome, setNome] = useState<string>("");
  const [descricao, setDescricao] = useState<string>("");
  const [preco, setPreco] = useState<number>(0.0);
  const [errorSnackBar, setErrorSnackBar] = useState(false);

  const [errorTextNome, setErrorTextNome] = useState("");
  const [errorTextDescricao, setErrorTextDescricao] = useState("");
  const [errorTextPreco, setErrorTextPreco] = useState("");

  function handleValidateNome() {
    if (nome.length > 0 && nome.length < 140) {
      setErrorTextNome("");
      return true;
    } else {
      if (nome.length === 0) {
        setErrorTextNome("O nome não pode ser vazio.");
      } else {
        setErrorTextNome("O nome não pode ter mais que 140 caracteres.");
      }
      return false;
    }
  }

  function handleValidateDescricao() {
    if (descricao.length > 0 && descricao.length < 500) {
      setErrorTextDescricao("");
      return true;
    } else {
      if (descricao.length === 0) {
        setErrorTextDescricao("A descrição não pode ser vazia.");
      } else {
        setErrorTextDescricao(
          "A descrição não pode ter mais que 500 caracteres."
        );
      }
      return false;
    }
  }

  function handleValidatePreco() {
    if (/^\d{0,5}(\.\d{0,2})?$/.test(preco.toString())) {
      setErrorTextPreco("");
      return true;
    } else {
      setErrorTextPreco("O preco digitado é inválido.");
      return false;
    }
  }

  function handleChangeNome(event: any) {
    if (event.target.value.length < 140) {
      if (errorTextNome.length > 0) {
        setErrorTextNome("");
      }

      setNome(event.target.value);
    } else {
      setErrorTextNome("O nome não pode ter mais que 140 caracteres.");
    }
  }

  function handleChangeDescricao(event: any) {
    if (event.target.value.length < 500) {
      if (errorTextDescricao.length > 0) {
        setErrorTextDescricao("");
      }

      setDescricao(event.target.value);
    } else {
      setErrorTextDescricao(
        "A descrição não pode ter mais do que 500 caracteres."
      );
    }
  }

  function handleChangePreco(event: any) {
    if (/^\d{0,5}(\.\d{0,2})?$/.test(event.target.value)) {
      if (errorTextPreco.length > 0) {
        setErrorTextPreco("");
      }

      setPreco(event.target.value);
    } else {
      setErrorTextPreco("O preço digitado é inválido.");
    }
  }

  function handleValidation() {
    let validationResults = [
      handleValidateNome(),
      handleValidateDescricao(),
      handleValidatePreco(),
    ];

    console.log(validationResults);

    return validationResults.reduce((acc, cur) => acc && cur, true);
  }

  function handleSubmit() {
    async function fetchPostSubmit() {
      const novoProduto = {
        nome: nome,
        descricao: descricao,
        preco: preco,
      };

      const response: Response | void = await fetch(apiEndpoints.produto, {
        method: 'POST',
        body: JSON.stringify(novoProduto),
        // mode: 'no-cors',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
      }).catch((error) => {
        setErrorSnackBar(true);
      });

      if (response && response.status === 200) {
        window.open("/produtos");
      }
    }

    if (handleValidation()) {
      fetchPostSubmit();
    } else {
      setErrorSnackBar(true);
    }
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

  return (
    <Box
      component="form"
      sx={{
        "& .MuiTextField-root": { m: 1, maxWidth: "50ch" },
      }}
      noValidate
      autoComplete="off"
    >
      <Typography variant="h3">Adicionar produto</Typography>
      <br />
      <TextField
        required
        id="nome-textfield"
        label="Nome"
        defaultValue=""
        autoFocus={true}
        value={nome}
        error={errorTextNome.length > 0}
        helperText={errorTextNome}
        onChange={handleChangeNome}
        fullWidth={true}
      />
      <br />
      <TextField
        id="descricao-multiline-textfield"
        required
        label="Descrição"
        multiline
        rows={4}
        maxRows={10}
        value={descricao}
        error={errorTextDescricao.length > 0}
        helperText={errorTextDescricao}
        onChange={handleChangeDescricao}
        fullWidth={true}
      />
      <br />
      <TextField
        id="preco-textfield"
        required
        label="Preço"
        value={preco}
        error={errorTextPreco.length > 0}
        helperText={errorTextPreco}
        onChange={handleChangePreco}
        InputProps={{
          startAdornment: <InputAdornment position="start">R$</InputAdornment>,
        }}
        fullWidth={true}
      />
      <br />
      <br />
      <Container>
        <Link to="/produtos">
          <Button
            sx={{ m: "0.5rem" }}
            startIcon={<CloseIcon />}
            color="error"
            variant="contained"
          >
            Cancelar
          </Button>
        </Link>
        <Button
          sx={{ m: "0.5rem" }}
          startIcon={<AddIcon />}
          variant="contained"
          onClick={handleSubmit}
        >
          Adicionar
        </Button>
      </Container>
      <Snackbar
        open={errorSnackBar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message="Houve um erro ao tentar adicionar o produto"
        action={snackBarAction}
      />
    </Box>
  );
}

export default CriarProduto;
