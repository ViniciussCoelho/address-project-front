import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button } from "@chakra-ui/react"
import { useRef } from "react"
import axios from "axios"

interface DeleteAlertProps {
  isOpen: boolean
  onClose: () => void
}

export const DeleteAlert: React.FC<DeleteAlertProps> = ({ isOpen, onClose }) => {
  const cancelRef = useRef(null)

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
    < AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize='lg' fontWeight='bold'>
            Delete Customer
          </AlertDialogHeader>

          <AlertDialogBody>
            Are you sure? You can't undo this action afterwards.
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme='red' onClick={handleDeleteAccount} ml={3}>
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog >
  )
}