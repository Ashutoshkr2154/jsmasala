# JSM Masala - Full Stack E-Commerce Project 🌶️

This repository contains the complete full-stack code for **JSM Masala**, a modern e-commerce platform for selling authentic Indian spices. The project is split into a React (Vite) frontend and a Node.js (Express) backend API.

---

## ✨ Core Features

* **Full E-commerce Flow:** Browse products (with filtering/search), view product details, add to cart, and complete the checkout process.
* **User Authentication:** Secure user registration, login (with JWT Access/Refresh tokens), and a password reset flow via email.
* **Persistent Cart & Wishlist:** User carts and wishlists are saved to the database, syncing across devices.
* **Admin Dashboard:** Role-protected routes for admins to view site statistics (users, orders, revenue) and manage products, orders, and users.
* **Image Uploads:** Product image uploads are handled by the backend using Multer and stored on Cloudinary.
* **Email Notifications:** Transactional emails (welcome, order confirmation, status updates) are sent via Nodemailer.

---

## 🔧 Tech Stack

### Frontend (`jsm-masala-frontend`)

* **Framework/Library:** React (with TypeScript)
* **Build Tool:** Vite
* **Routing:** React Router
* **State Management:** React Query (for server state) & Zustand (for global client state)
* **Styling:** Tailwind CSS
* **Form Handling:** React Hook Form & Zod
* **HTTP Client:** Axios
* **Testing:** Jest, React Testing Library, Playwright (E2E)

### Backend (`jsm-masala-backend`)

* **Framework:** Node.js, Express.js
* **Database:** MongoDB (with Mongoose ODM)
* **Authentication:** JSON Web Tokens (`jsonwebtoken`), `bcryptjs`
* **Image Storage:** Cloudinary & Multer
* **Email Service:** Nodemailer (with Mailtrap for dev)
* **Validation:** Joi
* **Security:** `helmet`, `cors`, `cookie-parser`

---

## 📂 Project Structure

The project is divided into two main folders. You must run both servers simultaneously.

/JSM-Website ├── /jsm-masala-backend # Node.js API (The Server) └── /jsm-masala-frontend # React App (The Client)


---

## 🚀 How to Run Locally

You will need two terminals running at the same time.

### 1. Backend Server

First, start the backend server.

1.  Navigate to the backend directory:
    ```bash
    cd jsm-masala-backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in this folder and add your secret keys (MongoDB URI, JWT secrets, Cloudinary keys, etc.).
4.  Run the server (using nodemon for auto-reload):
    ```bash
    npm run dev
    ```
    *Server will start on `http://localhost:5000`.*

### 2. Frontend App

1.  Open a **new terminal**.
2.  Navigate to the frontend directory:
    ```bash
    cd jsm-masala-frontend
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```
4.  Create a `.env` file in this folder and point it to your local backend:
    ```env
    VITE_API_BASE_URL=http://localhost:5000/api
    ```
5.  Run the app:
    ```bash
    npm run dev
    ```
    *App will be available at `http://localhost:5173`.*

---

## ☁️ Deployment

This project is configured for deployment on free-tier services:

* **Backend (Render):** Deployed as a "Web Service".
* **Frontend (Vercel):** Deployed as a "Vite" project.
* **Database (MongoDB Atlas):** Deployed as a "Free M0 Cluster".

The frontend's `VITE_API_BASE_URL` environment variable must be updated on Vercel to point to the live Render backend URL.
