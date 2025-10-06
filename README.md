# redis-cache-demo

Node.js + Express app demonstrating Redis caching with invalidation for GET/POST/PUT/DELETE on /items, using in-memory data. Includes example, requirements, and setup instructions (Masai Level 0 assignment)

## Features

- ✅ RESTful API with Express.js
- ✅ Redis caching implementation
- ✅ Cache invalidation on data modifications
- ✅ In-memory data storage
- ✅ Full CRUD operations for items
- ✅ Detailed console logging for cache hits/misses

## Prerequisites

Before running this application, make sure you have the following installed:

- Node.js (v14 or higher)
- Redis Server (v6 or higher)
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone https://github.com/aryansri9936/redis-cache-demo.git
cd redis-cache-demo
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:

Create a `.env` file in the root directory or use the provided sample:
```env
REDIS_URL=redis://localhost:6379
PORT=3000
```

## Running Redis Server

Make sure Redis is running on your system:

**macOS (using Homebrew):**
```bash
brew services start redis
```

**Linux:**
```bash
sudo systemctl start redis
```

**Windows:**
```bash
redis-server
```

Or use Docker:
```bash
docker run -d -p 6379:6379 redis:alpine
```

## Running the Application

### Development mode (with auto-reload):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

The server will start on `http://localhost:3000` (or the PORT specified in .env)

## API Documentation

### Base URL
```
http://localhost:3000
```

### Endpoints

#### 1. Get All Items
**Endpoint:** `GET /items`

**Description:** Retrieves all items. Uses Redis cache if available.

**Response:**
```json
{
  "source": "cache" | "database",
  "data": [
    {
      "id": 1,
      "name": "Item 1",
      "description": "First item"
    },
    ...
  ]
}
```

**Example:**
```bash
curl http://localhost:3000/items
```

#### 2. Get Item by ID
**Endpoint:** `GET /items/:id`

**Description:** Retrieves a specific item by ID.

**Response:**
```json
{
  "id": 1,
  "name": "Item 1",
  "description": "First item"
}
```

**Example:**
```bash
curl http://localhost:3000/items/1
```

#### 3. Create New Item
**Endpoint:** `POST /items`

**Description:** Creates a new item and invalidates the cache.

**Request Body:**
```json
{
  "name": "New Item",
  "description": "Description of new item"
}
```

**Response:**
```json
{
  "id": 4,
  "name": "New Item",
  "description": "Description of new item"
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/items \
  -H "Content-Type: application/json" \
  -d '{"name": "New Item", "description": "Description of new item"}'
```

#### 4. Update Item
**Endpoint:** `PUT /items/:id`

**Description:** Updates an existing item and invalidates the cache.

**Request Body:**
```json
{
  "name": "Updated Item",
  "description": "Updated description"
}
```

**Response:**
```json
{
  "id": 1,
  "name": "Updated Item",
  "description": "Updated description"
}
```

**Example:**
```bash
curl -X PUT http://localhost:3000/items/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "Updated Item", "description": "Updated description"}'
```

#### 5. Delete Item
**Endpoint:** `DELETE /items/:id`

**Description:** Deletes an item and invalidates the cache.

**Response:**
```json
{
  "message": "Item deleted successfully",
  "item": {
    "id": 1,
    "name": "Item 1",
    "description": "First item"
  }
}
```

**Example:**
```bash
curl -X DELETE http://localhost:3000/items/1
```

## Testing the Cache

1. **First request (Cache Miss):**
```bash
curl http://localhost:3000/items
```
Console output: `Cache MISS - Fetching from data store`

2. **Second request (Cache Hit):**
```bash
curl http://localhost:3000/items
```
Console output: `Cache HIT - Returning cached data`

3. **After modification (Cache Invalidation):**
```bash
curl -X POST http://localhost:3000/items \
  -H "Content-Type: application/json" \
  -d '{"name": "Test", "description": "Test item"}'
```
Console output: `Cache invalidated after POST`

## Project Structure

```
redis-cache-demo/
├── server.js          # Main application file with Express routes
├── data.js            # In-memory data store and CRUD functions
├── package.json       # Project dependencies and scripts
├── .env               # Environment variables (not committed)
└── README.md          # This file
```

## Cache Strategy

- **Cache Key:** `items`
- **Cache Expiry:** 3600 seconds (1 hour)
- **Invalidation:** Automatic on POST, PUT, and DELETE operations
- **Cache Source:** Response includes `source` field indicating "cache" or "database"

## Logging

The application provides detailed console logs:
- ✅ Redis connection status
- ✅ Cache HIT/MISS indicators
- ✅ Cache invalidation notifications
- ✅ Error messages with context

## Technologies Used

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Redis** - In-memory data store for caching
- **dotenv** - Environment variable management
- **nodemon** - Development auto-reload

## License

ISC

## Author

aryansri9936

## Assignment Details

This project is part of the Masai Level 0 assignment demonstrating:
- Redis caching implementation
- Cache invalidation strategies
- RESTful API design
- CRUD operations
- Error handling
