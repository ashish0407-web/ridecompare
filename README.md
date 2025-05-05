<h1 align="center">🚖 RideCompare</h1>
<p align="center">
  A futuristic ride fare comparison and prediction web app for Indian users.  
  Compare real-time fares, get AI-powered surge predictions, and plan smarter rides!  
</p>

<p align="center">
  <a href="https://ridecompare.vercel.app/" target="_blank"><strong>🌐 Live Demo</strong></a> • 
  <a href="#features">⚙️ Features</a> • 
  <a href="#tech-stack">🧰 Tech Stack</a> • 
  <a href="#installation">🚀 Getting Started</a> • 
  <a href="#screenshots">📸 Screenshots</a>
</p>

---

## 🚀 About RideCompare

**RideCompare** is a real-time fare comparison platform for ride-hailing services in India like **Uber**, **Ola**, and **Rapido**. It helps users:

- Compare fares, ETAs, and driver ratings.
- Predict fare surges using AI.
- Visualize demand hotspots.
- Optimize travel decisions with smart suggestions and historical data.

> Built for the modern commuter, with a sleek UI and advanced features powered by AI & real-time APIs.

---

## 🔥 Features

### 🧭 Core Functional
- 🚕 **Real-Time Fare Comparison** across Uber, Ola, Rapido
- ⏱️ **ETA Display** for pickup arrival
- 🌟 **Driver Ratings** included
- 🚗 **Filter by Ride Type**: Bike, Auto, Sedan, SUV
- 🔁 **Multi-Route Support**
- 📲 **One-Click Redirection** to provider apps
- 📍 **GPS-Based Auto Location Detection**

### 🧠 AI & Predictions
- 📈 **Surge Price Forecasting** using ML
- 📊 **Interactive Fare Graphs**
- 🧠 **Smart Ride Time Suggestions**
- 📉 **Offline Fare Estimation**
- 🗺️ **Heatmap for High-Demand Areas**

### 🎨 UI/UX & Accessibility
- 💻 **Responsive Web UI** with React.js
- 🧩 **PWA Support** (Installable like an app)
- 🎤 **Voice Input Support**
- 🌙 **Dark Mode & Theme Customization**
- 🌐 **Multi-Language Support**
- ♿ **WCAG Accessibility** compliant
- ✨ **Minimal Background Animations + AI Visuals**

### 🔐 User Experience
- 🔐 **Authentication** (Google, Email, Phone)
- 📜 **Ride History Logs**
- ❤️ **Favorite Routes**
- 🔔 **Fare Drop & Surge Alerts**
- ⚙️ **Custom Preferences**

### ⚙️ Backend & System
- 🌐 **Secure REST API** with Node.js + Express
- 🗃️ **MongoDB / PostgreSQL** Integration
- 🧼 **Scraper Layer** (where APIs are unavailable)
- 📊 **Admin Dashboard** + Analytics

---

## 🧰 Tech Stack

- **Frontend**: React.js, Tailwind CSS, Google Maps API
- **Backend**: Node.js, Express.js
- **Database**: MongoDB / PostgreSQL
- **APIs**: Uber, Ola, Rapido (where available) + scraping fallback
- **AI/ML**: Python model for surge prediction (optional integration)
- **Hosting**: Vercel (Frontend), Render/Heroku (Backend)

---

## 🛠️ Installation

```bash
# Clone the repo
git clone https://github.com/yourusername/ridecompare.git
cd ridecompare

# Install frontend dependencies
cd client
npm install

# Start frontend
npm start

# In a new terminal, run backend
cd ../server
npm install
npm run dev
