import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

interface Customer {
    customerId: string;
    customer_name: string;
    email: string;
    phone: string;
}

interface Vendor {
    vendorId: string;
    company_name: string;
    email: string;
    phone: string;
    address: string;
    country: string;
}

interface Product {
    productId: string;
    product_name: string;
    price: number;
}

interface PurchaseOrder {
    id: string;
    orderCustomerId: string;
    orderVendorId: string;
    orderProductId: string;
}

const generateCustomers = (amount: number): Customer[] => {
    const customers: Customer[] = [];
    for (let i = 0; i < amount; i++) {
        customers.push({
            customerId: uuidv4(),
            customer_name: faker.person.fullName(),
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
            vendorId: uuidv4(),
            company_name: faker.company.name(),
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
            productId: uuidv4(),
            product_name: faker.commerce.productName(),
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
                orderCustomerId: customers[Math.floor(Math.random() * customers.length)].customerId,
                orderVendorId: vendors[Math.floor(Math.random() * vendors.length)].vendorId,
                orderProductId: products[Math.floor(Math.random() * products.length)].productId,
            });
        }
        return purchaseOrders;
}

const main = () => {
    const customersAmount = process.env.CUSTOMERS ? parseInt(process.env.CUSTOMERS) : 500;
    const vendorsAmount = process.env.VENDORS ? parseInt(process.env.VENDORS) : 20;
    const productsAmount = process.env.PRODUCTS ? parseInt(process.env.PRODUCTS) : 50;
    const purchaseOrdersAmount = process.env.PURCHASE_ORDERS ? parseInt(process.env.PURCHASE_ORDERS) : 10000;

    console.log(`Generating ${customersAmount} customers, ${vendorsAmount} vendors, ${productsAmount} products, and ${purchaseOrdersAmount} purchase orders`);

    const customers = generateCustomers(customersAmount);
    const vendors = generateVendors(vendorsAmount);
    const products = generateProducts(productsAmount);
    const purchaseOrders = generatePurchaseOrders(purchaseOrdersAmount, customers, vendors, products);

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