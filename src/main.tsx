import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App.tsx";
import { ContactsProvider } from "./contexts/contacts-context.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ContactsProvider>
      <ChakraProvider>
        <Router>
          <App />
        </Router>
      </ChakraProvider>
    </ContactsProvider>
  </React.StrictMode>
);
