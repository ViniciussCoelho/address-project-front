import React, { useState } from 'react'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Heading,
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import axios from 'axios'

export const Login: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = () => {
    axios.post('http://localhost:3000/login', {
      user: {
        email,
        password,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          localStorage.setItem('token', response.headers.authorization)
          window.location.href = '/home'
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

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
          Login
        </Heading>
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
        <Button colorScheme="teal" onClick={handleLogin}>
          Login
        </Button>
        <Box textAlign="center">
          <RouterLink to="/signup">
            <Button variant="link" colorScheme="teal">
              Criar conta
            </Button>
          </RouterLink>
        </Box>
      </Stack>
    </Box>
  )
}