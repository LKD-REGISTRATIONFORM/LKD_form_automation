
import psycopg

from app.config import DATABASE_URL


def get_db_connection():
    """Open a PostgreSQL connection for one operation."""
    return psycopg.connect(DATABASE_URL)

def check_db_connection() -> bool:
    """Return True if PostgreSQL can execute a simple query."""
    try:
        with get_db_connection() as connection:
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1")
                return cursor.fetchone()[0] == 1
    except psycopg.Error:
        return False
