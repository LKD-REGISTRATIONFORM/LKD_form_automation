import {
  CustomerFormData,
  INITIAL_FORM_DATA,
} from "../../constants/formConstants";
import {
  calculateAgeFromDob,
  parseDateString,
  validateCustomerForm,
  validateField,
} from "../validation";

const validRecord: CustomerFormData = {
  camp_date: "29/10/2026",
  sr_no: "101",
  institution: "Dharampeth Science College",
  full_name: "Rahul Ramesh Deshmukh",
  date_of_birth: "15/05/2005",
  age: "21",
  gender: "Male",
  caste: "Maratha",
  category: "General",
  religion: "Hindu",
  standard_occupation: "12th Science",
  mobile_no: "9876543210",
  city_town: "Nagpur",
  district: "Nagpur",
  pincode: "440025",
  aadhaar_number: "123456789012",
  consent: true,
};

describe("parseDateString", () => {
  it("accepts real calendar dates, including a leap day", () => {
    expect(parseDateString("29/10/2026")).not.toBeNull();
    expect(parseDateString("29/02/2024")).not.toBeNull();
  });

  it.each(["31/02/2026", "29/02/2023", "invalid", ""])(
    "rejects %p",
    (value) => {
      expect(parseDateString(value)).toBeNull();
    }
  );
});

describe("calculateAgeFromDob", () => {
  it("calculates age in full years", () => {
    expect(calculateAgeFromDob("15/05/2005")).toBeGreaterThan(18);
  });

  it("returns null for an invalid date", () => {
    expect(calculateAgeFromDob("not a date")).toBeNull();
  });
});

describe("validateField", () => {
  const error = (field: keyof CustomerFormData, value: string | boolean) =>
    validateField(field, value, INITIAL_FORM_DATA);

  it.each([
    ["sr_no", ""],
    ["caste", ""],
    ["caste", "R"],
    ["religion", ""],
    ["full_name", ""],
    ["full_name", "R"],
    ["category", ""],
    ["gender", ""],
    ["mobile_no", ""],
    ["mobile_no", "12345"],
    ["mobile_no", "1234567890"],
    ["pincode", "44001"],
    ["pincode", "044001"],
    ["aadhaar_number", "123456789"],
    ["consent", false],
  ] as const)("rejects %s = %p", (field, value) => {
    expect(error(field, value)).not.toBeNull();
  });

  it.each([
    ["sr_no", "101"],
    ["caste", "Maratha"],
    ["religion", "Hindu"],
    ["full_name", "Rahul Ramesh Deshmukh"],
    ["category", "OBC"],
    ["mobile_no", "9876543210"],
    ["pincode", "440025"],
    ["aadhaar_number", "123456789012"],
    ["consent", true],
  ] as const)("accepts %s = %p", (field, value) => {
    expect(error(field, value)).toBeNull();
  });
});

describe("validateCustomerForm", () => {
  it("has no errors for a complete valid record", () => {
    expect(validateCustomerForm(validRecord)).toEqual({});
  });

  it.each(["sr_no", "caste", "religion", "consent"] as const)(
    "reports an error when %s is missing",
    (field) => {
      const blank = { ...validRecord, [field]: INITIAL_FORM_DATA[field] };
      expect(validateCustomerForm(blank)[field]).toBeDefined();
    }
  );
});
