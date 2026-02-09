# API Testing Guide

The automated test script requires the backend to be running. Here's how to test the API:

## Step 1: Start the Backend

```bash
cd c:\Users\USER\chopify\chopa-chop
php artisan serve
```

The server will run on **http://localhost:8000**

## Step 2: Test Endpoints with cURL

Open a new PowerShell terminal and run these commands:

### 1. Register a new user
```powershell
$body = @{
    name = "John Doe"
    email = "john@example.com"
    password = "password123"
    password_confirmation = "password123"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8000/api/v1/auth/register" `
  -Method POST `
  -Headers @{"Content-Type" = "application/json"} `
  -Body $body
```

**Expected:** 201 Created with user data and token

### 2. Login
```powershell
$body = @{
    email = "john@example.com"
    password = "password123"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:8000/api/v1/auth/login" `
  -Method POST `
  -Headers @{"Content-Type" = "application/json"} `
  -Body $body

$token = ($response.Content | ConvertFrom-Json).token
Write-Host "Token: $token"
```

**Save the token** — you'll need it for protected routes.

### 3. Get Current User (Protected)
```powershell
$token = "YOUR_TOKEN_HERE"

Invoke-WebRequest -Uri "http://localhost:8000/api/v1/auth/me" `
  -Method GET `
  -Headers @{"Authorization" = "Bearer $token"}
```

### 4. Create a Category
```powershell
$token = "YOUR_TOKEN_HERE"
$body = @{
    name = "Electronics"
    description = "Electronic gadgets"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:8000/api/v1/categories" `
  -Method POST `
  -Headers @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
  } `
  -Body $body

$response.Content | ConvertFrom-Json
```

### 5. Create a Product
```powershell
$token = "YOUR_TOKEN_HERE"
$body = @{
    name = "iPhone 15"
    description = "Latest Apple iPhone"
    price = 500000
    stock = 50
    category_id = 1
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:8000/api/v1/products" `
  -Method POST `
  -Headers @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
  } `
  -Body $body

$response.Content | ConvertFrom-Json
```

### 6. Get All Products (Protected)
```powershell
$token = "YOUR_TOKEN_HERE"

$response = Invoke-WebRequest -Uri "http://localhost:8000/api/v1/products" `
  -Method GET `
  -Headers @{"Authorization" = "Bearer $token"}

$response.Content | ConvertFrom-Json
```

### 7. Get Single Product (Protected)
```powershell
$token = "YOUR_TOKEN_HERE"
$productId = 1  # Change this to actual product ID

$response = Invoke-WebRequest -Uri "http://localhost:8000/api/v1/products/$productId" `
  -Method GET `
  -Headers @{"Authorization" = "Bearer $token"}

$response.Content | ConvertFrom-Json
```

### 8. Create an Order (Protected)
```powershell
$token = "YOUR_TOKEN_HERE"
$body = @{
    email = "customer@test.com"
    phone = "08012345678"
    address = "123 Main Street, Lagos"
    first_name = "Jane"
    last_name = "Doe"
    items = @(
        @{ product_id = 1; quantity = 2 }
    )
    total = 1000000
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:8000/api/v1/orders" `
  -Method POST `
  -Headers @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
  } `
  -Body $body

$response.Content | ConvertFrom-Json
```

### 9. Get All Orders (Protected)
```powershell
$token = "YOUR_TOKEN_HERE"

$response = Invoke-WebRequest -Uri "http://localhost:8000/api/v1/orders" `
  -Method GET `
  -Headers @{"Authorization" = "Bearer $token"}

$response.Content | ConvertFrom-Json
```

### 10. Update Order Status (Protected)
```powershell
$token = "YOUR_TOKEN_HERE"
$orderId = 1  # Change to actual order ID

$body = @{
    status = "processing"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:8000/api/v1/orders/$orderId/status" `
  -Method PUT `
  -Headers @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
  } `
  -Body $body

$response.Content | ConvertFrom-Json
```

### 11. Logout (Protected)
```powershell
$token = "YOUR_TOKEN_HERE"

Invoke-WebRequest -Uri "http://localhost:8000/api/v1/auth/logout" `
  -Method POST `
  -Headers @{"Authorization" = "Bearer $token"}
```

## Using Node Test Script

Once the backend is running, you can also run:
```bash
node test-api.js
```

This will automatically test all endpoints in sequence.

## Expected Status Codes

| Endpoint | Method | Auth | Success | Error |
|----------|--------|------|---------|-------|
| `/auth/register` | POST | No | 201 | 422 (validation) |
| `/auth/login` | POST | No | 200 | 401 (invalid) |
| `/auth/logout` | POST | Yes | 200 | 401 |
| `/auth/me` | GET | Yes | 200 | 401 |
| `/categories` | GET | Yes | 200 | 401 |
| `/categories` | POST | Yes | 201 | 422 |
| `/products` | GET | Yes | 200 | 401 |
| `/products` | POST | Yes | 201 | 422 |
| `/products/{id}` | GET | Yes | 200 | 404 |
| `/orders` | GET | Yes | 200 | 401 |
| `/orders` | POST | Yes | 201 | 422 |
| `/orders/{id}` | GET | Yes | 200 | 404 |
| `/orders/{id}/status` | PUT | Yes | 200 | 404 |

## Troubleshooting

### Connection Refused
- Make sure Laravel is running: `php artisan serve`
- Check port 8000 is not already in use

### 401 Unauthorized
- Token expired or invalid
- Missing `Authorization: Bearer {token}` header
- Token from wrong endpoint

### 422 Unprocessable Entity
- Missing required fields
- Invalid field format
- Check field validation rules in controller

### CORS Errors (from frontend)
- Configure CORS in `config/cors.php` if not already set
- Or test with Postman/cURL first to rule out CORS
