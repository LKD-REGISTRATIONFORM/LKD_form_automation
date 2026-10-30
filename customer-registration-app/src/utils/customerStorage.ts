// AsyncStorage saves customer records on the device.
import AsyncStorage from "@react-native-async-storage/async-storage";

// Import the shared customer data structure.
import type { Customer } from "../types/customer";

// Keep one key for all registered customer records.
const STORAGE_KEY = "@lokkalyan_customers";

// Load all saved customer records.
export async function getCustomers(): Promise<Customer[]> {
  const storedData = await AsyncStorage.getItem(STORAGE_KEY);

  // Return an empty list when no records exist.
  if (!storedData) return [];

  // Convert the stored JSON string back into records.
  return JSON.parse(storedData) as Customer[];
}

// Save the complete customer list to device storage.
async function saveCustomers(customers: Customer[]): Promise<void> {
  await AsyncStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(customers)
  );
}

// Add a new customer to the existing records.
export async function addCustomer(
  customer: Customer
): Promise<void> {
  const customers = await getCustomers();

  // Keep existing records and append the new one.
  customers.push(customer);

  await saveCustomers(customers);
}

// Update an existing customer using their unique ID.
export async function updateCustomer(
  updatedCustomer: Customer
): Promise<void> {
  const customers = await getCustomers();

  const updatedList = customers.map((customer) =>
    customer.id === updatedCustomer.id
      ? updatedCustomer
      : customer
  );

  await saveCustomers(updatedList);
}

// Delete a customer using their unique ID.
export async function deleteCustomer(id: string): Promise<void> {
  const customers = await getCustomers();

  // Keep every record except the selected customer.
  const updatedList = customers.filter(
    (customer) => customer.id !== id
  );

  await saveCustomers(updatedList);
}