export const GENDER_OPTIONS = ["Male", "Female", "Other"] as const;
export type Gender = (typeof GENDER_OPTIONS)[number];

// Categories exactly as printed on the Lokkalyan Diagnostics paper form:
// Category: SC / ST / OBC / NT / SBC / VJ / General (श्रेणी)
export const CATEGORY_OPTIONS = [
  "General",
  "OBC",
  "SC",
  "ST",
  "NT",
  "SBC",
  "VJ",
] as const;
export type Category = (typeof CATEGORY_OPTIONS)[number];

export const RELIGION_OPTIONS = [
  "Hindu",
  "Buddhist",
  "Muslim",
  "Christian",
  "Jain",
  "Sikh",
  "Other",
] as const;
export type Religion = (typeof RELIGION_OPTIONS)[number];

export const VALIDATION_LIMITS = {
  minNameLength: 2,
  maxNameLength: 60,
  minAge: 1,
  maxAge: 120,
  phoneLength: 10,
  pincodeLength: 6,
  aadharLength: 12,
} as const;

export interface CustomerFormData {
  // Camp Information
  camp_date: string; // Date (दिनांक), form-only
  sr_no: string; // Sr.No (अनुक्रमांक), form-only
  institution: string; // School / College / Institution (शाळा / महाविद्यालय / संस्था)

  // Personal Information
  full_name: string; // Full Name (पूर्ण नाव)
  date_of_birth: string; // Date of Birth (जन्मतारीख) - DD/MM/YYYY
  age: string; // Age (वय) - auto-calculated from DOB
  gender: string; // Gender (लिंग) - Male / Female / Other
  caste: string; // Caste (जात)
  category: string; // Category (श्रेणी) - SC / ST / OBC / NT / SBC / VJ / General
  religion: string; // Religion (धर्म)
  standard_occupation: string; // Standard / Occupation (वर्ग / व्यवसाय)

  // Contact Information
  mobile_no: string; // Mobile No. (मोबाईल क्र.) [10 digits]

  // Address Details
  city_town: string; // City / Town (शहर / गाव)
  district: string; // Dist. (जिल्हा)
  pincode: string; // Pincode (पिन कोड) [6 digits]

  // Identification
  aadhaar_number: string; // Aadhaar No. (आधार नं.) [12 digits]

  // Consent
  consent: boolean; // "I hereby voluntarily consent to collect blood sample for blood test CBC as a self referral"
}

export const INITIAL_FORM_DATA: CustomerFormData = {
  camp_date: "",
  sr_no: "",
  institution: "",
  full_name: "",
  date_of_birth: "",
  age: "",
  gender: "",
  caste: "",
  category: "",
  religion: "",
  standard_occupation: "",
  mobile_no: "",
  city_town: "",
  district: "Nagpur", // Pre-populated for LKD Nagpur camp convenience
  pincode: "",
  aadhaar_number: "",
  consent: false,
};
