# URL Shortener

A simple and efficient URL shortening service built with React, Material-UI, and Firebase. Create short, memorable links from long, unwieldy URLs.

## ✨ Features

- **Authentication**: Sign in with Google through Firebase Auth
- **Dark/Light Mode**: Toggle between dark and light themes
- **Responsive Design**: Built with Material-UI components
- **Protected Routes**: Secure routes for authenticated users
- **(Planned) URL Shortening**: Generate and manage short URLs
- **(Planned) Analytics**: Track usage of shortened URLs

---

## 🛠️ Tech Stack

- **Frontend**:
  - React.js with Vite
  - Material-UI (MUI)
  - Zustand for state management
  - Firebase Auth
  - React Router

- **Backend**:
  - Firebase Functions
  - Express.js
  - Firebase Admin SDK

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm
- Firebase CLI (`npm install -g firebase-tools`)

### Installation

1. **Clone the repository:**
   ```sh
   git clone <repository-url> && cd url-shortner
   ```

2. **Install dependencies:**
   ```sh
   # Root dependencies
   npm install

   # UI dependencies
   cd ui
   npm install
   cd ..

   # API dependencies
   cd api
   npm install
   cd ..
   ```

3. **Environment Setup:**
   Create a `.env.local` file in the `ui` directory with your Firebase configuration:
   ```env
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   ```

### Development

You can run the application in two modes:

#### UI Development Only (Recommended)
```sh
npm run dev:ui
```
This starts the Vite dev server at `http://localhost:5173`

#### Full Stack Development
```sh
npm run serve
```
This starts Firebase emulators for both hosting and functions

---

## 📝 Scripts

- `npm run dev` - Start UI development server
- `npm run serve` - Start Firebase emulators
- `npm run build:ui` - Build the UI for production
- `npm run deploy` - Build and deploy to Firebase

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📜 License

This project is licensed under the MIT License.
