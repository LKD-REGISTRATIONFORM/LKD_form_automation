
from app.database import get_db_connection


def create_tables():
    """Create the customers table if it does not exist."""

    with get_db_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS customers (
                    -- Internal ID for updates and synchronization.
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

                    institution TEXT NOT NULL,
                    full_name TEXT NOT NULL,
                    date_of_birth DATE NOT NULL,

                    gender TEXT NOT NULL CHECK (
                        gender IN ('Male', 'Female', 'Other')
                    ),

                    caste TEXT NOT NULL,

                    category TEXT NOT NULL CHECK (
                        category IN (
                            'SC', 'ST', 'OBC', 'NT',
                            'SBC', 'VJ', 'General'
                        )
                    ),

                    religion TEXT NOT NULL,
                    standard_occupation TEXT NOT NULL,
                    mobile_no TEXT NOT NULL,
                    city_town TEXT NOT NULL,
                    district TEXT NOT NULL,
                    pincode TEXT NOT NULL,
                    aadhaar_number TEXT NOT NULL,

                    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
                );
            """)

        # The connection context commits the transaction on success.
