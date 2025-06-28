import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Enhanced CORS configuration
const corsOptions = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions)); // Apply CORS with options
app.options('*', cors(corsOptions)); // Enable preflight for all routes

app.use(express.json());

const uri = process.env.MONGO_URI;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Define schema + model
const orderSchema = new mongoose.Schema({
  logs: [
  {
    note: { type: String, required: true },
    category: { type: String, required: true },
    createdBy: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
],
pharmacyRemarks: [
  {
    remark: { type: String, required: true },
    createdBy: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  }
]
}, { collection: 'orders', strict: false });
const Order = mongoose.model('Order', orderSchema);

// API endpoints
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find({ product: 'pharmacyjpmc' });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/customers', async (req, res) => {
  try {
    const customers = await Order.aggregate([
      { $match: { product: 'pharmacyjpmc' } },
      { 
        $group: {
          _id: {
            receiverName: "$receiverName",
            patientNumber: "$patientNumber"
          },
          totalOrders: { $sum: 1 },
          lastOrderDate: { $max: "$creationDate" },
          firstOrderDate: { $min: "$creationDate" }
        }
      },
      {
        $project: {
          _id: 0,
          receiverName: "$_id.receiverName",
          patientNumber: "$_id.patientNumber",
          totalOrders: 1,
          lastOrderDate: 1,
          firstOrderDate: 1
        }
      },
      { $sort: { receiverName: 1 } }
    ]);
    
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/customers/:patientNumber/orders', async (req, res) => {
  try {
    const { patientNumber } = req.params;
    const orders = await Order.find({ 
      product: 'pharmacyjpmc',
      patientNumber: patientNumber 
    }).sort({ creationDate: -1 });
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/orders/:id/collection-date', async (req, res) => {
  try {
    const { id } = req.params;
    const { collectionDate } = req.body;

    console.log(`Updating collection date for order ${id} to ${collectionDate}`);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.error('Invalid ID format:', id);
      return res.status(400).json({ 
        error: 'Invalid order ID format',
        receivedId: id
      });
    }

    if (!collectionDate) {
      return res.status(400).json({ error: 'collectionDate is required' });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { 
        collectionDate: new Date(collectionDate),
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!updatedOrder) {
      console.error('Order not found with ID:', id);
      return res.status(404).json({ 
        error: 'Order not found',
        orderId: id
      });
    }

    console.log('Successfully updated order:', updatedOrder._id);
    res.json(updatedOrder);

  } catch (error) {
    console.error('Server error updating collection date:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

app.get('/api/collection-dates', async (req, res) => {
  try {
    const dates = await Order.aggregate([
      { 
        $match: { 
          collectionDate: { $exists: true, $ne: null },
          product: 'pharmacyjpmc'
        } 
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$collectionDate" } },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          dateString: "$_id",
          date: { $toDate: "$_id" },
          orderCount: "$count",
          _id: 0
        }
      },
      { $sort: { date: 1 } }
    ]);
    
    res.json(dates);
  } catch (error) {
    console.error('Error fetching collection dates:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get orders for a specific collection date
app.get('/api/orders/collection-dates', async (req, res) => {
  try {
    const { date } = req.query;
    
    if (!date) {
      return res.status(400).json({ error: 'Date parameter is required' });
    }

    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);
    
    const orders = await Order.find({
      collectionDate: {
        $gte: startDate,
        $lt: endDate
      },
      product: 'pharmacyjpmc'
    }).sort({ collectionDate: 1 });

    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders for date:', error);
    res.status(500).json({ error: error.message });
  }
});

// Additional endpoint to get a specific order
app.get('/api/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid order ID' });
    }

    const order = await Order.findById(id);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/orders/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid order ID' });
    }

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { 
        status: status,
        updatedAt: new Date()
      },
      { new: true, runValidators: false }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ 
      success: true, 
      message: 'Order status updated successfully',
      order: updatedOrder 
    });

  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/orders/:id/logs', async (req, res) => {
  const { id } = req.params;
  const { note, category, createdBy } = req.body;

  if (!note || !category || !createdBy) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    const logEntry = {
      note,
      category,
      createdBy,
      createdAt: new Date(),
    };

    order.logs.push(logEntry);
    await order.save();

    res.status(201).json({ message: 'Log added successfully', log: logEntry });
  } catch (err) {
    console.error(err); // <- Add this to see error in terminal
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/orders/:id/pharmacy-remarks', async (req, res) => {
  const { id } = req.params;
  const { remark, createdBy } = req.body;

  if (!remark || !createdBy) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    const entry = {
      remark,
      createdBy,
      createdAt: new Date(),
    };

    order.pharmacyRemarks.push(entry);
    await order.save();

    res.status(201).json({ message: 'Remark added', remark: entry });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


const port = process.env.PORT || 5050;
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});