# Customer registration API contract

## Status and scope

This document is the canonical v1 contract for the mobile client and the
customer-registration backend introduced in PR [#9](https://github.com/riddhi0910/LKD_form_automation/pull/9).
It describes `POST /api/v1/customers`; no client-to-server integration is
implied by this document.

The API uses **snake_case** JSON keys. The client form state uses the same keys
for fields persisted by the API, while the UI-only fields remain local to the
form. A request mapper should still normalize dates and optional empty values
before the API is connected.

## Create customer

`POST /api/v1/customers`

```http
Content-Type: application/json
```

### Request body

| Form state key | API key | JSON type | Rules |
| --- | --- | --- | --- |
| `institution` | `institution` | string or `null` | Maximum 200 characters. |
| `full_name` | `full_name` | string | Required; trimmed, 1 to 200 characters. |
| `date_of_birth` | `date_of_birth` | ISO date string (`YYYY-MM-DD`) or `null` | The UI's `DD/MM/YYYY` value must be converted before sending. It cannot be in the future. |
| `gender` | `gender` | string or `null` | `Male`, `Female`, or `Other`. |
| `caste` | `caste` | string or `null` | Maximum 100 characters. |
| `category` | `category` | string or `null` | `SC`, `ST`, `OBC`, `NT`, `SBC`, `VJ`, or `General`. |
| `religion` | `religion` | string or `null` | Maximum 100 characters. |
| `standard_occupation` | `standard_occupation` | string or `null` | Maximum 150 characters. |
| `mobile_no` | `mobile_no` | string or `null` | Ten digits, beginning with 6, 7, 8, or 9. |
| `city_town` | `city_town` | string or `null` | Maximum 100 characters. |
| `district` | `district` | string or `null` | Maximum 100 characters. |
| `pincode` | `pincode` | string or `null` | Exactly six digits. |
| `aadhaar_number` | `aadhaar_number` | string or `null` | Exactly 12 digits. The API spelling is `aadhaar`. |

For optional text fields, the mapper sends `null` for an empty value rather
than an empty string. The client can keep stricter UX validation than the API;
the backend only requires `full_name` today.

### Form-only fields

The following current form values are not part of the v1 backend schema and
must **not** be sent to `POST /api/v1/customers` until both the database and
`CustomerCreate` schema support them:

| Form state key | Reason |
| --- | --- |
| `camp_date` | No `camp_date` column or request field exists in PR #9. |
| `sr_no` | No serial-number column or request field exists in PR #9. |
| `consent` | No consent column or request field exists in PR #9. |
| `age` | Derived from `date_of_birth` by the server; never submitted independently. |

Adding any of these fields requires a coordinated update to this contract, the
backend Pydantic schema, the database migration, and the client mapper. This
prevents FastAPI from silently discarding values it does not persist.

### Example request

```json
{
  "institution": "Government Polytechnic Nagpur",
  "full_name": "Rahul Ramesh Deshmukh",
  "date_of_birth": "2006-09-14",
  "gender": "Male",
  "caste": "Kunbi",
  "category": "OBC",
  "religion": "Hindu",
  "standard_occupation": "Student",
  "mobile_no": "9876543210",
  "city_town": "Nagpur",
  "district": "Nagpur",
  "pincode": "440010",
  "aadhaar_number": "123456789012"
}
```

### Successful response

The server returns `201 Created` and a server-calculated age:

```json
{
  "id": "e4b3f917-51e7-45a6-8109-aecb8a7b7d5a",
  "full_name": "Rahul Ramesh Deshmukh",
  "age": 20,
  "created_at": "2026-10-31T10:30:00+00:00"
}
```

Validation failures use FastAPI's `422 Unprocessable Entity` response format.
