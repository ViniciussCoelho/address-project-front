import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Input,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import axios from "axios";
import { useAppToast } from "../helpers/app-toast";

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
  const showToast = useAppToast();

  const handleDeleteAccount = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    axios
      .delete(`http://localhost:3000/delete_user`, {
        params: {
          password: password,
        },
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((response) => {
        if (response.status === 200) {
          showToast("success", "Conta deletada com sucesso");
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
      })
      .catch(() => {
        showToast("error", "Senha incorreta");
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
