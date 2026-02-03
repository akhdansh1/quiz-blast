import React, { useState, useEffect } from 'react';
import { Zap, Trophy, Users, Brain, Sparkles, CheckCircle, XCircle, Clock, Play, LogIn, Share2, Download, BarChart3, Crown, Medal, Award } from 'lucide-react';

const LiveQuizPlatform = () => {
  const [userMode, setUserMode] = useState(null); // 'host' or 'player'
  const [gameState, setGameState] = useState('setup'); // setup, lobby, playing, results
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
  const [isGenerating, setIsGenerating] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [uploadMode, setUploadMode] = useState('topic');
  const [questionStartTime, setQuestionStartTime] = useState(null);
  const [answeredPlayers, setAnsweredPlayers] = useState([]);
  const [isHost, setIsHost] = useState(false);

  // Generate random room code
  const generateRoomCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  // Polling for real-time updates
  useEffect(() => {
    if (!roomCode) return;

    const interval = setInterval(async () => {
      try {
        // Get room data
        const roomData = await window.storage.get(`room:${roomCode}`, true);
        if (roomData) {
          const room = JSON.parse(roomData.value);
          
          // Update players list
          if (isHost) {
            const playersList = [];
            for (const pid of room.playerIds || []) {
              try {
                const playerData = await window.storage.get(`player:${roomCode}:${pid}`, true);
                if (playerData) {
                  playersList.push(JSON.parse(playerData.value));
                }
              } catch (e) {
                console.log('Player not found:', pid);
              }
            }
            setPlayers(playersList);
          }
          
          // Sync game state for players
          if (!isHost) {
            if (room.gameState !== gameState) {
              setGameState(room.gameState);
            }
            if (room.currentQuestionIndex !== questionNumber) {
              setQuestionNumber(room.currentQuestionIndex);
              setSelectedAnswer(null);
              setIsCorrect(null);
              setTimeLeft(15);
              setQuestionStartTime(Date.now());
            }
            if (room.questions) {
              setQuestions(room.questions);
              setCurrentQuestion(room.questions[room.currentQuestionIndex]);
            }
          }
        }
      } catch (error) {
        console.log('Polling error:', error);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [roomCode, isHost, gameState, questionNumber]);

  // Timer countdown
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0 && selectedAnswer === null && currentQuestion) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && selectedAnswer === null && gameState === 'playing') {
      handleAnswerSelect(null);
    }
  }, [timeLeft, gameState, selectedAnswer, currentQuestion]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadedFile(file);
    
    try {
      if (file.type === 'application/pdf') {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const base64Data = e.target.result.split(',')[1];
          setFileContent(base64Data);
        };
        reader.readAsDataURL(file);
      } else if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64Data = e.target.result.split(',')[1];
          setFileContent(base64Data);
        };
        reader.readAsDataURL(file);
      } else if (file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setFileContent(e.target.result);
        };
        reader.readAsText(file);
      }
    } catch (error) {
      console.error('Error reading file:', error);
    }
  };

  const generateQuestionsFromFile = async () => {
    setIsGenerating(true);
    try {
      let messageContent;
      
      if (uploadedFile.type === 'application/pdf') {
        messageContent = [
          {
            type: "document",
            source: { type: "base64", media_type: "application/pdf", data: fileContent }
          },
          {
            type: "text",
            text: `Analyze this document and generate 5 multiple choice quiz questions based on its content.
            
            Return ONLY a JSON array with this exact structure, no other text:
            [
              {
                "question": "Question text here?",
                "options": ["Option A", "Option B", "Option C", "Option D"],
                "correctAnswer": 0
              }
            ]
            
            Make the questions engaging and varied in difficulty.`
          }
        ];
      } else if (uploadedFile.type.startsWith('image/')) {
        messageContent = [
          {
            type: "image",
            source: { type: "base64", media_type: uploadedFile.type, data: fileContent }
          },
          {
            type: "text",
            text: `Analyze this image and generate 5 multiple choice quiz questions.
            
            Return ONLY a JSON array with this exact structure, no other text:
            [{"question": "...", "options": ["A", "B", "C", "D"], "correctAnswer": 0}]`
          }
        ];
      } else {
        messageContent = [
          {
            type: "text",
            text: `Based on this text, generate 5 multiple choice quiz questions:

${fileContent}

Return ONLY a JSON array: [{"question": "...", "options": ["A", "B", "C", "D"], "correctAnswer": 0}]`
          }
        ];
      }

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: messageContent }],
        })
      });

      const data = await response.json();
      const content = data.content.find(item => item.type === "text")?.text || "";
      const cleanedContent = content.replace(/```json|```/g, "").trim();
      const generatedQuestions = JSON.parse(cleanedContent);
      
      setQuestions(generatedQuestions);
      setIsGenerating(false);
      return generatedQuestions;
    } catch (error) {
      console.error("Error generating questions:", error);
      setIsGenerating(false);
      return null;
    }
  };

  const generateQuestions = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [
            {
              role: "user",
              content: `Generate 5 multiple choice quiz questions about "${quizTopic}". 
              
              Return ONLY a JSON array with this exact structure:
              [{"question": "Question text?", "options": ["A", "B", "C", "D"], "correctAnswer": 0}]
              
              Make questions engaging and varied in difficulty.`
            }
          ],
        })
      });

      const data = await response.json();
      const content = data.content.find(item => item.type === "text")?.text || "";
      const cleanedContent = content.replace(/```json|```/g, "").trim();
      const generatedQuestions = JSON.parse(cleanedContent);
      
      setQuestions(generatedQuestions);
      setIsGenerating(false);
      return generatedQuestions;
    } catch (error) {
      console.error("Error generating questions:", error);
      setIsGenerating(false);
      return null;
    }
  };

  const createRoom = async () => {
    const code = generateRoomCode();
    const questionsData = uploadMode === 'topic' ? await generateQuestions() : await generateQuestionsFromFile();
    
    if (!questionsData) return;

    setRoomCode(code);
    setIsHost(true);
    
    const roomData = {
      code,
      hostId: 'host-' + Date.now(),
      questions: questionsData,
      currentQuestionIndex: 0,
      gameState: 'lobby',
      playerIds: [],
      createdAt: Date.now()
    };

    try {
      await window.storage.set(`room:${code}`, JSON.stringify(roomData), true);
      setUserMode('host');
      setGameState('lobby');
    } catch (error) {
      console.error('Error creating room:', error);
      alert('Failed to create room. Please try again.');
    }
  };

  const joinRoom = async () => {
    if (!roomCode || !playerName) return;

    try {
      const roomData = await window.storage.get(`room:${roomCode}`, true);
      if (!roomData) {
        alert('Room not found! Check your code.');
        return;
      }

      const room = JSON.parse(roomData.value);
      const pid = 'player-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
      setPlayerId(pid);
      setIsHost(false);

      const playerData = {
        id: pid,
        name: playerName,
        score: 0,
        answers: [],
        avatar: ['🎮', '🎯', '🎨', '🎪', '🎭', '🎬', '🎸', '🎹'][Math.floor(Math.random() * 8)]
      };

      await window.storage.set(`player:${roomCode}:${pid}`, JSON.stringify(playerData), true);

      room.playerIds.push(pid);
      await window.storage.set(`room:${roomCode}`, JSON.stringify(room), true);

      setQuestions(room.questions);
      setUserMode('player');
      setGameState('lobby');
    } catch (error) {
      console.error('Error joining room:', error);
      alert('Failed to join room. Please try again.');
    }
  };

  const startGameAsHost = async () => {
    try {
      const roomData = await window.storage.get(`room:${roomCode}`, true);
      const room = JSON.parse(roomData.value);
      
      room.gameState = 'playing';
      room.currentQuestionIndex = 0;
      await window.storage.set(`room:${roomCode}`, JSON.stringify(room), true);

      setGameState('playing');
      setQuestionNumber(0);
      setCurrentQuestion(questions[0]);
      setTimeLeft(15);
      setQuestionStartTime(Date.now());
    } catch (error) {
      console.error('Error starting game:', error);
    }
  };

  const handleAnswerSelect = async (answerIndex) => {
    if (selectedAnswer !== null || isHost) return;
    
    setSelectedAnswer(answerIndex);
    const correct = answerIndex === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    
    if (correct) {
      const timeTaken = (Date.now() - questionStartTime) / 1000;
      const points = Math.max(100, Math.floor((15 - timeTaken) * 100));
      setScore(score + points);

      try {
        const playerData = await window.storage.get(`player:${roomCode}:${playerId}`, true);
        const player = JSON.parse(playerData.value);
        player.score += points;
        player.answers.push({ questionIndex: questionNumber, answer: answerIndex, correct, points });
        await window.storage.set(`player:${roomCode}:${playerId}`, JSON.stringify(player), true);
      } catch (error) {
        console.error('Error updating score:', error);
      }
    }
  };

  const nextQuestion = async () => {
    if (!isHost) return;

    const nextIndex = questionNumber + 1;
    if (nextIndex < questions.length) {
      try {
        const roomData = await window.storage.get(`room:${roomCode}`, true);
        const room = JSON.parse(roomData.value);
        room.currentQuestionIndex = nextIndex;
        await window.storage.set(`room:${roomCode}`, JSON.stringify(room), true);

        setQuestionNumber(nextIndex);
        setCurrentQuestion(questions[nextIndex]);
        setTimeLeft(15);
        setQuestionStartTime(Date.now());
        setAnsweredPlayers([]);
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
      const roomData = await window.storage.get(`room:${roomCode}`, true);
      const room = JSON.parse(roomData.value);
      room.gameState = 'results';
      await window.storage.set(`room:${roomCode}`, JSON.stringify(room), true);

      setGameState('results');
      setShowConfetti(true);
    } catch (error) {
      console.error('Error ending game:', error);
    }
  };

  const resetGame = async () => {
    try {
      if (roomCode) {
        await window.storage.delete(`room:${roomCode}`, true);
        const playerKeys = await window.storage.list(`player:${roomCode}:`, true);
        for (const key of playerKeys.keys || []) {
          await window.storage.delete(key, true);
        }
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
    setUploadedFile(null);
    setFileContent('');
    setUploadMode('topic');
    setIsHost(false);
    setPlayers([]);
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

        {/* Initial Selection - Host or Join */}
        {!userMode && gameState === 'setup' && (
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
                  {/* Mode Selection */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setUploadMode('topic')}
                      className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all border-2 ${
                        uploadMode === 'topic'
                          ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white border-white/50'
                          : 'bg-white/10 text-cyan-200 border-white/20'
                      }`}
                    >
                      📝 Topic
                    </button>
                    <button
                      onClick={() => setUploadMode('file')}
                      className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all border-2 ${
                        uploadMode === 'file'
                          ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white border-white/50'
                          : 'bg-white/10 text-cyan-200 border-white/20'
                      }`}
                    >
                      📄 File
                    </button>
                  </div>

                  {uploadMode === 'topic' ? (
                    <input
                      type="text"
                      value={quizTopic}
                      onChange={(e) => setQuizTopic(e.target.value)}
                      placeholder="Quiz topic..."
                      className="w-full px-4 py-3 rounded-xl bg-white/20 border-2 border-cyan-300 text-white placeholder-cyan-200 font-semibold focus:outline-none focus:ring-2 focus:ring-pink-400"
                    />
                  ) : (
                    <div>
                      <input
                        type="file"
                        onChange={handleFileUpload}
                        accept=".pdf,.txt,.md,image/*"
                        className="hidden"
                        id="host-file-upload"
                      />
                      <label
                        htmlFor="host-file-upload"
                        className="block w-full px-4 py-6 rounded-xl bg-white/20 border-2 border-dashed border-cyan-300 text-center cursor-pointer hover:bg-white/30 transition-all"
                      >
                        {uploadedFile ? (
                          <div className="space-y-1">
                            <div className="text-2xl">{uploadedFile.type === 'application/pdf' ? '📄' : uploadedFile.type.startsWith('image/') ? '🖼️' : '📝'}</div>
                            <div className="text-white font-bold text-sm">{uploadedFile.name}</div>
                            <div className="text-green-300 text-xs">✓ Ready</div>
                          </div>
                        ) : (
                          <div>
                            <div className="text-3xl mb-1">📁</div>
                            <div className="text-white text-sm font-semibold">Upload Material</div>
                          </div>
                        )}
                      </label>
                    </div>
                  )}

                  <button
                    onClick={createRoom}
                    disabled={(uploadMode === 'topic' && !quizTopic) || (uploadMode === 'file' && !uploadedFile) || isGenerating}
                    className="w-full py-4 rounded-xl font-black text-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-xl hover:shadow-2xl transition-all disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                        Creating...
                      </span>
                    ) : (
                      'Create Room'
                    )}
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

                <div className="space-y-4">
                  <input
                    type="text"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                    placeholder="ROOM CODE"
                    className="w-full px-4 py-3 rounded-xl bg-white/20 border-2 border-cyan-300 text-white text-center text-2xl font-black placeholder-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 uppercase tracking-wider"
                    maxLength={6}
                  />
                  
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full px-4 py-3 rounded-xl bg-white/20 border-2 border-cyan-300 text-white placeholder-cyan-200 font-semibold focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />

                  <button
                    onClick={joinRoom}
                    disabled={!roomCode || !playerName}
                    className="w-full py-4 rounded-xl font-black text-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-xl hover:shadow-2xl transition-all disabled:opacity-50"
                  >
                    Join Room
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Lobby - Host View */}
        {userMode === 'host' && gameState === 'lobby' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border-4 border-yellow-400 shadow-2xl">
              <div className="text-center mb-8">
                <div className="inline-block bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl px-8 py-4 mb-4">
                  <div className="text-sm text-purple-900 font-bold mb-1">ROOM CODE</div>
                  <div className="text-5xl font-black text-purple-900 tracking-widest">{roomCode}</div>
                </div>
                <p className="text-cyan-200 text-lg">Share this code with your audience!</p>
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
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
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
                START GAME
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
              <div className="bg-white/10 rounded-xl p-6">
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

        {/* Playing - Host View */}
        {userMode === 'host' && gameState === 'playing' && currentQuestion && (
          <div className="max-w-5xl mx-auto">
            {/* Top bar */}
            <div className="flex justify-between items-center mb-6 bg-white/10 backdrop-blur-lg rounded-2xl p-4 border-2 border-pink-400">
              <div className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl px-5 py-2">
                <span className="text-white font-black text-lg">Q {questionNumber + 1}/{questions.length}</span>
              </div>
              <div className={`flex items-center gap-2 px-6 py-2 rounded-xl font-black text-xl ${timeLeft <= 5 ? 'bg-red-500 animate-pulse' : 'bg-cyan-500'}`}>
                <Clock className="w-6 h-6 text-white" />
                <span className="text-white">{timeLeft}s</span>
              </div>
            </div>

            {/* Question Display */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-10 mb-6 border-4 border-yellow-400 shadow-2xl">
              <h2 className="text-4xl font-black text-white mb-8 leading-tight text-center">
                {currentQuestion.question}
              </h2>

              <div className="grid grid-cols-2 gap-4">
                {currentQuestion.options.map((option, index) => {
                  const colors = [
                    'from-red-500 to-red-600',
                    'from-blue-500 to-blue-600', 
                    'from-yellow-500 to-yellow-600',
                    'from-green-500 to-green-600'
                  ];
                  
                  return (
                    <div
                      key={index}
                      className={`p-8 rounded-2xl bg-gradient-to-br ${colors[index]} border-4 border-white/50 font-bold text-2xl text-white shadow-2xl text-center`}
                    >
                      {option}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Host Controls */}
            <div className="flex gap-4">
              <button
                onClick={nextQuestion}
                className="flex-1 py-4 rounded-xl font-black text-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-xl hover:shadow-2xl transition-all"
              >
                {questionNumber < questions.length - 1 ? 'Next Question →' : 'Show Results'}
              </button>
            </div>

            {/* Mini Leaderboard */}
            <div className="mt-6 bg-white/10 backdrop-blur-lg rounded-2xl p-4 border-2 border-cyan-400">
              <h3 className="text-white font-bold text-lg mb-3">Top Players</h3>
              <div className="space-y-2">
                {players.sort((a, b) => b.score - a.score).slice(0, 5).map((player, index) => (
                  <div key={player.id} className="flex items-center gap-3 bg-white/10 rounded-lg p-2">
                    <span className="text-lg font-black text-yellow-300">#{index + 1}</span>
                    <span className="text-xl">{player.avatar}</span>
                    <span className="text-white font-bold flex-1 text-sm">{player.name}</span>
                    <span className="text-cyan-300 font-black">{player.score}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Playing - Player View */}
        {userMode === 'player' && gameState === 'playing' && currentQuestion && (
          <div className="max-w-4xl mx-auto">
            {/* Player Info Bar */}
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

            {/* Question */}
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

              {/* Final Leaderboard */}
              <div className="bg-white/10 rounded-2xl p-6 mb-8">
                <h3 className="text-white font-black text-2xl mb-6 flex items-center justify-center gap-2">
                  <BarChart3 className="w-7 h-7 text-yellow-300" />
                  Final Standings
                </h3>
                <div className="space-y-3">
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
                        <span className={`font-bold text-xl flex-1 ${index < 3 ? 'text-purple-900' : 'text-white'}`}>
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

      <style jsx>{`
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