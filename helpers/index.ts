import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
}

interface Vendor {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    country: string;
}

interface Product {
    id: string;
    name: string;
    price: number;
}

interface PurchaseOrder {
    id: string;
    customerId: string;
    vendorId: string;
    productId: string;
}

const generateCustomers = (amount: number): Customer[] => {
    const customers: Customer[] = [];
    for (let i = 0; i < amount; i++) {
        customers.push({
            id: uuidv4(),
            name: faker.person.fullName(),
            email: faker.internet.email(),
            phone: faker.phone.number(),
        });
    }
    return customers;
}

const generateVendors = (amount: number): Vendor[] => {
    const vendors: Vendor[] = [];
    for (let i = 0; i < amount; i++) {
        vendors.push({
            id: uuidv4(),
            name: faker.company.name(),
            email: faker.internet.email(),
            phone: faker.phone.number(),
            address: faker.location.streetAddress(),
            country: faker.location.country(),
        });
    }
    return vendors;
}

const generateProducts = (amount: number): Product[] => {
    const products: Product[] = [];
    for (let i = 0; i < amount; i++) {
        products.push({
            id: uuidv4(),
            name: faker.commerce.productName(),
            price: parseFloat(faker.commerce.price({min: 10, max: 1000})),
        });
    }
    return products;
}

const generatePurchaseOrders = (
    amount: number,
    customers: Customer[],
    vendors: Vendor[],
    products: Product[])
: PurchaseOrder[] => {
    if (customers.length === 0 || vendors.length === 0 || products.length === 0) {
        throw new Error('At least one customer, vendor, and product must be provided');
    }
    const purchaseOrders: PurchaseOrder[] = [];
        for (let i = 0; i < amount; i++) {
            purchaseOrders.push({
                id: uuidv4(),
                customerId: customers[Math.floor(Math.random() * customers.length)].id,
                vendorId: vendors[Math.floor(Math.random() * vendors.length)].id,
                productId: products[Math.floor(Math.random() * products.length)].id,
            });
        }
        return purchaseOrders;
}

const main = () => {
    const customers = generateCustomers(500);
    const vendors = generateVendors(20);
    const products = generateProducts(50);
    const purchaseOrders = generatePurchaseOrders(10000, customers, vendors, products);

    if (!existsSync('./output')) {
        mkdirSync('./output');
    }

    writeFileSync('./output/customers.json', JSON.stringify(customers, null, 2));
    writeFileSync('./output/vendors.json', JSON.stringify(vendors, null, 2));
    writeFileSync('./output/products.json', JSON.stringify(products, null, 2));
    writeFileSync('./output/purchaseOrders.json', JSON.stringify(purchaseOrders, null, 2));

    // console.log(customers, vendors, products, purchaseOrders);
}

main();