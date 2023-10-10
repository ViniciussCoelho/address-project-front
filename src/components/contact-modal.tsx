import {
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
  FormErrorMessage,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Contact } from "../types/contact";
import axios from "axios";
import { useContacts } from "../contexts/contacts-context";
import InputMask from "react-input-mask";
import { cpf } from "cpf-cnpj-validator";
import { useAppToast } from "../helpers/app-toast";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  contact?: Contact;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  contact,
}) => {
  const isEditMode = !!contact;
  const { addContact, editContact } = useContacts();
  const showToast = useAppToast();
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [editedContact, setEditedContact] = useState<Contact>(
    contact || {} as Contact
  );

  useEffect(() => {
    if (contact) {
      console.log(contact);
      setEditedContact(contact);
    } else {
      clearForm();
    }
  }, [contact, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setEditedContact((prevContact) => ({
      ...prevContact,
      [name]: value,
    }));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name == "zipcode") {
      handleSearchZipcode(value);
    }

    setEditedContact((prevContact) => ({
      ...prevContact,
      address: {
        ...prevContact.address,
        [name]: value,
      },
    }));
  };

  const handleSubmit = () => {
    if (validateForm()) {
      return;
    }
    if (!cpf.isValid(editedContact.cpf)) {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        cpf: "CPF inválido",
      }));
      return;
    }

    const apiUrl = isEditMode
      ? `http://localhost:3000/contacts/${editedContact.id}`
      : "http://localhost:3000/contacts";

    const requestMethod = isEditMode ? "PUT" : "POST";

    axios({
      method: requestMethod,
      url: apiUrl,
      data: editedContact,
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    })
      .then((response) => {
        if (response.status === 201 || response.status === 200) {
          if (isEditMode) {
            editContact(editedContact.id, editedContact);
          } else {
            addContact(editedContact);
          }
          showToast("success", "Contato salvo com sucesso");
          onClose();
          clearForm();
        }
      })
      .catch((error) => {
        if (error.response.status === 401) {
          window.location.href = "/login";
          return;
        }
        if (
          error.response.status === 422 &&
          error.response.data.cpf[0] === "CPF já cadastrado"
        ) {
          setValidationErrors((prevErrors) => ({
            ...prevErrors,
            cpf: "CPF já cadastrado",
          }));
          return;
        }

        showToast("error", "Erro ao salvar contato");
      });
  };

  const clearForm = () => {
    setEditedContact({
      id: 0,
      cpf: "",
      phone: "",
      name: "",
      address: {
        street: "",
        number: "",
        city: "",
        neighborhood: "",
        complement: "",
        state: "",
        country: "",
        zipcode: "",
        latitude: "",
        longitude: "",
      },
    });
  };

  const handleSearchZipcode = (zipcode: string) => {
    if (zipcode.length < 9) {
      return;
    }

    axios
      .get(`http://localhost:3000/address_by_zipcode`, {
        params: {
          address: {
            zipcode: zipcode,
          },
        },
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((response) => {
        const { data } = response;

        setEditedContact((prevContact) => ({
          ...prevContact,
          address: {
            ...prevContact.address,
            street: data.address.address,
            neighborhood: data.address.neighborhood,
            city: data.address.city,
            state: data.address.state,
            country: "Brasil",
          },
        }));
      })
      .catch((error) => {
        if (error.response.status === 401) {
          window.location.href = "/login";
          return;
        }

        showToast("error", "Erro ao buscar CEP");
      });
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    for (const [key, value] of Object.entries(editedContact)) {
      if (value.toString().trim() === "") {
        errors[key] = "Campo obrigatório";
      }
    }

    for (const [key, value] of Object.entries(editedContact.address)) {
      if (key === "latitude" || key === "longitude" || key === "complement") {
        continue;
      }
      if (value.toString().trim() === "") {
        errors[key] = "Campo obrigatório";
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length > 0;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {isEditMode ? "Editar contato" : "Adicionar contato"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Grid
            templateAreas={`
            "name cpf"
            "phone zipcode"
            "street number"
            "city state"
            "neighborhood country"
            "complement complement"
          `}
            gap={4}
            templateColumns="repeat(3, 1fr)"
          >
            <GridItem colSpan={2} area="name">
              <FormControl isInvalid={!!validationErrors.name} isRequired>
                <FormLabel>Nome</FormLabel>
                <Input
                  type="text"
                  name="name"
                  value={editedContact?.name}
                  onChange={handleChange}
                  onBlur={() => {
                    setValidationErrors((prevErrors) => ({
                      ...prevErrors,
                      name: "",
                    }));
                  }}
                />
                <FormErrorMessage>{validationErrors.name}</FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem colSpan={1} area="cpf">
              <FormControl isInvalid={!!validationErrors.cpf} isRequired>
                <FormLabel>CPF</FormLabel>
                <Input
                  type="text"
                  name="cpf"
                  value={editedContact?.cpf}
                  onChange={handleChange}
                  as={InputMask}
                  mask="999.999.999-99"
                  maskChar={null}
                  onBlur={() => {
                    setValidationErrors((prevErrors) => ({
                      ...prevErrors,
                      cpf: "",
                    }));
                  }}
                />
                <FormErrorMessage>{validationErrors.cpf}</FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem colSpan={2} area="phone">
              <FormControl isInvalid={!!validationErrors.phone} isRequired>
                <FormLabel>Telefone</FormLabel>
                <Input
                  type="text"
                  name="phone"
                  value={editedContact?.phone}
                  onChange={handleChange}
                  as={InputMask}
                  mask="(99) 99999-9999"
                  maskChar={null}
                  onBlur={() => {
                    setValidationErrors((prevErrors) => ({
                      ...prevErrors,
                      phone: "",
                    }));
                  }}
                />
                <FormErrorMessage>{validationErrors.phone}</FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem colSpan={1} area="zipcode">
              <FormControl isInvalid={!!validationErrors.zipcode} isRequired>
                <FormLabel>CEP</FormLabel>
                <Input
                  type="text"
                  as={InputMask}
                  name="zipcode"
                  value={editedContact?.address?.zipcode}
                  onChange={handleAddressChange}
                  mask="99999-999"
                  maskChar={null}
                  onBlur={() => {
                    setValidationErrors((prevErrors) => ({
                      ...prevErrors,
                      zipcode: "",
                    }));
                  }}
                />
                <FormErrorMessage>{validationErrors.zipcode}</FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem colSpan={2} area="street">
              <FormControl isInvalid={!!validationErrors.street} isRequired>
                <FormLabel>Rua</FormLabel>
                <Input
                  type="text"
                  name="street"
                  value={editedContact?.address?.street}
                  onChange={handleAddressChange}
                  onBlur={() => {
                    setValidationErrors((prevErrors) => ({
                      ...prevErrors,
                      street: "",
                    }));
                  }}
                />
                <FormErrorMessage>{validationErrors.street}</FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem colSpan={1} area="number">
              <FormControl isInvalid={!!validationErrors.number} isRequired>
                <FormLabel>Número</FormLabel>
                <Input
                  type="number"
                  name="number"
                  value={editedContact?.address?.number}
                  onChange={handleAddressChange}
                  onBlur={() => {
                    setValidationErrors((prevErrors) => ({
                      ...prevErrors,
                      number: "",
                    }));
                  }}
                />
                <FormErrorMessage>{validationErrors.number}</FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem colSpan={2} area="city">
              <FormControl isInvalid={!!validationErrors.city} isRequired>
                <FormLabel>Cidade</FormLabel>
                <Input
                  type="text"
                  name="city"
                  value={editedContact?.address?.city}
                  onChange={handleAddressChange}
                  onBlur={() => {
                    setValidationErrors((prevErrors) => ({
                      ...prevErrors,
                      city: "",
                    }));
                  }}
                />
                <FormErrorMessage>{validationErrors.city}</FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem colSpan={1} area="neighborhood">
              <FormControl
                isInvalid={!!validationErrors.neighborhood}
                isRequired
              >
                <FormLabel>Bairro</FormLabel>
                <Input
                  type="text"
                  name="neighborhood"
                  value={editedContact?.address?.neighborhood}
                  onChange={handleAddressChange}
                  onBlur={() => {
                    setValidationErrors((prevErrors) => ({
                      ...prevErrors,
                      neighborhood: "",
                    }));
                  }}
                />
                <FormErrorMessage>
                  {validationErrors.neighborhood}
                </FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem colSpan={1} area="state">
              <FormControl isInvalid={!!validationErrors.state} isRequired>
                <FormLabel>Estado</FormLabel>
                <Input
                  type="text"
                  name="state"
                  value={editedContact?.address?.state}
                  onChange={handleAddressChange}
                  onBlur={() => {
                    setValidationErrors((prevErrors) => ({
                      ...prevErrors,
                      state: "",
                    }));
                  }}
                />
                <FormErrorMessage>{validationErrors.state}</FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem colSpan={1} area="country">
              <FormControl isInvalid={!!validationErrors.country} isRequired>
                <FormLabel>País</FormLabel>
                <Input
                  type="text"
                  name="country"
                  value={editedContact?.address?.country}
                  onChange={handleAddressChange}
                  onBlur={() => {
                    setValidationErrors((prevErrors) => ({
                      ...prevErrors,
                      country: "",
                    }));
                  }}
                />
                <FormErrorMessage>{validationErrors.country}</FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem colSpan={2} area="complement">
              <FormControl>
                <FormLabel>Complemento</FormLabel>
                <Input
                  type="text"
                  name="complement"
                  value={editedContact?.address?.complement}
                  onChange={handleAddressChange}
                />
              </FormControl>
            </GridItem>
          </Grid>
        </ModalBody>
        <ModalFooter>
          <Button
            mr={3}
            onClick={handleSubmit}
            colorScheme={isEditMode ? "blue" : "green"}
          >
            Salvar
          </Button>
          <Button onClick={onClose}>Cancelar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
