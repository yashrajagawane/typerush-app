# ⌨️ TypeRush

> **Learn. Type. Improve. Rush.** A modern, highly engaging typing-speed learning game built with React, Vite, and Tailwind CSS.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

TypeRush is not just a standard typing test—it's an interactive arcade experience designed to help you improve your Words Per Minute (WPM) and accuracy through progressive lessons, daily challenges, and intense minigames.

---

## ✨ Key Features

*   **🎮 Arcade Minigames:** Practice under pressure! Survive the horde in *Zombie Defense*, dodge space debris in *Asteroid Runner*, type code in *Matrix Mode*, or speed through the *Race Game*.
*   **📚 50 Progressive Lessons:** Journey from basic home-row keystrokes all the way up to advanced React Hooks, Regex, and complex punctuation.
*   **🏆 Daily Challenges:** Form a habit with unique daily quotes and build your typing streak.
*   **📊 Advanced Analytics:** Track your WPM, accuracy, total characters typed, and unlock achievements as you level up.
*   **🔊 Immersive Audio:** High-quality sound effects provide satisfying feedback for keystrokes, errors, and game events.
*   **🎨 Premium UI:** A beautiful, dark-mode-first aesthetic with smooth animations powered by Framer Motion.

---

## 🚀 Getting Started

Want to run TypeRush locally on your machine? Follow these simple steps:

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v18 or higher recommended).

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/typerush-app.git
   cd typerush-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000` (or the port provided in your terminal).

---

## 📂 Project Structure

Here is a quick overview of the core file structure to help you navigate the codebase:

```text
📦 typerush-app
 ┣ 📂 public/              # Static public assets (icons, etc.)
 ┣ 📂 src/
 ┃ ┣ 📂 components/        # Reusable UI parts
 ┃ ┃ ┣ 📜 Navigation.tsx     # Sidebar navigation menu
 ┃ ┃ ┣ 📜 VirtualKeyboard.tsx# On-screen keyboard visualizer
 ┃ ┃ ┗ 📜 StreakCalendar.tsx # Daily streak visualizer
 ┃ ┣ 📂 lib/               # Core game logic and utilities
 ┃ ┃ ┣ 📜 typingEngine.ts    # WPM and accuracy calculation logic
 ┃ ┃ ┗ 📜 audio.ts           # Sound effect synthesizers
 ┃ ┣ 📂 screens/           # Main application views
 ┃ ┃ ┣ 📜 Dashboard.tsx      # Main hub
 ┃ ┃ ┣ 📜 Lessons.tsx        # 50-level progression screen
 ┃ ┃ ┣ 📜 Games.tsx          # Arcade game selector
 ┃ ┃ ┣ 📜 ZombieGame.tsx     # Zombie survival typing minigame
 ┃ ┃ ┣ 📜 AsteroidGame.tsx   # Asteroid dodging minigame
 ┃ ┃ ┗ 📜 MatrixGame.tsx     # Hacker/Terminal typing mode
 ┃ ┣ 📜 App.tsx            # Main application router/wrapper
 ┃ ┣ 📜 store.ts           # Global state management (Zustand/Context)
 ┃ ┣ 📜 data.ts            # Static data (Lessons, Achievements, Challenges)
 ┃ ┗ 📜 types.ts           # Global TypeScript interfaces
 ┣ 📜 index.html           # HTML entry point
 ┣ 📜 package.json         # Project dependencies and scripts
 ┗ 📜 vite.config.ts       # Vite bundler configuration
```

---

## 🌍 Deployment

TypeRush is fully optimized for static hosting platforms. We have included two detailed deployment guides in the repository:

*   **[Deploying to Vercel](./DEPLOYMENT_VERCEL.md)** (Recommended for ease of use and backend-friendly features)
*   **[Deploying to GitHub Pages](./DEPLOYMENT_GITHUB.md)** (Great for entirely free, static front-end hosting)

---

## 🛠️ Built With

*   **[React](https://react.dev/)** - UI Library
*   **[Vite](https://vitejs.dev/)** - Build Tool
*   **[Tailwind CSS v4](https://tailwindcss.com/)** - Styling
*   **[Framer Motion](https://motion.dev/)** - Animations
*   **[Lucide React](https://lucide.dev/)** - Icons

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/your-username/typerush-app/issues) if you want to contribute.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).
