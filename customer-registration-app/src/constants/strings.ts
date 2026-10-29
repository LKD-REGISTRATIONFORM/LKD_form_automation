export const FORM_STRINGS = {
  // Navigation
  backButton: "‹ Back to Home",
  backAccessibilityLabel: "Back to Home",
  clearAllButton: "Clear All",
  cancelExitButton: "Cancel & Exit",
  submitButton: "Validate & Save Record",
  submitAccessibilityLabel: "Submit and Save Record",

  // Header Banner
  campPillText: "Free Blood Testing Camp • To Screen Youth for Anaemia",
  campSlogan: "स्वस्थ युवा - स्वस्थ भारत",
  orgName: "LOKKALYAN DIAGNOSTICS",
  orgCollab: "In association with Western Coalfields Limited",
  orgProject: "Project SUSHRUTA",
  mandatoryNotePrefix: "Fields with ",
  mandatoryNoteSuffix: " are mandatory according to the paper record.",
  bottomFooter: "Project SUSHRUTA · Anaemia Screening Digital Record System",

  // Clear Alert
  clearAlertTitle: "Clear Form",
  clearAlertMessage: "Are you sure you want to reset all entered details?",
  clearAlertCancel: "Cancel",
  clearAlertConfirm: "Reset",

  // Section Headers
  section1Title: "Camp Information",
  section2Title: "Personal Details",
  section3Title: "Contact & Location",
  section4Title: "Consent & Authorization (सही / संमती)",

  // Field Labels & Sublabels
  dateLabel: "Date",
  dateSubLabel: "(दिनांक)",
  dateHint: "Camp date DD/MM/YYYY",
  datePickerTitle: "Camp Date",

  srNoLabel: "Sr. No.",
  srNoSubLabel: "(अनुक्रमांक)",
  srNoPlaceholder: "e.g. 101",

  institutionLabel: "School / College / Institution",
  institutionSubLabel: "(शाळा / महाविद्यालय / संस्था)",
  institutionPlaceholder: "Enter school, college, or institution name",
  institutionHint: "Name of educational or community institution",

  fullNameLabel: "Full Name",
  fullNameSubLabel: "(पूर्ण नाव)",
  fullNamePlaceholder: "e.g. Rahul Ramesh Deshmukh",
  fullNameHint: "First name, middle name, surname",

  dobLabel: "Date of Birth",
  dobSubLabel: "(जन्मतारीख)",
  dobPlaceholder: "DD/MM/YYYY",
  dobHint: "DD/MM/YYYY [Auto calculates age]",
  dobPickerTitle: "Date of Birth",

  ageLabel: "Age",
  ageSubLabel: "(वय)",
  agePlaceholder: "Age",
  ageHint: "Years (1-120)",

  genderLabel: "Gender",
  genderSubLabel: "(लिंग)",

  casteLabel: "Caste",
  casteSubLabel: "(जात)",
  castePlaceholder: "e.g. Maratha, Kunbi, etc.",

  categoryLabel: "Category",
  categorySubLabel: "(श्रेणी)",
  categoryPlaceholder: "Select category",
  categoryPickerTitle: "Category (श्रेणी)",

  religionLabel: "Religion",
  religionSubLabel: "(धर्म)",
  religionPlaceholder: "Select religion",
  religionPickerTitle: "Religion (धर्म)",

  standardOrOccupationLabel: "Standard / Occupation",
  standardOrOccupationSubLabel: "(वर्ग / व्यवसाय)",
  standardOrOccupationPlaceholder: "e.g. 10th / Student / Farmer",

  mobileNoLabel: "Mobile No.",
  mobileNoSubLabel: "(मोबाईल क्र.)",
  mobileNoPlaceholder: "Enter 10-digit mobile number",
  mobileNoHint: "10-digit mobile number",
  countryCode: "+91",

  cityTownLabel: "City / Town",
  cityTownSubLabel: "(शहर / गाव)",
  cityTownPlaceholder: "City or Village",

  districtLabel: "Dist.",
  districtSubLabel: "(जिल्हा)",
  districtPlaceholder: "District (e.g. Nagpur)",

  pincodeLabel: "Pincode",
  pincodeSubLabel: "(पिन कोड)",
  pincodePlaceholder: "6 digits",
  pincodeHint: "6-digit postal PIN",

  aadharNoLabel: "Aadhar No.",
  aadharNoSubLabel: "(आधार नं.)",
  aadharNoPlaceholder: "12 digits",
  aadharNoHint: "12 digits",

  // Consent
  consentDeclaration:
    '"I hereby voluntarily consent to collect blood sample for blood test CBC as a self referral"',
  orgAddress: "Lokkalyan Diagnostics · Khamla, Nagpur - 25",
  orgHelpline: "Helpline: 9112315436 / 8421943915 / 8830039758",

  // Success Modal
  successTitle: "Registration Successful!",
  successSubtitle:
    "Beneficiary record successfully verified and recorded for CBC screening.",
  summaryFullNameLabel: "Full Name:",
  summaryInstitutionLabel: "Institution:",
  summaryAgeGenderLabel: "Age & Gender:",
  summaryDobLabel: "DOB:",
  summaryCategoryLabel: "Category:",
  summaryMobileLabel: "Mobile:",
  summaryAadharLabel: "Aadhar No.:",
  summaryLocationLabel: "Location:",
  registerNextButton: "Register Next Person",
  returnHomeButton: "Return to Home",
} as const;
