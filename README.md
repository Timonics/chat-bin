# 🔐 Secret Sharing API

A secure, self-destructing secret sharing service built with NestJS, Prisma, BullMQ, and Redis.

## 🚀 Features
- Create encrypted secrets with expiration + view limits
- Retrieve secrets only while valid (auto-expire after conditions met)
- Background cleanup with BullMQ + Redis
- API documentation via Swagger
- PostgreSQL with Prisma ORM

## ⚙️ Tech Stack
- Backend: NestJS
- Database: PostgreSQL + Prisma
- Queue: Redis + BullMQ
- Encryption: AES-256-GCM (crypto)
- Docs: Swagger

## 📦 Setup & Installation
### Clone repo
```bash
git clone https://github.com/yourusername/secret-sharing-api.git
cd secret-sharing-api
```

### Install dependencies
```bash
npm install
```

### Copy env file
```bash
cp .env.example .env
```

### Run database migrations
```bash
npx prisma migrate dev
```

### Start app
```bash
npm run start:dev
```

### Example .env
```
DATABASE_URL="postgresql://user:password@localhost:5432/secretsdb"
SECRET_KEY=your32bytehexkeyhere
REDIS_URL=redis://localhost:6379
```

## 📖 API Documentation

Once running, visit:
```
👉 Swagger UI: http://localhost:3000/api/docs
```

## Example Routes
- POST /secrets → Create a new secret
- GET /secrets/:token → Retrieve secret by access token
- DELETE /secrets/:token → Manually delete secret

## 🏗️ System Architecture
```mermaid
flowchart TD
    A[Client] -->|API Request| B[Controller]
    B --> C[Secret Service]
    C -->|Encrypt/Decrypt| D[Crypto (AES-256-GCM)]
    C -->|DB Access| E[(PostgreSQL - Prisma)]
    C -->|Queue Jobs| F[Redis + BullMQ]

    subgraph G[Background Worker]
        F --> H[Secret Cleanup Worker]
        H --> E
    end

## 🛠 Development Notes
- Prisma handles migrations & DB access
- BullMQ workers process cleanup jobs in background
- Expired secrets auto-delete based on expiresAt

## 🤝 Contributing
Pull requests welcome!

## 📄 License
MIT