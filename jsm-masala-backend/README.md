# JSM Masala - Backend API

This repository contains the backend API server for the JSM Masala e-commerce website. It's built with Node.js, Express.js, and MongoDB, providing RESTful endpoints for user authentication, product management, cart operations, order processing, and administrative functions.

---

## ✨ Features

* **User Authentication:** Secure registration and login using JWT (Access & Refresh Tokens) with bcrypt password hashing. Includes forgot/reset password functionality via email.
* **Role-Based Access Control:** Differentiates between `user` and `admin` roles, protecting specific routes.
* **Product Management:** Full CRUD APIs for products, including variants, categories, and image uploads via Cloudinary.
* **Category Management:** CRUD APIs for product categories.
* **Shopping Cart:** Persistent user carts stored in the database with add, update, remove, and clear functionalities.
* **Order Management:** API for creating orders from the cart, retrieving user-specific order history, and admin management of all orders (status updates).
* **Admin Dashboard APIs:** Endpoints for fetching site statistics (users, orders, revenue) and managing users.
* **Image Uploads:** Integrates with Cloudinary via Multer for handling product image uploads.
* **Email Notifications:** Sends transactional emails (welcome, password reset, order confirmation) using Nodemailer and Mailtrap (for development).
* **Input Validation:** Robust validation of request data using Joi.
* **Security:** Basic security enhancements using Helmet, CORS, and JWT protection.
* **Error Handling:** Centralized middleware for consistent error responses.

---

## 🔧 Tech Stack

* **Backend Framework:** Node.js, Express.js
* **Database:** MongoDB (via Mongoose ODM)
* **Authentication:** JSON Web Tokens (`jsonwebtoken`), `bcryptjs`
* **Image Storage:** Cloudinary (`cloudinary`), `multer`
* **Email:** Nodemailer (`nodemailer`), Mailtrap (for development SMTP)
* **Validation:** Joi (`joi`)
* **Environment Variables:** `dotenv`
* **Security:** `helmet`, `cors`
* **HTTP Logging:** `morgan` (for development)
* **Process Management (Dev):** `nodemon`

---

## 📂 Folder Structure

The project follows an MVC-like pattern:

---

##  Prerequisites

* [Node.js](https://nodejs.org/) (v18.x or higher recommended)
* [npm](https://www.npmjs.com/) (usually comes with Node.js)
* [MongoDB Atlas](http://googleusercontent.com/mongodb.com/10) account (for cloud database)
* [Cloudinary](http://googleusercontent.com/cloudinary.com/11) account (for image storage)
* [Mailtrap](http://googleusercontent.com/mailtrap.io/12) account (for testing emails in development)

---

## ⚙️ Setup & Installation

1.  **Clone the Repository (or create files):**
    ```bash
    # If you haven't already, create the main folder
    # mkdir jsm-masala-backend
    # cd jsm-masala-backend
    ```
    *(Ensure you have created all the files and folders as previously instructed)*

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Create `.env` File:**
    Create a file named `.env` in the root directory (`jsm-masala-backend/`) and add the following environment variables, replacing the placeholders with your actual credentials:

    ```env
    NODE_ENV=development
    PORT=5000

    # MongoDB Atlas Connection String (replace with yours, include database name)
    MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database_name>?retryWrites=true&w=majority

    # JWT Secrets (Generate strong random strings)
    JWT_SECRET=YOUR_RANDOM_ACCESS_TOKEN_SECRET_KEY_HERE
    JWT_REFRESH_SECRET=YOUR_DIFFERENT_RANDOM_REFRESH_TOKEN_SECRET_KEY_HERE

    # Cloudinary Credentials
    CLOUDINARY_CLOUD_NAME=YOUR_CLOUDINARY_CLOUD_NAME
    CLOUDINARY_API_KEY=YOUR_CLOUDINARY_API_KEY
    CLOUDINARY_API_SECRET=YOUR_CLOUDINARY_API_SECRET

    # Mailtrap Credentials (for development email testing)
    EMAIL_HOST=sandbox.smtp.mailtrap.io
    EMAIL_PORT=2525
    EMAIL_USER=YOUR_MAILTRAP_USERNAME
    EMAIL_PASS=YOUR_MAILTRAP_PASSWORD

    # Frontend URL (for CORS and password reset links)
    FRONTEND_URL=http://localhost:5173
    ```
    **Where to get credentials:**
    * `MONGO_URI`: From your MongoDB Atlas cluster dashboard ("Connect" -> "Connect your application"). Remember to add your database name.
    * `JWT_SECRET`/`JWT_REFRESH_SECRET`: Generate using `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`. **Must be different!**
    * `CLOUDINARY_*`: From your Cloudinary account dashboard.
    * `EMAIL_*`: From your Mailtrap inbox SMTP settings.
    * `FRONTEND_URL`: The URL where your React frontend is running during development.

---

## 🚀 Running the Server

1.  **Development Mode (with auto-reload):**
    Make sure you have `nodemon` installed (`npm install -D nodemon`). Add the following script to your `package.json` under `"scripts"`:
    ```json
    "scripts": {
      "start": "node server.js",
      "dev": "nodemon server.js",
      "test": "echo \"Error: no test specified\" && exit 1"
    },
    ```
    Then run:
    ```bash
    npm run dev
    ```
    The server will start (usually on `http://localhost:5000`) and automatically restart when you save file changes.

2.  **Production Mode:**
    ```bash
    npm start
    ```
    (Ensure `NODE_ENV` is set to `production` in your deployment environment).

---

## 🧪 API Endpoints

Use a tool like [Postman](http://googleusercontent.com/postman.com/13) or Insomnia to test the API endpoints. Remember to include the `Authorization: Bearer <accessToken>` header for protected routes.

| Feature         | Method | Endpoint                    | Access       | Description                                  |
| :-------------- | :----- | :-------------------------- | :----------- | :------------------------------------------- |
| **Auth** | POST   | `/api/auth/register`        | Public       | Register a new user                          |
|                 | POST   | `/api/auth/login`           | Public       | Login user, get tokens                     |
|                 | POST   | `/api/auth/forgotpassword`  | Public       | Send password reset email                    |
|                 | PUT    | `/api/auth/resetpassword/:t`| Public       | Reset password using token from email        |
|                 | POST   | `/api/auth/logout`          | Private      | Logout user (clears refresh token in DB)     |
| **Users** | GET    | `/api/users/me`             | Private      | Get logged-in user's profile                 |
| **Categories** | GET    | `/api/categories`           | Public       | Get all categories                           |
|                 | GET    | `/api/categories/:slugOrId` | Public       | Get single category                          |
|                 | POST   | `/api/categories`           | Admin        | Create a new category                        |
|                 | PUT    | `/api/categories/:id`       | Admin        | Update a category                            |
|                 | DELETE | `/api/categories/:id`       | Admin        | Delete a category                            |
| **Products** | GET    | `/api/products`             | Public       | Get all products (paginated, filter, search) |
|                 | GET    | `/api/products/:idOrSlug`   | Public       | Get single product                           |
|                 | POST   | `/api/products`             | Admin        | Create product (requires form-data + images) |
|                 | PUT    | `/api/products/:id`         | Admin        | Update product (requires form-data)          |
|                 | DELETE | `/api/products/:id`         | Admin        | Delete product (also deletes images)         |
| **Cart** | GET    | `/api/cart`                 | Private      | Get user's cart                              |
|                 | POST   | `/api/cart`                 | Private      | Add item to cart                             |
|                 | PUT    | `/api/cart/:variantId`      | Private      | Update item quantity                         |
|                 | DELETE | `/api/cart/:variantId`      | Private      | Remove item from cart                        |
|                 | DELETE | `/api/cart`                 | Private      | Clear entire cart                            |
| **Orders** | POST   | `/api/orders`               | Private      | Create a new order                           |
|                 | GET    | `/api/orders/myorders`      | Private      | Get logged-in user's orders                  |
|                 | GET    | `/api/orders/:id`           | Private      | Get single order (own or if admin)           |
|                 | GET    | `/api/orders`               | Admin        | Get all orders                               |
|                 | PUT    | `/api/orders/:id/status`    | Admin        | Update order status                          |
| **Admin** | GET    | `/api/admin/stats`          | Admin        | Get dashboard statistics                     |
|                 | GET    | `/api/admin/users`          | Admin        | Get all users                                |

---

## ☁️ Deployment Notes (Render Example)

1.  **Push to GitHub/GitLab:** Ensure your code (excluding `node_modules` and `.env`) is pushed to a Git repository.
2.  **Create Render Account:** Sign up for [Render](http://googleusercontent.com/render.com/14).
3.  **New Web Service:** Create a "New Web Service" and connect it to your Git repository.
4.  **Settings:**
    * **Environment:** Node
    * **Build Command:** `npm install` (or `npm ci --only=production` for cleaner production installs)
    * **Start Command:** `npm start` (which runs `node server.js`)
5.  **Environment Variables:** Add all the variables from your local `.env` file to Render's "Environment" section. **Crucially:**
    * Set `NODE_ENV` to `production`.
    * Update `FRONTEND_URL` to your *deployed* frontend URL (e.g., your Vercel URL).
    * Use your production MongoDB Atlas connection string.
    * Use production email credentials if switching from Mailtrap.
6.  **Deploy:** Create the service. Render will build and deploy your application.

---

This `README.md` provides a comprehensive overview for setting up, running, and understanding your JSM Masala backend project.