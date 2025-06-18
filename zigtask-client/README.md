# 🎨 ZigTask Client - React Frontend

A modern React TypeScript frontend for the ZigTask task management application, featuring **glass morphism design**, **drag-and-drop functionality**, **AI-powered task suggestions**, and **comprehensive state management**.

![React](https://img.shields.io/badge/React-18.x-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue)
![Material-UI](https://img.shields.io/badge/Material--UI-5.x-0081cb)
![Redux Toolkit](https://img.shields.io/badge/Redux%20Toolkit-2.x-764abc)

---

## 🌟 Features Overview

### **🎨 Modern UI/UX Design**
- **Glass Morphism** effects with blur and transparency
- **Light Blue Theme** with professional color palette
- **Dark/Light Mode Toggle** with system preference detection
- **Responsive Design** optimized for all screen sizes
- **Micro-interactions** and smooth animations

### **✅ Task Management**
- **Three-column layout** (TODO, IN_PROGRESS, DONE)
- **Drag-and-drop** between status columns
- **Real-time search** with 0.5s debounce
- **Date range filtering** with Material-UI date pickers
- **Task CRUD operations** with optimistic updates
- **Due date & time support** with datetime-local inputs

### **🤖 AI Integration**
- **AI Task Suggestions** sidebar (33% width)
- **Contextual task generation** based on user prompts
- **Loading states** with skeleton screens
- **Individual and bulk** task creation from AI suggestions

### **🔐 Authentication Flow**
- **JWT-based authentication** with secure token storage
- **Protected routes** with automatic redirects
- **Form validation** with real-time feedback
- **Password visibility toggle**

---

## 🏗️ Technical Architecture

### **📦 Project Structure**
```
zigtask-client/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── AITaskSuggestions.tsx
│   │   ├── ConfirmDialog.tsx
│   │   ├── ProtectedRoute.tsx
│   │   ├── TaskCard.tsx
│   │   └── TaskForm.tsx
│   ├── pages/             # Route components
│   │   ├── DashboardPage.tsx
│   │   ├── SignInPage.tsx
│   │   └── SignUpPage.tsx
│   ├── store/             # Redux state management
│   │   ├── authSlice.ts
│   │   ├── tasksSlice.ts
│   │   ├── themeSlice.ts
│   │   ├── hooks.ts
│   │   └── index.ts
│   ├── theme/             # Material-UI theming
│   │   └── index.ts
│   ├── types/             # TypeScript definitions
│   │   └── index.ts
│   ├── utils/             # API and utilities
│   │   └── api.ts
│   ├── App.tsx            # Main application component
│   └── main.tsx           # Application entry point
├── .env                   # Environment variables
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
└── vite.config.ts         # Vite build configuration
```

### **🛠️ Tech Stack**

#### **Core Framework**
- **React 18** - Modern React with concurrent features
- **TypeScript** - Static type checking for reliability
- **Vite** - Fast build tool and development server

#### **State Management**
- **Redux Toolkit** - Predictable state container
- **RTK Query** - Data fetching and caching
- **Redux Persist** - State persistence

#### **UI Library & Styling**
- **Material-UI (MUI) 5.x** - React component library
- **@mui/icons-material** - Icon components
- **CSS-in-JS** - Component-level styling

#### **Functionality Libraries**
- **React Beautiful DnD** - Drag and drop functionality
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client with interceptors
- **React Hook Form** - Form management (if applicable)

---

## 🚀 Quick Start

### **Prerequisites**
- **Node.js** 18+ and **npm**
- **Backend API** running on `http://localhost:3000`

### **1. Installation**
```bash
cd zigtask-client
npm install
```

### **2. Environment Setup**
Create `.env` file in project root:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000

# Optional: Development settings
VITE_NODE_ENV=development
```

### **3. Development Server**
```bash
# Start development server with hot reload
npm run dev

# Server will start on http://localhost:5173
```

### **4. Build for Production**
```bash
# Create production build
npm run build

# Preview production build
npm run preview

# Build files will be in dist/ directory
```

---

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build production-ready application |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint for code quality |
| `npm run lint:fix` | Auto-fix ESLint issues |
| `npm run type-check` | Run TypeScript type checking |

---

## 🎨 Design System

### **🎨 Color Palette**
```css
/* Primary Colors */
--primary-blue: #0ea5e9;
--primary-blue-light: #38bdf8;
--primary-blue-dark: #0284c7;

/* Background Colors */
--background-light: #f8fafc;
--background-dark: #0f172a;

/* Glass Morphism Effects */
--glass-light: rgba(255, 255, 255, 0.9);
--glass-dark: rgba(255, 255, 255, 0.05);
--backdrop-blur: blur(20px);
```

### **🎭 Theme Structure**
```typescript
// Light Theme
const lightTheme = {
  palette: {
    mode: 'light',
    primary: { main: '#0ea5e9' },
    background: { default: '#f8fafc', paper: '#ffffff' },
    // ... more theme configuration
  }
};

// Dark Theme
const darkTheme = {
  palette: {
    mode: 'dark',
    primary: { main: '#38bdf8' },
    background: { default: '#0f172a', paper: '#1e293b' },
    // ... more theme configuration
  }
};
```

---

## 🏪 State Management

### **Redux Store Structure**
```typescript
interface RootState {
  auth: AuthState;       // User authentication state
  tasks: TasksState;     // Task management state
  theme: ThemeState;     // UI theme preferences
}
```

#### **📋 Tasks Slice**
```typescript
interface TasksState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  dateFilters: {
    startDate: string | null;
    endDate: string | null;
  };
}

// Async thunks for API operations
export const fetchTasks = createAsyncThunk(/* ... */);
export const createTask = createAsyncThunk(/* ... */);
export const updateTask = createAsyncThunk(/* ... */);
export const deleteTask = createAsyncThunk(/* ... */);
```

#### **🔐 Auth Slice**
```typescript
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Authentication actions
export const signIn = createAsyncThunk(/* ... */);
export const signUp = createAsyncThunk(/* ... */);
export const signOut = createAction(/* ... */);
```

#### **🎨 Theme Slice**
```typescript
interface ThemeState {
  mode: 'light' | 'dark';
  systemPreference: 'light' | 'dark';
}

// Theme actions
export const toggleTheme = createAction<void>();
export const setThemeMode = createAction<'light' | 'dark'>();
```

---

## 🧩 Component Architecture

### **📱 Core Components**

#### **🏠 DashboardPage**
```typescript
const DashboardPage = () => {
  // Main dashboard with 3-column layout
  // Drag-and-drop functionality
  // Search and filter controls
  // AI suggestions sidebar
};
```

#### **📋 TaskCard**
```typescript
interface TaskCardProps {
  task: Task;
  onEdit: () => void;
  dragHandleProps?: any;
}

const TaskCard = ({ task, onEdit, dragHandleProps }) => {
  // Glass morphism card design
  // Edit/delete actions
  // Due date and overdue indicators
  // Drag handle integration
};
```

#### **🤖 AITaskSuggestions**
```typescript
const AITaskSuggestions = () => {
  // AI prompt input
  // Loading states with skeleton
  // Suggestion cards with actions
  // Add individual/bulk functionality
};
```

#### **📝 TaskForm**
```typescript
interface TaskFormProps {
  open: boolean;
  onClose: () => void;
  task?: Task | null;
}

const TaskForm = ({ open, onClose, task }) => {
  // Modal form for create/edit
  // DateTime picker for due dates
  // Form validation
  // Material-UI components
};
```

### **🔒 Route Protection**
```typescript
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
  
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }
  
  return <>{children}</>;
};
```

---

## 🌐 API Integration

### **📡 Axios Configuration**
```typescript
// API instance with interceptors
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

// Request interceptor for auth tokens
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Auto logout on token expiry
      localStorage.removeItem('token');
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);
```

### **🔌 API Services**
```typescript
// Authentication API
export const authApi = {
  signup: (data: SignupData) => api.post('/auth/signup', data),
  signin: (data: SigninData) => api.post('/auth/signin', data),
};

// Tasks API
export const tasksApi = {
  getGrouped: () => api.get('/tasks/grouped'),
  create: (data: CreateTaskData) => api.post('/tasks', data),
  update: (id: string, data: UpdateTaskData) => api.patch(`/tasks/${id}`, data),
  delete: (id: string) => api.delete(`/tasks/${id}`),
  search: (filters: FilterTaskData) => api.get('/tasks', { params: filters }),
};

// AI API
export const aiApi = {
  suggestTasks: (query: string) => api.post('/ai/suggest-tasks', { query }),
};
```

---

## 🎯 Features Deep Dive

### **🖱️ Drag & Drop Implementation**
```typescript
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const onDragEnd = (result: DropResult) => {
  if (!result.destination) return;
  
  const { source, destination, draggableId } = result;
  
  if (source.droppableId !== destination.droppableId) {
    // Move task between columns
    dispatch(updateTaskStatus({
      taskId: draggableId,
      newStatus: destination.droppableId as TaskStatus
    }));
  }
};
```

### **🔍 Search & Filter System**
```typescript
// Debounced search implementation
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  
  return debouncedValue;
};

// Search and filter logic
const debouncedSearch = useDebounce(searchQuery, 500);

useEffect(() => {
  dispatch(searchTasks({
    title: debouncedSearch,
    startDate: filters.startDate,
    endDate: filters.endDate
  }));
}, [debouncedSearch, filters.startDate, filters.endDate]);
```

### **🎨 Glass Morphism Styling**
```typescript
const glassCardStyle = {
  background: theme.palette.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.05)' 
    : 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(20px)',
  borderRadius: '16px',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  boxShadow: theme.palette.mode === 'dark'
    ? '0 4px 16px rgba(0, 0, 0, 0.2)'
    : '0 4px 16px rgba(0, 0, 0, 0.08)',
};
```

---

## 🔒 Security Considerations

### **🛡️ Authentication Security**
- **JWT tokens** stored in localStorage
- **Automatic token cleanup** on logout/expiry
- **Protected routes** with authentication checks
- **API request signing** with Bearer tokens

### **🔐 Input Validation**
- **Client-side validation** for immediate feedback
- **Type safety** with TypeScript interfaces
- **Sanitized inputs** to prevent XSS attacks

---

## 📱 Responsive Design

### **📊 Breakpoints**
```typescript
const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,      // Mobile phones
      sm: 600,    // Tablets
      md: 900,    // Small laptops
      lg: 1200,   // Desktops
      xl: 1536,   // Large screens
    },
  },
});
```

### **📱 Mobile Optimizations**
- **Touch-friendly** drag and drop
- **Responsive grid system** with Material-UI
- **Mobile-optimized** date/time pickers
- **Collapsible navigation** for small screens

---

## 🧪 Development Best Practices

### **📝 Code Quality**
- **TypeScript strict mode** enabled
- **ESLint configuration** with React rules
- **Prettier formatting** for consistent code style
- **Import organization** with absolute paths

### **⚡ Performance Optimizations**
- **Code splitting** with React.lazy()
- **Memoization** with React.memo() and useMemo()
- **Bundle analysis** with Vite bundle analyzer
- **Image optimization** with proper formats

### **♿ Accessibility**
- **ARIA labels** on interactive elements
- **Keyboard navigation** support
- **Screen reader compatibility**
- **Color contrast compliance**

---

## 🚀 Deployment

### **📦 Production Build**
```bash
# Build optimized production bundle
npm run build

# Build output in dist/ directory
# Ready for static hosting (Netlify, Vercel, etc.)
```

### **🌍 Environment Configuration**
```bash
# Production environment variables
VITE_API_BASE_URL=https://api.zigtask.com
VITE_NODE_ENV=production
```

### **📊 Build Analysis**
```bash
# Analyze bundle size
npm run build -- --analyze

# Check for unused dependencies
npx depcheck
```

---

## 🔮 Future Enhancements

### **🎯 Planned Features**
- [ ] **Real-time collaboration** with WebSockets
- [ ] **Offline support** with service workers
- [ ] **Push notifications** for task reminders
- [ ] **Progressive Web App** (PWA) features

### **🧪 Testing Roadmap**
- [ ] **Unit tests** with React Testing Library
- [ ] **Integration tests** for user flows
- [ ] **E2E tests** with Cypress or Playwright
- [ ] **Visual regression tests** with Chromatic

### **⚡ Performance Improvements**
- [ ] **Virtual scrolling** for large task lists
- [ ] **Lazy loading** for images and components
- [ ] **Caching strategies** with React Query
- [ ] **Bundle optimization** with tree shaking

---

## 📞 Support & Contributing

### **🐛 Bug Reports**
1. Check existing issues on GitHub
2. Create detailed bug report with reproduction steps
3. Include browser/OS information

### **🚀 Feature Requests**
1. Discuss new features in GitHub discussions
2. Follow contribution guidelines
3. Submit pull requests with tests

### **📚 Documentation**
- **Component documentation** with Storybook (planned)
- **API integration guides**
- **Deployment tutorials**

---

## ⚖️ License

This project is part of a technical assessment and is for demonstration purposes only.

---

**Built with ❤️ using React, TypeScript, and Material-UI**