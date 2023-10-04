import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Heading,
  FormErrorMessage,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import axios from "axios";
import { useAppToast } from "../helpers/app-toast";

export const Signup: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const showToast = useAppToast();
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const emailRegex = new RegExp(
    "^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$"
  );

  const validateEmail = () => {
    if (emailRegex.test(email)) {
      return true;
    }
    setValidationErrors((prevState) => ({
      ...prevState,
      email: "E-mail inválido",
    }));
    return false;
  };

  const validatePassword = () => {
    if (password.length >= 6) {
      return true;
    }
    setValidationErrors((prevState) => ({
      ...prevState,
      password: "Senha deve ter no mínimo 6 caracteres",
    }));
    return false;
  };

  const validateBlankFields = () => {
    for (const [key, value] of Object.entries({ name, email })) {
      if (!value) {
        setValidationErrors((prevState) => ({
          ...prevState,
          [key]: "Campo obrigatório",
        }));
        return false;
      }
    }
    return true;
  };

  const handleSignup = () => {
    if (!(validateBlankFields(), validateEmail(), validatePassword())) {
      return;
    }

    axios
      .post("http://localhost:3000/signup", {
        user: {
          name,
          email,
          password,
        },
      })
      .then((response) => {
        if (response.status === 201) {
          showToast("success", "Usuário criado com sucesso");
          window.location.href = "/login";
        }
      })
      .catch(() => {
        showToast("error", "Erro ao criar usuário");
      });
  };

  return (
    <Box
      width="100%"
      height="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Stack spacing={4} width="300px">
        <Heading size="lg" textAlign="center">
          Registre-se
        </Heading>
        <FormControl id="name" isInvalid={!!validationErrors.name} isRequired>
          <FormLabel>Nome</FormLabel>
          <Input
            type="text"
            placeholder="Digite seu nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() =>
              setValidationErrors((prevErrors) => ({
                ...prevErrors,
                name: "",
              }))
            }
          />
          <FormErrorMessage>{validationErrors.name}</FormErrorMessage>
        </FormControl>
        <FormControl id="email" isInvalid={!!validationErrors.email} isRequired>
          <FormLabel>E-mail</FormLabel>
          <Input
            type="email"
            placeholder="Digite seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() =>
              setValidationErrors((prevErrors) => ({
                ...prevErrors,
                email: "",
              }))
            }
          />
          <FormErrorMessage>{validationErrors.email}</FormErrorMessage>
        </FormControl>
        <FormControl
          id="password"
          isInvalid={!!validationErrors.password}
          isRequired
        >
          <FormLabel>Senha</FormLabel>
          <Input
            type="password"
            placeholder="Digite sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() =>
              setValidationErrors((prevErrors) => ({
                ...prevErrors,
                password: "",
              }))
            }
          />
          <FormErrorMessage>{validationErrors.password}</FormErrorMessage>
        </FormControl>
        <Button colorScheme="teal" onClick={handleSignup}>
          Registrar
        </Button>
        <Box textAlign="center">
          <RouterLink to="/login">
            <Button variant="link" colorScheme="teal">
              Voltar para o login
            </Button>
          </RouterLink>
        </Box>
      </Stack>
    </Box>
  );
};
