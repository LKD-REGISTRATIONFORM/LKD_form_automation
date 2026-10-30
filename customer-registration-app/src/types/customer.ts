/**
 * Shared customer data structure for the mobile application.
 * Other screens and components can import this type.
 */
export type Customer = {
  // Unique registration number assigned to a customer.
  id: string;

  // Institution and personal information.
  institution: string;
  name: string;
  dob: string;
  gender: string;
  caste: string;
  category: string;

  // Contact and location information.
  phone: string;
  city: string;
  district: string;
  pincode: string;
  address: string;

  // Additional customer information.
  religion: string;
  occupation: string;
  aadhaar: string;
  signature: string;

  // Records the date on which the registration was created.
  createdAt: string;
};

/**
 * Creates an empty form using the same field names as Customer.
 * The id and createdAt are assigned when a record is saved.
 */
export type CustomerFormData = Omit<Customer, "id" | "createdAt">;

/**
 * Initial values used when opening a new customer form.
 * Empty strings keep all inputs controlled from the beginning.
 */
export const initialCustomerForm: CustomerFormData = {
  institution: "",
  name: "",
  dob: "",
  gender: "",
  caste: "",
  category: "",
  phone: "",
  city: "",
  district: "",
  pincode: "",
  address: "",
  religion: "",
  occupation: "",
  aadhaar: "",
  signature: "",
};
