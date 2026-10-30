import {
  CustomerFormData,
  VALIDATION_LIMITS,
} from "../constants/formConstants";

/**
 * Validates a DD/MM/YYYY date string.
 * Ensures the date is a valid calendar date (e.g. checks leap year, days per month).
 */
export function parseDateString(dateStr: string): Date | null {
  if (!dateStr || !/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
    return null;
  }

  const [dayStr, monthStr, yearStr] = dateStr.split("/");
  const day = parseInt(dayStr, 10);
  const month = parseInt(monthStr, 10);
  const year = parseInt(yearStr, 10);

  if (month < 1 || month > 12) {
    return null;
  }

  if (year < 1900 || year > 2100) {
    return null;
  }

  const daysInMonth = new Date(year, month, 0).getDate();
  if (day < 1 || day > daysInMonth) {
    return null;
  }

  const date = new Date(year, month - 1, day);
  return date;
}

/**
 * Calculates age in full years from a DD/MM/YYYY date of birth string.
 */
export function calculateAgeFromDob(dobStr: string): number | null {
  const birthDate = parseDateString(dobStr);
  if (!birthDate) return null;

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age >= 0 ? age : null;
}

/**
 * Formats a Date object to DD/MM/YYYY string.
 */
export function formatDate(date: Date): string {
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}

export type FormErrors = Partial<Record<keyof CustomerFormData, string>>;

/**
 * Validates an individual field. Returns error message if invalid, or null if valid.
 */
export function validateField(
  field: keyof CustomerFormData,
  value: any,
  data: CustomerFormData
): string | null {
  switch (field) {
    case "camp_date": {
      const trimmed = (value || "").trim();
      if (!trimmed) {
        return "Camp date is required.";
      }
      if (!/^\d{2}\/\d{2}\/\d{4}$/.test(trimmed)) {
        return "Date must be in DD/MM/YYYY format.";
      }
      const parsed = parseDateString(trimmed);
      if (!parsed) {
        return "Please enter a valid calendar date.";
      }
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (parsed > today) {
        return "Camp date cannot be in the future.";
      }
      return null;
    }

    case "sr_no": {
      // Serial number is optional or alphanumeric
      return null;
    }

    case "institution": {
      const trimmed = (value || "").trim();
      if (!trimmed) {
        return "School / College / Institution name is required.";
      }
      if (trimmed.length < 2) {
        return "Institution name must be at least 2 characters.";
      }
      return null;
    }

    case "full_name": {
      const trimmed = (value || "").trim();
      if (!trimmed) {
        return "Full name (पूर्ण नाव) is required.";
      }
      if (trimmed.length < VALIDATION_LIMITS.minNameLength) {
        return `Full name must be at least ${VALIDATION_LIMITS.minNameLength} characters.`;
      }
      if (!/^[a-zA-Z\u0900-\u097F\s.'-]+$/.test(trimmed)) {
        return "Full name should only contain letters and spaces.";
      }
      return null;
    }

    case "date_of_birth": {
      const trimmed = (value || "").trim();
      if (!trimmed) {
        return "Date of birth (जन्मतारीख) is required.";
      }
      if (!/^\d{2}\/\d{2}\/\d{4}$/.test(trimmed)) {
        return "Date of birth must be in DD/MM/YYYY format.";
      }
      const parsed = parseDateString(trimmed);
      if (!parsed) {
        return "Please enter a valid calendar date.";
      }
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (parsed >= today) {
        return "Date of birth must be in the past.";
      }
      const calculatedAge = calculateAgeFromDob(trimmed);
      if (
        calculatedAge !== null &&
        (calculatedAge < 0 || calculatedAge > VALIDATION_LIMITS.maxAge)
      ) {
        return `Age corresponds to invalid range (must be <= ${VALIDATION_LIMITS.maxAge} years).`;
      }
      return null;
    }

    case "age": {
      const trimmed = (value || "").trim();
      if (!trimmed) {
        return "Age (वय) is required.";
      }
      if (!/^\d+$/.test(trimmed)) {
        return "Age must be a valid whole number.";
      }
      const num = Number(trimmed);
      if (
        num < VALIDATION_LIMITS.minAge ||
        num > VALIDATION_LIMITS.maxAge
      ) {
        return `Age must be between ${VALIDATION_LIMITS.minAge} and ${VALIDATION_LIMITS.maxAge}.`;
      }
      // Check if matches DOB if DOB entered
      if (data.date_of_birth && /^\d{2}\/\d{2}\/\d{4}$/.test(data.date_of_birth)) {
        const expectedAge = calculateAgeFromDob(data.date_of_birth);
        if (expectedAge !== null && Math.abs(expectedAge - num) > 1) {
          return `Age (${num}) does not match date of birth (${expectedAge} years).`;
        }
      }
      return null;
    }

    case "gender": {
      if (!value || !value.trim()) {
        return "Please select gender (लिंग).";
      }
      return null;
    }

    case "caste": {
      const trimmed = (value || "").trim();
      if (trimmed && trimmed.length < 2) {
        return "Caste must be at least 2 characters.";
      }
      return null;
    }

    case "category": {
      if (!value || !value.trim()) {
        return "Please select category (श्रेणी).";
      }
      return null;
    }

    case "religion": {
      // Optional
      return null;
    }

    case "standard_occupation": {
      const trimmed = (value || "").trim();
      if (!trimmed) {
        return "Standard / Occupation (वर्ग / व्यवसाय) is required.";
      }
      return null;
    }

    case "mobile_no": {
      const trimmed = (value || "").trim();
      if (!trimmed) {
        return "Mobile number (मोबाईल क्र.) is required.";
      }
      if (!/^\d{10}$/.test(trimmed)) {
        return "Mobile number must be exactly 10 digits.";
      }
      if (!/^[6-9]/.test(trimmed)) {
        return "Mobile number should start with 6, 7, 8, or 9.";
      }
      return null;
    }

    case "city_town": {
      const trimmed = (value || "").trim();
      if (!trimmed) {
        return "City / Town (शहर / गाव) is required.";
      }
      if (trimmed.length < 2) {
        return "City / Town must be at least 2 characters.";
      }
      return null;
    }

    case "district": {
      const trimmed = (value || "").trim();
      if (!trimmed) {
        return "District (जिल्हा) is required.";
      }
      if (trimmed.length < 2) {
        return "District name must be at least 2 characters.";
      }
      return null;
    }

    case "pincode": {
      const trimmed = (value || "").trim();
      if (!trimmed) {
        return "Pincode (पिन कोड) is required.";
      }
      if (!/^\d{6}$/.test(trimmed)) {
        return "Pincode must be exactly 6 digits.";
      }
      if (trimmed.startsWith("0")) {
        return "Pincode cannot start with 0.";
      }
      return null;
    }

    case "aadhaar_number": {
      const trimmed = (value || "").trim();
      if (!trimmed) {
        return "Aadhar number (आधार नं.) is required.";
      }
      if (!/^\d{12}$/.test(trimmed)) {
        return "Aadhar number must be exactly 12 digits.";
      }
      return null;
    }

    case "consent": {
      if (!value) {
        return "Voluntary consent for blood sample collection is mandatory.";
      }
      return null;
    }

    default:
      return null;
  }
}

/**
 * Validates the entire form and returns an object mapping field keys to error messages.
 */
export function validateCustomerForm(
  data: CustomerFormData
): FormErrors {
  const errors: FormErrors = {};

  const fields = Object.keys(data) as Array<keyof CustomerFormData>;
  for (const field of fields) {
    const error = validateField(field, data[field], data);
    if (error) {
      errors[field] = error;
    }
  }

  return errors;
}
