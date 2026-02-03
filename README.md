# 🎮 Quiz Blast - Live Multiplayer Quiz Platform

<div align="center">

![Quiz Blast](https://img.shields.io/badge/Quiz-Blast-blueviolet?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61dafb?style=for-the-badge&logo=react)
![Firebase](https://img.shields.io/badge/Firebase-Realtime-orange?style=for-the-badge&logo=firebase)
![Vite](https://img.shields.io/badge/Vite-5-646cff?style=for-the-badge&logo=vite)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**Interactive real-time multiplayer quiz platform for webinars, classrooms, and events**

[Live Demo](#) • [Report Bug](https://github.com/yourusername/quiz-blast/issues) • [Request Feature](https://github.com/yourusername/quiz-blast/issues)

</div>

---

## ✨ Features

### 🎯 Core Features

- **🚀 Self-Paced Mode** - Players answer at their own speed (like Quizizz)
- **⚡ Real-time Sync** - Instant updates across all devices via Firebase
- **👥 Room-Based System** - Easy join with 6-character room codes
- **📊 Live Leaderboard** - Track player progress and scores in real-time
- **🎨 Modern UI** - Beautiful retro-gaming aesthetic with smooth animations
- **📱 Responsive Design** - Works perfectly on mobile, tablet, and desktop

### 🎓 Perfect For

- Webinars and online presentations
- Classroom engagement
- Team building activities
- Corporate training sessions
- Live events and conferences

### 🔗 Smart Link Sharing

- **Direct Join Links** - Share `?room=ABC123&mode=player` for instant access
- **Pre-filled Forms** - Room code auto-populated from URL
- **One-Click Copy** - Share links via WhatsApp, Telegram, or email

---

## 🎬 Demo

### Host View

![Host Dashboard](https://via.placeholder.com/800x400/667eea/ffffff?text=Host+Dashboard+-+Monitor+Players+in+Real-time)

### Player View

![Player Screen](https://via.placeholder.com/800x400/764ba2/ffffff?text=Player+Screen+-+Self-Paced+Quiz)

### Results

![Leaderboard](https://via.placeholder.com/800x400/f093fb/ffffff?text=Final+Leaderboard+with+Podium)

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Firebase account (free tier)
- Modern web browser

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/quiz-blast.git
cd quiz-blast
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure Firebase**

Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com):

- Enable Realtime Database
- Copy your config
- Update `quiz-self-paced.jsx` lines 7-14 with your config:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};
```

4. **Run development server**

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📖 Usage

### For Hosts (Presenters)

1. **Create a Quiz**
   - Choose a topic or category
   - Click "Create Room"
   - Get a unique 6-character room code

2. **Share with Participants**
   - Copy the shareable link: `https://your-app.com/?room=ABC123&mode=player`
   - Or share the room code: `ABC123`

3. **Start the Quiz**
   - Wait for participants to join
   - Click "START GAME"
   - Monitor progress on the live dashboard

4. **View Results**
   - Click "End Quiz & Show Results"
   - See final standings with podium

### For Players (Participants)

1. **Join via Link**
   - Click the link shared by host
   - Enter your name
   - Click "Join Quiz"

2. **Play the Quiz**
   - Answer questions at your own pace
   - Get instant feedback (correct/wrong)
   - Earn points based on speed
   - Auto-advance to next question

3. **See Your Score**
   - View your position on leaderboard
   - See final results with podium

---

## 🛠️ Tech Stack

| Technology                     | Purpose                 |
| ------------------------------ | ----------------------- |
| **React 18**                   | UI framework            |
| **Vite 5**                     | Build tool & dev server |
| **Firebase Realtime Database** | Real-time data sync     |
| **Tailwind CSS**               | Styling                 |
| **Lucide React**               | Icons                   |
| **Vercel**                     | Hosting (optional)      |

---

## 📂 Project Structure

```
quiz-blast/
├── public/
├── src/
│   ├── quiz-self-paced.jsx   # Main component
│   ├── main.jsx               # Entry point
│   ├── index.css              # Global styles
│   └── ...
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

---

## 🎨 Customization

### Question Banks

Edit `QUESTION_BANK` in `quiz-self-paced.jsx`:

```javascript
const QUESTION_BANK = {
  "your-topic": [
    {
      question: "Your question?",
      options: ["A", "B", "C", "D"],
      correctAnswer: 0, // Index of correct answer
    },
    // ... more questions
  ],
};
```

### Styling

- **Colors**: Edit Tailwind classes in components
- **Timer**: Change `setTimeLeft(15)` to desired seconds
- **Scoring**: Modify formula in `handleAnswerSelect`

### Branding

Replace "QUIZ BLAST" text and colors to match your brand.

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Install Vercel CLI**

```bash
npm install -g vercel
```

2. **Deploy**

```bash
vercel
```

3. **Done!** Get your production URL

### Alternative: Manual Build

```bash
npm run build
```

Upload `dist/` folder to any static hosting (Netlify, GitHub Pages, etc.)

---

## 🔒 Security

### Firebase Rules (Production)

Update your Firebase Realtime Database rules:

```json
{
  "rules": {
    "rooms": {
      "$roomCode": {
        ".read": true,
        ".write": true,
        ".indexOn": ["createdAt"]
      }
    }
  }
}
```

### Best Practices

- ✅ Never commit Firebase API keys to public repos
- ✅ Use environment variables for sensitive data
- ✅ Enable Firebase security rules
- ✅ Implement room expiration (24-48 hours)

---

## 📊 Scalability

| Players | Firebase Tier         | Status         |
| ------- | --------------------- | -------------- |
| 1-30    | Free                  | ✅ Perfect     |
| 30-100  | Free                  | ✅ Good        |
| 100-500 | Spark ($1/mo)         | ✅ Recommended |
| 500+    | Blaze (Pay-as-you-go) | ✅ Scalable    |

**Firebase Free Tier includes:**

- 100 simultaneous connections
- 1 GB storage
- 10 GB/month bandwidth

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with [React](https://react.dev/)
- Powered by [Firebase](https://firebase.google.com/)
- Icons from [Lucide](https://lucide.dev/)
- Inspired by Kahoot and Quizizz

---

## 📧 Contact

Your Name - [@yourtwitter](https://twitter.com/yourtwitter)

Project Link: [https://github.com/yourusername/quiz-blast](https://github.com/yourusername/quiz-blast)

---

## 🎯 Roadmap

- [ ] AI-powered question generation from files
- [ ] Custom themes and branding
- [ ] Export results to CSV
- [ ] Team mode (group competitions)
- [ ] Voice/video integration
- [ ] Mobile app (React Native)
- [ ] Question import from Excel/Google Sheets
- [ ] Analytics dashboard

---

## 🐛 Known Issues

See the [issues page](https://github.com/yourusername/quiz-blast/issues) for known bugs and feature requests.

---

<div align="center">

Made with ❤️ for educators and presenters worldwide

**⭐ Star this repo if you find it useful!**

</div>
