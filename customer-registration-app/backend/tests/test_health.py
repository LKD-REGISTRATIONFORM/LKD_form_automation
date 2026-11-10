def test_root(client):
    assert client.get("/").status_code == 200


def test_health(client):
    assert client.get("/health").json() == {"status": "ok"}


def test_database_health(client):
    response = client.get("/health/db")
    assert response.status_code == 200
    assert response.json()["database"] == "connected"
