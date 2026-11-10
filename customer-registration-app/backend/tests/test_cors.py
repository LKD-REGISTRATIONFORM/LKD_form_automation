ALLOWED = "http://localhost:8081"
URL = "/api/v1/customers"


def test_preflight_allows_known_origin(client):
    """Browsers send this OPTIONS request before a POST with a JSON body."""
    response = client.options(
        URL,
        headers={
            "Origin": ALLOWED,
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "content-type",
        },
    )

    assert response.status_code == 200
    assert response.headers["access-control-allow-origin"] == ALLOWED


def test_preflight_blocks_unknown_origin(client):
    response = client.options(
        URL,
        headers={
            "Origin": "http://evil.example",
            "Access-Control-Request-Method": "POST",
        },
    )

    assert "access-control-allow-origin" not in response.headers


def test_normal_response_carries_cors_header(client):
    response = client.get(URL, headers={"Origin": ALLOWED})
    assert response.headers["access-control-allow-origin"] == ALLOWED
