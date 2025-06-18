# 🚀 ZigTask API - NestJS Backend

A modern **NestJS TypeScript backend** for the ZigTask task management application, featuring **JWT authentication**, **AI-powered task suggestions**, **email notifications**, **MongoDB integration**, and **comprehensive RESTful APIs**.

![NestJS](https://img.shields.io/badge/NestJS-10.x-ea2845)
![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-7.x-47a248)
![JWT](https://img.shields.io/badge/JWT-Authentication-000000)

---

## 🌟 Features Overview

### **🔐 Authentication & Security**
- **JWT-based authentication** with bcrypt password hashing
- **Bearer token authorization** for protected endpoints
- **User registration/login** with email validation
- **Password strength requirements** and secure storage
- **Token expiration** and refresh mechanisms

### **📋 Task Management**
- **Complete CRUD operations** for tasks
- **Status tracking** (TODO, IN_PROGRESS, DONE)
- **Search and filtering** by title, date range, and status
- **Task grouping** by status for dashboard views
- **Due date management** with overdue detection
- **User-specific task isolation** for multi-tenant support

### **🤖 AI Integration**
- **Google Gemini AI** integration for task suggestions
- **Contextual task generation** based on user prompts
- **JSON response parsing** for structured task data
- **Error handling** for AI service failures

### **📧 Notifications & Automation**
- **Email notifications** via SMTP with Nodemailer
- **Automated reminders** using cron jobs
- **Scheduled task notifications** for due dates
- **Configurable email templates** and settings

### **📚 Documentation & Testing**
- **Swagger/OpenAPI** integration with detailed API docs
- **Comprehensive unit tests** for all services
- **E2E testing** for API endpoints
- **Type-safe DTOs** with validation decorators

---

## 🏗️ Technical Architecture

### **📦 Project Structure**
```
zigtask-api/
├── src/
│   ├── main.ts                    # Application entry point
│   ├── app.module.ts             # Root module configuration
│   ├── auth/                     # Authentication module
│   │   ├── auth.controller.ts    # Auth endpoints (signup/signin)
│   │   ├── auth.service.ts       # JWT & password logic
│   │   ├── auth.module.ts        # Auth module config
│   │   └── dto/                  # Authentication DTOs
│   │       ├── signin.dto.ts     # Sign-in validation
│   │       └── signup.dto.ts     # Registration validation
│   ├── user/                     # User management module
│   │   ├── user.module.ts        # User module config
│   │   └── user.schema.ts        # MongoDB User schema
│   ├── tasks/                    # Task management module
│   │   ├── tasks.controller.ts   # Task CRUD endpoints
│   │   ├── tasks.service.ts      # Task business logic
│   │   ├── tasks.module.ts       # Tasks module config
│   │   ├── tasks.schema.ts       # MongoDB Task schema
│   │   └── dto/                  # Task DTOs
│   │       ├── create-task.dto.ts
│   │       ├── update-task.dto.ts
│   │       └── filter-task.dto.ts
│   ├── ai/                       # AI integration module
│   │   ├── ai.controller.ts      # AI endpoints
│   │   ├── ai.service.ts         # Google Gemini integration
│   │   └── ai.module.ts          # AI module config
│   ├── mail/                     # Email service module
│   │   ├── mail.service.ts       # SMTP email sending
│   │   └── mail.module.ts        # Mail module config
│   ├── notification/             # Notification automation
│   │   ├── notification.service.ts # Cron job notifications
│   │   └── notification.module.ts  # Notification config
│   └── utils/                    # Shared utilities
│       ├── jwt.module.ts         # JWT service module
│       ├── jwt.service.ts        # JWT token operations
│       └── response.dto.ts       # Standardized responses
├── test/                         # Test files
│   ├── app.e2e-spec.ts          # End-to-end tests
│   └── jest-e2e.json            # E2E test configuration
├── .env                          # Environment variables
├── package.json                  # Dependencies and scripts
├── nest-cli.json                 # NestJS CLI configuration
└── tsconfig.json                 # TypeScript configuration
```

### **🛠️ Tech Stack**

#### **Core Framework**
- **NestJS 10.x** - Progressive Node.js framework
- **TypeScript** - Static type checking and modern JS features
- **Express.js** - Underlying HTTP server framework

#### **Database & ORM**
- **MongoDB 7.x** - NoSQL document database
- **Mongoose** - Elegant MongoDB object modeling
- **Schema validation** - Built-in data validation

#### **Authentication & Security**
- **JWT (jsonwebtoken)** - Stateless authentication tokens
- **bcryptjs** - Password hashing and salting
- **Passport.js** - Authentication middleware
- **Class Validator** - DTO validation decorators

#### **External Integrations**
- **Google Generative AI** - AI-powered task suggestions
- **Nodemailer** - Email sending with SMTP support
- **@nestjs/schedule** - Cron job automation

#### **Development & Testing**
- **Swagger/OpenAPI** - API documentation
- **Jest** - Unit and integration testing
- **ESLint** - Code quality and linting
- **Prettier** - Code formatting

---

## 🚀 Quick Start

### **Prerequisites**
- **Node.js** 18+ and **npm**
- **MongoDB** 5+ (local or cloud)
- **Google AI API Key** (for AI features)
- **SMTP Email Account** (for notifications)

### **1. Installation**
```bash
cd zigtask-api
npm install
```

### **2. Environment Setup**
Create `.env` file in project root:

```env
# Database Configuration
MONGO_URI=mongodb://localhost:27017/zigtask
# Or MongoDB Atlas: mongodb+srv://user:password@cluster.mongodb.net/zigtask

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
JWT_EXPIRES_IN=7d

# Google AI Configuration (for task suggestions)
GOOGLE_AI_API_KEY=your-google-ai-api-key

# Email Configuration (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@zigtask.com

# Application Configuration
PORT=3000
NODE_ENV=development
```

### **3. Database Setup**
```bash
# Option 1: Using Docker
docker run -d --name mongodb -p 27017:27017 mongo:latest

# Option 2: Local MongoDB installation
# Download and install MongoDB Community Server
# Start MongoDB service: mongod

# Option 3: MongoDB Atlas (cloud)
# Create cluster at https://cloud.mongodb.com
# Use connection string in MONGO_URI
```

### **4. Development Server**
```bash
# Start development server with hot reload
npm run start:dev

# Server will start on http://localhost:3000
# Swagger UI available at http://localhost:3000/api/docs
```

### **5. Build for Production**
```bash
# Create production build
npm run build

# Start production server
npm run start:prod
```

---

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run start` | Start production server |
| `npm run start:dev` | Start development server with hot reload |
| `npm run start:debug` | Start server in debug mode |
| `npm run start:prod` | Start production server from build |
| `npm run build` | Build production-ready application |
| `npm run test` | Run unit tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:cov` | Run tests with coverage report |
| `npm run test:e2e` | Run end-to-end tests |
| `npm run lint` | Run ESLint for code quality |
| `npm run format` | Format code with Prettier |

---

## 📚 API Documentation

### **🌐 Swagger UI**
Access interactive API documentation at:
```
http://localhost:3000/api/docs
```

---

## 📞 Support & Contributing

### **🐛 Bug Reports**
1. Check existing issues on GitHub
2. Provide detailed reproduction steps
3. Include environment information
4. Attach relevant logs

### **🚀 Feature Requests**
1. Discuss proposals in GitHub discussions
2. Follow contribution guidelines
3. Write tests for new features
4. Update documentation

### **📚 Development Guidelines**
- **Code Style**: Follow ESLint and Prettier rules
- **Testing**: Maintain >80% test coverage
- **Documentation**: Update Swagger annotations
- **Type Safety**: Use TypeScript strictly

---

## ⚖️ License

This project is part of a technical assessment and is for demonstration purposes only.

---