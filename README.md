# Royal Cell Spot

Royal Cell Spot is a full-stack e-commerce web application built for selling mobile phones, tablets, and accessories. It features a modern, responsive user interface for customers and a dedicated admin dashboard for managing products and orders.

## Features

- **Customer-Facing Storefront:**
  - Browse products with filtering and sorting options.
  - View detailed product pages.
  - Add products to a shopping cart.
  - Secure and seamless checkout process powered by Stripe.
  - Fully responsive design for a great experience on any device.

- **Admin Dashboard:**
  - Secure login for administrators.
  - Manage products: Add new products and update existing ones.
  - View and manage customer orders.

## Tech Stack

### Frontend
- **Framework:** React (with Vite)
- **Routing:** React Router
- **State Management:** Zustand
- **Styling:** Tailwind CSS
- **HTTP Client:** Axios
- **Payments:** Stripe.js

### Backend
- **Framework:** Node.js with Express
- **Database:** MongoDB with Mongoose
- **Authentication:** JSON Web Tokens (JWT)
- **Middleware:** CORS, Cookie Parser, Morgan for logging

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [MongoDB](https://www.mongodb.com/try/download/community) (or a MongoDB Atlas account)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd royalcellspot
    ```

2.  **Setup the Backend:**
    ```bash
    cd server
    npm install
    ```
    Create a `.env` file in the `server` directory and add the following environment variables:
    ```
    NODE_ENV=development
    PORT=5001
    MONGO_URI=<your_mongodb_connection_string>
    JWT_SECRET=<your_jwt_secret>
    JWT_EXPIRE=30d
    JWT_COOKIE_EXPIRE=30
    ```

3.  **Setup the Frontend:**
    ```bash
    cd ../frontend
    npm install
    ```

### Running the Application

1.  **Start the Backend Server:**
    Open a terminal in the `server` directory and run:
    ```bash
    npm run dev
    ```
    The server will start on `http://localhost:5001`.

2.  **Start the Frontend Development Server:**
    Open another terminal in the `frontend` directory and run:
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173` (or another port if 5173 is busy).

## Available Scripts

### Backend (`/server`)
- `npm start`: Starts the server in production mode.
- `npm run dev`: Starts the server in development mode with `nodemon` for live reloading.
- `npm run data:import`: Seeds the database with initial product data.
- `npm run data:destroy`: Deletes all data from the database.

### Frontend (`/frontend`)
- `npm run dev`: Starts the Vite development server.
- `npm run build`: Builds the application for production.
- `npm run lint`: Lints the source code using ESLint.
- `npm run preview`: Serves the production build locally.

## Project Structure

```
/
├── frontend/
│   ├── src/
│   │   ├── assets/         # Static assets like images
│   │   ├── components/     # Reusable React components
│   │   ├── data/           # Local data files (e.g., products.js)
│   │   ├── pages/          # Page components for routing
│   │   ├── services/       # API service modules
│   │   ├── store/          # Zustand state management store
│   │   └── utils/          # Utility functions
│   ├── package.json
│   └── vite.config.js
│
└── server/
    ├── config/             # Database configuration
    ├── controllers/        # Route handlers and business logic
    ├── middleware/         # Express middleware
    ├── models/             # Mongoose data models
    ├── routes/             # API route definitions
    ├── utils/              # Utility scripts (e.g., seeder)
    ├── package.json
    └── server.js           # Main server entry point
```
