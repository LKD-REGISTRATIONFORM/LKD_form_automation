from uuid import uuid4

URL = "/api/v1/customers"


def test_update_customer(client, create_customer, customer_payload):
    created = create_customer()

    changed = {**customer_payload, "full_name": "New Name", "district": "Pune"}
    response = client.put(f"{URL}/{created['id']}", json=changed)

    assert response.status_code == 200
    assert response.json()["full_name"] == "New Name"
    assert response.json()["district"] == "Pune"

    # The change was really saved, not just echoed back.
    saved = client.get(f"{URL}/{created['id']}").json()
    assert saved["full_name"] == "New Name"


def test_update_refreshes_updated_at(client, create_customer, customer_payload):
    created = create_customer()
    before = client.get(f"{URL}/{created['id']}").json()

    after = client.put(f"{URL}/{created['id']}", json=customer_payload).json()

    assert after["created_at"] == before["created_at"]
    assert after["updated_at"] > before["updated_at"]


def test_update_validates_input(client, create_customer, customer_payload):
    created = create_customer()
    customer_payload["mobile_no"] = "123"

    response = client.put(f"{URL}/{created['id']}", json=customer_payload)

    assert response.status_code == 422


def test_update_unknown_customer_is_404(client, customer_payload):
    assert client.put(f"{URL}/{uuid4()}", json=customer_payload).status_code == 404


def test_delete_customer(client, create_customer):
    created = create_customer()

    assert client.delete(f"{URL}/{created['id']}").status_code == 204
    assert client.get(f"{URL}/{created['id']}").status_code == 404
    assert client.get(URL).json()["total"] == 0


def test_delete_unknown_customer_is_404(client):
    assert client.delete(f"{URL}/{uuid4()}").status_code == 404
