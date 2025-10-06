require('dotenv').config();
const express = require('express');
const redis = require('redis');
const { getAllItems, getItemById, createItem, updateItem, deleteItem } = require('./data');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Redis client setup
const redisClient = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => console.error('Redis Client Error:', err));
redisClient.on('connect', () => console.log('Connected to Redis'));

// Connect to Redis
(async () => {
  await redisClient.connect();
})();

const CACHE_KEY = 'items';
const CACHE_EXPIRY = 3600; // 1 hour

// GET /items - Retrieve all items (with caching)
app.get('/items', async (req, res) => {
  try {
    // Try to get from cache
    const cachedData = await redisClient.get(CACHE_KEY);
    
    if (cachedData) {
      console.log('Cache HIT - Returning cached data');
      return res.json({
        source: 'cache',
        data: JSON.parse(cachedData)
      });
    }
    
    // Cache miss - get from data store
    console.log('Cache MISS - Fetching from data store');
    const items = getAllItems();
    
    // Store in cache
    await redisClient.setEx(CACHE_KEY, CACHE_EXPIRY, JSON.stringify(items));
    console.log('Data cached successfully');
    
    res.json({
      source: 'database',
      data: items
    });
  } catch (error) {
    console.error('Error in GET /items:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /items/:id - Retrieve a single item
app.get('/items/:id', async (req, res) => {
  try {
    const item = getItemById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    res.json(item);
  } catch (error) {
    console.error('Error in GET /items/:id:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /items - Create a new item (invalidate cache)
app.post('/items', async (req, res) => {
  try {
    const { name, description } = req.body;
    
    if (!name || !description) {
      return res.status(400).json({ error: 'Name and description are required' });
    }
    
    const newItem = createItem({ name, description });
    
    // Invalidate cache
    await redisClient.del(CACHE_KEY);
    console.log('Cache invalidated after POST');
    
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error in POST /items:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /items/:id - Update an item (invalidate cache)
app.put('/items/:id', async (req, res) => {
  try {
    const { name, description } = req.body;
    
    if (!name || !description) {
      return res.status(400).json({ error: 'Name and description are required' });
    }
    
    const updatedItem = updateItem(req.params.id, { name, description });
    
    if (!updatedItem) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    // Invalidate cache
    await redisClient.del(CACHE_KEY);
    console.log('Cache invalidated after PUT');
    
    res.json(updatedItem);
  } catch (error) {
    console.error('Error in PUT /items/:id:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /items/:id - Delete an item (invalidate cache)
app.delete('/items/:id', async (req, res) => {
  try {
    const deletedItem = deleteItem(req.params.id);
    
    if (!deletedItem) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    // Invalidate cache
    await redisClient.del(CACHE_KEY);
    console.log('Cache invalidated after DELETE');
    
    res.json({ message: 'Item deleted successfully', item: deletedItem });
  } catch (error) {
    console.error('Error in DELETE /items/:id:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
