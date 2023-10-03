import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Heading,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import axios from "axios";

export const Signup: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = () => {
    axios
      .post("http://localhost:3000/signup", {
        user: {
          email,
          password,
        },
      })
      .then((response) => {
        if (response.status === 201) {
          window.location.href = "/login";
        }
      })
      .catch((err) => {
        console.log(err);
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
        <FormControl id="name">
          <FormLabel>Nome</FormLabel>
          <Input
            type="text"
            placeholder="Digite seu nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </FormControl>
        <FormControl id="email">
          <FormLabel>E-mail</FormLabel>
          <Input
            type="email"
            placeholder="Digite seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>
        <FormControl id="password">
          <FormLabel>Senha</FormLabel>
          <Input
            type="password"
            placeholder="Digite sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
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
