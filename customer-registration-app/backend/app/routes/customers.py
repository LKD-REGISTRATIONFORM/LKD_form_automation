
from datetime import date

from fastapi import APIRouter, HTTPException, status

from app.database import get_db_connection
from app.schemas.customer import CustomerCreate

router = APIRouter(prefix="/api/v1/customers", tags=["Customers"])


@router.post("", status_code=status.HTTP_201_CREATED)
def add_customer(customer: CustomerCreate):
    """Validate and save a new customer."""

    # Calculate age from DOB; don't store age as an independent field.
    age = None
    if customer.date_of_birth:
        today = date.today()
        dob = customer.date_of_birth
        age = today.year - dob.year - (
            (today.month, today.day) < (dob.month, dob.day)
        )

    query = """
        INSERT INTO customers (
            institution, full_name, date_of_birth, gender,
            caste, category, religion, standard_occupation,
            mobile_no, city_town, district, pincode, aadhaar_number
        )
        VALUES (
            %(institution)s, %(full_name)s, %(date_of_birth)s, %(gender)s,
            %(caste)s, %(category)s, %(religion)s, %(standard_occupation)s,
            %(mobile_no)s, %(city_town)s, %(district)s, %(pincode)s,
            %(aadhaar_number)s
        )
        RETURNING id, created_at;
    """

    try:
        with get_db_connection() as connection:
            with connection.cursor() as cursor:
                cursor.execute(query, customer.model_dump())
                row = cursor.fetchone()

        return {
            "id": str(row[0]),
            "full_name": customer.full_name,
            "age": age,
            "created_at": row[1],
        }

    except Exception:
        # Don't expose internal database details to API clients.
        # Add secure server-side error logging before production.
        raise HTTPException(
            status_code=500,
            detail="Could not register customer",
        )
