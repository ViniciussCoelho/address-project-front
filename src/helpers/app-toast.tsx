import { useToast } from "@chakra-ui/react";

export function useAppToast() {
  const toast = useToast();

  const showToast = (
    status: "success" | "error" | "warning",
    message: string
  ) => {
    toast({
      description: message,
      status: status,
      duration: 5000,
      variant: "left-accent",
      position: "bottom-right",
      isClosable: true,
    });
  };

  return showToast;
}
