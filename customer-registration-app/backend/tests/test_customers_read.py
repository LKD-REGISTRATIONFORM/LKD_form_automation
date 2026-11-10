from uuid import uuid4

URL = "/api/v1/customers"


def test_list_empty(client):
    response = client.get(URL)

    assert response.status_code == 200
    assert response.json() == {"items": [], "total": 0, "limit": 20, "offset": 0}


def test_list_returns_customers_newest_first(client, create_customer):
    create_customer(full_name="First", sr_no="1")
    create_customer(full_name="Second", sr_no="2")

    body = client.get(URL).json()

    assert body["total"] == 2
    assert [c["full_name"] for c in body["items"]] == ["Second", "First"]


def test_list_includes_age_and_all_fields(client, create_customer):
    create_customer()
    item = client.get(URL).json()["items"][0]

    assert isinstance(item["age"], int)
    assert item["camp_date"] == "2026-10-29"
    assert item["sr_no"] == "101"


def test_list_paging(client, create_customer):
    for number in range(5):
        create_customer(sr_no=str(number))

    page = client.get(URL, params={"limit": 2, "offset": 2}).json()

    assert page["total"] == 5          # total counts all matches, not the page
    assert len(page["items"]) == 2
    assert page["limit"] == 2 and page["offset"] == 2


def test_list_rejects_bad_paging(client):
    assert client.get(URL, params={"limit": 0}).status_code == 422
    assert client.get(URL, params={"limit": 101}).status_code == 422
    assert client.get(URL, params={"offset": -1}).status_code == 422


def test_search_by_name_is_case_insensitive(client, create_customer):
    create_customer(full_name="Asha Patil", sr_no="1")
    create_customer(full_name="Rahul Deshmukh", sr_no="2")

    body = client.get(URL, params={"q": "asha"}).json()

    assert body["total"] == 1
    assert body["items"][0]["full_name"] == "Asha Patil"


def test_search_by_mobile_and_sr_no(client, create_customer):
    create_customer(mobile_no="9123456780", sr_no="A-10")
    create_customer(mobile_no="9999999999", sr_no="B-20")

    assert client.get(URL, params={"q": "9123"}).json()["total"] == 1
    assert client.get(URL, params={"q": "B-20"}).json()["total"] == 1


def test_search_treats_wildcards_literally(client, create_customer):
    create_customer(full_name="Asha Patil")

    # "%" would match everything if it were not escaped.
    assert client.get(URL, params={"q": "%"}).json()["total"] == 0


def test_search_no_match(client, create_customer):
    create_customer()
    assert client.get(URL, params={"q": "zzzz"}).json()["total"] == 0


def test_get_customer(client, create_customer):
    created = create_customer()

    response = client.get(f"{URL}/{created['id']}")

    assert response.status_code == 200
    assert response.json()["id"] == created["id"]
    assert response.json()["full_name"] == "Rahul Ramesh Deshmukh"


def test_get_unknown_customer_is_404(client):
    assert client.get(f"{URL}/{uuid4()}").status_code == 404


def test_get_malformed_id_is_422(client):
    assert client.get(f"{URL}/not-a-uuid").status_code == 422
