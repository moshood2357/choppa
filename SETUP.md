# ChoppaShop Backend - Setup & Architecture

## Overview

ChoppaShop is a Laravel-based e-commerce backend platform designed to help users create and manage online stores in minutes. It supports product management, order handling, inventory tracking, and integrations with popular social platforms.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│           API Client (Web/Mobile/Third-party)          │
└────────────────────────┬────────────────────────────────┘
                         │
                ┌────────▼───────────┐
                │   API Routes       │
                │   (routes/api.php) │
                └────────┬───────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
   ┌────▼──────┐ ┌─────▼──────┐ ┌──────▼────┐
   │ Auth       │ │ Products   │ │ Orders    │
   │ Controller │ │ Controller │ │Controller │
   └────┬──────┘ └─────┬──────┘ └──────┬────┘
        │              │               │
        │         ┌────▼──────┬────────▼──┐
        │         │ Models    │           │
        │    ┌────┼───────────┼────┐      │
        │    │    │           │    │      │
      ┌─▼────▼─┐ ┌───┐ ┌────┐ ┌──▼──┐ ┌─┴──┐
      │ User   │ │Cat│ │Prod│ │Order│ │Inv │
      │ Model  │ │ego│ │uct │ │     │ │Log │
      └────────┘ └───┘ └────┘ └─────┘ └────┘
        │              │
        └──────┬───────┘
               │
        ┌──────▼────────┐
        │  MySQL DB     │
        └───────────────┘
```

## Database Schema

### Core Tables

#### users
- User accounts with store information
- Fields: id, name, email, password, role, store_name, store_slug, phone, about, logo_url, banner_url, whatsapp_number, instagram_handle, primary_domain, payment_methods, last_login_at, timestamps

#### products
- Product catalog
- Fields: id, user_id, category_id, name, slug, description, price, cost_price, quantity, sku, images (JSON), instagram_product_id, is_active, is_featured, view_count, metadata (JSON)

#### categories
- Product categories
- Fields: id, user_id, name, slug, description, image_url, sort_order, is_active

#### orders
- Order records with multi-channel support
- Fields: id, user_id, order_number, customer_name, customer_email, customer_phone, status, payment_status, payment_method, subtotal, tax, shipping_cost, total, shipping_address (JSON), notes, channel (web/instagram/whatsapp), transaction_id, timestamps

#### order_items
- Items within orders
- Fields: id, order_id, product_id, product_name, unit_price, quantity, subtotal, attributes (JSON)

#### inventory_logs
- Audit trail for stock changes
- Fields: id, product_id, user_id, action, quantity_change, quantity_before, quantity_after, reason

#### store_settings
- Per-store configuration
- Fields: id, user_id, store_name, store_description, business_info, shipping_settings, tax_settings, email_templates, auto_confirm_orders, require_order_approval, integrations

#### api_keys
- API tokens for third-party integrations
- Fields: id, user_id, name, key, secret, permissions (JSON), last_used_at, is_active, expires_at

#### domain_requests
- Domain/subdomain management
- Fields: id, user_id, requested_domain, type, status, cyberpanel_domain_id, cyberpanel_response, error_message, checked_at, activated_at

## Setup Instructions

### 1. Environment Configuration

```bash
# Copy environment file
cp .env.example .env

# Edit .env with your database credentials
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=chopa_shop
DB_USERNAME=root
DB_PASSWORD=
```

### 2. Dependencies Installation

```bash
# Install PHP dependencies
composer install

# Install Node dependencies
npm install

# Generate application key
php artisan key:generate

# Publish Sanctum configuration
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
```

### 3. Database Setup

```bash
# Create database
mysql -u root -p -e "CREATE DATABASE chopa_shop;"

# Run migrations
php artisan migrate

# Seed initial data (optional)
php artisan db:seed
```

### 4. Start Development Server

```bash
# Using composer
composer dev

# Or manually
php artisan serve
# And in another terminal
npm run dev
```

The API will be available at `http://localhost:8000/api/v1`

## API Structure

### Authentication Endpoints

```
POST   /api/v1/auth/register    - Register new user
POST   /api/v1/auth/login       - Login user
POST   /api/v1/auth/logout      - Logout (requires auth)
GET    /api/v1/auth/me          - Get current user (requires auth)
```

### Product Endpoints (All require auth)

```
GET    /api/v1/products                    - List products
POST   /api/v1/products                    - Create product
GET    /api/v1/products/{id}               - Get product
PUT    /api/v1/products/{id}               - Update product
DELETE /api/v1/products/{id}               - Delete product
GET    /api/v1/products/low-stock          - Get low stock items
POST   /api/v1/products/{id}/adjust-stock  - Adjust inventory
```

### Category Endpoints (All require auth)

```
GET    /api/v1/categories        - List categories
POST   /api/v1/categories        - Create category
PUT    /api/v1/categories/{id}   - Update category
DELETE /api/v1/categories/{id}   - Delete category
```

### Order Endpoints (All require auth)

```
GET    /api/v1/orders                     - List orders
POST   /api/v1/orders                     - Create order
GET    /api/v1/orders/{id}                - Get order details
PUT    /api/v1/orders/{id}/status         - Update status
POST   /api/v1/orders/{id}/mark-as-paid   - Mark as paid
GET    /api/v1/orders/statistics          - Get order stats
```

## Authentication Flow

1. **Register**: POST /api/v1/auth/register
   - Creates new user with customer role
   - Auto-generates store slug
   - Creates store settings
   - Returns auth token

2. **Login**: POST /api/v1/auth/login
   - Validates credentials
   - Updates last_login_at
   - Returns auth token

3. **API Requests**: Use Bearer token in Authorization header
   ```
   Authorization: Bearer YOUR_TOKEN_HERE
   ```

## Key Features by Module

### Products
- CRUD operations with category linking
- Stock management with inventory logs
- Featured products support
- Low stock threshold alerts
- Instagram product ID tracking (for future imports)
- View count tracking

### Orders
- Multi-channel support (web, Instagram, WhatsApp)
- Order status tracking (pending, processing, shipped, delivered, cancelled)
- Payment status tracking (unpaid, paid, refunded, failed)
- Multiple payment methods (card, transfer, crypto, cash, WhatsApp)
- Customer information storage
- Shipping address management
- Line-item tracking with attributes

### Inventory
- Real-time stock tracking
- Automatic inventory adjustment on order creation
- Complete audit trail with InventoryLog
- Stock threshold alerts

### Store Management
- Customizable store settings
- Business information storage
- Shipping configuration
- Tax settings
- Email template management
- Integration configuration

## Security Features

- **Authentication**: Laravel Sanctum for token-based API auth
- **Authorization**: User-scoped data (users only see their own resources)
- **Password Hashing**: bcrypt with configurable rounds
- **Data Validation**: Comprehensive request validation
- **Soft Deletes**: Data recovery capability
- **CORS**: Configurable cross-origin requests

## Development Workflow

### Adding New Features

1. Create migration: `php artisan make:migration create_table_name`
2. Create model: `php artisan make:model ModelName`
3. Create controller: `php artisan make:controller Api/ControllerName`
4. Add routes in `routes/api.php`
5. Write tests: `php artisan make:test TestName`

### Running Tests

```bash
php artisan test
```

### Code Quality

```bash
# PHP code style check/fix
composer pint

# Type checking with Psalm (optional)
./vendor/bin/psalm
```

## File Structure

```
app/
├── Http/
│   └── Controllers/
│       └── Api/
│           ├── ApiController.php      (Base controller)
│           ├── AuthController.php     (Authentication)
│           ├── ProductController.php  (Products)
│           ├── CategoryController.php (Categories)
│           └── OrderController.php    (Orders)
├── Models/
│   ├── User.php
│   ├── Product.php
│   ├── Category.php
│   ├── Order.php
│   ├── OrderItem.php
│   ├── InventoryLog.php
│   ├── StoreSetting.php
│   ├── ApiKey.php
│   └── DomainRequest.php
└── Services/
    ├── PaymentService.php        (To be implemented)
    ├── InstagramService.php      (To be implemented)
    ├── WhatsAppService.php       (To be implemented)
    └── CyberPanelService.php     (To be implemented)

database/
├── migrations/
│   ├── users/orders/products
│   ├── categories
│   ├── inventory
│   ├── settings
│   └── integrations
└── seeders/

routes/
├── api.php        (API routes)
└── web.php        (Frontend routes)

resources/
├── css/
├── js/
└── views/
```

## Next Development Phases

### Phase 2: Integrations
- [ ] Paystack payment integration
- [ ] Instagram product import
- [ ] WhatsApp order notifications
- [ ] CyberPanel domain API

### Phase 3: Advanced Features
- [ ] Bulk product import (CSV/Excel)
- [ ] Order invoice generation (PDF)
- [ ] Email notification templates
- [ ] Customer management
- [ ] Analytics & reporting

### Phase 4: Frontend
- [ ] Admin dashboard (React/Vue)
- [ ] Store frontend template
- [ ] Mobile app

## Environment Variables

Key environment variables to configure:

```env
APP_NAME=ChoppaShop
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com

DB_CONNECTION=mysql
DB_HOST=localhost
DB_DATABASE=chopa_shop
DB_USERNAME=
DB_PASSWORD=

MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=
MAIL_PASSWORD=

PAYSTACK_SECRET_KEY=
PAYSTACK_PUBLIC_KEY=

INSTAGRAM_API_TOKEN=
INSTAGRAM_BUSINESS_ACCOUNT_ID=

WHATSAPP_API_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=

CYBERPANEL_API_TOKEN=
CYBERPANEL_BASE_URL=https://cyberpanel.yourhost.com
```

## Common Issues & Solutions

### CORS Errors
- Configure CORS in `config/cors.php`
- Add frontend domain to allowed origins

### Database Connection Fails
- Verify MySQL is running
- Check database credentials in .env
- Ensure database exists

### Migration Errors
- Clear config cache: `php artisan config:clear`
- Check for duplicate migration names
- Verify column syntax

## Support & Documentation

- Laravel Documentation: https://laravel.com/docs
- Sanctum Documentation: https://laravel.com/docs/sanctum
- Eloquent Documentation: https://laravel.com/docs/eloquent
