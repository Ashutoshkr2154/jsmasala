# JSM Masala - Full Stack E-Commerce Project 🌶️

This repository contains the complete full-stack code for **JSM Masala**, a modern e-commerce platform for selling spices. The project is split into a React (Vite) frontend and a Node.js (Express) backend API.

---

## Core Features

* **User Authentication:** Secure user registration, login, and password reset via email.
* **Product Catalog:** Browse products with search, filtering, and categorization.
* **Shopping Cart:** Persistent, user-specific shopping cart.
* **Order Management:** Secure checkout, order creation, and user order history.
* **Admin Dashboard:** Role-protected routes for admins to manage products, users, and orders.
* **Image Uploads:** Product images are handled and stored using Cloudinary.
* **Email Notifications:** Transactional emails (welcome, order confirmation) sent via Nodemailer.

---

## Tech Stack

### Frontend (Vite + React)

* **Framework:** React (with TypeScript)
* **Build Tool:** Vite
* **Routing:** React Router
* **State Management:** Zustand
* **Data Fetching:** React Query
* **HTTP Client:** Axios

### Backend (Node.js + Express)

* **Framework:** Node.js, Express.js
* **Database:** MongoDB (with Mongoose)
* **Authentication:** JSON Web Tokens (JWT) & bcrypt
* **Image Storage:** Cloudinary & Multer
* **Email Service:** Nodemailer (with Mailtrap for dev)
* **Validation:** Joi

---

## Project Structure

The project is divided into two main folders:

/jsm-masala-project ├── /backend # Node.js API (Server) └── /frontend # React App (Client)



---

## Quick Start (Running Locally)

You will need two terminals running simultaneously.

### 1. Backend Server

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file and add your keys:
    ```env
    PORT=5000
    MONGO_URI=...
    JWT_SECRET=...
    CLOUDINARY_CLOUD_NAME=...
    CLOUDINARY_API_KEY=...
    CLOUDINARY_API_SECRET=...
    EMAIL_HOST=...
    EMAIL_PORT=...
    EMAIL_USER=...
    EMAIL_PASS=...
    FRONTEND_URL=http://localhost:5173
    ```
4.  Run the server:
    ```bash
    npm run dev
    ```
    *(Server will run on `http://localhost:5000`)*

### 2. Frontend App

1.  Open a **new terminal** and navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file and link it to the backend:
    ```env
    VITE_API_BASE_URL=http://localhost:5000/api
    ```
4.  Run the app:
    ```bash
    npm run dev
    ```
    *(App will run on `http://localhost:5173`)*

---

## Deployment

* **Frontend:** Deployed on **Vercel**.
* **Backend:** Deployed on **Render**.
* **Database:** **MongoDB Atlas** free cluster.