# StockMaster - Advanced Inventory Management System

StockMaster is a comprehensive, full-stack inventory management solution built with modern web technologies. It helps businesses track stock levels, manage multiple locations, process operations (receipts, deliveries, transfers), and analyze financial performance with role-based access control.

## 🚀 Features

### **1. Dashboard & Analytics**
- **Stock Trends:** Visual graph showing historical and predicted stock movements based on demand.
- **Financial Performance:** (Manager Only) Revenue, Cost, and Profit analysis charts.
- **Recent Activity:** Real-time log of improved inventory operations.
- **Quick Stats:** Total Products, Low Stock Alerts, Total Value, and Pending Operations.

### **2. Inventory Management**
- **Products:** Create, update, and track products with SKU, categories, and unit of measure.
- **Categories:** Organize products for better filtering and reporting.
- **Stock Levels:** Real-time tracking of quantity on hand across different internal locations.

### **3. Operations Workflow**
- **Receipts (Purchasing):** Log incoming stock from vendors to warehouse locations.
- **Deliveries (Sales):** Process outgoing stock to customers, automatically calculating revenue and profits.
- **Internal Transfers:** Move stock between different warehouse zones or shelves.
- **Adjustments:** Handle inventory corrections (e.g., damage, loss, audit corrections) with reason codes.
- **Status Tracking:** All operations support Draft -> Validate -> Done/Cancelled workflows.

### **4. Location & Contact Management**
- **Multi-Location Support:** Manage Internal (Warehouse), Vendor, Customer, and Inventory Loss locations.
- **Contacts:** Maintain a directory of Suppliers (Vendors) and Clients (Customers).

### **5. Security & Access Control**
- **Authentication:** Secure Login and Registration system using JWT.
- **Role-Based Access Control (RBAC):**
  - **Manager:** Full access to all features, including Financial Performance and sensitive operations.
  - **Staff:** Restricted access (e.g., can process operations but cannot view financial profit data).

---

## 🛠 Tech Stack

### **Frontend**
- **Framework:** [React 18](https://reactjs.org/) with [Vite](https://vitejs.dev/)
- **State & Data Fetching:** [TanStack Query (React Query)](https://tanstack.com/query)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Charts:** [Recharts](https://recharts.org/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Notifications:** [React Hot Toast](https://react-hot-toast.com/)

### **Backend**
- **Runtime:** [Node.js](https://nodejs.org/)
- **Framework:** [Express.js](https://expressjs.com/)
- **Database:** [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Authentication:** JSON Web Token (JWT) & bcrypt
- **Validation:** Express Validator

---

## ⚙️ Installation & Setup

### **Prerequisites**
- Node.js (v18+)
- MongoDB Atlas URI (or local MongoDB)

### **1. Clone the Repository**
```bash
git clone https://github.com/Vcodes45/Stockmaster.git
cd Stockmaster
```

### **2. Backend Setup**
Navigate to the backend folder and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:
```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_secret_key
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_secret
REFRESH_TOKEN_EXPIRY=10d
CORS_ORIGIN=*
# Optional: Frontend URL for CORS
FRONTEND_URL=http://localhost:5173
```

Start the backend server:
```bash
npm run dev
```

### **3. Frontend Setup**
Open a new terminal, navigate to the frontend folder, and install dependencies:
```bash
cd frontend
npm install
```

Create a `.env` file (or `.env.local`) in the `frontend` directory:
```env
# URL of your running backend
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_APP_NAME=StockMaster
```

Start the frontend development server:
```bash
npm run dev
```

Access the app at `http://localhost:5173`.

---

## 🌍 Deployment Guide

### **Backend (Render/Heroku)**
1.  **Root Directory:** Set to `backend`.
2.  **Build Command:** `npm install`
3.  **Start Command:** `npm start`
4.  **Environment Variables:** Add all variables from your backend `.env` file.

### **Frontend (Vercel/Netlify)**
1.  **Root Directory:** Set to `frontend`.
2.  **Build Command:** `npm run build`
3.  **Output Directory:** `dist`
4.  **Environment Variables:**
    - `VITE_API_BASE_URL`: Set this to your **deployed backend URL** (e.g., `https://your-api.onrender.com/api/v1`).

---

## 🧪 Testing Account
Use these credentials or register a new account:
- **Email:** `vanshsharma020406@gmail.com` (Manager Access)
- **Password:** `123456`

---

## 🤝 Contribution
Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.

## 📄 License
This project is licensed under the MIT License.
