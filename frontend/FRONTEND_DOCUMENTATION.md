# 📱 Expense Tracker Frontend Documentation

## Overview

The Expense Tracker mobile application is built using **React Native** and **Expo**. It features a premium dark-themed interface designed for simplicity, speed, and visual appeal. The app communicates with the Node.js/Express backend via a robust API service layer.

---

## Tech Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| Framework | React Native (Expo) | Latest |
| Navigation | React Navigation | 7.x |
| HTTP Client | Axios | 1.x |
| Storage | Async Storage | Latest |
| Icons | Expo Vector Icons | Latest |
| Styling | StyleSheet (Vanilla) | - |
| Context | React Context API | - |

---

## Project Structure

```
frontend/
├── src/
│   ├── config/
│   │   ├── colors.js         # Theme & color tokens
│   │   └── constants.js      # App constants & categories
│   ├── context/
│   │   └── AuthContext.js    # Auth state management
│   ├── navigation/
│   │   ├── AppNavigator.js   # Root navigation logic
│   │   ├── AuthNavigator.js  # Login/Register flow
│   │   └── MainNavigator.js  # Main app (Tabs) flow
│   ├── screens/
│   │   ├── SplashScreen.js   # Animated welcome screen
│   │   ├── LoginScreen.js    # User authentication
│   │   ├── RegisterScreen.js # Account creation
│   │   ├── DashboardScreen.js# Analytics & summary
│   │   ├── AddExpenseScreen.js# Create new expense
│   │   ├── HistoryScreen.js  # Sortable expense list
│   │   ├── EditExpenseScreen.js# Update/Delete expense
│   │   └── ProfileScreen.js  # User settings & logout
│   └── services/
│       └── api.js            # Axios client & API methods
├── App.js                    # Entry point
└── package.json              # Project configuration
```

---

## Features

### 1. Animated Splash Screen
- Smooth fade-in and scale animations.
- Pulsing logo with neon glow.
- Automatic transition to Auth or Main flow based on login status.

### 2. Authentication
- **Login/Register**: Premium dark-themed forms with validation.
- **Persistent Session**: Uses `AsyncStorage` to keep users logged in.
- **JWT Handling**: Automatically attaches tokens to every API request via Axios interceptors.

### 3. Dashboard (Home)
- **Total Spent**: Large card showing monthly spending with spending trend.
- **Quick Stats**: Highest and lowest expense of the month.
- **Category Breakdown**: List of categories with spend amount, transaction count, and percentage progress bars.
- **Recent Expenses**: Quick view of the last 5 transactions.

### 4. Expense Management
- **Add Expense**: Intuitive form with category selection, payment method, and note.
- **Edit/Delete**: Long-press any item in History to delete, or tap to edit.
- **History**: Full list of expenses with infinite scroll pagination and multiple sorting options (Latest, Oldest, Highest, Lowest).

### 5. Profile & Settings
- Personalized avatar and user details.
- Settings menu for profile edits, password changes, and budget management.
- Secure logout with confirmation.

---

## Design System

### Colors (Dark Theme)
- **Background**: Deep Indigo (`#0F0F1A`)
- **Primary**: Vibrant Purple (`#6C63FF`)
- **Secondary**: Cyan Accent (`#00D9FF`)
- **Cards**: Dark Slate (`#16213E`)
- **Text**: Pure White (`#FFFFFF`) / Muted Blue (`#A0AEC0`)

### Categories & Icons
- 🍕 **Food**: Red
- ✈️ **Travel**: Teal
- 🛍️ **Shopping**: Purple
- 💡 **Bills**: Amber
- 🏥 **Health**: Green
- 🎬 **Entertainment**: Pink
- 📚 **Education**: Blue
- 📦 **Others**: Grey

---

## Development Guide

### Prerequisites
- Node.js installed
- Expo Go app on your phone (optional for testing)
- Backend server running on `http://localhost:5000`

### Setup Instructions

1. **Install dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Configure API**:
   Open `src/config/constants.js` and update `API_BASE_URL` with your local machine's IP address if testing on a physical device.

3. **Start the app**:
   ```bash
   npx expo start --web
   ```
   Or for mobile:
   ```bash
   npx expo start
   ```

### Troubleshooting
- **Connection Refused**: Ensure the backend server is running and the `API_BASE_URL` is correct.
- **Web Build Errors**: Run `npx expo install react-dom react-native-web` if web support is missing.
