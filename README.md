# 🚴 VeloFlow - Full-Stack E-Commerce & Bike Management Platform

VeloFlow is a full-stack e-commerce platform designed for bicycle retailers. It combines a modern customer storefront with an administration dashboard for products, inventory, orders, reviews, and business analytics.

## 🛠️ Tech Stack

### Backend
- Laravel 11
- Laravel Sanctum
- Spatie Permission
- PostgreSQL
- DomPDF

### Frontend
- Next.js
- App Router
- TypeScript
- Tailwind CSS
- Zustand
- Axios
- Lucide React

## 🚀 Key Features

### 🛒 Customer Storefront

- Browse bicycles by category
- Product search and filtering
- Product details with variants
- Bike frame size and color selection
- Shopping cart management
- Coupon validation
- Secure checkout
- Stock management during checkout
- Customer order history
- PDF invoice download
- Product reviews and ratings

### 📊 Admin Dashboard

- Product management
- Order management
- Inventory monitoring
- Stock updates
- Order status management
- Sales analytics
- Revenue statistics
- Order statistics
- Abandoned cart monitoring

### 🔐 Security

- Laravel Sanctum authentication
- Role-based authorization with Spatie Permission
- API rate limiting
- Login brute-force protection
- Protected admin routes
- Form Request validation
- Database transactions during checkout
- Pessimistic locking for product variants

## 🏗️ Project Structure

```text
velo-web/
├── backend/
│   ├── app/
│   ├── database/
│   ├── routes/
│   └── ...
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   └── store/
│   ├── public/
│   └── package.json
│
└── README.md
```

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/MalakMessaoudi/velo-web.git
cd velo-web
```

### 2. Backend Setup

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

Configure your PostgreSQL database in the `.env` file.

Then run:

```bash
php artisan migrate --seed
php artisan serve
```

Backend API:

```text
http://127.0.0.1:8000
```

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
```

Create a `.env.local` file inside the `frontend` folder:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
```

Then start the frontend:

```bash
npm run dev
```

Frontend:

```text
http://localhost:3000
```

## 🔑 Authentication

The application uses Laravel Sanctum for API authentication.

Protected requests use:

```text
Authorization: Bearer <token>
```

## 🛡️ API Rate Limiting

Authentication endpoints are protected with rate limiting to reduce brute-force attacks.

- Login: 5 requests per minute
- Registration: 10 requests per minute

## 👨‍💻 Author

**Malak Messaoudi**

Full-Stack Web Developer

GitHub: https://github.com/MalakMessaoudi