# API Documentation

Complete API reference for Navodaya Store.

## Base URL

\`\`\`
http://localhost:3000/api/v1
\`\`\`

## Response Format

All responses follow a consistent format:

### Success Response
\`\`\`json
{
  "success": true,
  "status": true,
  "statusCode": 200,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
\`\`\`

### Error Response
\`\`\`json
{
  "success": false,
  "status": false,
  "statusCode": 400,
  "message": "Error description"
}
\`\`\`

## Authentication

### Bearer Token
Include JWT token in the Authorization header:
\`\`\`
Authorization: Bearer <your_jwt_token>
\`\`\`

## Endpoints

### Auth Endpoints

#### 1. Register User
\`\`\`
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "phone": "1234567890",
  "address": "123 Main St"
}

Response: 201 Created
{
  "success": true,
  "message": "Registration successful",
  "user": {
    "name": "John Doe",
    "email": "john@example.com"
  }
}
\`\`\`

#### 2. Login
\`\`\`
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}

Response: 200 OK
{
  "success": true,
  "message": "Login successful",
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "isAdmin": false
  },
  "token": "eyJhbGc..."
}
\`\`\`

#### 3. Verify Email
\`\`\`
GET /auth/verify-email/:token

Response: 200 OK
{
  "success": true,
  "message": "Email verified successfully"
}
\`\`\`

#### 4. Forget Password
\`\`\`
POST /auth/forget-password
Content-Type: application/json

{
  "email": "john@example.com"
}

Response: 200 OK
{
  "success": true,
  "message": "Password reset link sent to email"
}
\`\`\`

#### 5. Check User Authentication
\`\`\`
GET /auth/user-auth
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "ok": true
}
\`\`\`

#### 6. Check Admin Authentication
\`\`\`
GET /auth/admin-auth
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "ok": true
}
\`\`\`

#### 7. Update Profile
\`\`\`
PUT /auth/update-profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "9876543210",
  "address": "456 Oak St"
}

Response: 200 OK
{
  "success": true,
  "message": "Profile updated successfully"
}
\`\`\`

### Category Endpoints

#### 1. Create Category (Admin)
\`\`\`
POST /category/create-category
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Electronics",
  "description": "Electronic devices"
}

Response: 201 Created
{
  "success": true,
  "message": "Category created successfully",
  "category": {
    "_id": "...",
    "name": "Electronics",
    "slug": "electronics"
  }
}
\`\`\`

#### 2. Get All Categories
\`\`\`
GET /category/get-category

Response: 200 OK
{
  "success": true,
  "categories": [...]
}
\`\`\`

#### 3. Get Category by ID
\`\`\`
GET /category/get-category/:id

Response: 200 OK
{
  "success": true,
  "category": {...}
}
\`\`\`

#### 4. Update Category (Admin)
\`\`\`
PUT /category/update-category/:id
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Electronics Updated",
  "description": "Updated description"
}

Response: 200 OK
{
  "success": true,
  "message": "Category updated successfully"
}
\`\`\`

#### 5. Delete Category (Admin)
\`\`\`
DELETE /category/delete-category/:id
Authorization: Bearer <admin_token>

Response: 200 OK
{
  "success": true,
  "message": "Category deleted successfully"
}
\`\`\`

### Product Endpoints

#### 1. Create Product (Admin)
\`\`\`
POST /product/create-product
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data

Fields:
- name: "Laptop"
- price: 50000
- category: "electronics_category_id"
- quantity: 10
- description: "High-performance laptop"
- rating: 4.5
- photo: <file>

Response: 201 Created
{
  "success": true,
  "message": "Product created successfully",
  "product": {...}
}
\`\`\`

#### 2. Get All Products
\`\`\`
GET /product/get-products?page=1&limit=10&sort=-price

Response: 200 OK
{
  "success": true,
  "total": 100,
  "page": 1,
  "limit": 10,
  "products": [...]
}
\`\`\`

#### 3. Get Product by ID
\`\`\`
GET /product/get-product/:id

Response: 200 OK
{
  "success": true,
  "product": {...}
}
\`\`\`

#### 4. Get Product Photo
\`\`\`
GET /product/product-photo/:id

Response: 200 OK (Image binary data)
\`\`\`

#### 5. Update Product (Admin)
\`\`\`
PUT /product/update-product/:id
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data

Response: 200 OK
{
  "success": true,
  "message": "Product updated successfully"
}
\`\`\`

#### 6. Delete Product (Admin)
\`\`\`
DELETE /product/delete-product/:id
Authorization: Bearer <admin_token>

Response: 200 OK
{
  "success": true,
  "message": "Product deleted successfully"
}
\`\`\`

### Cart Endpoints

#### 1. Add to Cart
\`\`\`
POST /cart/add-to-cart
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "product_id",
  "quantity": 2
}

Response: 200 OK
{
  "success": true,
  "message": "Item added to cart"
}
\`\`\`

#### 2. Get Cart
\`\`\`
GET /cart/get-cart
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "cart": {
    "products": [...]
  }
}
\`\`\`

#### 3. Remove from Cart
\`\`\`
DELETE /cart/remove-from-cart/:productId
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "message": "Item removed from cart"
}
\`\`\`

### Order Endpoints

#### 1. Create Order
\`\`\`
POST /order/create-order
Authorization: Bearer <token>
Content-Type: application/json

{
  "products": ["product_id_1", "product_id_2"],
  "address": "Delivery address",
  "paymentIntentId": "payment_intent_id" (optional)
}

Response: 201 Created
{
  "success": true,
  "message": "Order created successfully",
  "order": {...}
}
\`\`\`

#### 2. Get User Orders
\`\`\`
GET /order/get-orders
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "orders": [...]
}
\`\`\`

#### 3. Get All Orders (Admin)
\`\`\`
GET /order/get-all-orders
Authorization: Bearer <admin_token>

Response: 200 OK
{
  "success": true,
  "orders": [...]
}
\`\`\`

#### 4. Update Order Status (Admin)
\`\`\`
PUT /order/update-status/:id
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "status": "shipped"
}

Response: 200 OK
{
  "success": true,
  "message": "Order status updated"
}
\`\`\`

### Payment Endpoints

#### 1. Generate Payment Token
\`\`\`
GET /payment/braintree/token
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "clientToken": "braintree_token_string"
}
\`\`\`

#### 2. Process Payment
\`\`\`
POST /payment/braintree/payment
Authorization: Bearer <token>
Content-Type: application/json

{
  "paymentMethodNonce": "braintree_nonce",
  "amount": "5000.00",
  "products": [...]
}

Response: 200 OK
{
  "success": true,
  "message": "Payment processed successfully",
  "transaction": {...},
  "order": {...}
}
\`\`\`

### Feedback Endpoints

#### 1. Submit Feedback
\`\`\`
POST /feedback/submit-feedback
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Great products!"
}

Response: 201 Created
{
  "success": true,
  "message": "Feedback submitted successfully"
}
\`\`\`

#### 2. Get All Feedback (Admin)
\`\`\`
GET /feedback/get-feedback
Authorization: Bearer <admin_token>

Response: 200 OK
{
  "success": true,
  "feedback": [...]
}
\`\`\`

#### 3. Delete Feedback (Admin)
\`\`\`
DELETE /feedback/delete-feedback/:id
Authorization: Bearer <admin_token>

Response: 200 OK
{
  "success": true,
  "message": "Feedback deleted successfully"
}
\`\`\`

## Error Codes

| Code | Description |
|------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Permission denied |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error - Server error |

## Rate Limiting

Not currently implemented. Consider adding:
- 100 requests per 15 minutes per IP
- 50 requests per 15 minutes for auth endpoints
