"""Shared test setup.

Tests run against a separate PostgreSQL database so they never touch your
development data. It lives on the same server (the Docker container) and is
created automatically the first time you run pytest.
"""

import os

import psycopg
import pytest
from dotenv import load_dotenv
from psycopg import sql
from psycopg.conninfo import make_conninfo

load_dotenv()

TEST_DB_NAME = "customer_registration_test"


def _point_app_at_test_database():
    """Create the test database if needed and make the app use it.

    This must run BEFORE the app is imported, because app/config.py reads
    DATABASE_URL at import time.
    """
    dev_url = os.environ["DATABASE_URL"]
    test_url = make_conninfo(dev_url, dbname=TEST_DB_NAME)

    # CREATE DATABASE can't run inside a transaction, hence autocommit.
    admin_url = make_conninfo(dev_url, dbname="postgres")
    with psycopg.connect(admin_url, autocommit=True) as admin:
        exists = admin.execute(
            "SELECT 1 FROM pg_database WHERE datname = %s", (TEST_DB_NAME,)
        ).fetchone()
        if not exists:
            admin.execute(sql.SQL("CREATE DATABASE {}").format(sql.Identifier(TEST_DB_NAME)))

    os.environ["DATABASE_URL"] = test_url


_point_app_at_test_database()

from fastapi.testclient import TestClient  # noqa: E402

from app.database import get_db_connection  # noqa: E402
from app.init_db import create_tables  # noqa: E402
from app.main import app  # noqa: E402


@pytest.fixture(scope="session", autouse=True)
def _create_schema():
    create_tables()


@pytest.fixture(autouse=True)
def _empty_customers_table():
    """Start every test with an empty table so tests don't affect each other."""
    with get_db_connection() as connection:
        connection.execute("TRUNCATE customers")
    yield


@pytest.fixture
def client():
    return TestClient(app)


@pytest.fixture
def customer_payload():
    """A valid request body. Tests copy it and change one field at a time."""
    return {
        "camp_date": "2026-10-29",
        "sr_no": "101",
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
        "aadhaar_number": "123456789012",
    }


@pytest.fixture
def create_customer(client, customer_payload):
    """Helper that creates a customer, optionally overriding some fields."""

    def _create(**overrides):
        response = client.post(
            "/api/v1/customers", json={**customer_payload, **overrides}
        )
        assert response.status_code == 201, response.text
        return response.json()

    return _create
