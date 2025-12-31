# Library-Management
Library Management using ReactJS (frontend), NodeJS (api-gateway), Python(backend). Protocol used is GRPC AIO

## Overview

This repository contains a small microservices sample application for a Library Management system:

- `user-service` (Python, gRPC): user management
- `book-service` (Python, gRPC): book catalog and categories
- `reservation-service` (Python, gRPC): reserve/return/delete reservations
- `UI/api-gateway` (Node.js/Express): HTTP API that forwards to gRPC services
- `UI/frontend` (React + Vite): single-page web UI

Each backend service exposes gRPC endpoints and is instrumented with OpenTelemetry. The API Gateway exposes HTTP endpoints consumed by the frontend and forwards requests to the gRPC services.

## Run (Docker Compose) - recommended

The easiest way to run the whole system locally is with Docker Compose. From the repository root run:

```bash
docker compose build --no-cache
docker compose up
```

This will build and start:

- PostgreSQL database
- `user-service`, `book-service`, `reservation-service` (Python containers)
- `api-gateway` (Node.js)
- `frontend` (Vite served behind nginx)
- run pg-admin by typing http://localhost:8091 or any port specified in the docker compose file
- Register your server by right clicking on the left "Server" node.
- Enter "postgres" as your server name (name of the service is mentioned in docker compose file)
- credentials are also mentioned in docker compose file. Ideally we should not expose it in docker compose and have it as environment variables and use it 
- Add new database "library" with the user mentioned in docker compose file 
- Right click on database and open a new Query tool
- Copy contents of "generate_tables.sql" in root folder of the project and copy paste it in Query tool
- Press the "Execute" button 

Open the UI in your browser at: http://localhost:3000/DashBoard (or the port shown by the compose output).

Logs: use `docker compose logs -f <service-name>` to follow a single service's logs.

## Run services locally (without Docker)

Prerequisites:

- Python 3.10+ with dependencies installed (see each service `requirements.txt`)
- Node.js 18+ and `npm`/`pnpm`
- PostgreSQL available and running (or update `DATABASE_URL` in each service `database.py`)

1. Start PostgreSQL (or configure to point to an existing instance).
2. From each Python service folder (e.g. `user-service`) create a virtualenv and install deps:

```bash
python -m venv .venv
source .venv/bin/activate    # or .\.venv\Scripts\activate on Windows
pip install -r requirements.txt
```

3. Initialize the DB schema for each service if required (check `init_db.py` in each `app` folder):

```bash
python app/init_db.py
```

4. Start the Python gRPC services (each runs on its own port):

```bash
# from user-service
python -m app.server
# from book-service
python -m app.server
# from reservation-service
python -m app.server
```

5. Start the API gateway (from `UI/api-gateway`):

```bash
npm install
node index.js
```

6. Start the frontend (from `UI/frontend`):

```bash
pnpm install   # or npm install
pnpm run dev   # starts vite on port 5173
```

If you run the frontend standalone, the gateway base path is configured via `VITE_API_BASE_URL` / `REACT_APP_API_BASE` environment variable.

## Regenerate gRPC stubs

When you change any `.proto` files, regenerate stubs used by Python and Node.js clients:

Python (gRPC Python):

```bash
python -m grpc_tools.protoc -I. --python_out=./user-service/app --grpc_python_out=./user-service/app user-service/proto/user.proto
python -m grpc_tools.protoc -I. --python_out=./reservation-service/app --grpc_python_out=./reservation-service/app reservation-service/proto/reservation.proto
python -m grpc_tools.protoc -I. --python_out=./book-service/app --grpc_python_out=./book-service/app book-service/proto/book.proto
```

Node.js (gateway client using `grpc`/`@grpc/grpc-js` + `proto-loader`) does not require codegen — it loads `.proto` at runtime. Ensure the gateway `proto/` folder contains the current `.proto` files.

## API Gateway endpoints (HTTP)

Users:
- POST `/users` - create user
- PUT `/users/:user_id` - update user
- DELETE `/users/:user_id` - delete user
- GET `/users/:user_id` - get user
- GET `/users` - list users

Reservations:
- POST `/reservations` - create reservation (body: `user_id`, `book_id`)
- POST `/reservations/:reservation_id/return` - mark return
- DELETE `/reservations/:reservation_id` - delete reservation

Books (gateway forwards to book-service):
- standard CRUD endpoints under `/books` and `/categories` (see gateway source)

## Frontend

The frontend expects the API gateway to be available at `VITE_API_BASE_URL` (default `/api` in dev). The main pages are located in `UI/frontend/src/pages` and API wrappers in `UI/frontend/src/api`.

## Notes & Maintenance

- The services use SQLAlchemy + asyncpg; connection strings are in each service `database.py` file.
- For development, adjust ports and hostnames in `UI/api-gateway/services/*.js` to point to local services if not using Docker.
- The repository includes basic OpenTelemetry setup — configure exporters in `common/telemetry.py` if you want tracing.

If you want, I can add a short `make` or npm script to simplify common dev flows (build/run all services), or create a small checklist for debugging startup issues.
