# Tier 2 (application) image. Framework-neutral, Dockerized, portable.
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Install dependencies first for better layer caching.
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Run as a non-root user (least privilege).
RUN useradd --create-home appuser
USER appuser

EXPOSE 8000

# Apply migrations, seed synthetic data, then serve. DATABASE_URL and DATA_MODE
# come from the environment (docker-compose injects them).
CMD ["sh", "-c", "alembic upgrade head && python seed.py && uvicorn app.main:app --host 0.0.0.0 --port 8000"]
