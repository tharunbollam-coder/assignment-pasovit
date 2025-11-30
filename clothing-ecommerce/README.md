# Clothing E-commerce Application

A full-stack e-commerce web application for a fictional clothing brand built with the MERN stack (MongoDB, Express.js, React, Node.js).

## Features

### User Authentication
- User registration and login
- JWT-based authentication with HTTP-only cookies
- Protected routes and middleware
- Password hashing with bcrypt

### Product Management
- Product browsing with search functionality
- Advanced filtering (category, size, price range)
- Pagination
- Product details page
- 20+ pre-seeded products

### Shopping Cart
- Works for both guest and logged-in users
- Local storage for guest carts
- Database sync for logged-in users
- Add, update, and remove cart items
- Real-time cart updates

### Order Management
- Mock checkout process
- Order creation and management
- Stock validation
- Order confirmation emails via Nodemailer
- Order history tracking

### Frontend Features
- Responsive design
- React Context for state management
- React Router for navigation
- Modern UI with CSS-in-JS
- Loading states and error handling

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Nodemailer** - Email service
- **cookie-parser** - Cookie handling
- **cors** - Cross-origin resource sharing

### Frontend
- **React** - UI library
- **React Router** - Navigation
- **Axios** - HTTP client
- **CSS-in-JS** - Styling

## Project Structure

```
clothing-ecommerce/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── cartController.js
│   │   └── orderController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Cart.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── cartRoutes.js
│   │   └── orderRoutes.js
│   ├── utils/
│   │   └── sendEmail.js
│   ├── seedProducts.js
│   ├── server.js
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── Filters.jsx
│   │   │   └── CartItem.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── CartContext.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   └── OrderSuccess.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   └── package.json
│
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd clothing-ecommerce
```

### 2. Backend Setup

#### Navigate to backend directory
```bash
cd backend
```

#### Install dependencies
```bash
npm install
```

#### Environment Variables
Create a `.env` file in the backend directory with the following:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_strong_secret_key_here_change_this_in_production
NODE_ENV=development
EMAIL_USER=yourgmail@gmail.com
EMAIL_PASS=your_app_password
```

#### Database Setup
1. Set up MongoDB (local or MongoDB Atlas)
2. Update `MONGO_URI` in `.env` with your connection string

#### Seed Products
```bash
node seedProducts.js
```

#### Start Backend Server
```bash
npm run dev
```

### 3. Frontend Setup

#### Navigate to frontend directory
```bash
cd ../frontend
```

#### Install dependencies
```bash
npm install
```

#### Start Frontend Development Server
```bash
npm run dev
```

## Usage

### Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### Default Features
- Browse products without authentication
- Register for an account or login
- Add items to cart (works for guests and logged-in users)
- Proceed to checkout (requires authentication)
- Receive order confirmation emails

### Email Configuration
For order confirmation emails to work:
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password from Google Account settings
3. Update `EMAIL_USER` and `EMAIL_PASS` in the `.env` file

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get products with filtering and pagination
- `GET /api/products/:id` - Get single product
- `GET /api/products/categories` - Get all categories
- `GET /api/products/sizes` - Get all sizes

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item
- `DELETE /api/cart/remove` - Remove item from cart
- `DELETE /api/cart/clear` - Clear cart

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get single order

## Features Demonstration

### Product Filtering
```javascript
// Example API call with filters
GET /api/products?category=Men&size=L&minPrice=20&maxPrice=100&page=1&limit=10&search=denim
```

### Cart Operations
- Guest carts are stored in localStorage
- Logged-in user carts are stored in MongoDB
- Cart sync happens automatically on login

### Order Process
1. Add items to cart
2. Proceed to checkout
3. Fill shipping and payment information
4. Place order
5. Receive confirmation email
6. View order details

## Development

### Available Scripts

#### Backend
```bash
npm start      # Start production server
npm run dev    # Start development server with nodemon
```

#### Frontend
```bash
npm run dev    # Start development server
npm run build  # Build for production
npm run preview # Preview production build
```

### Environment Variables
Make sure to set the following environment variables:

**Backend (.env)**
- `PORT` - Server port (default: 5000)
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - JWT secret key
- `NODE_ENV` - Environment (development/production)
- `EMAIL_USER` - Gmail address for notifications
- `EMAIL_PASS` - Gmail app password

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For any questions or issues, please contact the development team or create an issue in the repository.

## Future Enhancements

- Payment gateway integration (Stripe, PayPal)
- Admin dashboard for product management
- Product reviews and ratings
- Wishlist functionality
- Order tracking
- Social media authentication
- Advanced search with autocomplete
- Product recommendations
- Discount and coupon system
