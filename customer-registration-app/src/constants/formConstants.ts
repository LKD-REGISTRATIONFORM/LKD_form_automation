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
  campDate: string; // Date (दिनांक)
  srNo: string; // Sr.No (अनुक्रमांक)
  institution: string; // School / College / Institution (शाळा / महाविद्यालय / संस्था)

  // Personal Information
  fullName: string; // Full Name (पूर्ण नाव)
  dob: string; // Date of Birth (जन्मतारीख) - DD/MM/YYYY
  age: string; // Age (वय) - auto-calculated from DOB
  gender: string; // Gender (लिंग) - Male / Female / Other
  caste: string; // Caste (जात)
  category: string; // Category (श्रेणी) - SC / ST / OBC / NT / SBC / VJ / General
  religion: string; // Religion (धर्म)
  standardOrOccupation: string; // Standard / Occupation (वर्ग / व्यवसाय)

  // Contact Information
  mobileNo: string; // Mobile No. (मोबाईल क्र.) [10 digits]

  // Address Details
  cityTown: string; // City / Town (शहर / गाव)
  district: string; // Dist. (जिल्हा)
  pincode: string; // Pincode (पिन कोड) [6 digits]

  // Identification
  aadharNo: string; // Aadhar No. (आधार नं.) [12 digits]

  // Consent
  consent: boolean; // "I hereby voluntarily consent to collect blood sample for blood test CBC as a self referral"
}

export const INITIAL_FORM_DATA: CustomerFormData = {
  campDate: "",
  srNo: "",
  institution: "",
  fullName: "",
  dob: "",
  age: "",
  gender: "",
  caste: "",
  category: "",
  religion: "",
  standardOrOccupation: "",
  mobileNo: "",
  cityTown: "",
  district: "Nagpur", // Pre-populated for LKD Nagpur camp convenience
  pincode: "",
  aadharNo: "",
  consent: false,
};
