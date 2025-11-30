const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const sendOrderEmail = require('../utils/sendEmail');

const createOrder = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Check stock using populated data (no extra queries)
    for (const item of cart.items) {
      if (item.product.stock < item.qty) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${item.product.name}. Only ${item.product.stock} available.` 
        });
      }
    }

    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      name: item.product.name,
      size: item.size,
      qty: item.qty,
      price: item.product.price
    }));

    const totalPrice = orderItems.reduce((total, item) => total + (item.price * item.qty), 0);

    // Create order and update stock in parallel
    const bulkUpdates = cart.items.map(item => ({
      updateOne: {
        filter: { _id: item.product._id },
        update: { $inc: { stock: -item.qty } }
      }
    }));

    const [order] = await Promise.all([
      Order.create({
        user: req.user._id,
        items: orderItems,
        totalPrice
      }),
      // Bulk update stock
      Product.bulkWrite(bulkUpdates),
      // Clear cart
      Cart.findOneAndUpdate(
        { user: req.user._id },
        { $set: { items: [] } }
      )
    ]);

    const populatedOrder = await Order.findById(order._id).populate('user', 'name email');

    // Send email asynchronously (non-blocking)
    setImmediate(async () => {
      try {
        await sendOrderEmail(populatedOrder, populatedOrder.user);
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
      }
    });

    res.status(201).json(populatedOrder);
  } catch (error) {
    next(error);
  }
};

const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ orderDate: -1 })
      .populate('items.product', 'name image');

    res.json(orders);
  } catch (error) {
    next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.product', 'name image');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById
};
