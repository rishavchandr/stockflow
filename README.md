# StockFlow MVP 

## Overview
**StockFlow MVP** is a minimal SaaS Inventory Management System

The application allows a user to:
- Sign up and log in
- Create and manage products
- Track inventory quantities
- View a dashboard summary
- Identify low-stock items

This MVP focuses only on **core inventory functionality**.

---

# 1. Objective

Deliver a **simple multi-tenant inventory application** where a user can:

- Sign up and log in
- Create products with SKU and quantity
- View inventory in a product list
- See dashboard summary
- Detect low stock products

The app is designed for **demo or early-stage internal testing**.

---

# 2. Users & Personas

### Primary User
**Owner / Admin**

Typical user:
- Small business owner
- Internal tester
- Startup founder

### Characteristics
- One user per organization
- No role management
- Desktop-first usage

---

# 3. Features

## 3.1 Authentication & Tenant Basics

### Signup
Users create an account using:
- Email
- Password
- Organization Name

When signing up:
- An **Organization** record is created
- The user is linked to that organization

### Login
Users log in with:
- Email
- Password

Password reset is **not included in MVP**.

---

## 3.2 Organization Context

All data is scoped by **organization**.

Structure:


Each organization only sees its own inventory.

---

# 3.3 Product & Inventory Management

## Product Model

Each product contains:

| Field | Description |
|------|-------------|
| ID | Unique identifier |
| Organization ID | Tenant reference |
| Name | Product name |
| SKU | Unique per organization |
| Description | Optional |
| Quantity on Hand | Inventory quantity |
| Cost Price | Optional |
| Selling Price | Optional |
| Low Stock Threshold | Optional |
| Created At | Timestamp |
| Updated At | Timestamp |

Not included:
- Product images
- Categories
- Variants
- Suppliers

---

# 3.4 Product CRUD

### Create Product
Form fields:
- Name
- SKU
- Quantity
- Cost Price
- Selling Price
- Low Stock Threshold

---

### Product List

Displayed as a table:

Columns:
- Name
- SKU
- Quantity
- Low Stock Indicator
- Selling Price

---

### Update Product
Users can edit all fields including quantity.

---

### Delete Product
Products can be deleted.

For MVP:
- Hard delete is acceptable.

---

# 3.5 Simple Stock Updates

Stock can be modified via:
- Product edit form
- Optional inline adjustment

No detailed inventory history is required.

Optional tracking fields:
- last_updated_by
- updated_at

---

# 4. Dashboard

After login the user lands on the **Dashboard**.

Dashboard displays:

### Summary Cards
- Total number of products
- Total inventory quantity

### Low Stock Items

A product is **low stock** if:


If threshold is missing, a **global default value** is used.

Low stock table columns:

- Name
- SKU
- Quantity
- Threshold

---

# 5. Settings

Minimal settings page containing:

### Default Low Stock Threshold

Example:


If a product does not specify a threshold, this value is used.

---

# 6. Non-Functional Requirements

- Single region deployment
- Basic authentication
- Password hashing (bcrypt)
- Simple validation
- Desktop-first UI
- Responsive layout (optional)

---

# 7. Out-of-Scope Features

Not included in this MVP:

- Multi-warehouse inventory
- Product variants
- Shopify / Amazon integrations
- Order management
- Purchase orders
- Supplier management
- Email notifications
- CSV imports
- Public API
- Role-based access
- Audit logs
- Subscription billing

---

# 8. Suggested Tech Stack

### Backend
- Node.js
- Express.js
- Prisma ORM
- PostgreSQL / MySQL

### Frontend
- Next.js
- React
- Tailwind CSS

### Authentication
- JWT or session-based
- bcrypt for password hashing

---

# 9. Application Screens

## Authentication
- Login Page
- Signup Page

Signup fields:
- Email
- Password
- Confirm Password
- Organization Name

---

## Dashboard
Displays:
- Total products
- Total inventory units
- Low stock products

---

## Products

### Product List
Table view with:

- Name
- SKU
- Quantity
- Selling Price
- Low stock indicator

Features:
- Search by name or SKU
- Add product button

---

### Product Form

Used for:
- Create product
- Edit product

Fields:

- Name
- SKU
- Quantity
- Cost price
- Selling price
- Low stock threshold

---

## Settings

Contains:

- Default Low Stock Threshold

---

# 10. Success Criteria

The MVP is successful if a user can:

1. Sign up with email and organization name
2. Log in successfully
3. View the dashboard
4. Create products with SKU and quantity
5. See products in the product list
6. View inventory totals
7. Identify low-stock items
8. Ensure all data is scoped to their organization

---

# 11. MVP Goal

Deliver a **working SaaS inventory prototype** that demonstrates:

- Multi-tenant architecture
- Product inventory management
- Dashboard insights



