/**
 * Where the backend lives.
 *
 * Set EXPO_PUBLIC_API_URL in customer-registration-app/.env (see .env.example).
 * A phone cannot use "localhost" (that is the phone itself), so use the
 * computer's LAN address, e.g. http://192.168.1.38:8000.
 */
export const API_BASE_URL = (
  process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8000"
).replace(/\/+$/, ""); // drop trailing slashes so paths join cleanly

/** Give up on a request after this long so the form never hangs forever. */
export const REQUEST_TIMEOUT_MS = 10_000;
