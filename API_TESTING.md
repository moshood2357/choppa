# Testing the API

## Quick Start

### 1. Start the Backend
```bash
cd chopa-chop
php artisan serve
```
This runs on `http://localhost:8000`

### 2. Seed Test Data (optional)
```bash
php artisan db:seed
```

### 3. Run API Tests
```bash
node test-api.js
```

This will test all endpoints in sequence:
- User registration & login
- Categories (create, list)
- Products (create, list, show)
- Orders (create, list, show, update status)
- Logout

## Manual Testing with cURL

### Register User
```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "password_confirmation": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```
Response will include a `token`. Use it in subsequent requests:
```bash
curl -H "Authorization: Bearer {TOKEN}" http://localhost:8000/api/v1/auth/me
```

### Create Category
```bash
curl -X POST http://localhost:8000/api/v1/categories \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Electronics",
    "description": "Electronic gadgets"
  }'
```

### Create Product
```bash
curl -X POST http://localhost:8000/api/v1/products \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "iPhone 15",
    "description": "Latest Apple iPhone",
    "price": 500000,
    "stock": 50,
    "category_id": 1
  }'
```

### Get Products
```bash
curl -H "Authorization: Bearer {TOKEN}" http://localhost:8000/api/v1/products
```

### Create Order
```bash
curl -X POST http://localhost:8000/api/v1/orders \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@test.com",
    "phone": "08012345678",
    "address": "123 Main St",
    "first_name": "Jane",
    "last_name": "Doe",
    "items": [{"product_id": 1, "quantity": 2}],
    "total": 1000000
  }'
```

## Postman Collection

Import the endpoints into Postman:
1. Create a new collection: "Chopify API"
2. Set variable `base_url` = `http://localhost:8000/api/v1`
3. Set variable `token` = (retrieved from login response)
4. Add requests for each endpoint above

## Expected Responses

- **Registration (201):** Returns user + token
- **Login (200):** Returns user + token
- **Protected endpoints (200):** Return resource data
- **Errors (4xx/5xx):** Return error message in `message` field
