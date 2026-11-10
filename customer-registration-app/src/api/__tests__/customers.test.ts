import { CustomerFormData } from "../../constants/formConstants";
import {
  ApiError,
  createCustomer,
  toCustomerPayload,
  toIsoDate,
} from "../customers";

const form: CustomerFormData = {
  camp_date: "29/10/2026",
  sr_no: " 101 ",
  institution: "  Dharampeth Science College ",
  full_name: "Rahul Ramesh Deshmukh",
  date_of_birth: "05/09/2005",
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

describe("toIsoDate", () => {
  it("converts DD/MM/YYYY to YYYY-MM-DD", () => {
    expect(toIsoDate("05/09/2005")).toBe("2005-09-05");
    expect(toIsoDate("29/02/2024")).toBe("2024-02-29");
  });

  it("rejects an invalid date", () => {
    expect(() => toIsoDate("31/02/2024")).toThrow(ApiError);
  });
});

describe("toCustomerPayload", () => {
  it("converts dates and trims text", () => {
    const payload = toCustomerPayload(form);

    expect(payload.camp_date).toBe("2026-10-29");
    expect(payload.date_of_birth).toBe("2005-09-05");
    expect(payload.sr_no).toBe("101");
    expect(payload.institution).toBe("Dharampeth Science College");
  });

  it("never sends age or consent", () => {
    const payload = toCustomerPayload(form);

    expect(payload).not.toHaveProperty("age");
    expect(payload).not.toHaveProperty("consent");
  });
});

describe("createCustomer", () => {
  const mockFetch = jest.fn();

  beforeEach(() => {
    mockFetch.mockReset();
    globalThis.fetch = mockFetch as unknown as typeof fetch;
  });

  function reply(status: number, body: unknown) {
    mockFetch.mockResolvedValue({
      status,
      json: () => Promise.resolve(body),
    });
  }

  it("POSTs the mapped payload and returns the created customer", async () => {
    const created = { id: "abc", full_name: "Rahul", age: 20, created_at: "x" };
    reply(201, created);

    await expect(createCustomer(form)).resolves.toEqual(created);

    const [url, options] = mockFetch.mock.calls[0];
    expect(url).toMatch(/\/api\/v1\/customers$/);
    expect(options.method).toBe("POST");
    expect(JSON.parse(options.body)).toEqual(toCustomerPayload(form));
  });

  it("explains validation errors from the server", async () => {
    reply(422, {
      detail: [
        {
          loc: ["body", "mobile_no"],
          msg: "Value error, Mobile number must be 10 digits",
        },
      ],
    });

    await expect(createCustomer(form)).rejects.toThrow(
      "mobile_no: Mobile number must be 10 digits"
    );
  });

  it("reports an unreachable server", async () => {
    mockFetch.mockRejectedValue(new TypeError("Network request failed"));

    await expect(createCustomer(form)).rejects.toThrow(/Could not reach the server/);
  });

  it("reports a server error without leaking details", async () => {
    reply(500, { detail: "Database error" });

    await expect(createCustomer(form)).rejects.toThrow(/problem saving/);
  });
});
