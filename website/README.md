# 🌐 Website Application - ML Roadmap Tracker

### _Production-Ready React Web Application_

<div align="center">
  
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-4.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)

![Netlify](https://img.shields.io/badge/Live-mlroadmap.netlify.app-00C853?style=for-the-badge&logo=netlify&logoColor=white)
![Performance](https://img.shields.io/badge/Lighthouse-95+-4FC08D?style=for-the-badge&logo=lighthouse&logoColor=white)

**[🔗 Live Demo](https://mlroadmap.netlify.app/) | [📱 Download Apps](https://github.com/Shahidur8381/-ML-Engineer-Roadmap/releases) | [📚 Main Docs](../README.md)**

</div>

---

## 🎯 Overview

This is the **main web application** for ML Roadmap Tracker - a sophisticated React-based platform for tracking your 52-week machine learning journey. Built with modern web technologies and optimized for production deployment.

## ✨ Key Features

- **📊 Progress Tracking**: Interactive 52-week ML curriculum tracker
- **☁️ Cloud Synchronization**: GitHub Gists integration for cross-device sync
- **📱 Responsive Design**: Optimized for desktop, tablet, and mobile
- **🎯 Project Milestones**: Track practical ML implementations
- **💡 Motivational System**: Daily quotes and progress celebrations
- **📈 Analytics Dashboard**: Visual progress insights and statistics

## 🛠️ Tech Stack

### Core Technologies

- **React 18.x** - Modern component-based architecture
- **TypeScript 5.x** - Type-safe development
- **Vite 4.x** - Lightning-fast build tool
- **Tailwind CSS 3.x** - Utility-first styling

### State & Data Management

- **Custom React Hooks** - Specialized state management
- **LocalStorage API** - Client-side persistence
- **GitHub API** - Cloud data synchronization

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ (LTS recommended)
- npm or yarn package manager

### Installation

1. **Navigate to web directory**

   ```bash
   cd web
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment setup**

   ```bash
   cp .env.example .env
   # Edit .env with your GitHub token
   ```

4. **Start development**
   ```bash
   npm run dev
   # Opens at http://localhost:5173
   ```

## 📁 Project Structure

```
website/
├── src/
│   ├── components/          # React components
│   │   ├── Dashboard.tsx    # Main dashboard
│   │   ├── WeekCard.tsx     # Week progress cards
│   │   ├── CloudSync.tsx    # Sync interface
│   │   ├── PM.tsx           # Project milestones
│   │   └── ...              # Other components
│   ├── hooks/               # Custom React hooks
│   │   ├── useLocalStorage.ts
│   │   └── useShawonProgress.ts
│   ├── services/            # API services
│   │   └── CloudSyncService.ts
│   ├── types/               # TypeScript types
│   │   └── index.ts
│   ├── App.tsx              # Main app component
│   └── index.tsx            # Entry point
├── public/                  # Static assets
│   ├── roadmap.json         # ML curriculum data
│   ├── manifest.json        # PWA manifest
│   └── ...                  # Icons and images
├── package.json             # Dependencies
├── vite.config.ts           # Vite config
└── tailwind.config.js       # Tailwind config
```

## 🔧 Available Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run preview      # Preview build
npm run lint         # Code linting
```

## ⚙️ Environment Configuration

Required environment variables:

```env
VITE_GITHUB_TOKEN=your_github_token
VITE_GIST_ID=your_gist_id
VITE_DEV_PASSWORD=dev_password
```

### GitHub Token Setup

1. Go to [GitHub Settings → Personal Access Tokens](https://github.com/settings/tokens)
2. Generate token with `gist` scope
3. Add to `.env` file

## 🏗️ Architecture

### Component Design

- **Modular Components**: Single responsibility principle
- **Custom Hooks**: Encapsulated state and effects
- **Service Layer**: API abstraction
- **Type Safety**: Full TypeScript coverage

### Performance Features

- **Code Splitting**: Dynamic imports for optimization
- **Lazy Loading**: Efficient resource loading
- **Memoization**: Optimized re-renders
- **Bundle Optimization**: < 500KB gzipped

## 📱 Progressive Web App

PWA capabilities included:

- **Offline Support**: Core functionality without internet
- **Installable**: Add to home screen
- **Fast Loading**: Optimized caching
- **Responsive**: Works on all devices

## 🚀 Deployment

### Production Build

```bash
npm run build
```

### Hosting Platforms

- **Netlify** (Current): Auto-deploy from Git
- **Vercel**: Zero-config deployment
- **GitHub Pages**: Static hosting

### Performance Targets

- **Lighthouse Score**: 95+
- **Bundle Size**: < 500KB
- **FCP**: < 1.5s
- **TTI**: < 3s

## 🔗 Related Links

- **[Live Application](https://mlroadmap.netlify.app/)**
- **[Main Repository](https://github.com/Shahidur8381/-ML-Engineer-Roadmap)**
- **[Android App](../android%20app/README.md)**
- **[iOS App](../ios%20app/README.md)**
- **[Project Documentation](../README.md)**
