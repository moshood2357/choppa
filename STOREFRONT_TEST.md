# Storefront Testing Checklist

Run this test with all three services running:
1. Backend: `php artisan serve` (port 8000)
2. Admin: `npm run dev` in `frontend/admin` (port 5173)  
3. Storefront: `npm run dev` in `frontend/storefront` (port 3000)

## Test Steps

### Step 1: Create Test Data (via Admin)
- [ ] Go to http://localhost:5173/login
- [ ] Login with your admin credentials
- [ ] Go to Categories page, create a test category (e.g., "Test Products")
- [ ] Go to Products page, add a product:
  - Name: "Test Product"
  - Price: 5000
  - Quantity: 10
  - Category: "Test Products"
  - Click Save

### Step 2: Browse Storefront (Customer View)
- [ ] Go to http://localhost:3000
- [ ] You should see the test product in the grid
- [ ] Product card shows name, price, stock count
- [ ] Click on product to view details

### Step 3: Add to Cart
- [ ] On product detail page, change quantity to 2
- [ ] Click "Add to Cart"
- [ ] Should see success message
- [ ] Header cart badge should show "2"
- [ ] Click "Cart" in header to view cart page

### Step 4: View Cart
- [ ] Cart page shows the product with quantity 2
- [ ] Total is calculated correctly (5000 * 2 = 10,000)
- [ ] Can change quantity
- [ ] Can remove item
- [ ] "Proceed to Checkout" button visible

### Step 5: Checkout
- [ ] Click "Proceed to Checkout"
- [ ] Fill in form:
  - First Name: John
  - Last Name: Doe
  - Email: john@example.com
  - Phone: 08012345678
  - Address: 123 Main St, Lagos
- [ ] Click "Place Order"
- [ ] Should see success with order ID

### Step 6: Verify Order in Admin
- [ ] Go back to admin http://localhost:5173/orders
- [ ] Click on the order that just appeared
- [ ] Verify customer details match
- [ ] Verify order items and total are correct
- [ ] Try changing order status to "processing"

## Known Issues & Fixes

If products don't show:
- Check browser console for network errors
- Verify backend is running and has products
- Check NEXT_PUBLIC_API_URL env var

If cart doesn't persist:
- Check browser localStorage in DevTools
- Clear cache and reload

If checkout fails:
- Check form validation errors
- Verify backend /orders endpoint accepts the payload
