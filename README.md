# 📰 Personalized News Digest

A premium, full-stack news aggregation platform that delivers tailored news content based on user-defined topics. Built with a modern tech stack and a focus on high-fidelity, responsive design.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)
![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Node](https://img.shields.io/badge/Node-20-green?logo=node.js)

## ✨ Features

- **Personalized Topics**: Curate your own news feed by adding or removing topics of interest.
- **Premium UI/UX**: High-fidelity dashboard featuring glassmorphism, smooth animations, and a modern color palette.
- **Fully Responsive**: Optimized for all devices, from mobile phones to large desktop monitors.
- **Secure Authentication**: JWT-based secure login and registration system.
- **Automated Digests**: Integrated cron jobs to deliver news digests periodically.
- **Real-time News**: Fetches latest articles from reliable news sources.

## 🚀 Tech Stack

### Frontend
- **React 19** (Vite)
- **Tailwind CSS** for styling
- **React Router 7** for navigation
- **Lucide React** for premium iconography

### Backend
- **Node.js** & **Express**
- **MongoDB** with **Mongoose** ORM
- **JWT** (JSON Web Tokens) for authentication
- **Node-cron** for automated tasks
- **Axios** for external API integrations

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- News API Key

### 1. Clone the Repository
```bash
git clone https://github.com/snehan02/personalized-news-digest.git
cd personalized-news-digest
```

### 2. Install Dependencies
Install root and backend dependencies:
```bash
npm install
```

Install frontend dependencies:
```bash
cd client
npm install
cd ..
```

### 3. Environment Variables
Create a `.env` file in the root directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NEWS_API_KEY=your_news_api_key
```

### 4. Run the Application
Start the backend:
```bash
npm start
```

Start the frontend (in a separate terminal):
```bash
cd client
npm run dev
```

## 📱 Mobile View
The application is fully optimized for mobile devices, ensuring a seamless experience with stacked layouts and touch-friendly interactive elements.

## 📄 License
This project is licensed under the MIT License.

---
Built with ❤️ by [Sneha](https://github.com/snehan02)
