import {
  Flex,
  VStack,
  Text,
  IconButton,
  Box,
  useDisclosure,
  Input,
  Select,
  Link,
  Button,
} from "@chakra-ui/react";
import {
  AiFillDelete as DeleteIcon,
  AiFillEdit as EditIcon,
  AiFillPlusCircle as AddIcon,
} from "react-icons/ai";
import { useEffect, useState } from "react";
import axios from "axios";
import { Contact } from "../types/contact";
import { ContactModal } from "../components/contact-modal";
import { useContacts } from "../contexts/contacts-context";
import { DeleteAlert } from "../components/delete-alert";
import { useAppToast } from "../helpers/app-toast";

export const Home = () => {
  const { contacts, deleteContact, setContacts } = useContacts();
  const [contactToEdit, setContactToEdit] = useState<Contact>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const showToast = useAppToast();
  const {
    isOpen: isOpenDelete,
    onOpen: onOpenDelete,
    onClose: onCloseDelete,
  } = useDisclosure();
  const [mapUrl, setMapUrl] = useState<string>(
    "https://maps.google.com/maps?q=Brazil&t=&z=13&ie=UTF8&iwloc=&output=embed"
  );

  useEffect(() => {
    fetchContacts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchContacts = (page = 1) => {
    axios
      .get(
        `http://localhost:3000/contacts?page=${page}&per_page=10&sort=name&order=asc`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          setContacts(response.data.contacts);
          setTotalPages(response.data.total_pages);
          setCurrentPage(page);
        }
      })
      .catch((err) => {
        if (err.response.status === 401) {
          window.location.href = "/login";
          return;
        }
        showToast("error", "Erro ao carregar contatos");
      });
  };

  const handlePageChange = (page: number) => {
    fetchContacts(page);
  };

  const handleDeleteContact = (id: number) => {
    axios
      .delete(`http://localhost:3000/contacts/${id}`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((response) => {
        if (response.status === 200) {
          deleteContact(id);
          showToast("success", "Contato deletado com sucesso");
        }
      })
      .catch((err) => {
        if (err.response.status === 401) {
          window.location.href = "/login";
          return;
        }
        showToast("error", "Erro ao deletar contato");
      });
  };

  const handleEditContact = (contact: Contact) => {
    setContactToEdit(contact);
    onOpen();
  };

  const handleAddContact = () => {
    setContactToEdit(undefined);
    onOpen();
  };

  const handleContactMap = (contact: Contact) => {
    const { latitude, longitude } = contact.address;
    const mapUrl = `https://maps.google.com/maps?q=${latitude},${longitude}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
    setMapUrl(mapUrl);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    axios
      .get(
        `http://localhost:3000/contacts?search=${value}&page=1&per_page=10&sort=name&order=asc`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          setContacts(response.data.contacts);
        }
      })
      .catch(() => {
        showToast("error", "Erro ao pesquisar contatos");
      });
  };

  const handleOrder = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;

    axios
      .get(
        `http://localhost:3000/contacts?page=1&per_page=10&sort=name&order=${value}`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          setContacts(response.data.contacts);
        }
      })
      .catch(() => {});
  };

  const handleLogout = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    axios
      .delete("http://localhost:3000/logout", {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((response) => {
        if (response.status === 200) {
          showToast("success", "Logout realizado com sucesso");
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
      })
      .catch(() => {});
  };

  const handleDeleteAccount = () => {
    onOpenDelete();
  };

  return (
    <Flex width="100%" height="100vh">
      <VStack
        height="100%"
        width="300px"
        padding={4}
        spacing={4}
        align="stretch"
        bg="white"
      >
        <Flex justify="space-between" align="center">
          <Link href="/login" onClick={handleLogout} color="red">
            Sair
          </Link>
          <Button colorScheme="red" onClick={handleDeleteAccount} ml={3}>
            Apagar conta
          </Button>
        </Flex>
        <Flex justify="space-between" align="center">
          <Text fontSize="2xl" fontWeight="bold" color="black">
            Contatos
          </Text>
          <IconButton
            icon={<AddIcon />}
            aria-label="Add contact"
            onClick={handleAddContact}
            _hover={{ color: "green.500" }}
          />
        </Flex>
        <Input
          placeholder="Pesquisar"
          onChange={handleSearch}
          backgroundColor="white"
        />
        <Select
          onChange={handleOrder}
          backgroundColor="white"
          cursor="pointer"
          defaultValue="asc"
        >
          <option value="asc">ASC</option>
          <option value="desc">DESC</option>
        </Select>
        <Box overflowY="auto">
          {contacts &&
            contacts.map((contact) => (
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
                _hover={{ cursor: "pointer", backgroundColor: "gray.100" }}
                transition="background-color 0.2s ease-in-out"
                onClick={() => handleContactMap(contact)}
                marginBottom={2}
              >
                <Flex>
                  <Text>{contact.name}</Text>
                </Flex>
                <Flex gap={2}>
                  <IconButton
                    icon={<EditIcon />}
                    aria-label="Edit contact"
                    onClick={() => handleEditContact(contact)}
                    _hover={{ color: "blue.500" }}
                  />
                  <IconButton
                    icon={<DeleteIcon />}
                    aria-label="Delete contact"
                    onClick={() => handleDeleteContact(contact.id)}
                    _hover={{ color: "red.500" }}
                  />
                </Flex>
              </Flex>
            ))}
        </Box>
        <Flex justify="center" mt={4} align="center">
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            isDisabled={currentPage === 1}
            fontSize="sm"
          >
            Previous
          </Button>
          <Text mx={2} fontSize="sm">
            Page {currentPage} of {totalPages}
          </Text>
          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            isDisabled={currentPage === totalPages}
            fontSize="sm"
          >
            Next
          </Button>
        </Flex>
      </VStack>
      <Box id="map" width="100%" height="100vh" flex={1}>
        <iframe title="map" width="100%" height="100%" src={mapUrl} />
      </Box>
      <ContactModal isOpen={isOpen} onClose={onClose} contact={contactToEdit} />
      <DeleteAlert isOpen={isOpenDelete} onClose={onCloseDelete} />
    </Flex>
  );
};
