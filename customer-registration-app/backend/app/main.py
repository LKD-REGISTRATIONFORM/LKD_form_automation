
import logging
from contextlib import asynccontextmanager

import psycopg
from fastapi import FastAPI, HTTPException

from app.database import check_db_connection
from app.init_db import create_tables
from app.routes.customers import router as customers_router

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create initial tables during development.
    # We will replace this with Alembic migrations later.
    try:
        create_tables()
    except psycopg.Error:
        # Keep the API running so /health/db can report the problem.
        logger.exception("Could not create tables; is PostgreSQL running?")
    yield


app = FastAPI(
    title="Customer Registration API",
    description="Backend for customer registration and record management.",
    version="0.1.0",
    lifespan=lifespan,
)

# Register customer endpoints.
app.include_router(customers_router)


@app.get("/")
def home_page():
    return {"message": "Customer Registration API is running"}


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.get("/health/db")
def database_health_check():
    if not check_db_connection():
        raise HTTPException(
            status_code=503,
            detail="Database connection unavailable",
        )

    return {"status": "ok", "database": "connected"}
