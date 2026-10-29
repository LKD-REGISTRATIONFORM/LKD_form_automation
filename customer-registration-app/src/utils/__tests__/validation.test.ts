import {
  calculateAgeFromDob,
  formatDate,
  parseDateString,
  validateCustomerForm,
  validateField,
} from "../validation";
import { CustomerFormData, INITIAL_FORM_DATA } from "../../constants/formConstants";

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

console.log("Running LKD validation tests...");

// Test parseDateString
assert(parseDateString("29/10/2026") !== null, "Should parse valid date");
assert(parseDateString("31/02/2026") === null, "Should reject Feb 31");
assert(parseDateString("29/02/2024") !== null, "Should accept leap year Feb 29");
assert(parseDateString("29/02/2023") === null, "Should reject non-leap year Feb 29");
assert(parseDateString("invalid") === null, "Should reject invalid string");

// Test Automatic Age Calculation from Date of Birth ("automatic age cal.")
const pastDob = "15/05/2005";
const calculatedAge = calculateAgeFromDob(pastDob);
assert(calculatedAge !== null && calculatedAge > 18, "Age should be > 18 for year 2005");

// Test Full Name validation
assert(validateField("fullName", "", INITIAL_FORM_DATA) !== null, "Empty name should be invalid");
assert(validateField("fullName", "R", INITIAL_FORM_DATA) !== null, "Single letter name should be invalid");
assert(validateField("fullName", "Rahul Ramesh Deshmukh", INITIAL_FORM_DATA) === null, "Valid name should pass");

// Test Mobile No validation (10 boxes)
assert(validateField("mobileNo", "", INITIAL_FORM_DATA) !== null, "Empty mobile should be invalid");
assert(validateField("mobileNo", "12345", INITIAL_FORM_DATA) !== null, "Short mobile should be invalid");
assert(validateField("mobileNo", "1234567890", INITIAL_FORM_DATA) !== null, "Mobile starting with 1 should be invalid");
assert(validateField("mobileNo", "9876543210", INITIAL_FORM_DATA) === null, "10-digit mobile starting with 9 should pass");

// Test Pincode validation (6 boxes)
assert(validateField("pincode", "44001", INITIAL_FORM_DATA) !== null, "5-digit pincode should fail");
assert(validateField("pincode", "044001", INITIAL_FORM_DATA) !== null, "Pincode starting with 0 should fail");
assert(validateField("pincode", "440025", INITIAL_FORM_DATA) === null, "Valid 6-digit pincode should pass");

// Test Aadhar No validation (12 boxes)
assert(validateField("aadharNo", "123456789", INITIAL_FORM_DATA) !== null, "Aadhar < 12 digits should fail");
assert(validateField("aadharNo", "123456789012", INITIAL_FORM_DATA) === null, "12-digit Aadhar should pass");

// Test Category selection
assert(validateField("category", "", INITIAL_FORM_DATA) !== null, "Empty category should fail");
assert(validateField("category", "OBC", INITIAL_FORM_DATA) === null, "Valid category should pass");

// Test Consent
assert(validateField("consent", false, INITIAL_FORM_DATA) !== null, "Unchecked consent should fail");
assert(validateField("consent", true, INITIAL_FORM_DATA) === null, "Checked consent should pass");

// Test complete valid form matching Lokkalyan Diagnostics paper form
const validLkdRecord: CustomerFormData = {
  campDate: "29/10/2026",
  srNo: "101",
  institution: "Dharampeth Science College",
  fullName: "Rahul Ramesh Deshmukh",
  dob: "15/05/2005",
  age: "21",
  gender: "Male",
  caste: "Maratha",
  category: "General",
  religion: "Hindu",
  standardOrOccupation: "12th Science",
  mobileNo: "9876543210",
  cityTown: "Nagpur",
  district: "Nagpur",
  pincode: "440025",
  aadharNo: "123456789012",
  consent: true,
};

const errors = validateCustomerForm(validLkdRecord);
assert(Object.keys(errors).length === 0, `Valid form produced errors: ${JSON.stringify(errors)}`);

console.log("All LKD validation tests passed successfully!");
