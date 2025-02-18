Project Name

Overview

This project is a full-stack chatbot application built using Next.js with PostgreSQL as the database. It features authentication using JSON Web Token (JWT) and bcrypt for password hashing. The database operations are managed using pg ORM, and the project is written in TypeScript. The backend logic is handled using Next.js API routes.

Features

Authentication & Authorization (JWT-based login system)

Chatbot Functionality

Secure Password Hashing with bcrypt

Database Management using PostgreSQL & pg ORM

Backend API Routes in Next.js

Responsive UI with Next.js & Tailwind CSS

Tech Stack

Frontend:

Next.js (React framework for SSR & SSG)

Tailwind CSS (Utility-first styling)

TypeScript (Static typing)

Backend:

Next.js API Routes (Server-side logic)

PostgreSQL (Relational database)

pg ORM (Database management)

JSON Web Token (JWT) (Authentication)

bcrypt (Password hashing)

Installation

Prerequisites

Node.js (v18+ recommended)

PostgreSQL installed & running

Setup Instructions

Clone the repository:

git clone https://github.com/zeeshan-memon/platformance-assessment-.git
cd platformance-assessment

Install dependencies:

npm install

Set up environment variables:
Create a .env.local file and add the following:

DATABASE_URL=postgresql://user:password@localhost:5432/dbname
JWT_SECRET=your_jwt_secret

Run database migrations (if applicable):

npx prisma migrate dev

Start the development server:

npm run dev

Project Structure

📦 your-project
├── 📂 components      # Reusable UI components
│   ├── 📂 ui         # UI-related components
├── 📂 lib            # Backend logic & helpers
│   ├── 📂 auth       # Authentication logic (JWT, bcrypt)
│   ├── 📂 db         # Database interactions
├── 📂 types          # TypeScript types
├── 📂 pages          # Next.js pages (frontend UI)
│   ├── 📂 api        # Backend API routes
├── 📂 public         # Static assets
├── .env.local        # Environment variables
├── next.config.js    # Next.js configuration
├── package.json      # Dependencies & scripts
└── README.md         # Project documentation

API Endpoints

Authentication

POST /api/auth/login - User login

POST /api/auth/register - User registration

Chat

GET /api/chats - Fetch all chats

POST /api/chats - Create a new chat

GET /api/chats/:id - Fetch chat messages

Deployment

Vercel (Recommended)

Install Vercel CLI:

npm install -g vercel

Deploy:

vercel

Contributing

Fork the repository

Create a new branch (git checkout -b feature-branch)

Commit your changes (git commit -m 'Add new feature')

Push to your branch (git push origin feature-branch)

Open a pull request

License

This project is licensed under the MIT License.