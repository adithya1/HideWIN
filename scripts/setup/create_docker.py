import os

root = r"C:\Users\akula\Downloads\Hide-WIN"

# 1. hidewin-fastapi
fastapi_dir = os.path.join(root, "hidewin-fastapi")
with open(os.path.join(fastapi_dir, "requirements.txt"), "w") as f:
    f.write("fastapi>=0.110.0\nuvicorn>=0.27.1\nsqlalchemy>=2.0.27\npydantic>=2.6.2\nwebsockets>=12.0\npython-multipart>=0.0.9\n")

with open(os.path.join(fastapi_dir, "Dockerfile"), "w") as f:
    f.write("""FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "run_api:app", "--host", "0.0.0.0", "--port", "8000"]
""")

# 2. hidewin-cloud-relay
relay_dir = os.path.join(root, "hidewin-cloud-relay")
with open(os.path.join(relay_dir, "requirements.txt"), "w") as f:
    f.write("fastapi>=0.110.0\nuvicorn>=0.27.1\nwebsockets>=12.0\n")

with open(os.path.join(relay_dir, "Dockerfile"), "w") as f:
    f.write("""FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "cloud_relay:app", "--host", "0.0.0.0", "--port", "9000"]
""")

# 3. Hide-Win-Web
web_dir = os.path.join(root, "Hide-Win-Web")
with open(os.path.join(web_dir, "Dockerfile"), "w") as f:
    f.write("""FROM nginx:alpine
# Copy the frontend apps into the nginx server
COPY Admin /usr/share/nginx/html/Admin
COPY Guest /usr/share/nginx/html/Guest
COPY User /usr/share/nginx/html/User

# Expose port 80
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
""")

# 4. docker-compose.yml
compose = """version: '3.8'

services:
  api-service:
    build:
      context: ./hidewin-fastapi
    ports:
      - "8000:8000"
    volumes:
      # Mount the API source code for hot-reloading
      - ./hidewin-fastapi:/app
      # Mount the Web UI so FastAPI can serve the Admin static files relative to its path
      - ./Hide-Win-Web:/Hide-Win-Web
    environment:
      - PYTHONUNBUFFERED=1

  cloud-relay:
    build:
      context: ./hidewin-cloud-relay
    ports:
      - "9000:9000"
    volumes:
      - ./hidewin-cloud-relay:/app
      # Mount the Web UI so the Relay can serve the Guest static files
      - ./Hide-Win-Web:/Hide-Win-Web
    environment:
      - PYTHONUNBUFFERED=1

  web-client:
    build:
      context: ./Hide-Win-Web
    ports:
      - "3000:80"
    volumes:
      - ./Hide-Win-Web:/usr/share/nginx/html
"""
with open(os.path.join(root, "docker-compose.yml"), "w") as f:
    f.write(compose)

print("Created all Dockerfiles, requirements.txt, and docker-compose.yml!")
