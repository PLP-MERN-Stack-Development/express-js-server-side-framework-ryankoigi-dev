# 🧩 Express.js RESTful Product API

A complete RESTful API built with **Node.js** and **Express.js**, implementing CRUD operations, middleware, and error handling for a `products` resource.  
This assignment fulfills all requirements for **Week 2 – Express.js RESTful API Project**.

---

## 📘 Table of Contents
1. [Overview](#overview)
2. [Features](#features)
3. [Project Structure](#project-structure)
4. [Setup & Installation](#setup--installation)
5. [Environment Variables](#environment-variables)
6. [Running the Server](#running-the-server)
7. [API Endpoints](#api-endpoints)
8. [Request & Response Examples](#request--response-examples)
9. [Middleware Implemented](#middleware-implemented)
10. [Error Handling](#error-handling)
11. [Testing with Postman](#testing-with-postman)
12. [License](#license)

---

## 🧾 Overview
This API allows users to **manage products** using RESTful principles.  
It supports:
- Listing all products with search, filtering, and pagination  
- Creating, updating, and deleting products (with API key authentication)  
- Retrieving product statistics by category  
- Structured error handling and modular middleware

---

## ⚙️ Features
✅ RESTful CRUD operations (`GET`, `POST`, `PUT`, `DELETE`)  
✅ Custom middleware for logging, validation, and authentication  
✅ Global error handling with descriptive messages  
✅ Pagination, filtering, and search support  
✅ Category-based product statistics  
✅ Environment variable configuration  
✅ Modular folder structure for scalability  

---

## 🧱 Project Structure
```

📂 express-product-api
├── server.js
├── routes/
│   └── products.js
├── middleware/
│   ├── logger.js
│   ├── auth.js
│   ├── validateProduct.js
│   └── errorHandler.js
├── errors/
│   ├── NotFoundError.js
│   └── ValidationError.js
├── data/
│   └── products.js
├── .env.example
├── .gitignore
└── README.md

````

---

## 🧩 Setup & Installation

### 1️⃣ Clone the Repository
```bash
git clone <your-github-classroom-repo-url>
cd express-product-api
````

### 2️⃣ Install Dependencies

```bash
npm install express body-parser uuid dotenv
```

### 3️⃣ Environment Setup

Create a `.env` file in your root directory:

```bash
PORT=3000
API_KEY=my-secret-key
```

You can use `.env.example` as a reference.

---

## 🖥️ Running the Server

Start the API server:

```bash
npm start
```

By default, it runs on:

```
http://localhost:3000
```

---

## 🌐 API Endpoints

| Method     | Endpoint                    | Description                                            | Auth Required |
| ---------- | --------------------------- | ------------------------------------------------------ | ------------- |
| **GET**    | `/api/products`             | Get all products (supports filter, search, pagination) | ❌             |
| **GET**    | `/api/products/:id`         | Get a specific product by ID                           | ❌             |
| **POST**   | `/api/products`             | Create a new product                                   | ✅             |
| **PUT**    | `/api/products/:id`         | Update an existing product                             | ✅             |
| **DELETE** | `/api/products/:id`         | Delete a product                                       | ✅             |
| **GET**    | `/api/products/stats/count` | Get product count by category                          | ❌             |

---

## 📤 Request & Response Examples

### ➕ Create a New Product

**Request**

```http
POST /api/products
Headers:
  Content-Type: application/json
  x-api-key: my-secret-key
Body:
{
  "name": "Tablet",
  "description": "10-inch display tablet",
  "price": 450,
  "category": "electronics",
  "inStock": true
}
```

**Response**

```json
{
  "id": "b5a82e7c-21ef-4f5d-bf49-fb79d6b2b231",
  "name": "Tablet",
  "description": "10-inch display tablet",
  "price": 450,
  "category": "electronics",
  "inStock": true
}
```

---

### 🧾 Get All Products (With Filters)

**Request**

```http
GET /api/products?category=electronics&page=1&limit=2&search=laptop
```

**Response**

```json
{
  "total": 2,
  "page": 1,
  "limit": 2,
  "data": [
    {
      "id": "1",
      "name": "Laptop",
      "description": "High-performance laptop with 16GB RAM",
      "price": 1200,
      "category": "electronics",
      "inStock": true
    }
  ]
}
```

---

### 🔁 Update a Product

**Request**

```http
PUT /api/products/1
Headers:
  x-api-key: my-secret-key
Body:
{
  "name": "Gaming Laptop",
  "description": "High-end gaming laptop with RTX GPU",
  "price": 1500,
  "category": "electronics",
  "inStock": true
}
```

**Response**

```json
{
  "id": "1",
  "name": "Gaming Laptop",
  "description": "High-end gaming laptop with RTX GPU",
  "price": 1500,
  "category": "electronics",
  "inStock": true
}
```

---

### 🗑️ Delete a Product

**Request**

```http
DELETE /api/products/2
Headers:
  x-api-key: my-secret-key
```

**Response**

```json
{
  "message": "Product deleted successfully",
  "deleted": [
    {
      "id": "2",
      "name": "Smartphone",
      "description": "Latest model with 128GB storage",
      "price": 800,
      "category": "electronics",
      "inStock": true
    }
  ]
}
```

---

### 📊 Product Statistics

**Request**

```http
GET /api/products/stats/count
```

**Response**

```json
{
  "totalProducts": 3,
  "countByCategory": {
    "electronics": 2,
    "kitchen": 1
  }
}
```

---

## ⚙️ Middleware Implemented

| Middleware             | Description                             |
| ---------------------- | --------------------------------------- |
| **logger.js**          | Logs request method, URL, and timestamp |
| **auth.js**            | Validates API key for protected routes  |
| **validateProduct.js** | Checks product fields and data types    |
| **errorHandler.js**    | Handles all application errors globally |

---

## ❗ Error Handling

The API uses custom error classes and global error middleware.

### Example Errors

| Type                | Status | Example Message                               |
| ------------------- | ------ | --------------------------------------------- |
| **NotFoundError**   | 404    | `"Product not found"`                         |
| **ValidationError** | 400    | `"Validation Error: Missing required fields"` |
| **Unauthorized**    | 401    | `"Unauthorized: Missing or invalid API key"`  |

All error responses follow this JSON structure:

```json
{
  "error": "ErrorType",
  "message": "Descriptive error message"
}
```

---

## 🧪 Testing with Postman or curl

### Using Postman:

1. Import your API URL: `http://localhost:3000`
2. Set headers where necessary:

   ```
   x-api-key: my-secret-key
   Content-Type: application/json
   ```
3. Test CRUD operations.

### Using curl:

```bash
curl -X GET http://localhost:3000/api/products
curl -X POST -H "x-api-key: my-secret-key" -H "Content-Type: application/json" \
-d '{"name":"Mouse","description":"Wireless mouse","price":20,"category":"electronics","inStock":true}' \
http://localhost:3000/api/products
```

---

## 🧰 Technologies Used

* **Node.js v18+**
* **Express.js**
* **UUID** for product IDs
* **dotenv** for environment variables
* **body-parser** for parsing JSON bodies

---

## 🧾 License

This project is for educational purposes under the **GitHub Classroom Assignment** for the Express.js RESTful API module.
You are free to modify and extend it for learning or portfolio use.

---

## 👨‍💻 Author

**Ryan Koigi Njuguna**
Software  Development
Power Learn Project Africa
📧 [ryankoigi64@gmail.com](mailto:ryankoigi64@gmail.com)

