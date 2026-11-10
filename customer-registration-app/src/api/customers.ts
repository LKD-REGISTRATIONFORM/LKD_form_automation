import { CustomerFormData } from "../constants/formConstants";
import { parseDateString } from "../utils/validation";
import { API_BASE_URL, REQUEST_TIMEOUT_MS } from "./config";

/** The JSON body the backend expects (see docs/api-contract.md). */
export interface CustomerPayload {
  camp_date: string; // YYYY-MM-DD
  sr_no: string;
  institution: string;
  full_name: string;
  date_of_birth: string; // YYYY-MM-DD
  gender: string;
  caste: string;
  category: string;
  religion: string;
  standard_occupation: string;
  mobile_no: string;
  city_town: string;
  district: string;
  pincode: string;
  aadhaar_number: string;
}

/** What the backend returns after a customer is created. */
export interface CreatedCustomer {
  id: string;
  full_name: string;
  age: number;
  created_at: string;
}

/** An error whose message is safe to show to the person using the app. */
export class ApiError extends Error {}

/** Converts DD/MM/YYYY (what the form uses) to YYYY-MM-DD (what the API uses). */
export function toIsoDate(ddmmyyyy: string): string {
  const date = parseDateString(ddmmyyyy.trim());
  if (!date) {
    throw new ApiError(`Invalid date: ${ddmmyyyy}`);
  }
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

/**
 * Builds the API request from the form state.
 *
 * `age` is left out because the server calculates it, and `consent` because
 * we do not store it. Everything else is trimmed.
 */
export function toCustomerPayload(form: CustomerFormData): CustomerPayload {
  return {
    camp_date: toIsoDate(form.camp_date),
    sr_no: form.sr_no.trim(),
    institution: form.institution.trim(),
    full_name: form.full_name.trim(),
    date_of_birth: toIsoDate(form.date_of_birth),
    gender: form.gender,
    caste: form.caste.trim(),
    category: form.category,
    religion: form.religion,
    standard_occupation: form.standard_occupation.trim(),
    mobile_no: form.mobile_no.trim(),
    city_town: form.city_town.trim(),
    district: form.district.trim(),
    pincode: form.pincode.trim(),
    aadhaar_number: form.aadhaar_number.trim(),
  };
}

/**
 * Turns FastAPI's 422 body into one readable line per problem, e.g.
 * { detail: [{ loc: ["body","mobile_no"], msg: "Value error, ..." }] }
 * becomes "mobile_no: Mobile number must be 10 digits ...".
 */
function describeValidationErrors(detail: unknown): string {
  if (!Array.isArray(detail)) {
    return "The server rejected the details. Please check the form.";
  }
  return detail
    .map((item) => {
      const field = Array.isArray(item?.loc) ? item.loc[item.loc.length - 1] : "";
      const message = String(item?.msg ?? "Invalid value").replace(
        /^Value error, /,
        ""
      );
      return field ? `${field}: ${message}` : message;
    })
    .join("\n");
}

/** Saves a new customer on the server. Throws ApiError with a readable message. */
export async function createCustomer(
  form: CustomerFormData
): Promise<CreatedCustomer> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/api/v1/customers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(toCustomerPayload(form)),
      signal: controller.signal,
    });
  } catch {
    // fetch only throws when no response arrived at all (offline, wrong
    // address, server down, or our timeout).
    throw new ApiError(
      "Could not reach the server. Check your Wi-Fi connection and try again."
    );
  } finally {
    clearTimeout(timer);
  }

  if (response.status === 201) {
    return response.json();
  }

  if (response.status === 422) {
    const body = await response.json().catch(() => null);
    throw new ApiError(describeValidationErrors(body?.detail));
  }

  throw new ApiError("The server had a problem saving this record. Please try again.");
}
