# ShopSmart Backend — AI Shopping Assistant API

Node.js + Express + MongoDB (MERN) backend for the ShopSmart frontend. Implements
authentication, product CRUD, keyword search/filtering, rule-based AI natural-language
search, per-user cart & wishlist, and history-based product recommendations.

## Tech Stack
- Node.js / Express 4
- MongoDB / Mongoose
- JWT auth (`jsonwebtoken`) + `bcryptjs` password hashing
- `express-validator` for input validation
- `express-rate-limit` on auth routes
- Centralized error handling middleware

## Getting Started

```bash
npm install
cp .env.example .env   # then fill in MONGO_URI and JWT_SECRET
npm run dev             # nodemon, or `npm start` for plain node
node seed.js             # optional: populate the DB with sample products
```

Server runs on `http://localhost:5000` by default. Point the frontend's
`src/services/api.js` `BASE_URL` at `http://localhost:5000/api/products` (or
your deployed URL) to replace the mock endpoints.

## Environment Variables (`.env`)
| Key | Description |
|---|---|
| `PORT` | Port to run the server on (default 5000) |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret used to sign JWTs |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `7d` |
| `CLIENT_ORIGIN` | Deployed frontend origin, used for CORS in production |

## API Endpoints

### Auth
| Method | Endpoint | Access | Body |
|---|---|---|---|
| POST | `/api/auth/signup` | Public | `{ name, email, password, mobile?, dob? }` |
| POST | `/api/auth/login` | Public | `{ email, password }` |
| GET | `/api/auth/me` | Protected | — |

### Products
| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/products` | Protected |
| GET | `/api/products?category=&minPrice=&maxPrice=&sort=&page=&limit=` | Public |
| GET | `/api/products/:id` | Public |
| PUT | `/api/products/:id` | Protected |
| DELETE | `/api/products/:id` | Protected |
| GET | `/api/products/search?q=keyword` | Public |
| GET | `/api/categories` | Public |

### AI Search
| Method | Endpoint | Access | Body |
|---|---|---|---|
| POST | `/api/ai-search` | Public | `{ query: "budget laptop under ₹40,000 with best battery" }` |

### Cart (all Protected — send `Authorization: Bearer <token>`)
| Method | Endpoint | Body |
|---|---|---|
| POST | `/api/cart` | `{ productId, quantity }` |
| GET | `/api/cart` | — |
| PUT | `/api/cart/:productId` | `{ quantity }` |
| DELETE | `/api/cart/:productId` | — |

### Wishlist (all Protected)
| Method | Endpoint | Body |
|---|---|---|
| POST | `/api/wishlist` | `{ productId }` |
| GET | `/api/wishlist` | — |
| DELETE | `/api/wishlist/:productId` | — |

### Recommendations (all Protected)
| Method | Endpoint | Body |
|---|---|---|
| POST | `/api/history/view` | `{ productId }` |
| GET | `/api/recommendations` | — |

## Response Shape
All responses follow: `{ success: boolean, message?: string, data: ... }`.
Errors follow: `{ success: false, message: string }` with the correct HTTP status
(400, 401, 403, 404, 409, 500).

## Deployment
1. Push this repo to GitHub (`.env` is git-ignored — only `.env.example` is committed).
2. Create a MongoDB Atlas cluster and copy the connection string into `MONGO_URI`.
3. Deploy to Render/Railway/Vercel, setting the same environment variables there.
4. Set `CLIENT_ORIGIN` to your deployed frontend's URL for CORS in production.
