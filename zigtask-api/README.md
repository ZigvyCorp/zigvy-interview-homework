# ZigTask API

A Task Management application built with NestJS, MongoDB, and TypeScript. This API provides user authentication and task management functionality with full CRUD operations.

##  Features

-  **User Authentication**: Registration and login with JWT
-  **User Management**: CRUD operations for users
-  **Task Management**: Create, read, update, delete tasks
-  **Status Tracking**: Todo, In Progress, Done
-  **Search and Filter**: Search by title and date range
-  **Group by Status**: View tasks grouped by status
-  **API Documentation**: Integrated Swagger UI
-  **Docker Support**: Ready for containerization

##  Tech Stack

- **Backend Framework**: NestJS
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Class Validator
- **Documentation**: Swagger/OpenAPI
- **Language**: TypeScript
- **Package Manager**: npm

##  System Requirements

- Node.js 18+ 
- npm 8+
- MongoDB 5+
- Docker (optional)

##  Installation and Setup

### 1. Clone repository

```bash
git clone <repository-url>
cd zigtask-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment configuration

Create a `.env` file in the root directory:

```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_jwt_key
```

### 4. Start MongoDB

```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Or use local MongoDB installation
mongod
```

### 5. Run the application

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

The application will run at: `http://localhost:3000`

##  Running with Docker

### 1. Build Docker image

```bash
docker build -t zigtask-api .
```

### 2. Run individually

```bash
# Run MongoDB
docker run -d --name mongodb -p 27017:27017 mongo:latest

# Run app
docker run -d \
  --name zigtask-api \
  -p 3000:3000 \
  -e MONGO_URI=mongodb://mongodb:27017/zigtask \
  -e JWT_SECRET=your-super-secret-jwt-key \
  --link mongodb \
  zigtask-api
```

##  API Documentation

After running the application, access Swagger UI at:

```
http://localhost:3000/api/docs
```

### Main endpoints:

#### Authentication
- `POST /api/auth/signup`       - Register a new account
- `POST /api/auth/signin`       - Sign in

#### Users
- `GET /api/users`              - Get all users
- `GET /api/users/:id`          - Get user by ID
- `POST /api/users`             - Create new user
- `PUT /api/users/:id`          - Update user
- `DELETE /api/users/:id`       - Delete user

#### Tasks  
- `GET /api/tasks`              - Search and filter tasks
- `POST /api/tasks`             - Create new task
- `PATCH /api/tasks/:id`        - Update task
- `DELETE /api/tasks/:id`       - Delete task
- `GET /api/tasks/grouped`      - Get tasks grouped by status
- `PATCH /api/tasks/:id/status` - Update task status

##  Project Structure

```
src/
├── main.ts                       # Entry point, Swagger configuration
├── app.module.ts                 # Root module, MongoDB configuration
├── auth/                         # Authentication module
│   ├── auth.controller.ts        # Controller for signup/signin
│   ├── auth.service.ts           # Authentication logic, JWT
│   ├── auth.module.ts            # Auth module configuration
│   └── dto/                      # Data Transfer Objects
│       ├── signin.dto.ts         # DTO for sign in
│       └── signup.dto.ts         # DTO for sign up
├── user/                         # User module
│   ├── user.controller.ts        # CRUD controller for users
│   ├── user.service.ts           # User business logic
│   ├── user.module.ts            # User module configuration
│   └── user.schema.ts            # MongoDB schema for User
├── tasks/                        # Tasks module
│   ├── tasks.controller.ts       # CRUD controller, filter, group
│   ├── tasks.service.ts          # Task business logic
│   ├── tasks.module.ts           # Tasks module configuration
│   ├── tasks.schema.ts           # MongoDB schema for Task, TaskStatus enum
│   └── dto/                      # Data Transfer Objects
│       ├── create-task.dto.ts    # DTO for creating task
│       ├── update-task.dto.ts    # DTO for updating task
│       └── filter-task.dto.ts    # DTO for filtering tasks
└── utils/                        # Utilities
    └── response.dto.ts           # Standardized response format
```

### File descriptions:

#### Core Files
- **main.ts**: Entry point, Swagger UI setup, global prefix `/api`
- **app.module.ts**: Root module, MongoDB connection configuration, module imports

#### Authentication Module
- **auth.controller.ts**: Handles signup/signin API endpoints
- **auth.service.ts**: Authentication logic, password hashing, JWT token generation
- **signin.dto.ts**: Validation for email/password sign in
- **signup.dto.ts**: Validation for registration (email, password, fullName)

#### User Module  
- **user.controller.ts**: CRUD API for users with Swagger decorators
- **user.service.ts**: User business logic (find, create, update, delete)
- **user.schema.ts**: MongoDB schema defining User (email, password, fullName)

#### Tasks Module
- **tasks.controller.ts**: CRUD API, filter, group tasks by status  
- **tasks.service.ts**: Task business logic, search/filter by title and date range
- **tasks.schema.ts**: MongoDB schema for Task (title, description, dueDate, status)
- **create-task.dto.ts**: Validation for creating tasks
- **update-task.dto.ts**: Validation for updating tasks  
- **filter-task.dto.ts**: Validation for filtering by title, from/to date

#### Utilities
- **response.dto.ts**: Standardized response format (data, statusCode, message)

##  Testing

```bash
# Unit tests
npm run test

# E2E tests  
npm run test:e2e

# Test coverage
npm run test:cov
```

##  Available Scripts

```bash
npm run build        # Build for production
npm run start        # Run production
npm run start:dev    # Run development with watch mode
npm run start:debug  # Run debug mode
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

##  Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Create a Pull Request

##  License

This project is released under [UNLICENSED](LICENSE).
