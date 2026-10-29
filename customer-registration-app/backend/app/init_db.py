
from app.database import get_db_connection


def create_tables():
    """Create the customers table if it does not exist."""

    with get_db_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS customers (
                    -- Internal ID for updates and synchronization.
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

                    institution TEXT,
                    full_name TEXT NOT NULL,
                    date_of_birth DATE,

                    gender TEXT CHECK (
                        gender IN ('Male', 'Female', 'Other')
                        OR gender IS NULL
                    ),

                    caste TEXT,

                    category TEXT CHECK (
                        category IN (
                            'SC', 'ST', 'OBC', 'NT',
                            'SBC', 'VJ', 'General'
                        ) OR category IS NULL
                    ),

                    religion TEXT,
                    standard_occupation TEXT,
                    mobile_no TEXT,
                    city_town TEXT,
                    district TEXT,
                    pincode TEXT,
                    aadhaar_number TEXT,

                    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
                );
            """)

        # The connection context commits the transaction on success.
