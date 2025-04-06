FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
ENV IS_DOCKER=true
COPY . .
CMD ["python", "main.py"]
