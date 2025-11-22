# Product Requirements Document: StockMaster

## 1. Introduction

### 1.1 Product Name

**StockMaster**

### 1.2 Problem Statement

The current objective is to build a modular Inventory Management System (IMS) that digitizes and streamlines all stock-related operations within a business. The goal is to replace manual registers, Excel sheets, and scattered tracking methods with a centralized, real-time, easy-to-use app.

---

## 2. Target Audience

The system is designed for the following users:

- **Inventory Managers**: Responsible for managing incoming and outgoing stock.
- **Warehouse Staff**: Responsible for performing transfers, picking, shelving, and counting.

---

## 3. Functional Requirements

### 3.1 Authentication

- **User Access**: Users must be able to sign up and log in.
- **Password Recovery**: The system must support OTP-based password reset.
- **Post-Login**: Users are redirected to the Inventory Dashboard upon successful login.

### 3.2 Dashboard

The landing page provides a snapshot of inventory operations.

**Key Performance Indicators (KPIs):**

- Total Products in Stock.
- Low Stock / Out of Stock Items.
- Pending Receipts.
- Pending Deliveries.
- Internal Transfers Scheduled.

**Dynamic Filters:**

- **By Document Type**: Receipts, Delivery, Internal, Adjustments.
- **By Status**: Draft, Waiting, Ready, Done, Canceled.
- **By Location/Category**: Warehouse location or product category.

### 3.3 Product Management

Users can create and update products via the "Products" navigation menu.

**Product Attributes:**

- Name.
- SKU / Code.
- Category.
- Unit of Measure.
- Initial Stock (Optional).

**Features:**

- View stock availability per location.
- Manage product categories.
- Set reordering rules.

### 3.4 Operations Management

The core operations cover the movement and adjustment of stock.

#### A. Receipts (Incoming Goods)

**Purpose**: Used when items arrive from vendors.

**Workflow:**

1. Create a new receipt.
2. Add supplier and products.
3. Input quantities received.
4. Validate to automatically increase stock.

**Example**: Receiving 50 units of "Steel Rods" increases stock by 50.

#### B. Delivery Orders (Outgoing Goods)

**Purpose**: Used when stock leaves the warehouse for customer shipment.

**Workflow:**

1. Pick items.
2. Pack items.
3. Validate to automatically decrease stock.

**Example**: A sales order for 10 chairs reduces chair inventory by 10.

#### C. Internal Transfers

**Purpose**: Move stock inside the company (e.g., Main Warehouse to Production Floor, or Rack A to Rack B).

**Logging**: Each movement is logged in the ledger.

#### D. Stock Adjustments

**Purpose**: Fix mismatches between recorded stock and physical count.

**Workflow:**

1. Select product/location.
2. Enter counted quantity.
3. System auto-updates and logs the adjustment.

#### E. Move History

Users must be able to view a history of stock movements.

### 3.5 Additional Features & Settings

- **Profile Management**: Access "My Profile" and "Logout" via the left sidebar.
- **Warehouse Settings**: Manage warehouse configurations.
- **Alerts**: Notifications for low stock.
- **Multi-warehouse Support**: Manage inventory across multiple facilities.
- **Search**: SKU search and smart filters.

---

## 4. Simplified User Flow Example

To understand the inventory flow, the system must support the following lifecycle:

1. **Receive Goods**: Vendor delivers 100kg of steel; system updates stock (+100).
2. **Internal Transfer**: Move stock from Main Store to Production Rack; total stock remains unchanged, but location is updated.
3. **Deliver Goods**: 20 steel frames delivered; system updates stock (-20).
4. **Adjust Stock**: 3kg of steel found damaged; manual adjustment updates stock (-3).
5. **Ledger**: All the above events are logged in the Stock Ledger.
