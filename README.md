# 🎧 Sonic-Stream

![Build](https://img.shields.io/badge/build-student%20project-blue)
![Status](https://img.shields.io/badge/status-learning%20project-yellow)
![Platform](https://img.shields.io/badge/platform-Web%20%7C%20Android-lightgrey)
![React](https://img.shields.io/badge/React-18-blue?logo=react)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase\&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)
![License](https://img.shields.io/badge/License-MIT-green)

**Sonic-Stream** is a modern, streaming-focused music application built as a **student project**. The goal of this project is to explore real-world application development including authentication, cloud storage, smooth media playback, and production deployment.

> ⚠️ This project is built for learning purposes. Bugs may exist and updates may be limited.

---

## 🌐 Live Demo

* **Web App:** [https://sonic-stream.vercel.app](https://sonic-stream.vercel.app)

---

## ✨ Features

* 🔐 Google authentication using Supabase
* 🎵 Upload and stream your own music
* 📚 User-specific music library
* ☁️ Cloud storage via Supabase Storage
* 🎧 Clean, minimal music player UI
* 📱 Mobile-friendly design
* ⚡ Smooth scrolling and transitions

---

## 🛠️ Tech Stack

**Frontend**

* React
* TypeScript
* Vite
* Tailwind CSS

**Backend / Services**

* Supabase (Auth, Database, Storage)
* Google OAuth

**Deployment**

* Vercel

**Mobile App**

* Android (WebView-based)

---

## 🗂️ Project Structure

```
Sonic-Stream/
├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── lib/
│   └── styles/
├── public/
├── android/
├── .env.example
├── README.md
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

* Node.js (v18+ recommended)
* npm or yarn
* Supabase account
* Google Cloud OAuth credentials

### Installation

```bash
git clone https://github.com/<your-username>/sonic-stream.git
cd sonic-stream
npm install
```

### Run locally

```bash
npm run dev
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 🔐 Authentication Flow

* User signs in with Google
* Supabase manages authentication sessions
* Each user has a private music library
* On logout, user data is hidden from the UI

---

## 📱 Android App Build (Optional)

1. Install **JDK 17**
2. Install **Android Studio**
3. Open the `android/` folder in Android Studio
4. Build APK:

```
Build > Build Bundle(s) / APK(s) > Build APK(s)
```

---

## ⚠️ Disclaimer

This project is built by a student as a learning exercise.

* Bugs may exist
* Updates are not guaranteed
* Not intended for production use

---

## 🌱 What I Learned

* OAuth authentication and session handling
* Supabase storage and database integration
* Building a real-world media app
* Debugging OAuth issues in production
* Web-to-Android app conversion

---

## 🤝 Contributing

Contributions are welcome for learning purposes:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a pull request

---

## 📜 License

This project is licensed under the **MIT License**.

---

## 🙌 Credits

* Supabase
* Google OAuth
* Vercel
* Shields.io

---

Built with ❤️ as a student project.
