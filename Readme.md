# 📊 Chapter Performance Dashboard API

A backend API built using **Node.js**, **Express**, **MongoDB**, **TypeScript**, and **Redis**, designed to manage chapter-wise performance data in an educational setting. 

This project was completed as part of a sample backend task.

---

## 🌐 Live Deployment

🔗 [Deployed on Render](https://chapter-dashboard-backned.onrender.com)

https://chapter-dashboard-backned.onrender.com


---

## 🛠️ Tech Stack

- **Node.js** + **Express.js** (REST API)
- **MongoDB** with Mongoose (Database)
- **Redis (Upstash)** (Caching and Rate Limiting)
- **TypeScript**
- **Docker (for local Redis testing)**
- **Multer (for file upload)**
- **Postman** (for API testing)

---

## 📦 Features

- Upload chapters in bulk via JSON
- Filterable + paginated chapter listings
- Caching with Redis
- Rate limiting per IP
- Get single chapter by ID
- Admin-protected routes for data upload
- Centralized error handling

---

## 📌 API Endpoints

### 🔐 Admin-Only

#### `POST /api/v1/chapters`
Upload chapter data via `.json` file (FormData: `file`).  
Requires `isAdmin` middleware.
For now, i have just made userAdmin = true, but it can be easily checked and replaced by the original authentic logic
I have added a data.json file in the repo for testing 

---

### 🔓 Public

#### `GET /api/v1/chapters`
Get paginated chapters with optional filters:

- `?class=Class 11&unit=Mechanics&status=Completed&weakChapters=true&page=1&limit=10`

#### `GET /api/v1/chapters/:id`
Get a single chapter by MongoDB `_id`.

---

## ⚙️ Set up env 
Setup your env file with the help of .env.example file and if you don't want to use upstash redis for local, you just need to change the src/config/redis.ts file just to create a redis instance with the help of docker and you are good to go

---

## POSTMAN EXPORT
Also added in the repo checkout for detailed documentation of APIS and their uses with response examples

---
### Author
Praveen Patidar  praveen_k@bt.iitr.ac.in
---

## ⚙️ How to Run Locally

1. **Clone the repo**
```bash
git clone https://github.com/praveenpatidar171/chapter_dashboard_backned.git
cd chapter-dashboard-api
npm install
npm run dev







