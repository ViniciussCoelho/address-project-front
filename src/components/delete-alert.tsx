import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Input,
  useToast,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import axios from "axios";

interface DeleteAlertProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeleteAlert: React.FC<DeleteAlertProps> = ({
  isOpen,
  onClose,
}) => {
  const cancelRef = useRef(null);
  const [password, setPassword] = useState<string>("");
  const toast = useToast();

  const handleDeleteAccount = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    axios
      .delete(`http://localhost:3000/delete_user?`, {
        params: {
          password: password,
        },
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((response) => {
        if (response.status === 200) {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
      })
      .catch(() => {
        toast({
          description: "Senha incorreta",
          status: "error",
          position: "top-right",
          duration: 9000,
          isClosable: true,
        });
      });
  };

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Delete Customer
          </AlertDialogHeader>

          <AlertDialogBody>
            Digite sua senha para confirmar a exclusão da sua conta.
            <Input
              type="password"
              placeholder="Senha"
              onChange={(e) => setPassword(e.target.value)}
            />
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={handleDeleteAccount} ml={3}>
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};
