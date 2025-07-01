# Rice Distribution Management System

A full-stack web application for managing rice distribution, including inventory (storage), customers, mills, transactions, profits, and an AI-powered chatbot for natural language data queries.



## 🚀 Features

### 🔧 Backend (Express.js + PostgreSQL)
- **Storage Management**: Add/update/remove rice packets and brands.
- **Customer Management**: Track balances, purchases, and customer details.
- **Mill Management**: Record mill transactions and amounts due.
- **Profits & Expenses**: Add/view daily and monthly profits and expenses.
- **Transactions**: Full tracking of rice sales, including customer/outside sales.
- **AI Chatbot API**: Accepts natural language queries and responds with results using dynamic SQL.
- **Database Connection**: PostgreSQL connection via `pg` and `.env` configuration.

### 🖥️ Frontend (React.js)
- **React Router**: Navigation between pages like storage, mills, chatbot, etc.
- **Dashboard**: View all metrics (e.g. customers, mills, storage levels).
- **Interactive Forms**: For adding customers, selling rice, etc.
- **Styled Components**: CSS modules and custom styling for a clean UI.
- **Chatbot UI**: Query the system using natural language and see real-time answers.

---

## 🤖 AI Chatbot

### How it works:
1. **Reads** `dbSchema.txt` to understand table and column names.
2. **Receives** a user question via `/api/chatbot`.
3. **Uses OpenRouter AI** to generate the SQL query.
4. **Executes** the SQL on your database.
5. **Returns** the result in human-readable format.

Example Query:  
🗨️ *"How much profit did we make this month?"*

---

## 🧠 Database Schema (PostgreSQL)

Includes the following tables:
- `customers`
- `transactions`
- `mills`
- `mill_transactions`
- `rice_brands`
- `profits`

See full schema in [`dbSchema.txt`](./dbSchema.txt)

---

## 📦 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/Narsi7777/ricedeployment2.git
cd ricedeployment2
