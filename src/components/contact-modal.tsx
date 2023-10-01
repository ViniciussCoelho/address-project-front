import {
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Grid,
  GridItem,
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { Contact } from '../types/contact'
import axios from 'axios'
import { useContacts } from '../contexts/contacts-context'

interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
  contact?: Contact
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, contact }) => {
  const isEditMode = !!contact;
  const { addContact, editContact } = useContacts();
  const [editedContact, setEditedContact] = useState<Contact>(contact
    ? contact
    : {
      id: 0,
      cpf: '',
      phone: '',
      name: '',
      address: {
        street: '',
        number: '',
        city: '',
        state: '',
        country: '',
        zipcode: '',
        latitude: '',
        longitude: '',
      },
    })

  useEffect(() => {
    if (contact) {
      setEditedContact(contact);
    } else {
      clearForm();
    }
  }, [contact, isOpen]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setEditedContact((prevContact) => ({
      ...prevContact,
      [name]: value,
    }))
  }

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setEditedContact((prevContact) => ({
      ...prevContact,
      address: {
        ...prevContact.address,
        [name]: value,
      },
    }))
  }

  const handleSubmit = () => {
    const apiUrl = isEditMode
      ? `http://localhost:3000/contacts/${editedContact.id}`
      : 'http://localhost:3000/contacts'

    const requestMethod = isEditMode ? 'PUT' : 'POST'

    axios({
      method: requestMethod,
      url: apiUrl,
      data: editedContact,
    })
      .then((response) => {
        if (response.status === 201 || response.status === 200) {
          if (isEditMode) {
            editContact(editedContact.id, editedContact)
          }
          else {
            addContact(editedContact)
          }
          onClose()
          clearForm()
        }
      })
      .catch((err) => {
        console.error(err)
      })
  }

  const clearForm = () => {
    setEditedContact({
      id: 0,
      cpf: '',
      phone: '',
      name: '',
      address: {
        street: '',
        number: '',
        city: '',
        state: '',
        country: '',
        zipcode: '',
        latitude: '',
        longitude: '',
      },
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Adicionar Contato</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Grid templateAreas={`
            "name cpf"
            "phone zipcode"
            "street number"
            "city state"
            "country country"
          `
          } gap={4} templateColumns="repeat(3, 1fr)">
            <GridItem colSpan={2} area="name">
              <FormControl>
                <FormLabel>Nome</FormLabel>
                <Input
                  type="text"
                  name="name"
                  value={editedContact?.name}
                  onChange={handleChange}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={1} area="cpf">
              <FormControl>
                <FormLabel>CPF</FormLabel>
                <Input
                  type="text"
                  name="cpf"
                  value={editedContact?.cpf}
                  onChange={handleChange}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={2} area="phone">
              <FormControl>
                <FormLabel>Telefone</FormLabel>
                <Input
                  type="text"
                  name="phone"
                  value={editedContact?.phone}
                  onChange={handleChange}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={1} area="zipcode">
              <FormControl>
                <FormLabel>CEP</FormLabel>
                <Input
                  type="text"
                  name="zipcode"
                  value={editedContact?.address?.zipcode}
                  onChange={handleAddressChange}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={2} area="street">
              <FormControl>
                <FormLabel>Rua</FormLabel>
                <Input
                  type="text"
                  name="street"
                  value={editedContact?.address?.street}
                  onChange={handleAddressChange}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={1} area="number">
              <FormControl>
                <FormLabel>Número</FormLabel>
                <Input
                  type="number"
                  name="number"
                  value={editedContact?.address?.number}
                  onChange={handleAddressChange}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={2} area="city">
              <FormControl>
                <FormLabel>Cidade</FormLabel>
                <Input
                  type="text"
                  name="city"
                  value={editedContact?.address?.city}
                  onChange={handleAddressChange}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={1} area="state">
              <FormControl>
                <FormLabel>Estado</FormLabel>
                <Input
                  type="text"
                  name="state"
                  value={editedContact?.address?.state}
                  onChange={handleAddressChange}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={1} area="country">
              <FormControl>
                <FormLabel>País</FormLabel>
                <Input
                  type="text"
                  name="country"
                  value={editedContact?.address?.country}
                  onChange={handleAddressChange}
                />
              </FormControl>
            </GridItem>
          </Grid>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
            Salvar
          </Button>
          <Button onClick={onClose}>Cancelar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}