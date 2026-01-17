# Bug Tracking Backend - Layered Architecture

A professional, scalable Node.js backend built with Express and PostgreSQL, following industry best practices with proper separation of concerns.

## 🏗️ Architecture

This project follows a **layered architecture** pattern:

- **Routes Layer**: API endpoint definitions
- **Controllers Layer**: Request/response handling
- **Services Layer**: Business logic (VERY IMPORTANT)
- **Models Layer**: Database queries
- **Middlewares**: Authentication, validation, error handling
- **Helpers**: Reusable utility functions
- **Validators**: Request validation schemas
- **Utils**: Constants, logging, async handlers

## 📁 Project Structure

```
src/
├── app.js                  # Express app configuration
├── server.js               # Server startup
│
├── config/
│   ├── db.js               # PostgreSQL connection pool
│   ├── env.js              # Environment variables
│   └── index.js
│
├── routes/
│   ├── index.js            # Combine all routes
│   ├── auth.routes.js      # Authentication routes
│   ├── user.routes.js      # User management routes
│   └── role.routes.js      # Role management routes
│
├── controllers/
│   ├── auth.controller.js  # Auth request handlers
│   ├── user.controller.js  # User request handlers
│   └── role.controller.js  # Role request handlers
│
├── models/
│   ├── user.model.js       # User database operations
│   ├── role.model.js       # Role database operations
│   └── index.js
│
├── services/               # Business logic layer
│   ├── auth.service.js     # Authentication logic
│   ├── user.service.js     # User management logic
│   └── role.service.js     # Role management logic
│
├── middlewares/
│   ├── auth.middleware.js  # JWT authentication & authorization
│   ├── error.middleware.js # Global error handling
│   └── validate.middleware.js # Request validation
│
├── helpers/
│   ├── password.helper.js  # Password hashing/comparison
│   ├── token.helper.js     # JWT token generation/verification
│   ├── response.helper.js  # Standardized API responses
│   └── pagination.helper.js # Pagination utilities
│
├── validators/
│   ├── auth.validator.js   # Auth request validation schemas
│   └── user.validator.js   # User request validation schemas
│
├── utils/
│   ├── constants.js        # Application constants
│   ├── logger.js           # Winston logger configuration
│   └── asyncHandler.js     # Async error wrapper
│
├── migrations/
│   └── 001_create_users_roles.sql # Database schema
│
└── seeders/
    └── roles.seeder.js     # Seed default roles
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Installation

1. **Install dependencies**
```bash
npm install
```

2. **Configure environment variables**

Edit `.env` file with your PostgreSQL credentials:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bugtrackin_db
DB_USER=your_postgres_username
DB_PASSWORD=your_postgres_password

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
```

3. **Set up PostgreSQL database**

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE bugtrackin_db;

# Exit
\q

# Run migrations
psql -U postgres -d bugtrackin_db -f src/migrations/001_create_users_roles.sql
```

4. **Seed default roles**
```bash
npm run seed:roles
```

5. **Start the server**

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:3000`

## 📡 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| POST | `/api/auth/refresh` | Refresh access token | Private |
| POST | `/api/auth/logout` | Logout user | Private |
| GET | `/api/auth/me` | Get current user profile | Private |

### Users (`/api/users`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/users` | Get all users (paginated) | Admin |
| GET | `/api/users/:id` | Get user by ID | Private |
| POST | `/api/users` | Create new user | Admin |
| PUT | `/api/users/:id` | Update user | Admin |
| DELETE | `/api/users/:id` | Delete user | Admin |
| PUT | `/api/users/:id/password` | Change password | Private |

### Roles (`/api/roles`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/roles` | Get all roles | Private |
| GET | `/api/roles/:id` | Get role by ID | Private |
| POST | `/api/roles` | Create new role | Admin |
| PUT | `/api/roles/:id` | Update role | Admin |
| DELETE | `/api/roles/:id` | Delete role | Admin |

### Health Check

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/health` | Server health status | Public |

## 🔐 Authentication

This API uses **JWT (JSON Web Tokens)** for authentication.

### Register a new user

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "password123",
    "full_name": "John Doe",
    "role": "developer"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

Response:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### Using protected endpoints

Include the access token in the Authorization header:

```bash
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 🛡️ Authorization

The API supports role-based access control (RBAC) with the following roles:

- **admin**: Full access to all resources
- **developer**: Can manage bugs and projects
- **tester**: Can create and update bugs
- **viewer**: Read-only access

## 📝 Available Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start server in production mode |
| `npm run dev` | Start server in development mode with auto-reload |
| `npm run seed:roles` | Seed default roles into database |
| `npm test` | Run tests (to be implemented) |

## 🗄️ Database Schema

The database includes the following tables:

- **users**: User accounts with authentication
- **roles**: User roles for RBAC
- **projects**: Bug tracking projects
- **bugs**: Bug/issue tracking
- **comments**: Bug comments and discussions

See `src/migrations/001_create_users_roles.sql` for the complete schema.

## 📦 Dependencies

### Core
- **express**: Web framework
- **pg**: PostgreSQL client
- **dotenv**: Environment variable management
- **cors**: Cross-origin resource sharing

### Security
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT authentication

### Validation & Logging
- **joi**: Request validation
- **winston**: Logging

## 🔧 Configuration

All configuration is managed through environment variables in `.env`:

- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development/production)
- `DB_*`: Database connection settings
- `JWT_*`: JWT token settings
- `LOG_LEVEL`: Logging level (info/debug/error)
- `CORS_ORIGIN`: Allowed CORS origins

## 🎯 Best Practices Implemented

✅ **Layered Architecture**: Clear separation of concerns  
✅ **Service Layer**: Business logic isolated from controllers  
✅ **Validation**: Request validation using Joi schemas  
✅ **Error Handling**: Centralized error handling middleware  
✅ **Logging**: Structured logging with Winston  
✅ **Security**: Password hashing, JWT authentication  
✅ **Authorization**: Role-based access control  
✅ **Async Handling**: Proper async/await error handling  
✅ **Standardized Responses**: Consistent API response format  
✅ **Pagination**: Built-in pagination support  

## 🚧 Future Enhancements

- [ ] Unit and integration tests (Jest, Supertest)
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Rate limiting
- [ ] Request throttling
- [ ] Email verification
- [ ] Password reset functionality
- [ ] Refresh token rotation
- [ ] API versioning
- [ ] Docker containerization
- [ ] CI/CD pipeline

## 📄 License

ISC

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
#   b u g t r a c k i n - b a c k e n d - n o d e  
 