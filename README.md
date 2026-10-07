# ISE System — Incense Stick Enterprise (Fullstack Architecture)

Enterprise-grade incense production and employee management platform separated into **independent Frontend and Backend** modules, backed by **MongoDB** with full **MongoDB Compass** support.

---

## 🏗️ Project Architecture

```
ise-system/
├── frontend/                     # React 19 + Vite Frontend Client
│   ├── src/
│   │   ├── services/
│   │   │   └── api.js            # REST API Client layer (auth, employees, orders, etc.)
│   │   ├── context/
│   │   │   ├── AuthContext.jsx   # JWT Authentication & role permissions
│   │   │   ├── DataContext.jsx   # Live data sync with Backend & MongoDB
│   │   │   └── NotificationContext.jsx # Live in-app notifications
│   │   └── pages/                # Admin, Manager, Employee dashboards
│   ├── vite.config.js            # Reverse proxy (/api -> http://localhost:5000)
│   └── package.json
│
├── backend/                      # Node.js + Express REST API Server
│   ├── config/
│   │   └── db.js                 # MongoDB connection & auto-seeding
│   ├── models/                   # Mongoose Schemas (Employee, Order, Task, Inventory, etc.)
│   ├── routes/                   # API Endpoints (/api/auth, /api/employees, /api/orders...)
│   ├── middleware/
│   │   └── auth.js               # JWT Bearer verification & role guards
│   ├── data/
│   │   ├── seedData.js           # 50 employees, products, orders, inventory seeds
│   │   └── db.json               # Resilient local fallback database
│   ├── .env                      # MongoDB URI & server configuration
│   ├── server.js                 # Express entry point (Port 5000)
│   └── package.json
│
└── package.json                  # Root runner (starts frontend & backend together)
```

---

## 🍃 MongoDB & MongoDB Compass Connection

The backend connects directly to MongoDB via Mongoose.

### 1. View in MongoDB Compass
1. Open **MongoDB Compass**.
2. In the "New Connection" screen, enter the connection string:
   ```
   mongodb://localhost:27017
   ```
   *(or `mongodb://127.0.0.1:27017`)*
3. Click **Connect**.
4. You will see the database **`ise_system`** with all collections:
   - **`employees`**: 50+ employee records (attendance, production count, department)
   - **`orders`**: Active order tracking records
   - **`inventories`**: Real-time warehouse inventory
   - **`tasks`**: Production task assignments
   - **`notifications`**: Live notification queue
   - **`products`**: Incense stick catalog & raw material recipes
   - **`users`**: Enterprise user accounts

### 2. Custom MongoDB URI (MongoDB Atlas or Remote)
Edit `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/ise_system
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/ise_system?retryWrites=true&w=majority
JWT_SECRET=ise_enterprise_security_secret_key_2026
CLIENT_ORIGIN=http://localhost:5173
```

---

## 🚀 Running the Project

### Option A: Run Both Together (Recommended)
From the root `ise-system/` directory:
```bash
npm run dev
```
This runs both the Backend (`http://localhost:5000`) and Frontend (`http://localhost:5173`) concurrently in a single terminal with color-coded logs!

---

### Option B: Run Frontend and Backend Separately

#### 1. Start the Backend API Server:
```bash
cd backend
npm run dev
```
- Server starts on **`http://localhost:5000`**
- Health check: `http://localhost:5000/api/health`
- Seeds MongoDB automatically if empty

#### 2. Start the Frontend Application:
In a separate terminal:
```bash
cd frontend
npm run dev
```
- Opens on **`http://localhost:5173`**
- Automatically proxies all `/api/*` requests to the Backend (`http://localhost:5000`)

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Backend & MongoDB status check |
| `POST` | `/api/auth/login` | Authenticate user & issue JWT token |
| `POST` | `/api/auth/signup` | Register new employee & create DB profile |
| `GET` | `/api/employees` | Fetch all employees (filter by dept/status) |
| `POST` | `/api/employees` | Create new employee profile |
| `PUT` | `/api/employees/:id` | Update employee attendance or details |
| `DELETE` | `/api/employees/:id` | Remove employee |
| `GET` | `/api/orders` | Fetch orders |
| `PATCH` | `/api/orders/:id/status` | Advance order status (Placed → Processing → Shipped → Delivered) |
| `GET` | `/api/inventory` | Fetch warehouse inventory |
| `PUT` | `/api/inventory/:id` | Update stock quantity |
| `GET` | `/api/tasks` | Fetch production assignments |
| `POST` | `/api/tasks` | Assign new production task |
| `GET` | `/api/notifications` | Fetch notifications (audience filter available) |
| `PATCH` | `/api/notifications/:id/read` | Mark notification as read |

---

## 👥 Demo User Credentials

| Role | Email | Password | Access |
|---|---|---|---|
| **Admin** | `ravi@admin.com` | `Password@123` | Full enterprise control (Orders, Employees, Inventory, Settings) |
| **Manager** | `priya@manager.com` | `Password@123` | Read-only oversight console |
| **Employee** | `selvam@employee.com` | `Password@123` | Biometric attendance & production logging |
