
import os

from dotenv import load_dotenv

# Load environment variables from backend/.env.
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL is missing from backend/.env")

# Browser origins allowed to call the API (comma separated).
#
# CORS is a browser rule, so it only matters for the Expo *web* build. The
# native Android app is not a browser and is not affected by it. The defaults
# are Expo web's dev-server addresses. Set CORS_ORIGINS in backend/.env to
# change them, e.g. when the web app is hosted somewhere.
CORS_ORIGINS = [
    origin.strip()
    for origin in os.getenv(
        "CORS_ORIGINS", "http://localhost:8081,http://localhost:19006"
    ).split(",")
    if origin.strip()
]
