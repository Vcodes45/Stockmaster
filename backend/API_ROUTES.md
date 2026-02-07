# StockMaster API Routes Documentation

Base URL: `http://localhost:PORT/api/v1`

## 🔐 Authentication Routes (`/auth`)

### Public Routes

- `POST /auth/register` - Register a new user

  - Body: `{ email, username, password, fullname? }`
  - Returns: User data + verification email sent

- `POST /auth/login` - Login user

  - Body: `{ email, password }`
  - Returns: User data + access/refresh tokens in cookies

- `GET /auth/verify-email/:verificationToken` - Verify email address

  - Params: `verificationToken`
  - Returns: Email verification status

- `POST /auth/refresh-token` - Get new access token

  - Body: `{ refreshToken }` or from cookies
  - Returns: New access and refresh tokens

- `POST /auth/forgot-password` - Request password reset

  - Body: `{ email }`
  - Returns: Reset email sent confirmation

- `POST /auth/reset-password/:resetToken` - Reset password
  - Params: `resetToken`
  - Body: `{ newPassword }`
  - Returns: Password reset confirmation

### Protected Routes (Require JWT)

- `POST /auth/logout` - Logout user

  - Returns: Logout confirmation + clears cookies

- `GET /auth/current-user` - Get current logged-in user

  - Returns: User data

- `POST /auth/change-password` - Change password

  - Body: `{ oldPassword, newPassword }`
  - Returns: Password change confirmation

- `POST /auth/resend-email-verification` - Resend verification email
  - Returns: Email resent confirmation

---

## 📦 Product Routes (`/products`)

All routes require authentication (`verifyJWT`)

- `GET /products` - Get all products

  - Query params: `category` (ObjectId), `search` (string)
  - Returns: Array of products with populated category

- `POST /products` - Create a new product

  - Body:
    ```json
    {
      "name": "string",
      "sku": "string",
      "description": "string?",
      "category": "ObjectId",
      "unitOfMeasure": "string?",
      "minStockLevel": "number?",
      "costPrice": "number?",
      "salesPrice": "number?",
      "initialStock": "number?",
      "initialStockLocationId": "ObjectId?"
    }
    ```
  - Returns: Created product with initial stock operation if provided

- `GET /products/:id` - Get product by ID
  - Params: `id` (ObjectId)
  - Returns: Product details + stock quantities across all locations

---

## 📂 Category Routes (`/categories`)

All routes require authentication (`verifyJWT`)

- `GET /categories` - Get all categories

  - Returns: Array of categories

- `POST /categories` - Create a new category

  - Body: `{ name, description? }`
  - Returns: Created category

- `GET /categories/:id` - Get category by ID

  - Params: `id` (ObjectId)
  - Returns: Category details

- `PUT /categories/:id` - Update category

  - Params: `id` (ObjectId)
  - Body: `{ name?, description? }`
  - Returns: Updated category

- `DELETE /categories/:id` - Delete category
  - Params: `id` (ObjectId)
  - Returns: Deletion confirmation
  - Note: Cannot delete if products are using this category

---

## 👥 Contact Routes (`/contacts`)

All routes require authentication (`verifyJWT`)

- `GET /contacts` - Get all contacts

  - Query params: `type` (VENDOR | CUSTOMER)
  - Returns: Array of contacts (vendors/customers)

- `POST /contacts` - Create a new contact
  - Body:
    ```json
    {
      "name": "string",
      "type": "VENDOR | CUSTOMER",
      "email": "string?",
      "phone": "string?",
      "address": "string?"
    }
    ```
  - Returns: Created contact

---

## 📍 Location Routes (`/locations`)

All routes require authentication (`verifyJWT`)

- `GET /locations` - Get all locations

  - Query params: `type` (INTERNAL | CUSTOMER | VENDOR | INVENTORY_LOSS | VIEW)
  - Returns: Array of locations

- `POST /locations` - Create a new location
  - Body:
    ```json
    {
      "name": "string",
      "type": "INTERNAL | CUSTOMER | VENDOR | INVENTORY_LOSS | VIEW",
      "address": "string?"
    }
    ```
  - Returns: Created location

---

## 🔄 Operation Routes (`/operations`)

All routes require authentication (`verifyJWT`)

- `GET /operations` - Get all operations

  - Query params:
    - `type` (RECEIPT | DELIVERY | INTERNAL_TRANSFER | ADJUSTMENT)
    - `status` (DRAFT | READY | DONE | CANCELLED)
  - Returns: Array of operations with populated references

- `POST /operations` - Create a new operation

  - Body:
    ```json
    {
      "reference": "string (unique)",
      "type": "RECEIPT | DELIVERY | INTERNAL_TRANSFER | ADJUSTMENT",
      "partner": "ObjectId?",
      "sourceLocation": "ObjectId",
      "destinationLocation": "ObjectId",
      "scheduledDate": "ISO8601?",
      "lines": [
        {
          "product": "ObjectId",
          "demandQuantity": "number",
          "doneQuantity": "number?"
        }
      ]
    }
    ```
  - Returns: Created operation (status: DRAFT)
  - Note: Stock is NOT moved at this stage

- `POST /operations/:id/validate` - Validate operation (CRITICAL)
  - Params: `id` (ObjectId)
  - Returns: Updated operation with stock movements completed
  - Note: This actually moves stock using database transactions
  - Status changes to DONE
  - Creates StockQuant and StockLedger entries

---

## 📊 Dashboard Routes (`/dashboard`)

All routes require authentication (`verifyJWT`)

- `GET /dashboard/stats` - Get dashboard statistics
  - Returns:
    ```json
    {
      "totalProducts": "number",
      "pendingReceipts": "number",
      "pendingDeliveries": "number",
      "internalTransfers": "number",
      "lowStockCount": "number",
      "outOfStockCount": "number"
    }
    ```

---

## 🏥 Health Check Routes (`/healthcheck`)

- `GET /healthcheck` - Check API health
  - Returns: `{ status: "OK" }`

---

## 🔒 Authentication Details

### Access Token

- Short-lived (typically 15 minutes)
- Used for API authentication
- Sent in cookies or `Authorization: Bearer <token>` header

### Refresh Token

- Long-lived (typically 7 days)
- Used to get new access tokens
- Sent in cookies or request body

### Cookie Configuration

- `httpOnly: true` - Cannot be accessed by JavaScript
- `secure: true` (production) - HTTPS only
- `sameSite: "None" | "Lax"` - CSRF protection

---

## ✅ Validation & Error Handling

All routes use:

- **express-validator** for input validation
- **ApiError** for consistent error responses
- **ApiResponse** for consistent success responses
- **asyncHandler** for automatic error catching

### Error Response Format

```json
{
  "statusCode": 400,
  "message": "Error message",
  "success": false,
  "errors": []
}
```

### Success Response Format

```json
{
  "statusCode": 200,
  "data": {},
  "message": "Success message",
  "success": true
}
```

---

## 🚀 Workflow Examples

### Example 1: Receiving Goods from Vendor

1. **Create Vendor** (one-time)

   ```
   POST /contacts
   { "name": "ABC Suppliers", "type": "VENDOR" }
   ```

2. **Create Vendor Location** (one-time)

   ```
   POST /locations
   { "name": "ABC Suppliers Warehouse", "type": "VENDOR" }
   ```

3. **Create Receipt Operation**

   ```
   POST /operations
   {
     "reference": "WH/IN/001",
     "type": "RECEIPT",
     "partner": "<vendorContactId>",
     "sourceLocation": "<vendorLocationId>",
     "destinationLocation": "<warehouseId>",
     "lines": [
       { "product": "<productId>", "demandQuantity": 100 }
     ]
   }
   ```

4. **Validate Operation** (Stock moves here!)
   ```
   POST /operations/<operationId>/validate
   ```

### Example 2: Internal Transfer

```
POST /operations
{
  "reference": "INT/001",
  "type": "INTERNAL_TRANSFER",
  "sourceLocation": "<warehouseAId>",
  "destinationLocation": "<warehouseBId>",
  "lines": [
    { "product": "<productId>", "demandQuantity": 50 }
  ]
}

POST /operations/<operationId>/validate
```

### Example 3: Stock Adjustment

```
POST /operations
{
  "reference": "ADJ/001",
  "type": "ADJUSTMENT",
  "sourceLocation": "<inventoryLossId>",
  "destinationLocation": "<warehouseId>",
  "lines": [
    { "product": "<productId>", "demandQuantity": 10 }
  ]
}

POST /operations/<operationId>/validate
```

---

## 📝 Notes

- All routes except auth public routes require JWT authentication
- All timestamps are automatically managed by MongoDB (`createdAt`, `updatedAt`)
- All IDs are MongoDB ObjectIds
- Stock movements are atomic using database transactions
- StockLedger provides immutable audit trail
- Virtual locations (VENDOR, CUSTOMER, INVENTORY_LOSS) allow flexible stock management
