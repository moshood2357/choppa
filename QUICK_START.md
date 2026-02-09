# Quick Startup Guide

To run the full Chopify stack locally:

## Terminal 1: Backend (Laravel)
```bash
cd c:\Users\USER\chopify\chopa-chop
php artisan serve
# Runs at http://localhost:8000
```

## Terminal 2: Admin Dashboard
```bash
cd c:\Users\USER\chopify\chopa-chop\frontend\admin
npm install  # first time only
npm run dev
# Runs at http://localhost:5173
```

## Terminal 3: Customer Storefront
```bash
cd c:\Users\USER\chopify\chopa-chop\frontend\storefront
npm install  # first time only
npm run dev
# Runs at http://localhost:3000
```

## Access Points
- **Admin**: http://localhost:5173/login
- **Storefront**: http://localhost:3000
- **API**: http://localhost:8000/api/v1

## Quick Test Flow
1. Create a category in admin → go to Categories
2. Create a product in admin → go to Products
3. Browse product on storefront → http://localhost:3000
4. Add to cart → click Cart in header
5. Checkout → fill form, place order
6. View order in admin → go to Orders

See STOREFRONT_TEST.md for detailed test steps.
