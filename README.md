# URL Shortener API

A full-stack URL shortening service built with Node.js, Express, Prisma, and Supabase (PostgreSQL). It includes a robust API for creating short links, tracking visit statistics, and a clean, lightweight frontend built with Vanilla HTML/JS.

## Live Deployment
🚀 **Live Demo:** [http://51.20.53.241:3000/]

---

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

## Prerequisites (Local Development)
Before running this project, ensure you have the following installed:
* [Node.js](https://nodejs.org/) (v18 or higher)
* A [Supabase](https://supabase.com/) account with a PostgreSQL database project created.

---

## Local Installation & Setup

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
\`\`\`env
# Port 6543 (Connection Pooler) for the Node.js application
DATABASE_URL="postgres://postgres.[your-project-ref]:[your-password]@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"

# Port 5432 (Direct Connection) for Prisma schema migrations
DIRECT_URL="postgres://postgres.[your-project-ref]:[your-password]@aws-1-ap-south-1.pooler.supabase.com:5432/postgres"
\`\`\`

**4. Push Database Schema & Generate Prisma Client:**
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

## AWS Deployment Guide (EC2)

To deploy this application to an AWS EC2 instance (Ubuntu), SSH into your server and run the following bash commands:

**1. Update the server and install Node.js (v18):**
\`\`\`bash
sudo apt update
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
\`\`\`

**2. Clone your repository:**
*(Replace the URL with your actual GitHub repository URL)*
\`\`\`bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name/backend
\`\`\`

**3. Install project dependencies:**
\`\`\`bash
npm install
\`\`\`

**4. Set up your Environment Variables:**
Open the nano text editor to create your `.env` file and paste your Supabase URLs inside:
\`\`\`bash
nano .env
\`\`\`
*(Press `Ctrl + X`, then `Y`, then `Enter` to save and exit).*

**5. Generate the Prisma Client for production:**
\`\`\`bash
npx prisma generate
\`\`\`

**6. Install PM2 to keep the app running in the background:**
\`\`\`bash
sudo npm install -g pm2
\`\`\`

**7. Start the application with PM2:**
\`\`\`bash
pm2 start server.js --name "url-shortener"
\`\`\`

**8. Ensure PM2 restarts the app automatically if the AWS server reboots:**
\`\`\`bash
pm2 startup
pm2 save
\`\`\`

*Note: Make sure you have opened port `3000` (or port `80` if using a reverse proxy like Nginx) in your EC2 instance's Security Group settings in the AWS Console.*

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

### 2. Redirect to Original URL
* **Endpoint:** `/:shortCode`
* **Method:** `GET`
* **Description:** Redirects the user to the original URL and increments the visit counter using a `302 Temporary Redirect`.

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
  \`\`\`

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
\`\`\`
