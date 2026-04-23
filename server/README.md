# Royal Cell Spot - Backend

This is the backend for the Royal Cell Spot e-commerce website.

## Prerequisites

- Node.js
- MongoDB

## Getting Started

1.  **Clone the repository**

2.  **Install dependencies**

    ```bash
    cd server
    npm install
    ```

3.  **Set up environment variables**

    Create a `.env` file inside the `server/` folder (see `.env.example`) and add the following:

    ```
    NODE_ENV=development
    PORT=5000
    MONGO_URI=<YOUR_MONGO_DB_URI>
    JWT_SECRET=<YOUR_JWT_SECRET>

    # Email (Gmail via Nodemailer)
    EMAIL_USER=<YOUR_GMAIL_ADDRESS>
    EMAIL_PASS=<YOUR_GMAIL_APP_PASSWORD>
    ADMIN_EMAIL=royalcellspot@gmail.com
    # Optional: number shown in customer lead email
    CUSTOMER_CONTACT_PHONE=<YOUR_CONTACT_NUMBER>

    # Frontend URL used to build the tracking link in SMS
    FRONTEND_URL=http://localhost:5173

    # Twilio (SMS)
    TWILIO_SID=<YOUR_TWILIO_ACCOUNT_SID>
    TWILIO_AUTH_TOKEN=<YOUR_TWILIO_AUTH_TOKEN>
    # Preferred (recommended)
    TWILIO_MESSAGING_SERVICE_SID=<YOUR_MESSAGING_SERVICE_SID>
    # Or fallback sender number (if you don't use Messaging Service)
    TWILIO_PHONE_NUMBER=<YOUR_TWILIO_PHONE_NUMBER>
    ```

4.  **Run the server**

    ```bash
    npm run dev
    ```

    The server will be running on `http://localhost:5000`

## API Endpoints

### Products

-   `GET /api/products`
-   `GET /api/products/:id`
-   `POST /api/products` (Admin only)
-   `PUT /api/products/:id` (Admin only)
-   `DELETE /api/products/:id` (Admin only)

### Orders

-   `POST /api/orders`
-   `GET /api/orders` (Admin only)
-   `GET /api/orders/:id` (Admin only)
-   `PUT /api/orders/:id/status` (Admin only)
-   `GET /api/orders/track/:orderId`
-   `GET /api/orders/track?phone=<phone_number>`

### Admin

-   `POST /api/admin/login`
-   `GET /api/admin/me` (Admin only)

### Leads

-   `POST /api/leads`

## Seeding the database

You can seed the database with an admin user by running the following command:

```bash
npm run data:import
```

To destroy the data:

```bash
npm run data:destroy
```