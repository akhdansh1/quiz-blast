import React, { useState, useEffect } from 'react';
import { Zap, Trophy, Users, Brain, Sparkles, CheckCircle, XCircle, Clock, Play, LogIn, Share2, Download, BarChart3, Crown, Medal, Award, Copy, Check } from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue, push, remove, update, get } from 'firebase/database';

// FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyDUP7fjysobAx2hFNb-HfNY2JVKNbo1Q1Q",
  authDomain: "quiz-blast-live.firebaseapp.com",
  databaseURL: "https://quiz-blast-live-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "quiz-blast-live",
  storageBucket: "quiz-blast-live.firebasestorage.app",
  messagingSenderId: "940042464539",
  appId: "1:940042464539:web:29a9308b84a53be5fd37be",
  measurementId: "G-CM9HZ0V585"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// DEMO QUESTIONS BANK
const QUESTION_BANK = {
  'webinar': [
    {
      question: "Mengapa tahun 2026 dianggap berbeda bagi programmer pemula dibandingkan tahun-tahun sebelumnya?",
      options: [
        "Bahasa pemrograman semakin sedikit",
        "AI menjadi asisten utama dalam coding dan peluang karier semakin luas",
        "Semua pekerjaan programmer digantikan AI",
        "Tidak perlu portofolio untuk melamar kerja"
      ],
      correctAnswer: 1
    },
    {
      question: "Apa pesan utama dari Tips 1: \"Jangan Harus Tahu Semua, Fokus pada Dasar\"?",
      options: [
        "Programmer harus menguasai semua teknologi terbaru",
        "Fokus pada framework populer saja",
        "Memahami dasar pemrograman lebih penting daripada mengetahui semuanya",
        "Menghindari belajar hal baru"
      ],
      correctAnswer: 2
    },
    {
      question: "Bagaimana peran AI seperti ChatGPT menurut materi tersebut?",
      options: [
        "Sebagai pengganti programmer",
        "Sebagai alat hiburan",
        "Sebagai asisten untuk debugging dan brainstorming",
        "Sebagai penilai hasil coding"
      ],
      correctAnswer: 2
    },
    {
      question: "Mengapa kemampuan bahasa Inggris penting bagi programmer pemula?",
      options: [
        "Agar bisa bekerja di luar negeri saja",
        "Karena dokumentasi dan sumber belajar berkualitas banyak tersedia dalam bahasa Inggris",
        "Karena semua bahasa pemrograman menggunakan bahasa Inggris penuh",
        "Agar terlihat lebih profesional di media sosial"
      ],
      correctAnswer: 1
    },
    {
      question: "Apa manfaat utama membangun jaringan dan aktif di komunitas developer?",
      options: [
        "Mendapatkan sertifikat dengan cepat",
        "Mengurangi kebutuhan belajar mandiri",
        "Mendapat pengalaman nyata, koneksi, dan peluang mentoring",
        "Menghindari kesalahan dalam menulis kode"
      ],
      correctAnswer: 2
    }
  ],
  'javascript': [
    {
      question: "What does 'const' keyword do in JavaScript?",
      options: ["Creates a mutable variable", "Creates an immutable binding", "Creates a function", "Deletes a variable"],
      correctAnswer: 1
    },
    {
      question: "Which method adds an element to the end of an array?",
      options: ["push()", "pop()", "shift()", "unshift()"],
      correctAnswer: 0
    },
    {
      question: "What is the output of: typeof null",
      options: ["'null'", "'undefined'", "'object'", "'number'"],
      correctAnswer: 2
    },
    {
      question: "Which keyword is used to create a class?",
      options: ["class", "function", "object", "constructor"],
      correctAnswer: 0
    },
    {
      question: "What does the '===' operator do?",
      options: ["Assigns a value", "Compares values only", "Compares value and type", "Logical AND"],
      correctAnswer: 2
    }
  ],
  'react': [
    {
      question: "What is JSX in React?",
      options: ["A JavaScript framework", "Syntax extension for JavaScript", "A CSS library", "A testing tool"],
      correctAnswer: 1
    },
    {
      question: "Which hook is used for side effects?",
      options: ["useState", "useEffect", "useContext", "useRef"],
      correctAnswer: 1
    },
    {
      question: "How do you pass data from parent to child?",
      options: ["State", "Props", "Context", "Redux"],
      correctAnswer: 1
    },
    {
      question: "What is the Virtual DOM?",
      options: ["Real DOM copy", "Lightweight DOM representation", "CSS framework", "Browser API"],
      correctAnswer: 1
    },
    {
      question: "Which method is used to update state?",
      options: ["this.state =", "setState()", "updateState()", "changeState()"],
      correctAnswer: 1
    }
  ],
  'indonesia': [
    {
      question: "Siapa presiden pertama Indonesia?",
      options: ["Soekarno", "Soeharto", "Habibie", "Megawati"],
      correctAnswer: 0
    },
    {
      question: "Kapan Indonesia merdeka?",
      options: ["17 Agustus 1945", "17 Agustus 1944", "1 Juni 1945", "20 Mei 1908"],
      correctAnswer: 0
    },
    {
      question: "Apa ibukota Indonesia?",
      options: ["Bandung", "Surabaya", "Jakarta", "Medan"],
      correctAnswer: 2
    },
    {
      question: "Berapa jumlah pulau di Indonesia?",
      options: ["13.000", "15.000", "17.000", "19.000"],
      correctAnswer: 2
    },
    {
      question: "Apa mata uang Indonesia?",
      options: ["Ringgit", "Rupiah", "Baht", "Dollar"],
      correctAnswer: 1
    }
  ],
  'general': [
    {
      question: "What is the capital of France?",
      options: ["London", "Berlin", "Paris", "Madrid"],
      correctAnswer: 2
    },
    {
      question: "Which planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Jupiter", "Saturn"],
      correctAnswer: 1
    },
    {
      question: "What is the largest ocean on Earth?",
      options: ["Atlantic", "Indian", "Arctic", "Pacific"],
      correctAnswer: 3
    },
    {
      question: "Who painted the Mona Lisa?",
      options: ["Van Gogh", "Picasso", "Da Vinci", "Michelangelo"],
      correctAnswer: 2
    },
    {
      question: "What year did World War II end?",
      options: ["1943", "1944", "1945", "1946"],
      correctAnswer: 2
    }
  ]
};

const LiveQuizPlatform = () => {
  const [userMode, setUserMode] = useState(null);
  const [gameState, setGameState] = useState('setup');
  const [roomCode, setRoomCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [playerId, setPlayerId] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [players, setPlayers] = useState([]);
  const [quizTopic, setQuizTopic] = useState('');
  const [questions, setQuestions] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState(null);
  const [isHost, setIsHost] = useState(false);
  const [copied, setCopied] = useState(false);
  const [preSelectedMode, setPreSelectedMode] = useState(null);

  // Check URL params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlRoomCode = params.get('room');
    const urlMode = params.get('mode');
    
    if (urlRoomCode) {
      setRoomCode(urlRoomCode.toUpperCase());
      console.log('Room code from URL:', urlRoomCode);
    }
    
    if (urlMode === 'player' || urlMode === 'join') {
      setPreSelectedMode('player');
      console.log('Pre-selected mode: player');
    } else if (urlMode === 'host') {
      setPreSelectedMode('host');
      console.log('Pre-selected mode: host');
    }
  }, []);

  const generateRoomCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  // Get questions based on topic
  const getQuestionsForTopic = (topic) => {
    const lowerTopic = topic.toLowerCase();
    
    // Check for webinar/programming topic keywords
    if (lowerTopic.includes('webinar') || 
        lowerTopic.includes('programming') || 
        lowerTopic.includes('programmer') ||
        lowerTopic.includes('pemula') ||
        lowerTopic.includes('2026') ||
        lowerTopic.includes('coding')) {
      return QUESTION_BANK['webinar'];
    } else if (lowerTopic.includes('javascript') || lowerTopic.includes('js')) {
      return QUESTION_BANK['javascript'];
    } else if (lowerTopic.includes('react')) {
      return QUESTION_BANK['react'];
    } else if (lowerTopic.includes('indonesia') || lowerTopic.includes('indonesian')) {
      return QUESTION_BANK['indonesia'];
    } else {
      return QUESTION_BANK['general'];
    }
  };

  // Listen to room changes - ONLY after user has joined
  useEffect(() => {
    // CRITICAL: Only listen if user has officially joined (userMode is set)
    if (!roomCode || !userMode) return;

    console.log('Firebase listener active for room:', roomCode, 'userMode:', userMode);

    const roomRef = ref(database, `rooms/${roomCode}`);
    const unsubscribe = onValue(roomRef, (snapshot) => {
      const roomData = snapshot.val();
      if (!roomData) {
        console.log('Room data not found');
        return;
      }

      console.log('Room update received:', {
        gameState: roomData.gameState,
        questionsCount: roomData.questions?.length
      });

      // For HOST: sync everything
      if (isHost) {
        // Host doesn't play, just monitors
        if (roomData.players) {
          const playersList = Object.entries(roomData.players).map(([id, data]) => ({
            id,
            ...data
          }));
          setPlayers(playersList);
        }
        return;
      }

      // For PLAYERS: Self-paced mode
      // Only update gameState, NOT currentQuestion (player controls their own progress)
      
      // Update game state
      setGameState(roomData.gameState);
      
      // Set questions if not already set (from Firebase)
      if (roomData.questions && questions.length === 0) {
        console.log('Setting questions from Firebase');
        setQuestions(roomData.questions);
      }
      
      // Initialize first question when game is playing but currentQuestion not set yet
      if (roomData.gameState === 'playing' && !currentQuestion) {
        console.log('Game is playing but no question set. Initializing...');
        const questionsToUse = roomData.questions || questions;
        console.log('Questions available:', questionsToUse?.length);
        
        if (questionsToUse && questionsToUse.length > 0) {
          console.log('Setting first question:', questionsToUse[0]);
          setCurrentQuestion(questionsToUse[0]);
          setQuestionNumber(0);
          setTimeLeft(15);
          setQuestionStartTime(Date.now());
        } else {
          console.error('No questions available!');
        }
      }

      // Update players list for leaderboard
      if (roomData.players) {
        const playersList = Object.entries(roomData.players).map(([id, data]) => ({
          id,
          ...data
        }));
        setPlayers(playersList);
      }
    });

    return () => unsubscribe();
  }, [roomCode, userMode, isHost, questions.length, currentQuestion]); // ← Add userMode dependency!

  // Timer countdown
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0 && selectedAnswer === null && currentQuestion) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && selectedAnswer === null && gameState === 'playing') {
      handleAnswerSelect(null);
    }
  }, [timeLeft, gameState, selectedAnswer, currentQuestion]);

  const createRoom = async () => {
    if (!quizTopic) return;
    
    const code = generateRoomCode();
    const questionsData = getQuestionsForTopic(quizTopic);

    setRoomCode(code);
    setIsHost(true);
    setQuestions(questionsData);
    
    const roomData = {
      code,
      hostId: 'host-' + Date.now(),
      questions: questionsData,
      currentQuestionIndex: 0,
      gameState: 'lobby',
      createdAt: Date.now(),
      players: {}
    };

    try {
      await set(ref(database, `rooms/${code}`), roomData);
      setUserMode('host');
      setGameState('lobby');
    } catch (error) {
      console.error('Error creating room:', error);
      alert('Failed to create room. Please try again.');
    }
  };

  const joinRoom = async () => {
    // Validasi input
    if (!roomCode || !playerName) {
      console.log('Validation failed: missing roomCode or playerName', { roomCode, playerName });
      alert('Mohon masukkan kode room dan nama Anda!');
      return;
    }

    // Validasi room code format (6 karakter)
    if (roomCode.length !== 6) {
      console.log('Validation failed: roomCode length', roomCode.length);
      alert('Kode room harus 6 karakter!');
      return;
    }

    // Validasi nama minimal 2 karakter
    if (playerName.trim().length < 2) {
      console.log('Validation failed: playerName too short', playerName.trim().length);
      alert('Nama harus minimal 2 karakter!');
      return;
    }

    console.log('joinRoom started with:', { roomCode, playerName: playerName.trim() });

    try {
      const roomSnapshot = await get(ref(database, `rooms/${roomCode}`));
      
      if (!roomSnapshot.exists()) {
        console.log('Room not found:', roomCode);
        alert('Room tidak ditemukan! Cek kembali kode room Anda.');
        return;
      }

      const roomData = roomSnapshot.val();
      console.log('Room data:', roomData);
      
      // Check if game already started
      if (roomData.gameState === 'playing') {
        alert('Maaf, game sudah dimulai! Tidak bisa join di tengah permainan.');
        return;
      }

      // Check if game already ended
      if (roomData.gameState === 'results') {
        alert('Game sudah selesai! Tunggu host membuat room baru.');
        return;
      }

      const pid = 'player-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
      console.log('Creating player with ID:', pid);
      
      setPlayerId(pid);
      setIsHost(false);

      const playerData = {
        name: playerName.trim(),
        score: 0,
        answers: [],
        avatar: ['🎮', '🎯', '🎨', '🎪', '🎭', '🎬', '🎸', '🎹'][Math.floor(Math.random() * 8)],
        joinedAt: Date.now()
      };

      await set(ref(database, `rooms/${roomCode}/players/${pid}`), playerData);
      console.log('Player added to Firebase');

      setQuestions(roomData.questions);
      setUserMode('player');
      setGameState(roomData.gameState);
      console.log('State updated, should show lobby now');
    } catch (error) {
      console.error('Error joining room:', error);
      alert('Gagal join room. Silakan coba lagi!');
    }
  };

  const startGameAsHost = async () => {
    try {
      await update(ref(database, `rooms/${roomCode}`), {
        gameState: 'playing',
        startedAt: Date.now()
      });

      setGameState('playing');
      // Host doesn't play, just monitors
    } catch (error) {
      console.error('Error starting game:', error);
    }
  };

  const endGameAsHost = async () => {
    try {
      await update(ref(database, `rooms/${roomCode}`), {
        gameState: 'results'
      });

      setGameState('results');
      setShowConfetti(true);
    } catch (error) {
      console.error('Error ending game:', error);
    }
  };

  const handleAnswerSelect = async (answerIndex) => {
    if (selectedAnswer !== null || isHost) return;
    
    setSelectedAnswer(answerIndex);
    const correct = answerIndex === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    
    let earnedPoints = 0;
    if (correct) {
      const timeTaken = (Date.now() - questionStartTime) / 1000;
      const points = Math.max(100, Math.floor((15 - timeTaken) * 100));
      earnedPoints = points;
      setScore(score + points);

      try {
        await update(ref(database, `rooms/${roomCode}/players/${playerId}`), {
          score: score + points,
          [`answers/${questionNumber}`]: {
            answer: answerIndex,
            correct,
            points,
            timestamp: Date.now()
          }
        });
      } catch (error) {
        console.error('Error updating score:', error);
      }
    } else {
      try {
        await update(ref(database, `rooms/${roomCode}/players/${playerId}/answers/${questionNumber}`), {
          answer: answerIndex,
          correct,
          points: 0,
          timestamp: Date.now()
        });
      } catch (error) {
        console.error('Error updating answer:', error);
      }
    }

    // Auto next after 2 seconds (show result first)
    setTimeout(() => {
      const nextIndex = questionNumber + 1;
      if (nextIndex < questions.length) {
        // Move to next question for this player
        setQuestionNumber(nextIndex);
        setCurrentQuestion(questions[nextIndex]);
        setSelectedAnswer(null);
        setIsCorrect(null);
        setTimeLeft(15);
        setQuestionStartTime(Date.now());
      } else {
        // Player finished all questions
        setGameState('results');
        setShowConfetti(true);
      }
    }, 2000);
  };

  const nextQuestion = async () => {
    if (!isHost) return;

    const nextIndex = questionNumber + 1;
    if (nextIndex < questions.length) {
      try {
        await update(ref(database, `rooms/${roomCode}`), {
          currentQuestionIndex: nextIndex
        });

        setQuestionNumber(nextIndex);
        setCurrentQuestion(questions[nextIndex]);
        setTimeLeft(15);
        setQuestionStartTime(Date.now());
      } catch (error) {
        console.error('Error moving to next question:', error);
      }
    } else {
      endGame();
    }
  };

  const endGame = async () => {
    if (!isHost) return;

    try {
      await update(ref(database, `rooms/${roomCode}`), {
        gameState: 'results'
      });

      setGameState('results');
      setShowConfetti(true);
    } catch (error) {
      console.error('Error ending game:', error);
    }
  };

  const resetGame = async () => {
    try {
      if (roomCode) {
        await remove(ref(database, `rooms/${roomCode}`));
      }
    } catch (error) {
      console.log('Cleanup error:', error);
    }

    setUserMode(null);
    setGameState('setup');
    setRoomCode('');
    setPlayerName('');
    setPlayerId('');
    setQuestionNumber(0);
    setScore(0);
    setCurrentQuestion(null);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setQuizTopic('');
    setShowConfetti(false);
    setIsHost(false);
    setPlayers([]);
  };

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-20 left-40 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Confetti */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10%',
                animationDelay: `${Math.random() * 3}s`,
                fontSize: '24px'
              }}
            >
              {['🎉', '✨', '🎊', '⭐', '🏆'][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      )}

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-7xl font-black mb-2 tracking-tighter">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-pink-300 to-yellow-300 drop-shadow-2xl animate-pulse">
              QUIZ BLAST
            </span>
          </h1>
          <p className="text-cyan-200 text-xl font-bold tracking-wider uppercase">
            ⚡ Live Multiplayer Quiz Platform ⚡
          </p>
        </div>

        {/* Direct Join Screen (from URL) */}
        {!userMode && gameState === 'setup' && preSelectedMode === 'player' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border-4 border-cyan-400 shadow-2xl shadow-cyan-500/50">
              <div className="text-center mb-6">
                <Users className="w-20 h-20 mx-auto mb-4 text-cyan-300" />
                <h2 className="text-4xl font-black text-white mb-2">JOIN QUIZ</h2>
                <p className="text-cyan-200">Enter your name to join</p>
                {roomCode && (
                  <div className="mt-4 inline-block bg-yellow-400/20 border-2 border-yellow-400 rounded-xl px-6 py-2">
                    <div className="text-yellow-300 text-sm font-bold">Room Code</div>
                    <div className="text-yellow-300 text-2xl font-black tracking-wider">{roomCode}</div>
                  </div>
                )}
              </div>

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (roomCode && playerName && roomCode.length === 6 && playerName.trim().length >= 2) {
                    joinRoom();
                  }
                }}
                className="space-y-4"
              >
                {!roomCode && (
                  <input
                    type="text"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                    placeholder="ROOM CODE"
                    className="w-full px-4 py-3 rounded-xl bg-white/20 border-2 border-cyan-300 text-white text-center text-2xl font-black placeholder-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 uppercase tracking-wider"
                    maxLength={6}
                    autoComplete="off"
                  />
                )}
                
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full px-4 py-3 rounded-xl bg-white/20 border-2 border-cyan-300 text-white placeholder-cyan-200 font-semibold focus:outline-none focus:ring-2 focus:ring-cyan-400 text-lg"
                  autoComplete="off"
                  autoFocus
                  minLength={2}
                />

                <button
                  type="submit"
                  disabled={!roomCode || !playerName || roomCode.length !== 6 || playerName.trim().length < 2}
                  className="w-full py-4 rounded-xl font-black text-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {!roomCode || roomCode.length !== 6 || !playerName || playerName.trim().length < 2 
                    ? 'Enter your name...' 
                    : '🚀 Join Quiz'}
                </button>
                
                {playerName && playerName.trim().length < 2 && (
                  <div className="text-red-300 text-sm text-center">
                    ⚠️ Name must be at least 2 characters
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setPreSelectedMode(null);
                    setRoomCode('');
                    window.history.pushState({}, '', '/');
                  }}
                  className="w-full py-2 text-cyan-200 hover:text-white text-sm"
                >
                  ← Back to home
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Direct Host Screen (from URL) */}
        {!userMode && gameState === 'setup' && preSelectedMode === 'host' && roomCode && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 border-4 border-pink-400 shadow-2xl text-center">
              <Crown className="w-20 h-20 mx-auto mb-4 text-yellow-300" />
              <h2 className="text-4xl font-black text-white mb-4">HOST DASHBOARD</h2>
              <div className="text-cyan-200 text-xl mb-8">
                Room: <span className="font-black text-yellow-300 text-3xl">{roomCode}</span>
              </div>
              <div className="bg-white/10 rounded-xl p-6 mb-6">
                <div className="text-white text-lg mb-4">Loading room data...</div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce"></div>
                  <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                </div>
              </div>
              <button
                onClick={() => {
                  setPreSelectedMode(null);
                  setRoomCode('');
                  window.history.pushState({}, '', '/');
                }}
                className="text-cyan-200 hover:text-white text-sm"
              >
                ← Back to home
              </button>
            </div>
          </div>
        )}

        {/* Initial Selection */}
        {!userMode && gameState === 'setup' && !preSelectedMode && (
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Host Card */}
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border-4 border-pink-400 shadow-2xl shadow-pink-500/50 hover:scale-105 transition-transform">
                <div className="text-center mb-6">
                  <Crown className="w-20 h-20 mx-auto mb-4 text-yellow-300" />
                  <h2 className="text-4xl font-black text-white mb-2">HOST</h2>
                  <p className="text-cyan-200">Create a quiz for your audience</p>
                </div>

                <div className="space-y-4">
                  <input
                    type="text"
                    value={quizTopic}
                    onChange={(e) => setQuizTopic(e.target.value)}
                    placeholder="Quiz topic..."
                    className="w-full px-4 py-3 rounded-xl bg-white/20 border-2 border-cyan-300 text-white placeholder-cyan-200 font-semibold focus:outline-none focus:ring-2 focus:ring-pink-400"
                  />

                  <div className="bg-white/5 rounded-lg p-3 text-xs text-cyan-200">
                    💡 Available topics: <span className="font-bold">Webinar, JavaScript, React, Indonesia, General Knowledge</span>
                  </div>

                  <button
                    onClick={createRoom}
                    disabled={!quizTopic}
                    className="w-full py-4 rounded-xl font-black text-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-xl hover:shadow-2xl transition-all disabled:opacity-50"
                  >
                    Create Room
                  </button>
                </div>
              </div>

              {/* Join Card */}
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border-4 border-cyan-400 shadow-2xl shadow-cyan-500/50 hover:scale-105 transition-transform">
                <div className="text-center mb-6">
                  <Users className="w-20 h-20 mx-auto mb-4 text-cyan-300" />
                  <h2 className="text-4xl font-black text-white mb-2">JOIN</h2>
                  <p className="text-cyan-200">Enter the game code</p>
                </div>

                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (roomCode && playerName && roomCode.length === 6 && playerName.trim().length >= 2) {
                      joinRoom();
                    }
                  }}
                  className="space-y-4"
                >
                  <input
                    type="text"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                    placeholder="ROOM CODE"
                    className="w-full px-4 py-3 rounded-xl bg-white/20 border-2 border-cyan-300 text-white text-center text-2xl font-black placeholder-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 uppercase tracking-wider"
                    maxLength={6}
                    autoComplete="off"
                  />
                  
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full px-4 py-3 rounded-xl bg-white/20 border-2 border-cyan-300 text-white placeholder-cyan-200 font-semibold focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    autoComplete="off"
                    minLength={2}
                  />

                  <button
                    type="submit"
                    disabled={!roomCode || !playerName || roomCode.length !== 6 || playerName.trim().length < 2}
                    className="w-full py-4 rounded-xl font-black text-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-xl"
                  >
                    {!roomCode || roomCode.length !== 6 || !playerName || playerName.trim().length < 2 
                      ? 'Fill in all fields...' 
                      : 'Join Room'}
                  </button>
                  
                  {roomCode && roomCode.length !== 6 && (
                    <div className="text-red-300 text-sm text-center -mt-2">
                      ⚠️ Room code must be 6 characters
                    </div>
                  )}
                  
                  {playerName && playerName.trim().length < 2 && (
                    <div className="text-red-300 text-sm text-center -mt-2">
                      ⚠️ Name must be at least 2 characters
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Lobby - Host View */}
        {userMode === 'host' && gameState === 'lobby' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border-4 border-yellow-400 shadow-2xl">
              <div className="text-center mb-8">
                <div className="inline-block bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl px-8 py-4 mb-4 relative">
                  <div className="text-sm text-purple-900 font-bold mb-1">ROOM CODE</div>
                  <div className="text-5xl font-black text-purple-900 tracking-widest mb-2">{roomCode}</div>
                  <button
                    onClick={copyRoomCode}
                    className="absolute top-2 right-2 p-2 bg-purple-900/20 hover:bg-purple-900/40 rounded-lg transition-all"
                  >
                    {copied ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <Copy className="w-5 h-5 text-purple-900" />
                    )}
                  </button>
                </div>
                <p className="text-cyan-200 text-lg">Share this code with your audience!</p>
                
                {/* Shareable Link */}
                <div className="mt-4 bg-white/5 rounded-xl p-4">
                  <div className="text-cyan-300 text-sm font-bold mb-2">📎 Or share this link:</div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={`${window.location.origin}/?room=${roomCode}&mode=player`}
                      readOnly
                      className="flex-1 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm font-mono"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/?room=${roomCode}&mode=player`);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg text-white font-bold text-sm transition-all"
                    >
                      {copied ? '✓' : 'Copy'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 rounded-2xl p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-black text-2xl flex items-center gap-2">
                    <Users className="w-6 h-6" />
                    Players ({players.length})
                  </h3>
                  <div className="text-cyan-300 font-bold animate-pulse">Waiting...</div>
                </div>
                
                {players.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                    {players.map(player => (
                      <div key={player.id} className="bg-white/10 rounded-xl p-4 text-center border-2 border-white/20">
                        <div className="text-3xl mb-2">{player.avatar}</div>
                        <div className="text-white font-bold text-sm truncate">{player.name}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-cyan-200">
                    <Users className="w-16 h-16 mx-auto mb-3 opacity-50" />
                    <p>No players yet. Share the room code!</p>
                  </div>
                )}
              </div>

              <button
                onClick={startGameAsHost}
                disabled={players.length === 0}
                className="w-full py-5 rounded-2xl font-black text-2xl bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-2xl hover:shadow-green-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                <Play className="w-8 h-8" />
                START GAME ({players.length} {players.length === 1 ? 'Player' : 'Players'})
              </button>
            </div>
          </div>
        )}

        {/* Lobby - Player View */}
        {userMode === 'player' && gameState === 'lobby' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 border-4 border-cyan-400 shadow-2xl text-center">
              <div className="text-6xl mb-6">🎮</div>
              <h2 className="text-4xl font-black text-white mb-4">You're In!</h2>
              <div className="text-cyan-200 text-xl mb-8">
                Room: <span className="font-black text-yellow-300 text-3xl">{roomCode}</span>
              </div>
              <div className="bg-white/10 rounded-xl p-6 mb-6">
                <div className="text-white text-lg mb-4">Players in lobby: {players.length}</div>
                <div className="text-white text-lg mb-2">Waiting for host to start...</div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce"></div>
                  <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Playing - Host View (Monitoring Dashboard) */}
        {userMode === 'host' && gameState === 'playing' && (
          <div className="max-w-5xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border-4 border-yellow-400 shadow-2xl mb-6">
              <div className="text-center mb-6">
                <h2 className="text-4xl font-black text-white mb-2">🎮 Quiz in Progress</h2>
                <p className="text-cyan-200 text-lg">Players are answering at their own pace</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white/10 rounded-xl p-4 text-center">
                  <Users className="w-8 h-8 mx-auto mb-2 text-cyan-300" />
                  <div className="text-3xl font-black text-white">{players.length}</div>
                  <div className="text-cyan-200 text-sm">Total Players</div>
                </div>
                <div className="bg-white/10 rounded-xl p-4 text-center">
                  <Brain className="w-8 h-8 mx-auto mb-2 text-pink-300" />
                  <div className="text-3xl font-black text-white">{questions.length}</div>
                  <div className="text-cyan-200 text-sm">Questions</div>
                </div>
                <div className="bg-white/10 rounded-xl p-4 text-center">
                  <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-300" />
                  <div className="text-3xl font-black text-white">
                    {players.filter(p => p.answers && Object.keys(p.answers).length === questions.length).length}
                  </div>
                  <div className="text-cyan-200 text-sm">Finished</div>
                </div>
              </div>
            </div>

            {/* Live Leaderboard */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border-2 border-cyan-400 mb-6">
              <h3 className="text-white font-black text-2xl mb-4 flex items-center gap-2">
                <BarChart3 className="w-7 h-7 text-yellow-300" />
                Live Leaderboard
              </h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {players.sort((a, b) => b.score - a.score).map((player, index) => {
                  const progress = player.answers ? Object.keys(player.answers).length : 0;
                  const isFinished = progress === questions.length;
                  
                  return (
                    <div key={player.id} className="flex items-center gap-3 bg-white/10 rounded-lg p-3">
                      <span className="text-xl font-black text-yellow-300 w-8">#{index + 1}</span>
                      <span className="text-2xl">{player.avatar}</span>
                      <div className="flex-1">
                        <div className="text-white font-bold">{player.name}</div>
                        <div className="text-sm text-cyan-200">
                          {progress}/{questions.length} questions
                          {isFinished && <span className="ml-2 text-green-300">✓ Done</span>}
                        </div>
                      </div>
                      <span className="text-cyan-300 font-black text-xl">{player.score}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Host Controls */}
            <div className="flex gap-4">
              <button
                onClick={endGameAsHost}
                className="flex-1 py-4 rounded-xl font-black text-xl bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-xl hover:shadow-2xl transition-all"
              >
                🏁 End Quiz & Show Results
              </button>
            </div>
          </div>
        )}

        {/* Playing - Player View */}
        {userMode === 'player' && gameState === 'playing' && (
          <div className="max-w-4xl mx-auto">
            {!currentQuestion ? (
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 border-4 border-cyan-400 shadow-2xl text-center">
                <div className="text-6xl mb-6">⏳</div>
                <h2 className="text-4xl font-black text-white mb-4">Loading Question...</h2>
                <div className="text-cyan-200 text-xl">Please wait</div>
                <div className="flex items-center justify-center gap-2 mt-6">
                  <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce"></div>
                  <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                </div>
              </div>
            ) : (
              <>
            <div className="flex justify-between items-center mb-6 bg-white/10 backdrop-blur-lg rounded-2xl p-4 border-2 border-cyan-400">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl px-4 py-2">
                  <span className="text-white font-black text-lg">Q {questionNumber + 1}/{questions.length}</span>
                </div>
                <div className="flex items-center gap-2 bg-yellow-400 rounded-xl px-4 py-2">
                  <Trophy className="w-5 h-5 text-purple-900" />
                  <span className="text-purple-900 font-black text-lg">{score}</span>
                </div>
              </div>
              
              <div className={`flex items-center gap-2 px-6 py-2 rounded-xl font-black text-xl ${timeLeft <= 5 ? 'bg-red-500 animate-pulse' : 'bg-cyan-500'}`}>
                <Clock className="w-6 h-6 text-white" />
                <span className="text-white">{timeLeft}s</span>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 mb-6 border-4 border-pink-400 shadow-2xl">
              <h2 className="text-3xl font-black text-white mb-6 leading-tight">
                {currentQuestion.question}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQuestion.options.map((option, index) => {
                  const isSelected = selectedAnswer === index;
                  const isCorrectAnswer = index === currentQuestion.correctAnswer;
                  const showResult = selectedAnswer !== null;
                  
                  let bgClass = 'bg-white/20 hover:bg-white/30 border-white/40';
                  if (showResult && isCorrectAnswer) {
                    bgClass = 'bg-green-500 border-green-300';
                  } else if (showResult && isSelected && !isCorrectAnswer) {
                    bgClass = 'bg-red-500 border-red-300';
                  } else if (isSelected) {
                    bgClass = 'bg-purple-500 border-purple-300';
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={selectedAnswer !== null}
                      className={`p-6 rounded-2xl border-4 font-bold text-lg text-left transition-all transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed ${bgClass} text-white shadow-lg relative overflow-hidden group`}
                    >
                      <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform"></div>
                      <div className="relative flex items-center justify-between gap-3">
                        <span className="flex-1">{option}</span>
                        {showResult && isCorrectAnswer && (
                          <CheckCircle className="w-7 h-7 text-white animate-bounce" />
                        )}
                        {showResult && isSelected && !isCorrectAnswer && (
                          <XCircle className="w-7 h-7 text-white" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {selectedAnswer !== null && (
                <div className="mt-6 text-center">
                  {isCorrect ? (
                    <div className="text-green-300 font-black text-2xl animate-bounce">
                      ✓ Correct! +{Math.max(100, Math.floor((15 - (Date.now() - questionStartTime) / 1000) * 100))} points
                    </div>
                  ) : (
                    <div className="text-red-300 font-black text-2xl">
                      ✗ Wrong answer
                    </div>
                  )}
                </div>
              )}
            </div>
            </>
            )}
          </div>
        )}

        {/* Results */}
        {gameState === 'results' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-10 border-4 border-yellow-400 shadow-2xl text-center">
              <Trophy className="w-24 h-24 mx-auto mb-6 text-yellow-300 animate-bounce" />
              <h2 className="text-5xl font-black text-white mb-8">
                {isHost ? 'Quiz Complete!' : 'Your Score'}
              </h2>

              {!isHost && (
                <div className="text-7xl font-black bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-pink-300 to-cyan-300 mb-8">
                  {score}
                </div>
              )}

              <div className="bg-white/10 rounded-2xl p-6 mb-8">
                <h3 className="text-white font-black text-2xl mb-6 flex items-center justify-center gap-2">
                  <BarChart3 className="w-7 h-7 text-yellow-300" />
                  Final Standings
                </h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {players.sort((a, b) => b.score - a.score).map((player, index) => {
                    const medals = [
                      { icon: <Crown className="w-8 h-8" />, color: 'from-yellow-400 to-orange-400' },
                      { icon: <Medal className="w-7 h-7" />, color: 'from-gray-300 to-gray-400' },
                      { icon: <Award className="w-7 h-7" />, color: 'from-orange-400 to-orange-500' }
                    ];
                    
                    return (
                      <div
                        key={player.id}
                        className={`flex items-center gap-4 rounded-xl p-4 ${
                          index < 3 ? `bg-gradient-to-r ${medals[index].color}` : 'bg-white/10'
                        } ${player.id === playerId ? 'ring-4 ring-cyan-400' : ''}`}
                      >
                        <div className="w-12 flex items-center justify-center">
                          {index < 3 ? (
                            <div className="text-white">{medals[index].icon}</div>
                          ) : (
                            <span className="text-2xl font-black text-white">#{index + 1}</span>
                          )}
                        </div>
                        <span className="text-3xl">{player.avatar}</span>
                        <span className={`font-bold text-xl flex-1 truncate ${index < 3 ? 'text-purple-900' : 'text-white'}`}>
                          {player.name}
                          {player.id === playerId && ' (You)'}
                        </span>
                        <span className={`font-black text-2xl ${index < 3 ? 'text-purple-900' : 'text-cyan-300'}`}>
                          {player.score}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={resetGame}
                className="w-full py-5 rounded-2xl font-black text-2xl bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white shadow-2xl border-4 border-white/30 hover:scale-105 transition-transform"
              >
                🎮 {isHost ? 'Create New Quiz' : 'Play Again'}
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -20px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(20px, 20px) scale(1.05); }
        }
        
        @keyframes confetti {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animate-confetti { animation: confetti 3s ease-in forwards; }
      `}</style>
    </div>
  );
};

export default LiveQuizPlatform;