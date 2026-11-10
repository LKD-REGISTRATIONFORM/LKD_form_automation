
import logging
from contextlib import asynccontextmanager

import psycopg
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.config import CORS_ORIGINS
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

# Let the web build of the app (running on another origin) call this API.
# Only the origins listed in CORS_ORIGINS are allowed, never "*".
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Content-Type", "Authorization"],
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
