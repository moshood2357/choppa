# Chopify Storefront

Next.js-based customer storefront for the Chopify e-commerce platform.

## Features

- Browse products
- Add to cart
- Checkout flow
- Responsive design with Tailwind CSS
- Integration with Laravel backend API

## Setup

1. Copy `.env.local.example` to `.env.local` and update API URL if needed
2. Install dependencies: `npm install`
3. Start dev server: `npm run dev`
4. Visit http://localhost:3000

## Environment Variables

- `NEXT_PUBLIC_API_URL` - Backend API base URL (default: http://localhost:8000/api/v1)

## Build for Production

```bash
npm run build
npm start
```
