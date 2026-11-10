import pytest

URL = "/api/v1/customers"


def test_create_customer(client, customer_payload):
    response = client.post(URL, json=customer_payload)

    assert response.status_code == 201
    body = response.json()
    assert body["full_name"] == "Rahul Ramesh Deshmukh"
    assert body["id"]
    assert isinstance(body["age"], int)


def test_create_trims_whitespace(client, create_customer):
    created = create_customer(full_name="  Asha Patil  ")
    assert created["full_name"] == "Asha Patil"


def test_create_ignores_consent(client, customer_payload):
    """consent is form-only; extra fields are ignored, not stored."""
    response = client.post(URL, json={**customer_payload, "consent": True})
    assert response.status_code == 201


@pytest.mark.parametrize(
    "field",
    [
        "camp_date", "sr_no", "institution", "full_name", "date_of_birth",
        "gender", "caste", "category", "religion", "standard_occupation",
        "mobile_no", "city_town", "district", "pincode", "aadhaar_number",
    ],
)
def test_create_requires_every_field(client, customer_payload, field):
    del customer_payload[field]
    response = client.post(URL, json=customer_payload)
    assert response.status_code == 422


@pytest.mark.parametrize(
    "field, bad_value",
    [
        ("full_name", "   "),                 # blank after trimming
        ("gender", "Unknown"),
        ("category", "XYZ"),
        ("date_of_birth", "2999-01-01"),      # future
        ("camp_date", "2999-01-01"),          # future
        ("date_of_birth", "14/09/2006"),      # wrong format, API wants ISO
        ("mobile_no", "1234567890"),          # must start with 6-9
        ("mobile_no", "98765"),               # too short
        ("mobile_no", "98765abcde"),          # not digits
        ("pincode", "44001"),                 # 5 digits
        ("aadhaar_number", "12345678901"),    # 11 digits
        ("sr_no", ""),
        ("sr_no", "x" * 51),
    ],
)
def test_create_rejects_invalid_values(client, customer_payload, field, bad_value):
    customer_payload[field] = bad_value
    response = client.post(URL, json=customer_payload)
    assert response.status_code == 422
