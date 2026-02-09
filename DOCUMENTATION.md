# ChoppaShop Backend - Complete Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Database Schema](#database-schema)
4. [API Endpoints](#api-endpoints)
5. [Authentication](#authentication)
6. [Models & Relationships](#models--relationships)
7. [Integration Services](#integration-services)
8. [Development Guide](#development-guide)

## Project Overview

**ChoppaShop** is a Laravel-based e-commerce backend platform that enables users to create and manage online stores in minutes. It's designed to be:

- **User-Friendly**: Easy setup and management
- **Feature-Rich**: Products, orders, inventory, payments
- **Extensible**: Ready for integrations with social platforms and payment gateways
- **Scalable**: Built on Laravel with proper database design
- **API-First**: RESTful JSON API for all operations

### Key Features

✅ User registration and authentication (Sanctum tokens)
✅ Role-based access (admin/customer)
✅ Product management with categories
✅ Order management with multi-channel support (web, Instagram, WhatsApp)
✅ Real-time inventory tracking
✅ Payment status tracking
✅ Store customization
✅ API key management for integrations
✅ Domain management (subdomain/custom)
✅ Audit trails (inventory logs)

### Tech Stack

- **Framework**: Laravel 12
- **Database**: MySQL 8.0+
- **Authentication**: Laravel Sanctum
- **API**: RESTful JSON API
- **Payment Gateway**: Paystack (ready)
- **Social Integrations**: Instagram, WhatsApp (ready)
- **Domain Management**: CyberPanel API (ready)

## Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend Client                       │
│            (Web/Mobile/Third-party Tools)               │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP/JSON
                    ┌────▼───────────┐
                    │   API Gateway   │
                    │  (routes/api)   │
                    └────┬────────────┘
          ┌─────────────┼──────────────┐
          │             │              │
    ┌─────▼────┐  ┌────▼──────┐ ┌────▼──────┐
    │ Auth      │  │ Products  │ │ Orders    │
    │ Controller│  │Controller │ │Controller │
    └─────┬────┘  └────┬──────┘ └────┬──────┘
          │            │            │
          └────────┬───┴────────┬───┘
                   │            │
              ┌────▼────────────▼───┐
              │  Service Layer      │
              │ (Paystack,          │
              │  Instagram, etc)    │
              └────┬────────────┬───┘
                   │            │
              ┌────▼────────────▼──────────┐
              │    Model Layer (Eloquent)  │
              │ (User, Product, Order...)  │
              └────┬────────────┬──────────┘
                   │            │
              ┌────▼────────────▼──────────┐
              │     MySQL Database         │
              │ (tables, relationships)    │
              └────────────────────────────┘
```

### Request/Response Flow

```
Client Request
    │
    ▼
Route (routes/api.php)
    │
    ▼
Controller (Api/*)
    │ ├─ Validate Input
    │ └─ Check Authorization
    │
    ▼
Model/Service Layer
    │ ├─ Query Database
    │ ├─ Process Business Logic
    │ └─ Call External Services
    │
    ▼
Database Operations
    │ ├─ CRUD Operations
    │ └─ Transactions
    │
    ▼
API Response (JSON)
    │
    ▼
Client
```

## Database Schema

### User Management

#### `users` table
Primary user account and store information

| Column | Type | Details |
|--------|------|---------|
| id | bigint | Primary key |
| name | string | User full name |
| email | string | Unique email |
| password | string | Hashed password |
| role | enum | admin/customer |
| store_name | string | Store display name |
| store_slug | string | Unique store identifier |
| phone | string | Contact phone |
| about | text | Store description |
| logo_url | string | Store logo URL |
| banner_url | string | Store banner URL |
| whatsapp_number | string | WhatsApp integration |
| instagram_handle | string | Instagram handle |
| primary_domain | string | Main store domain |
| payment_methods | json | Available payment options |
| last_login_at | timestamp | Last login time |
| created_at | timestamp | Account creation |
| updated_at | timestamp | Last update |
| deleted_at | timestamp | Soft delete |

**Key Relationships:**
- 1 User → Many Products
- 1 User → Many Categories
- 1 User → Many Orders
- 1 User → 1 StoreSetting
- 1 User → Many ApiKeys
- 1 User → Many DomainRequests

### Product Catalog

#### `categories` table
Product categorization

| Column | Type | Details |
|--------|------|---------|
| id | bigint | Primary key |
| user_id | bigint | Owner |
| name | string | Category name |
| slug | string | URL-friendly identifier |
| description | text | Category description |
| image_url | string | Category image |
| sort_order | integer | Display order |
| is_active | boolean | Active status |

#### `products` table
Product inventory and details

| Column | Type | Details |
|--------|------|---------|
| id | bigint | Primary key |
| user_id | bigint | Store owner |
| category_id | bigint | Associated category |
| name | string | Product name |
| slug | string | URL-friendly name |
| description | text | Product description |
| price | decimal | Selling price |
| cost_price | decimal | Cost/wholesale price |
| quantity | integer | Current stock |
| low_stock_threshold | integer | Alert level |
| sku | string | Stock keeping unit |
| images | json | Product images array |
| instagram_product_id | string | Instagram sync ID |
| is_active | boolean | Listed status |
| is_featured | boolean | Featured on store |
| view_count | integer | Product views |
| metadata | json | Custom attributes |

**Key Relationships:**
- Many Products → 1 Category
- Many Products → 1 User
- 1 Product → Many OrderItems
- 1 Product → Many InventoryLogs

### Order Management

#### `orders` table
Order tracking with multi-channel support

| Column | Type | Details |
|--------|------|---------|
| id | bigint | Primary key |
| user_id | bigint | Store owner |
| order_number | string | Unique order ID |
| customer_name | string | Buyer name |
| customer_email | string | Buyer email |
| customer_phone | string | Buyer phone |
| status | enum | pending/processing/shipped/delivered/cancelled |
| payment_status | enum | unpaid/paid/refunded/failed |
| payment_method | enum | card/transfer/crypto/cash/whatsapp |
| subtotal | decimal | Items total |
| tax | decimal | Tax amount |
| shipping_cost | decimal | Shipping fee |
| total | decimal | Final amount |
| shipping_address | json | Delivery address |
| notes | text | Order notes |
| channel | enum | web/instagram/whatsapp |
| transaction_id | string | Payment reference |
| paid_at | timestamp | Payment time |
| shipped_at | timestamp | Shipment time |

#### `order_items` table
Individual items in orders

| Column | Type | Details |
|--------|------|---------|
| id | bigint | Primary key |
| order_id | bigint | Parent order |
| product_id | bigint | Product reference |
| product_name | string | Item name |
| unit_price | decimal | Price per unit |
| quantity | integer | Quantity ordered |
| subtotal | decimal | Line total |
| attributes | json | Size/color/variants |

**Key Relationships:**
- Many Orders → 1 User
- Many OrderItems → 1 Order
- Many OrderItems → 1 Product

### Inventory & Settings

#### `inventory_logs` table
Audit trail for all stock changes

| Column | Type | Details |
|--------|------|---------|
| id | bigint | Primary key |
| product_id | bigint | Product modified |
| user_id | bigint | Who made change |
| action | enum | add/remove/adjust/import |
| quantity_change | integer | Amount changed |
| quantity_before | integer | Previous quantity |
| quantity_after | integer | New quantity |
| reason | text | Change reason |
| metadata | json | Additional info |
| created_at | timestamp | When changed |

#### `store_settings` table
Per-store configuration

| Column | Type | Details |
|--------|------|---------|
| id | bigint | Primary key |
| user_id | bigint | Store owner |
| store_name | string | Display name |
| store_description | text | About store |
| business_info | json | Company details |
| shipping_settings | json | Shipping config |
| tax_settings | json | Tax configuration |
| email_templates | json | Email customization |
| auto_confirm_orders | boolean | Auto-confirmation |
| require_order_approval | boolean | Approval workflow |
| integrations | json | Integration settings |

#### `api_keys` table
Third-party API access

| Column | Type | Details |
|--------|------|---------|
| id | bigint | Primary key |
| user_id | bigint | Key owner |
| name | string | Key name |
| key | string | API key |
| secret | string | API secret |
| permissions | json | Allowed scopes |
| last_used_at | timestamp | Last usage |
| is_active | boolean | Active status |
| expires_at | timestamp | Expiration date |

#### `domain_requests` table
Domain/subdomain management

| Column | Type | Details |
|--------|------|---------|
| id | bigint | Primary key |
| user_id | bigint | Requester |
| requested_domain | string | Domain name |
| type | enum | subdomain/custom |
| status | enum | pending/available/taken/approved/active/failed |
| cyberpanel_domain_id | string | CyberPanel ID |
| cyberpanel_response | json | API response |
| error_message | text | Error details |
| checked_at | timestamp | Check time |
| activated_at | timestamp | Activation time |

## API Endpoints

### Base URL
```
http://localhost:8000/api/v1
```

### Authentication Endpoints

#### Register New User
```
POST /auth/register

Request:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "store_name": "My Shop"
}

Response (201):
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { /* user object */ },
    "token": "auth_token_here"
  }
}
```

#### Login
```
POST /auth/login

Request:
{
  "email": "john@example.com",
  "password": "password123"
}

Response (200):
{
  "success": true,
  "message": "Logged in successfully",
  "data": {
    "user": { /* user object */ },
    "token": "auth_token_here"
  }
}
```

#### Logout
```
POST /auth/logout
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### Get Current User
```
GET /auth/me
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "message": "Success",
  "data": { /* user object */ }
}
```

### Product Endpoints

#### List Products
```
GET /products?page=1&per_page=15&search=name&category_id=1&is_active=true
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": [/* products */],
  "pagination": { /* pagination info */ }
}
```

#### Create Product
```
POST /products
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "name": "iPhone 15",
  "description": "Latest Apple phone",
  "price": 999.99,
  "cost_price": 500,
  "quantity": 50,
  "category_id": 1,
  "sku": "IP15-001",
  "images": ["url1", "url2"],
  "low_stock_threshold": 5
}

Response (201):
{
  "success": true,
  "message": "Product created successfully",
  "data": { /* product object */ }
}
```

#### Get Product
```
GET /products/{id}
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": { /* product object */ }
}
```

#### Update Product
```
PUT /products/{id}
Authorization: Bearer {token}
Content-Type: application/json

Response (200):
{
  "success": true,
  "message": "Product updated successfully",
  "data": { /* updated product */ }
}
```

#### Delete Product
```
DELETE /products/{id}
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "message": "Product deleted successfully"
}
```

#### Get Low Stock Products
```
GET /products/low-stock
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": [/* low stock products */],
  "pagination": { /* pagination */ }
}
```

#### Adjust Stock
```
POST /products/{id}/adjust-stock
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "quantity": 10,
  "reason": "Restock from supplier"
}

Response (200):
{
  "success": true,
  "message": "Stock adjusted successfully",
  "data": { /* updated product */ }
}
```

### Category Endpoints

#### List Categories
```
GET /categories
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": [/* categories */]
}
```

#### Create Category
```
POST /categories
Authorization: Bearer {token}

Request:
{
  "name": "Electronics",
  "description": "Electronic products",
  "image_url": "https://...",
  "sort_order": 1
}

Response (201):
{
  "success": true,
  "message": "Category created successfully",
  "data": { /* category */ }
}
```

#### Update Category
```
PUT /categories/{id}
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "message": "Category updated successfully",
  "data": { /* updated category */ }
}
```

#### Delete Category
```
DELETE /categories/{id}
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "message": "Category deleted successfully"
}
```

### Order Endpoints

#### List Orders
```
GET /orders?page=1&status=pending&payment_status=unpaid&channel=web&search=ORD
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": [/* orders with items */],
  "pagination": { /* pagination */ }
}
```

#### Create Order
```
POST /orders
Authorization: Bearer {token}

Request:
{
  "customer_name": "Ahmed Hassan",
  "customer_email": "ahmed@example.com",
  "customer_phone": "+2348012345678",
  "channel": "web",
  "items": [
    {
      "product_id": 1,
      "quantity": 2,
      "attributes": { "color": "black", "size": "L" }
    }
  ],
  "shipping_address": {
    "street": "123 Main Street",
    "city": "Lagos",
    "state": "Lagos",
    "postal_code": "100001"
  },
  "notes": "Handle with care"
}

Response (201):
{
  "success": true,
  "message": "Order created successfully",
  "data": { /* order with items */ }
}
```

#### Get Order
```
GET /orders/{id}
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": { /* order with items */ }
}
```

#### Update Order Status
```
PUT /orders/{id}/status
Authorization: Bearer {token}

Request:
{
  "status": "processing"
}

Valid statuses: pending, processing, shipped, delivered, cancelled

Response (200):
{
  "success": true,
  "message": "Order status updated",
  "data": { /* updated order */ }
}
```

#### Mark Order as Paid
```
POST /orders/{id}/mark-as-paid
Authorization: Bearer {token}

Request:
{
  "payment_method": "card",
  "transaction_id": "TRX-123456"
}

Valid methods: card, transfer, crypto, cash, whatsapp

Response (200):
{
  "success": true,
  "message": "Order marked as paid",
  "data": { /* updated order */ }
}
```

#### Order Statistics
```
GET /orders/statistics
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": {
    "total_orders": 50,
    "pending_orders": 5,
    "paid_orders": 45,
    "total_revenue": 45000.00,
    "orders_by_channel": {
      "web": 30,
      "instagram": 15,
      "whatsapp": 5
    }
  }
}
```

## Authentication

### Sanctum Token Authentication

ChoppaShop uses Laravel Sanctum for stateless API authentication.

**How it works:**

1. User registers or logs in
2. Server returns API token
3. Client includes token in `Authorization` header
4. Server validates token on each request
5. User ID is available via `auth()->user()`

**Token Usage:**
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

**Token Management:**
- Tokens are created on login/register
- One token per login (can be multiple per user)
- Tokens have no expiration by default
- Client can revoke by calling logout endpoint
- Tokens are stored in `personal_access_tokens` table

### Authorization Model

- **Authentication**: All `/api/v1` routes (except register/login) require valid token
- **Authorization**: Users can only access their own resources
- **Role-based**: Admin role available for future admin features

Example authorization check in controller:
```php
// User can only see their own products
if ($product->user_id !== $request->user()->id) {
    return $this->error('Not found', null, 404);
}
```

## Models & Relationships

### User Model

```php
// Relationships
$user->products()          // HasMany
$user->categories()        // HasMany
$user->orders()            // HasMany
$user->storeSetting()      // HasOne
$user->apiKeys()           // HasMany
$user->domainRequests()    // HasMany
$user->inventoryLogs()     // HasMany

// Methods
$user->isAdmin()           // bool
$user->isCustomer()        // bool
$user->hasStore()          // bool
$user->updateLastLogin()   // void
```

### Product Model

```php
// Relationships
$product->user()           // BelongsTo
$product->category()       // BelongsTo
$product->orderItems()     // HasMany
$product->inventoryLogs()  // HasMany

// Scopes
$product->active()         // Only active
$product->featured()       // Only featured
$product->lowStock()       // Below threshold

// Methods
$product->isInStock()      // bool
$product->isLowStock()     // bool
$product->getProfit()      // float
$product->adjustStock($qty, $action, $reason) // void
```

### Order Model

```php
// Relationships
$order->user()             // BelongsTo
$order->items()            // HasMany OrderItems

// Scopes
$order->pending()
$order->processing()
$order->paid()
$order->unpaid()
$order->whatsapp()
$order->instagram()

// Methods
$order->markAsPaid($method, $txnId)  // void
$order->markAsShipped()              // void
$order->cancel()                     // void
$order->isPaid()                     // bool
$order->isPending()                  // bool
```

## Integration Services

### PaystackService

```php
use App\Services\PaystackService;

$service = new PaystackService();

// Initialize payment
$service->initializeTransaction($email, $amount, $reference, $metadata);

// Verify payment
$service->verifyTransaction($reference);

// Transfer funds
$service->createTransfer($recipient, $amount, $reason);

// Manage recipients
$service->createTransferRecipient($type, $accountNumber, $bankCode, $name);

// Get banks list
$service->getBanks($country);
```

### InstagramService

```php
use App\Services\InstagramService;

$service = new InstagramService();

// Get business account
$service->getBusinessAccount($businessAccountId);

// Get products from catalog
$service->getProducts($businessAccountId);

// Get specific product
$service->getProduct($productId);

// Create product
$service->createProduct($catalogId, $productData);

// Update product
$service->updateProduct($productId, $productData);
```

### WhatsAppService

```php
use App\Services\WhatsAppService;

$service = new WhatsAppService();

// Send text
$service->sendTextMessage($phone, $message);

// Send template message
$service->sendTemplateMessage($phone, $template, $language, $parameters);

// Send media
$service->sendMediaMessage($phone, $type, $mediaUrl);

// Send interactive buttons
$service->sendButtonMessage($phone, $bodyText, $buttons);

// Upload media
$service->uploadMedia($filePath, $type);
```

### CyberPanelService

```php
use App\Services\CyberPanelService;

$service = new CyberPanelService();

// Check availability
$service->checkDomainAvailability($domain);

// Create subdomain
$service->createSubdomain($subdomain, $parentDomain, $accountId);

// Add custom domain
$service->addCustomDomain($domain, $accountId, $dnsRecords);

// Manage DNS
$service->getDNSRecords($domain);
$service->updateDNSRecord($domain, $recordId, $data);

// SSL management
$service->enableSSL($domain);
$service->getSSLStatus($domain);
```

## Development Guide

### Adding a New Feature

#### 1. Create Migration
```bash
php artisan make:migration create_features_table
```

#### 2. Create Model
```bash
php artisan make:model Feature
```

#### 3. Create Controller
```bash
php artisan make:controller Api/FeatureController
```

#### 4. Update Routes
Add to `routes/api.php`:
```php
Route::apiResource('features', FeatureController::class);
```

#### 5. Write Tests
```bash
php artisan make:test FeatureTest
```

### Best Practices

1. **Always validate input** using Laravel's validation
2. **Check authorization** before returning data
3. **Use relationships** for loading related data
4. **Log important actions** for auditing
5. **Return consistent responses** using ApiController methods
6. **Use transactions** for operations affecting multiple tables
7. **Implement soft deletes** for important data
8. **Add timestamps** to track creation and updates
9. **Use JSON fields** for flexible data structure
10. **Index frequently queried columns**

### Testing

```bash
# Run all tests
php artisan test

# Run specific test
php artisan test tests/Feature/OrderTest.php

# With coverage
php artisan test --coverage
```

### Code Quality

```bash
# Check code style
composer pint --check

# Fix code style
composer pint
```

### Debugging

```bash
# Use Tinker for interactive shell
php artisan tinker

# Example:
>>> $user = User::find(1);
>>> $user->products()->count();
```

---

**Last Updated**: February 8, 2026
**Version**: 1.0.0
