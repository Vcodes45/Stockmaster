# StockMaster Backend

A comprehensive Inventory Management System API built with Node.js, Express, and MongoDB.

## 🚀 Features

- **Authentication & Authorization** - JWT-based auth with refresh tokens
- **Product Management** - CRUD operations with categories and stock tracking
- **Multi-warehouse Support** - Track inventory across multiple locations
- **Stock Operations** - Receipts, deliveries, internal transfers, and adjustments
- **Real-time Stock Tracking** - Automatic stock updates with transaction support
- **Audit Trail** - Immutable ledger for all stock movements
- **Dashboard Analytics** - KPIs and inventory insights
- **Email Notifications** - Email verification and password reset

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the backend directory with the following variables:
   ```env
   # Database
   MONGO_URI=mongodb://localhost:27017/stockmaster
   # or MongoDB Atlas
   # MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/stockmaster

   # Server
   PORT=8000
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:5173

   # JWT Tokens
   ACCESS_TOKEN_SECRET=your_access_token_secret_here
   ACCESS_TOKEN_EXPIRY=1d
   REFRESH_TOKEN_SECRET=your_refresh_token_secret_here
   REFRESH_TOKEN_EXPIRY=10d

   # Email Configuration (Mailtrap for development)
   MAILTRAP_SMTP_HOST=sandbox.smtp.mailtrap.io
   MAILTRAP_SMTP_PORT=2525
   MAILTRAP_SMTP_USER=your_mailtrap_user
   MAILTRAP_SMTP_PASS=your_mailtrap_password

   # Frontend URL for password reset
   FORGET_PASSWORD_REDIRECT_URL=http://localhost:5173/reset-password
   ```

4. **Start the server**
   
   Development mode (with auto-restart):
   ```bash
   npm run dev
   ```
   
   Production mode:
   ```bash
   npm start
   ```

## 📁 Project Structure

```
backend/
├── src/
│   ├── controller/         # Route controllers
│   │   ├── auth.controller.js
│   │   ├── product.controller.js
│   │   ├── category.controller.js
│   │   ├── contact.controller.js
│   │   ├── location.controller.js
│   │   ├── operation.controller.js
│   │   └── dashboard.controller.js
│   ├── models/            # Mongoose schemas
│   │   ├── user.model.js
│   │   ├── product.model.js
│   │   ├── category.model.js
│   │   ├── contact.model.js
│   │   ├── location.model.js
│   │   ├── operation.model.js
│   │   ├── stockQuant.model.js
│   │   └── stockLedger.model.js
│   ├── routes/            # Express routes
│   ├── middleware/        # Custom middleware
│   │   ├── auth.middleware.js
│   │   └── validate.middleware.js
│   ├── validators/        # Input validation
│   │   └── index.js
│   ├── utils/             # Utility functions
│   │   ├── api-error.js
│   │   ├── api-response.js
│   │   ├── async-handler.js
│   │   └── mail.js
│   └── db/               # Database connection
│       └── index.js
├── app.js                # Express app setup
├── index.js              # Server entry point
├── package.json
├── .env
└── README.md
```

## 🔌 API Endpoints

Base URL: `http://localhost:8000/api/v1`

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user
- `GET /auth/verify-email/:token` - Verify email
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password/:token` - Reset password
- `POST /auth/refresh-token` - Refresh access token
- `GET /auth/current-user` - Get current user
- `POST /auth/change-password` - Change password

### Products
- `GET /products` - Get all products
- `POST /products` - Create product
- `GET /products/:id` - Get product by ID

### Categories
- `GET /categories` - Get all categories
- `POST /categories` - Create category
- `GET /categories/:id` - Get category by ID
- `PUT /categories/:id` - Update category
- `DELETE /categories/:id` - Delete category

### Contacts (Vendors/Customers)
- `GET /contacts` - Get all contacts
- `POST /contacts` - Create contact

### Locations
- `GET /locations` - Get all locations
- `POST /locations` - Create location

### Operations (Stock Movements)
- `GET /operations` - Get all operations
- `POST /operations` - Create operation
- `POST /operations/:id/validate` - Validate operation (moves stock)

### Dashboard
- `GET /dashboard/stats` - Get dashboard statistics

See [API_ROUTES.md](./API_ROUTES.md) for detailed API documentation.

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication:

- **Access Token**: Short-lived token (1 day) for API requests
- **Refresh Token**: Long-lived token (10 days) for obtaining new access tokens

Tokens are sent via:
1. HTTP-only cookies (recommended)
2. Authorization header: `Authorization: Bearer <token>`

## 🗄️ Database Models

### Core Models

1. **User** - User authentication and authorization
2. **Product** - Product catalog with SKU, category, pricing
3. **Category** - Product categorization
4. **Contact** - Vendors and customers
5. **Location** - Warehouses and storage locations
6. **Operation** - Stock movement operations
7. **StockQuant** - Current stock per product per location
8. **StockLedger** - Immutable audit trail of stock movements

## 📊 Stock Management Flow

### Example: Receiving Goods

1. **Create Operation** (DRAFT status)
   ```javascript
   POST /operations
   {
     "reference": "WH/IN/001",
     "type": "RECEIPT",
     "sourceLocation": "vendorLocationId",
     "destinationLocation": "warehouseId",
     "lines": [
       { "product": "productId", "demandQuantity": 100 }
     ]
   }
   ```

2. **Validate Operation** (Moves stock)
   ```javascript
   POST /operations/:id/validate
   ```
   
   This will:
   - Update StockQuant (source -100, destination +100)
   - Create StockLedger entry
   - Mark operation as DONE
   - Use database transactions for atomicity

## 🛡️ Error Handling

The API uses consistent error responses:

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Error description",
  "errors": []
}
```

Success responses:

```json
{
  "success": true,
  "statusCode": 200,
  "data": {},
  "message": "Success message"
}
```

## ⚡ Performance

- **Database Indexing**: Optimized queries with strategic indexes
- **Transaction Support**: ACID compliance for critical operations
- **Async/Await**: Non-blocking operations throughout
- **Connection Pooling**: MongoDB connection pooling enabled

## 🧪 Testing

Run the API:
```bash
npm run dev
```

Test health check:
```bash
curl http://localhost:8000/api/v1/healthcheck
```

## 📝 Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGO_URI` | MongoDB connection string | Yes |
| `PORT` | Server port | No (default: 3000) |
| `NODE_ENV` | Environment (development/production) | No |
| `CORS_ORIGIN` | Allowed origins for CORS | Yes |
| `ACCESS_TOKEN_SECRET` | JWT access token secret | Yes |
| `ACCESS_TOKEN_EXPIRY` | Access token expiration | Yes |
| `REFRESH_TOKEN_SECRET` | JWT refresh token secret | Yes |
| `REFRESH_TOKEN_EXPIRY` | Refresh token expiration | Yes |
| `MAILTRAP_SMTP_HOST` | Email SMTP host | Yes |
| `MAILTRAP_SMTP_PORT` | Email SMTP port | Yes |
| `MAILTRAP_SMTP_USER` | Email SMTP username | Yes |
| `MAILTRAP_SMTP_PASS` | Email SMTP password | Yes |
| `FORGET_PASSWORD_REDIRECT_URL` | Frontend reset password URL | Yes |

## 🚨 Common Issues

### MongoDB Connection Error
- Check if MongoDB is running
- Verify MONGO_URI in .env file
- Check network connectivity for Atlas

### Authentication Error
- Ensure JWT secrets are set in .env
- Check token expiry settings
- Verify cookies are being sent (credentials: true)

### Email Not Sending
- Verify Mailtrap credentials
- Check SMTP configuration
- Review email logs in console

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [JWT.io](https://jwt.io/)
- [API Routes Documentation](./API_ROUTES.md)

## 👥 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

ISC

## 🤝 Support

For support, email support@stockmaster.com or create an issue in the repository.
