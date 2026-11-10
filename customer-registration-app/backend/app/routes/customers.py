import logging
from datetime import date
from uuid import UUID

from fastapi import APIRouter, HTTPException, Query, Response, status
from psycopg.rows import dict_row

from app.database import get_db_connection
from app.schemas.customer import CustomerCreate, CustomerList, CustomerOut

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/v1/customers", tags=["Customers"])

# Columns a client can send. Used by both INSERT and UPDATE so the two
# queries can never drift apart.
INPUT_COLUMNS = [
    "camp_date", "sr_no", "institution", "full_name", "date_of_birth",
    "gender", "caste", "category", "religion", "standard_occupation",
    "mobile_no", "city_town", "district", "pincode", "aadhaar_number",
]

# Every column we return for a customer (age is calculated, not stored).
OUTPUT_COLUMNS = ["id", *INPUT_COLUMNS, "created_at", "updated_at"]
SELECT_COLUMNS = ", ".join(OUTPUT_COLUMNS)


def calculate_age(dob: date) -> int:
    """Age in full years. We never store age because it changes every year."""
    today = date.today()
    return today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))


def to_customer(row: dict) -> dict:
    """Turn a database row into the API response shape."""
    return {**row, "age": calculate_age(row["date_of_birth"])}


def server_error() -> HTTPException:
    # Don't expose internal database details to API clients.
    return HTTPException(
        status_code=500,
        detail="Could not register customer"
    )


def not_found() -> HTTPException:
    return HTTPException(status_code=404, detail="Customer not found")


@router.post("", status_code=status.HTTP_201_CREATED)
def add_customer(customer: CustomerCreate):
    """Validate and save a new customer."""

    columns = ", ".join(INPUT_COLUMNS)
    placeholders = ", ".join(f"%({name})s" for name in INPUT_COLUMNS)
    query = f"""
        INSERT INTO customers ({columns})
        VALUES ({placeholders})
        RETURNING id, created_at;
    """

    try:
        with get_db_connection() as connection:
            with connection.cursor() as cursor:
                cursor.execute(query, customer.model_dump())
                row = cursor.fetchone()
    except Exception:
        logger.exception("Could not register customer")
        raise server_error()

    return {
        "id": str(row[0]),
        "full_name": customer.full_name,
        "age": calculate_age(customer.date_of_birth),
        "created_at": row[1],
    }


@router.get("", response_model=CustomerList)
def list_customers(
    q: str | None = Query(
        None, description="Search in name, mobile number and Sr. No."
    ),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
):
    """List customers, newest first, with optional search and paging."""

    where = ""
    params: dict = {"limit": limit, "offset": offset}

    if q and q.strip():
        # Escape LIKE wildcards so a search for "50%" is taken literally.
        text = q.strip().replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_")
        params["pattern"] = f"%{text}%"
        where = """
            WHERE full_name ILIKE %(pattern)s
               OR mobile_no ILIKE %(pattern)s
               OR sr_no ILIKE %(pattern)s
        """

    try:
        with get_db_connection() as connection:
            with connection.cursor(row_factory=dict_row) as cursor:
                cursor.execute(f"SELECT COUNT(*) AS total FROM customers {where}", params)
                total = cursor.fetchone()["total"]

                cursor.execute(
                    f"""
                    SELECT {SELECT_COLUMNS} FROM customers {where}
                    ORDER BY created_at DESC, id
                    LIMIT %(limit)s OFFSET %(offset)s
                    """,
                    params,
                )
                rows = cursor.fetchall()
    except Exception:
        logger.exception("Could not retrieve customers")
        raise server_error()

    return {
        "items": [to_customer(row) for row in rows],
        "total": total,
        "limit": limit,
        "offset": offset,
    }


@router.get("/{customer_id}", response_model=CustomerOut)
def get_customer(customer_id: UUID):
    """Get one customer. A malformed id is rejected with 422 by FastAPI."""

    try:
        with get_db_connection() as connection:
            with connection.cursor(row_factory=dict_row) as cursor:
                cursor.execute(
                    f"SELECT {SELECT_COLUMNS} FROM customers WHERE id = %s",
                    (customer_id,),
                )
                row = cursor.fetchone()
    except Exception:
        logger.exception("Could not retrieve customer")
        raise server_error()

    # Raised outside the try block so the generic handler can't swallow it.
    if row is None:
        raise not_found()
    return to_customer(row)


@router.put("/{customer_id}", response_model=CustomerOut)
def update_customer(customer_id: UUID, customer: CustomerCreate):
    """Replace a customer's details. Send every field, as for a new customer."""

    assignments = ", ".join(f"{name} = %({name})s" for name in INPUT_COLUMNS)
    params = {**customer.model_dump(), "id": customer_id}

    try:
        with get_db_connection() as connection:
            with connection.cursor(row_factory=dict_row) as cursor:
                cursor.execute(
                    f"""
                    UPDATE customers
                    SET {assignments}, updated_at = NOW()
                    WHERE id = %(id)s
                    RETURNING {SELECT_COLUMNS}
                    """,
                    params,
                )
                row = cursor.fetchone()
    except Exception:
        logger.exception("Could not update customer")
        raise server_error()

    if row is None:
        raise not_found()
    return to_customer(row)


@router.delete("/{customer_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_customer(customer_id: UUID):
    """Permanently delete a customer.

    This is a hard delete for now. Soft delete (needed for sync) comes with
    the Alembic migrations.
    """

    try:
        with get_db_connection() as connection:
            with connection.cursor() as cursor:
                cursor.execute(
                    "DELETE FROM customers WHERE id = %s RETURNING id",
                    (customer_id,),
                )
                deleted = cursor.fetchone()
    except Exception:
        logger.exception("Could not delete customer")
        raise server_error()

    if deleted is None:
        raise not_found()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
