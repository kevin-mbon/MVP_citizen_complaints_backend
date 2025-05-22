# MVP_citizen_complaints_backend

This is the backend API for the Citizen Complaint, built using **NestJS** and integrated with **Google Gemini AI** for intelligent services. It supports user authentication, complaint handling, email notifications, and includes comprehensive API documentation via Swagger.

---

## 🧰 Tech Stack

| Category              | Technology                         |
|-----------------------|-------------------------------------|
| **Backend Framework** | [NestJS](https://nestjs.com/)       |
| **Database**          | MongoDB with Mongoose               |
| **Authentication**    | JWT (JSON Web Tokens)               |
| **API Docs**          | Swagger / OpenAPI                   |
| **AI Integration**    | Google Gemini AI                    |
| **Email Service**     | Nodemailer                          |
| **Validation**        | class-validator                     |
| **Env Management**    | ConfigModule                        |

---

## 📋 Prerequisites

Make sure you have the following installed on your system:

- [Node.js (v14+)](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- A valid **Google Gemini API Key**

---

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone [https://github.com/kevin-mbon/MVP_citizen_complaints_backend.git]
cd MVP_citizen_complaints_backend
 ```
---
### installation

```bash
pnpm install
```

## Setup Environment Variables
```bash
PORT=4444
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```
---

### Running the Application

```bash
npm run start:dev
```

### API documentation

```bash
http://localhost:4444/api/v1/docs
```

