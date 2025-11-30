const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const products = [
  {
    name: "Classic White T-Shirt",
    description: "Comfortable cotton t-shirt perfect for everyday wear",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
    category: "Men",
    sizes: ["S", "M", "L", "XL"],
    stock: 50
  },
  {
    name: "Denim Jacket",
    description: "Classic denim jacket with modern fit",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1594634319156-319c9a82198f?w=500",
    category: "Men",
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: 30
  },
  {
    name: "Black Hoodie",
    description: "Cozy hoodie perfect for cold weather",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1556821840-3a63f9560941?w=500",
    category: "Men",
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: 40
  },
  {
    name: "Slim Fit Jeans",
    description: "Modern slim fit jeans with stretch",
    price: 69.99,
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500",
    category: "Men",
    sizes: ["28", "30", "32", "34", "36"],
    stock: 35
  },
  {
    name: "Summer Dress",
    description: "Light and breezy summer dress",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=500",
    category: "Women",
    sizes: ["XS", "S", "M", "L", "XL"],
    stock: 25
  },
  {
    name: "Women's Blazer",
    description: "Professional blazer for business casual",
    price: 119.99,
    image: "https://images.unsplash.com/photo-1594634319156-319c9a82198f?w=500",
    category: "Women",
    sizes: ["XS", "S", "M", "L", "XL"],
    stock: 20
  },
  {
    name: "Yoga Leggings",
    description: "High-waisted leggings perfect for workout",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500",
    category: "Women",
    sizes: ["XS", "S", "M", "L", "XL"],
    stock: 45
  },
  {
    name: "Kids Rainbow T-Shirt",
    description: "Colorful t-shirt for kids",
    price: 15.99,
    image: "https://images.unsplash.com/photo-1516478177764-9fe5ae0e4443?w=500",
    category: "Kids",
    sizes: ["XS", "S", "M", "L"],
    stock: 60
  },
  {
    name: "Kids Denim Shorts",
    description: "Comfortable denim shorts for active kids",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500",
    category: "Kids",
    sizes: ["XS", "S", "M", "L"],
    stock: 40
  },
  {
    name: "Baseball Cap",
    description: "Classic baseball cap with adjustable strap",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1521319422675-83cb779e0c69?w=500",
    category: "Accessories",
    sizes: ["OS"],
    stock: 100
  },
  {
    name: "Leather Belt",
    description: "Genuine leather belt with classic buckle",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500",
    category: "Accessories",
    sizes: ["S", "M", "L"],
    stock: 50
  },
  {
    name: "Wool Scarf",
    description: "Warm wool scarf for winter",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500",
    category: "Accessories",
    sizes: ["OS"],
    stock: 30
  },
  {
    name: "Polo Shirt",
    description: "Classic polo shirt for casual wear",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500",
    category: "Men",
    sizes: ["S", "M", "L", "XL"],
    stock: 35
  },
  {
    name: "Winter Coat",
    description: "Warm winter coat with hood",
    price: 149.99,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500",
    category: "Women",
    sizes: ["XS", "S", "M", "L", "XL"],
    stock: 25
  },
  {
    name: "Kids Hoodie",
    description: "Cozy hoodie for kids",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1556821840-3a63f9560941?w=500",
    category: "Kids",
    sizes: ["XS", "S", "M", "L"],
    stock: 45
  },
  {
    name: "Sunglasses",
    description: "Stylish sunglasses with UV protection",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8f?w=500",
    category: "Accessories",
    sizes: ["OS"],
    stock: 80
  },
  {
    name: "Backpack",
    description: "Durable backpack for school or travel",
    price: 44.99,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
    category: "Accessories",
    sizes: ["OS"],
    stock: 35
  },
  {
    name: "Women's Top",
    description: "Casual top perfect for everyday wear",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500",
    category: "Women",
    sizes: ["XS", "S", "M", "L", "XL"],
    stock: 40
  },
  {
    name: "Men's Shorts",
    description: "Comfortable shorts for summer",
    price: 32.99,
    image: "https://images.unsplash.com/photo-1594634319156-319c9a82198f?w=500",
    category: "Men",
    sizes: ["S", "M", "L", "XL"],
    stock: 30
  },
  {
    name: "Kids T-Shirt Set",
    description: "Pack of 3 colorful t-shirts for kids",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1516478177764-9fe5ae0e4443?w=500",
    category: "Kids",
    sizes: ["XS", "S", "M", "L"],
    stock: 25
  },
  {
    name: "Wrist Watch",
    description: "Classic analog watch",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
    category: "Accessories",
    sizes: ["OS"],
    stock: 40
  }
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await Product.deleteMany();
    console.log('Cleared existing products');

    await Product.insertMany(products);
    console.log('Products seeded successfully');

    mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts();
