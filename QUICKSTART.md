# ChoppaShop Backend - Quick Start Guide

## 5-Minute Setup

### Prerequisites
- PHP 8.2+
- MySQL 8.0+
- Composer
- Node.js (for assets)

### Step 1: Initial Setup
```bash
cd chopa-chop

# Install dependencies
composer install
npm install

# Copy environment
cp .env.example .env

# Generate key
php artisan key:generate
```

### Step 2: Database Configuration
Edit `.env`:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=chopa_shop
DB_USERNAME=root
DB_PASSWORD=
```

### Step 3: Database Setup
```bash
# Create database
mysql -u root -p -e "CREATE DATABASE chopa_shop;"

# Run migrations
php artisan migrate
```

### Step 4: Start Server
```bash
# Terminal 1: Start Laravel server
php artisan serve

# Terminal 2: Start Vite (for assets)
npm run dev
```

API is now available at: `http://localhost:8000/api/v1`

## Testing the API

### 1. Register a User
```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "password_confirmation": "password123",
    "store_name": "My Awesome Store"
  }'
```

Response:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "store_name": "My Awesome Store",
      "store_slug": "my-awesome-store",
      ...
    },
    "token": "YOUR_API_TOKEN_HERE"
  }
}
```

### 2. Login
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 3. Get Your Profile (requires token)
```bash
curl -X GET http://localhost:8000/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 4. Create a Category
```bash
curl -X POST http://localhost:8000/api/v1/categories \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Electronics",
    "description": "Electronic products",
    "sort_order": 1
  }'
```

### 5. Create a Product
```bash
curl -X POST http://localhost:8000/api/v1/products \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "iPhone 15 Pro",
    "description": "Latest Apple smartphone",
    "price": 999.99,
    "cost_price": 500.00,
    "quantity": 50,
    "category_id": 1,
    "sku": "IP15PRO-001",
    "low_stock_threshold": 5
  }'
```

### 6. Create an Order
```bash
curl -X POST http://localhost:8000/api/v1/orders \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "customer_name": "Ahmed Hassan",
    "customer_email": "ahmed@example.com",
    "customer_phone": "+2348012345678",
    "channel": "web",
    "items": [
      {
        "product_id": 1,
        "quantity": 2,
        "attributes": {}
      }
    ],
    "shipping_address": {
      "street": "123 Main Street",
      "city": "Lagos",
      "state": "Lagos",
      "postal_code": "100001"
    }
  }'
```

### 7. Mark Order as Paid
```bash
curl -X POST http://localhost:8000/api/v1/orders/1/mark-as-paid \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "payment_method": "card",
    "transaction_id": "TRX-123456"
  }'
```

### 8. Get Order Statistics
```bash
curl -X GET http://localhost:8000/api/v1/orders/statistics \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Project Structure

```
app/
├── Http/Controllers/Api/     # API Controllers
│   ├── ApiController.php      # Base controller with response methods
│   ├── AuthController.php     # Authentication (register/login)
│   ├── ProductController.php  # Product CRUD
│   ├── CategoryController.php # Category CRUD
│   └── OrderController.php    # Order management
├── Models/                    # Eloquent models
│   ├── User.php
│   ├── Product.php
│   ├── Order.php
│   ├── Category.php
│   └── ... (other models)
└── Services/                  # External service integrations
    ├── PaystackService.php
    ├── InstagramService.php
    ├── WhatsAppService.php
    └── CyberPanelService.php

database/
├── migrations/               # Database migrations
├── seeders/                 # Database seeders
└── factories/               # Model factories for testing

routes/
├── api.php                  # API routes (all endpoints)
└── web.php                  # Web routes

config/
├── services.php             # Third-party service credentials
└── database.php             # Database configuration
```

## Common Commands

### Artisan Commands
```bash
# Serve application
php artisan serve

# Database
php artisan migrate                 # Run migrations
php artisan migrate:fresh           # Reset database
php artisan db:seed                 # Seed database
php artisan tinker                  # Interactive shell

# Testing
php artisan test                    # Run tests
php artisan test --coverage         # With code coverage

# Code Quality
composer pint                       # Fix code style

# Generate Code
php artisan make:migration name     # Create migration
php artisan make:model ModelName    # Create model
php artisan make:controller CtrlName # Create controller
php artisan make:test TestName      # Create test
```

## Integrations Setup

### Paystack
1. Create account at https://paystack.com
2. Get your Secret Key from dashboard
3. Add to `.env`:
```env
PAYSTACK_SECRET_KEY=sk_live_xxxxx
PAYSTACK_PUBLIC_KEY=pk_live_xxxxx
```

### Instagram
1. Create Instagram Business App
2. Get access token and business account ID
3. Add to `.env`:
```env
INSTAGRAM_API_TOKEN=your_token_here
INSTAGRAM_BUSINESS_ACCOUNT_ID=your_id_here
```

### WhatsApp
1. Create WhatsApp Business account
2. Get phone number ID and access token
3. Add to `.env`:
```env
WHATSAPP_API_TOKEN=your_token_here
WHATSAPP_PHONE_NUMBER_ID=your_id_here
WHATSAPP_BUSINESS_ACCOUNT_ID=your_id_here
```

### CyberPanel
1. Set up CyberPanel on your server
2. Generate API token
3. Add to `.env`:
```env
CYBERPANEL_BASE_URL=https://your-cyberpanel.com
CYBERPANEL_API_TOKEN=your_token_here
```

## Database Backup

```bash
# Backup database
mysqldump -u root -p chopa_shop > backup.sql

# Restore database
mysql -u root -p chopa_shop < backup.sql
```

## Deployment

### Production Checklist
- [ ] Set `APP_DEBUG=false` in `.env`
- [ ] Set `APP_ENV=production` in `.env`
- [ ] Generate new `APP_KEY`
- [ ] Run migrations on production database
- [ ] Set up CORS for frontend domain
- [ ] Configure SSL/HTTPS
- [ ] Set up proper file permissions
- [ ] Configure error logging
- [ ] Set up database backups
- [ ] Monitor API performance

### Environment Setup
```bash
# Production .env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-domain.com

DB_CONNECTION=mysql
DB_HOST=your-db-host
DB_DATABASE=chopa_shop
DB_USERNAME=secure_user
DB_PASSWORD=strong_password

PAYSTACK_SECRET_KEY=sk_live_xxxxx
INSTAGRAM_API_TOKEN=...
WHATSAPP_API_TOKEN=...
CYBERPANEL_API_TOKEN=...
```

## Troubleshooting

### Database Connection Error
```bash
# Check MySQL is running
# Update DB credentials in .env
# Verify database exists

php artisan tinker
>>> DB::connection()->getPdo();
```

### Migration Errors
```bash
# Clear config cache
php artisan config:clear

# Rollback migrations
php artisan migrate:rollback

# Re-run migrations
php artisan migrate
```

### API Token Issues
```bash
# Clear Sanctum tokens
php artisan tinker
>>> DB::table('personal_access_tokens')->truncate();
```

### File Permission Issues
```bash
# Fix storage permissions (Linux)
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

## Need Help?

- **Documentation**: See [DOCUMENTATION.md](DOCUMENTATION.md)
- **Setup Guide**: See [SETUP.md](SETUP.md)
- **Laravel Docs**: https://laravel.com/docs
- **Sanctum**: https://laravel.com/docs/sanctum

---

Happy coding! 🚀
