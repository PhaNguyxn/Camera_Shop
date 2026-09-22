# Camera Shop

Camera Shop is a full-stack e-commerce web application for selling cameras and camera accessories.

The system includes a customer website, an admin dashboard, and a backend server. Customers can browse products, manage their shopping cart, place orders, and view order history. Administrators can manage products, categories, users, and orders.

The project uses a shared login system for both customers and administrators. After a successful login, users are redirected based on their account role.

## Technologies

- **Frontend:** ReactJS, Redux, React Router, Axios, Bootstrap
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Authentication:** bcrypt

## Project Structure

```text
Camera_Shop/
├── client_shop/    # Customer website
├── admin_shop/     # Admin dashboard
├── server_shop/    # Backend REST API
├── seed/           # Sample data
└── README.md
```

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/PhaNguyxn/Camera_Shop.git
cd Camera_Shop
```

### 2. Install Backend

```bash
cd server_shop
npm install
```

Create a `.env` file inside `server_shop` and configure the required environment variables.

Example:

```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string
```

Start the backend:

```bash
npm start
```

The server runs at:

```text
http://localhost:8000
```

### 3. Install Client

Open a new terminal:

```bash
cd client_shop
npm install
npm start
```

The customer website runs at:

```text
http://localhost:3000
```

### 4. Install Admin

Open another terminal:

```bash
cd admin_shop
npm install
npm start
```

The admin dashboard normally runs at:

```text
http://localhost:3001
```

## Running the Project

Run the applications in the following order:

```text
1. server_shop  → http://localhost:8000
2. client_shop  → http://localhost:3000
3. admin_shop   → http://localhost:3001
```