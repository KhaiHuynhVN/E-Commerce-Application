# E-Commerce Application

A modern e-commerce web application built with React, TypeScript, and Redux Toolkit.

---

## 🚀 How to Run the Project

### Prerequisites

- Node.js v18.0.0+
- npm v9.0.0+

### Installation & Running

```bash
# Clone repository
git clone https://github.com/KhaiHuynhVN/E-Commerce-Application.git
cd E-Commerce-Application

# Install dependencies
npm install

# Start development server
npm run dev
# → http://localhost:5173

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 📁 Folder Structure

```
src/
├── assets/                 # Icons, images, translations (i18n)
├── commonComponents/       # Reusable UI (Button, Input, Modal)
├── components/             # Shared components (Loaders, Notifications)
├── layouts/                # Layout components (Header, Sidebar)
├── pages/                  # Page components
│   ├── LoginPage/
│   ├── ProductListPage/
│   ├── CartPage/
│   ├── CheckoutPage/
│   └── OrderConfirmationPage/
├── routes/                 # Routing configuration
├── services/               # API services (auth, carts, products, users)
├── store/                  # Redux store (slices, selectors)
├── utils/                  # Utilities (configs, formats, schemas, types)
├── hooks/                  # Custom React hooks
├── App.tsx
└── main.tsx
```

---

## 💡 Challenges and Considerations During Implementation

### 1. **Converting Internal Component Library from JavaScript to TypeScript**

The project required using a pre-existing component library (Button, Input, Modal, Notification system) originally written in JavaScript. Converting these to TypeScript while maintaining functionality and integrating with react-hook-form, Redux, and other typed libraries required:

- Creating comprehensive type definitions for all component props
- Converting complex hooks (`useInput`, `useNotify`) with proper type inference

**Result**: Full TypeScript support with IntelliSense and compile-time type checking.

---

### 2. **Global Pending State Management and Request Cancellation**

Managing loading states across pages and preventing memory leaks from unmounted components required a comprehensive solution:

**Pending State Management**:

- Implemented **PendingManager** class (singleton) to centrally track all async operations
- Integrated with **Redux** (pendingManagerSlice) for reactive state updates
- All service functions follow consistent pattern: set pending → API call → clear pending

**Request Cancellation (AbortController)**:

- Integrated AbortController in all pages making API calls (ProductListPage, CartPage, CheckoutPage)
- Per-product cancellation using `Map<productId, AbortController>` for cart updates
- `useEffect` cleanup aborts pending requests on unmount
- All service functions accept optional `signal?: AbortSignal` parameter

**Result**: Zero memory leaks, no console errors, proper handling of race conditions.

---

### 3. **Learning and Implementing DummyJSON API While Developing**

Building the application required simultaneously learning the DummyJSON API through documentation and experimentation:

**Key Challenges**:

- Understanding available endpoints (`/auth/login`, `/products`, `/carts`, `/users`)
- Discovering limitations (POST/PUT/DELETE don't persist data, no order endpoints)
- Handling data inconsistencies (cart products missing `discountedPrice` in GET but present in PUT)

**Solutions**:

- Data normalization in service layer to calculate missing `discountedPrice` fields
- Simulated order placement by updating user info and deleting cart
- Implemented dual token refresh strategy (proactive + reactive)
- Created TypeScript interfaces based on actual API responses

**Result**: Fully functional e-commerce flow with graceful handling of API limitations.
