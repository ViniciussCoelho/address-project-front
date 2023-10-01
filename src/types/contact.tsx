type Address = {
    street: string;
    number: string;
    city: string;
    state: string;
    country: string;
    zipcode: string;
    latitude: string;
    longitude: string;
}

export type Contact = {
    id: number;
    cpf: string;
    phone: string;
    name: string;
    address: Address;
}