# URL Shortener API

A full-stack URL shortening service built with Node.js, Express, Prisma, and Supabase (PostgreSQL). It includes a robust API for creating short links, tracking visit statistics, and a clean, lightweight frontend built with Vanilla HTML/JS.

## Features
* **Shorten URLs:** Converts long URLs into 6-character, unique alphanumeric short codes.
* **Redirection:** Instantly redirects users from the short link to the original destination.
* **Analytics/Tracking:** Tracks the total number of visits for every generated short link.
* **Frontend UI:** A simple, built-in graphical interface to interact with the API.

## Tech Stack
* **Backend:** Node.js, Express.js
* **Database:** PostgreSQL (Hosted on Supabase)
* **ORM:** Prisma (v7, using `@prisma/adapter-pg` with ES Modules)
* **Frontend:** Vanilla HTML, CSS, JavaScript

---

## Prerequisites
Before running this project, ensure you have the following installed:
* [Node.js](https://nodejs.org/) (v18 or higher)
* A [Supabase](https://supabase.com/) account with a PostgreSQL database project created.

---

## Installation & Setup

**1. Clone the repository and navigate to the project folder:**
\`\`\`bash
cd backend
\`\`\`

**2. Install dependencies:**
\`\`\`bash
npm install
\`\`\`

**3. Configure Environment Variables:**
Create a `.env` file in the root directory and add your Supabase database connection strings. 

*Note: Prisma requires a direct connection to push schemas, but the Node app uses the connection pooler.*
\`\`\`env
# Port 6543 (Connection Pooler) for the Node.js application
DATABASE_URL="postgres://postgres.[your-project-ref]:[your-password]@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"

# Port 5432 (Direct Connection) for Prisma schema migrations
DIRECT_URL="postgres://postgres.[your-project-ref]:[your-password]@aws-1-ap-south-1.pooler.supabase.com:5432/postgres"
\`\`\`

**4. Push Database Schema & Generate Prisma Client:**
Run the following commands to create the `urls` table in Supabase and generate the Prisma client files:
\`\`\`bash
npx prisma db push
npx prisma generate
\`\`\`

**5. Start the Server:**
\`\`\`bash
npm start
\`\`\`
The application will be running at: `http://localhost:3000`

---

## API Documentation

### 1. Shorten a URL
* **Endpoint:** `/api/shorten`
* **Method:** `POST`
* **Body (JSON):**
  \`\`\`json
  {
    "originalUrl": "https://www.example.com"
  }
  \`\`\`
* **Success Response (201):**
  \`\`\`json
  {
    "originalUrl": "https://www.example.com",
    "shortCode": "a1b2c3",
    "shortLink": "http://localhost:3000/a1b2c3"
  }
  \`\`\`

### 2. Redirect to Original URL
* **Endpoint:** `/:shortCode`
* **Method:** `GET`
* **Description:** Redirects the user to the original URL and increments the visit counter. Uses a `302 Temporary Redirect` to ensure clicks are tracked reliably across browsers.

### 3. Get URL Statistics
* **Endpoint:** `/api/stats/:shortCode`
* **Method:** `GET`
* **Success Response (200):**
  \`\`\`json
  {
    "shortCode": "a1b2c3",
    "originalUrl": "https://www.example.com",
    "visits": 5
  }
  

---

## Folder Structure
\`\`\`text
backend/
├── public/
│   └── index.html         # Frontend User Interface
├── prisma/
│   └── schema.prisma      # Prisma database schema definition
├── .env                   # Environment variables (Database URLs)
├── package.json           # Project dependencies and scripts
├── prisma.config.ts       # Prisma 7 adapter configuration
└── server.js              # Express API Server and application logic


## Deployed at aws 
Deployed Link - http://51.20.53.241:3000/
