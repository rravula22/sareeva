# Sareeva

Sareeva is a full-stack saree e-commerce storefront and seller platform built with Next.js App Router. It delivers a polished shopping experience for buyers, plus catalog and order management tools for marketplace sellers.

## Tech Stack

- Next.js 14+ App Router with TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL / Neon
- NextAuth v5
- Zustand
- Cloudinary
- bcryptjs

## Features

- Myntra-inspired customer storefront for sarees
- Product listing, product detail, cart, wishlist, and checkout flows
- Credentials-based authentication for buyers and sellers
- Seller dashboard with catalog, orders, and stats
- Prisma schema for users, carts, orders, wishlists, reviews, and seller profiles
- Cloudinary-based image uploads for seller catalog management

## Setup

1. Clone the repository:

```bash
git clone <your-repo-url>
cd sareeva
```

2. Install dependencies:

```bash
npm install
```

3. Copy environment values:

```bash
cp .env.example .env
```

4. Update `.env` with your PostgreSQL, NextAuth, and Cloudinary credentials.

5. Generate the Prisma client and run migrations:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

6. Seed the database:

```bash
npx tsx prisma/seed.ts
```

7. Start the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Default Seed Accounts

- Admin: `admin@sareeva.com` / `admin123`
- Seller: `seller@sareeva.com` / `seller123`

## Seller Registration Flow

1. Open `/auth/register`
2. Choose **I want to sell**
3. Enter your store name
4. Submit registration
5. Log in and access `/seller`

## Deployment

### Vercel

1. Push the repository to GitHub.
2. Import the project into Vercel.
3. Add the environment variables from `.env.example`.
4. Run migrations on your production PostgreSQL / Neon database.
5. Deploy.

### Neon / PostgreSQL

- Create a PostgreSQL database.
- Copy the connection string into `DATABASE_URL`.
- Ensure SSL is enabled for hosted environments.

## Notes

- Product images are configured for Cloudinary and other remote hosts.
- Checkout uses a demo payment flow and is ready for Razorpay integration.
- Seller tools are protected with role-based access in middleware and server layouts.
