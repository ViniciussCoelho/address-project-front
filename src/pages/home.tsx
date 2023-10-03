import { Flex, VStack, Text, IconButton, Box, useDisclosure, Input, Select, HStack, Link, useToast } from "@chakra-ui/react";
import { AiFillDelete as DeleteIcon, AiFillEdit as EditIcon, AiFillPlusCircle as AddIcon } from "react-icons/ai";
import { useEffect, useState } from "react";
import axios from "axios";
import { Contact } from "../types/contact";
import { ContactModal } from "../components/contact-modal";
import { useContacts } from "../contexts/contacts-context";

export const Home = () => {
  const { contacts, deleteContact, setContacts } = useContacts()
  const [contactToEdit, setContactToEdit] = useState<Contact>()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [mapUrl, setMapUrl] = useState<string>('https://maps.google.com/maps?q=London&t=&z=13&ie=UTF8&iwloc=&output=embed')
  const [order, setOrder] = useState<string>('asc')
  const [sort, setSort] = useState<string>('name')
  const toast = useToast()

  useEffect(() => {
    axios.get("http://localhost:3000/contacts?page=1&per_page=10&sort=name&order=asc", {
      headers: {
        Authorization: localStorage.getItem('token')
      }
    })
      .then((response) => {
        setContacts(response.data)
      })
      .catch((err) => {
        toast({
          title: "Erro ao carregar contatos",
          description: err.message,
          status: "error",
          duration: 9000,
          isClosable: true,
        })
      })
  }, [])

  const handleDeleteContact = (id: number) => {
    axios.delete(`http://localhost:3000/contacts/${id}`,
      {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      })
      .then((response) => {
        if (response.status === 200) {
          deleteContact(id)
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const handleEditContact = (contact: Contact) => {
    setContactToEdit(contact)
    onOpen()
  }

  const handleAddContact = () => {
    setContactToEdit(undefined)
    onOpen()
  }

  const handleContactMap = (contact: Contact) => {
    const { latitude, longitude } = contact.address
    console.log(contact.address)
    const mapUrl = `https://maps.google.com/maps?q=${latitude},${longitude}&t=&z=13&ie=UTF8&iwloc=&output=embed`
    setMapUrl(mapUrl)
  }

  const handleSearch = (e: any) => {
    const { value } = e.target

    axios.get(`http://localhost:3000/contacts?search=${value}&page=1&per_page=10&sort=name&order=asc`,
      {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      })
      .then((response) => {
        if (response.status === 200) {
          setContacts(response.data)
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const handleSort = (e: any) => {
    const { value } = e.target

    setSort(value)

    axios.get(`http://localhost:3000/contacts?page=1&per_page=10&sort=${value}&order=${order}`,
      {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      })
      .then((response) => {
        if (response.status === 200) {
          setContacts(response.data)
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const handleOrder = (e: any) => {
    const { value } = e.target

    setOrder(value)

    axios.get(`http://localhost:3000/contacts?page=1&per_page=10&sort=${sort}&order=${value}`,
      {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      })
      .then((response) => {
        if (response.status === 200) {
          setContacts(response.data)
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const handleLogout = (e: any) => {
    e.preventDefault()

    axios.delete('http://localhost:3000/logout',
      {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      })
      .then((response) => {
        if (response.status === 200) {
          localStorage.removeItem('token')
          window.location.href = '/login'
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const handleDeleteAccount = (e: any) => {
    e.preventDefault()

    axios.delete('http://localhost:3000/delete_user',
      {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      })
      .then((response) => {
        if (response.status === 200) {
          localStorage.removeItem('token')
          window.location.href = '/login'
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <Flex width="100%" height="100vh">
      <VStack height="100%" width="300px" padding={4} spacing={4} align="stretch" bg="gray.800">
        <Link href="/login" onClick={handleLogout} color="white">Logout</Link>
        <Flex justify="space-between" align="center">
          <Text fontSize="2xl" fontWeight="bold" color="white">Contatos</Text>
          <IconButton icon={<AddIcon />} aria-label="Add contact" onClick={handleAddContact} _hover={{ color: 'green.500' }} />
        </Flex>
        <Input placeholder="Pesquisar" onChange={handleSearch} backgroundColor="white" />
        <HStack>
          <Select placeholder="Ordenar por" onChange={handleSort} backgroundColor="white" cursor="pointer">
            <option value="name">Nome</option>
            <option value="cpf">CPF</option>
          </Select>
          <Select placeholder="Ordem" onChange={handleOrder} backgroundColor="white" cursor="pointer">
            <option value="asc">ASC</option>
            <option value="desc">DESC</option>
          </Select>
        </HStack>
        {contacts.map((contact) => (
          <Flex
            key={contact.id}
            gap={2}
            align="center"
            bg="white"
            borderRadius={8}
            justify="space-between"
            padding="0.5rem 1rem"
            boxShadow="md"
            width="100%"
            _hover={{ cursor: 'pointer', backgroundColor: 'gray.100' }}
            transition="background-color 0.2s ease-in-out"
            onClick={() => handleContactMap(contact)}
          >
            <Flex>
              <Text>{contact.name}</Text>
            </Flex>
            <Flex gap={2}>
              <IconButton icon={<EditIcon />} aria-label="Edit contact" onClick={() => handleEditContact(contact)} _hover={{ color: 'blue.500' }} />
              < IconButton icon={< DeleteIcon />} aria-label="Delete contact" onClick={() => handleDeleteContact(contact.id)} _hover={{ color: 'red.500' }} />
            </Flex>
          </Flex>
        ))}

        <Link href="login" color="red" position="absolute" bottom="1rem" onClick={handleDeleteAccount}>Apagar conta</Link>
      </VStack>
      <Box id="map" width="100%" height="100vh" flex={1}>
        <iframe
          title="map"
          width="100%"
          height="100%"
          src={mapUrl}
        />
      </Box>
      <ContactModal isOpen={isOpen} onClose={onClose} contact={contactToEdit} />
    </Flex >
  );
}