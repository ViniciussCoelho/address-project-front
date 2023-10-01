
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Contact } from '../types/contact';
import axios from 'axios';

interface ContactsContextType {
    contacts: Contact[];
    addContact: (contact: Contact) => void;
    deleteContact: (id: number) => void;
    editContact: (id: number, contact: Contact) => void;
}

const ContactsContext = createContext<ContactsContextType | undefined>(undefined);

export function ContactsProvider({ children }: { children: ReactNode }) {
    const [contacts, setContacts] = useState<Contact[]>([]);

    useEffect(() => {
        axios.get('http://localhost:3000/contacts', {
            headers: {
                Authorization: localStorage.getItem('token')
            }
        })
            .then((response) => {
                setContacts(response.data)
            })
            .catch((err) => {
                console.log(err)
            })
    }, [])

    const addContact = (contact: Contact) => {
        setContacts([...contacts, contact]);
    };

    const deleteContact = (id: number) => {
        const updatedContacts = contacts.filter((contact) => contact.id !== id);
        setContacts(updatedContacts);
    };

    const editContact = (id: number, editedContact: Contact) => {
        const updatedContacts = contacts.map((contact) => {
            if (contact.id === id) {
                return editedContact;
            }
            return contact;
        });
        setContacts(updatedContacts);
    }

    return (
        <ContactsContext.Provider value={{ contacts, addContact, deleteContact, editContact }}>
            {children}
        </ContactsContext.Provider>
    );
}

export function useContacts() {
    const context = useContext(ContactsContext);
    if (!context) {
        throw new Error('useContacts must be used within a ContactsProvider');
    }
    return context;
}