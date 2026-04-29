# 💰 Expense Tracker - Full Stack App

A comprehensive, enterprise-grade expense management solution featuring a professional web dashboard, mobile application, and a robust RESTful API.

## 🌟 Key Features
- **Real-time Analytics**: Dynamic charts and spending trends.
- **Multi-Platform**: Professional Web Portal + Expo-based Mobile App.
- **Secure Authentication**: JWT-based auth with encrypted password storage.
- **Cloud Powered**: Firestore database integration for real-time synchronization.
- **Premium UI**: Sleek glassmorphism design with professional dark/light modes.

---

## 🏗️ Project Structure
```bash
├── backend/            # Node.js + Express API
├── frontend/           # Expo (React Native Web) Mobile/Web App
├── official-website/   # Vite + React Landing Page & Dashboard
├── firebase.json       # Firebase Hosting & Services Config
└── firestore.rules     # Database Security Rules
```

---

## 🚀 Setup & Run Instructions

### 1. Backend (API)
The backend is a Node.js Express server connected to MongoDB.

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and add your credentials:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   NODE_ENV=development
   ```
4. Run the server:
   ```bash
   npm run dev
   ```

### 2. Official Website (Vite)
The professional dashboard for the expense tracker.

1. Navigate to the website directory:
   ```bash
   cd official-website
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run in development mode (HTTPS enabled):
   ```bash
   npm run dev
   ```

### 3. Frontend (Expo)
The cross-platform mobile application.

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the app:
   ```bash
   npx expo start
   ```

---

## 🔒 Security Features
- **HTTPS by Default**: Local development is configured with SSL using self-signed certificates.
- **Security Headers**: Implemented using `helmet` on the backend.
- **Rate Limiting**: Protection against brute-force attacks on auth routes.

## 🛠️ Tech Stack
- **Frontend**: React, Vite, Framer Motion, Lucide Icons, Recharts.
- **Mobile**: React Native, Expo.
- **Backend**: Node.js, Express, MongoDB, Mongoose.
- **Cloud**: Firebase Hosting, Firestore, Firebase Auth.

---

## 📄 License
This project is licensed under the ISC License.
