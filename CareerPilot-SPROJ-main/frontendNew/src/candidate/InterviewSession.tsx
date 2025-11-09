import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { Textarea } from '../components/ui/textarea';
import { 
  Mic, 
  MicOff, 
  Type, 
  RotateCcw, 
  Gauge, 
  Eye, 
  Volume2,
  Settings,
  Home,
  Square
} from 'lucide-react';

interface InterviewSessionProps {
  onComplete: () => void;
  onEndInterview: () => void;
  onReturnHome: () => void;
  domain: string;
}

interface Message {
  id: string;
  sender: 'ai' | 'user';
  content: string;
  timestamp: Date;
}

const mockQuestions = [
  "Tell me about yourself and your background in software engineering.",
  "Describe a challenging project you've worked on recently.",
  "How do you handle debugging complex issues?",
  "Walk me through your problem-solving process.",
  "What's your experience with version control systems?",
];

export default function InterviewSession({ onComplete, onEndInterview, onReturnHome, domain }: InterviewSessionProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      content: `Hello! I'm excited to conduct your ${domain} interview today. Let's start with an introduction. ${mockQuestions[0]}`,
      timestamp: new Date(),
    }
  ]);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [showTextInput, setShowTextInput] = useState(false);
  const [textResponse, setTextResponse] = useState('');
  const [confidenceLevel, setConfidenceLevel] = useState(75);
  const [currentTopic, setCurrentTopic] = useState('Introduction');
  const [sessionProgress, setSessionProgress] = useState(20);
  const [isListening, setIsListening] = useState(false);
  const [liveTranscription, setLiveTranscription] = useState('');

  // Simulate live transcription when recording
  useEffect(() => {
    if (isRecording) {
      const transcriptionTexts = [
        "So, I'm a software engineer with about...",
        "...five years of experience primarily in...",
        "...web development using React and Node.js...",
        "...I've worked on several large-scale applications..."
      ];
      
      let index = 0;
      const interval = setInterval(() => {
        if (index < transcriptionTexts.length) {
          setLiveTranscription(transcriptionTexts[index]);
          index++;
        } else {
          clearInterval(interval);
        }
      }, 1500);

      return () => clearInterval(interval);
    } else {
      setLiveTranscription('');
    }
  }, [isRecording]);

  // Simulate confidence updates
  useEffect(() => {
    const interval = setInterval(() => {
      setConfidenceLevel(prev => {
        const change = Math.random() > 0.5 ? 2 : -2;
        return Math.max(30, Math.min(95, prev + change));
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleMicToggle = () => {
    setIsRecording(!isRecording);
    setIsListening(!isListening);
  };

  const handleSendText = () => {
    if (textResponse.trim()) {
      const userMessage: Message = {
        id: Date.now().toString(),
        sender: 'user',
        content: textResponse,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, userMessage]);
      setTextResponse('');
      setShowTextInput(false);

      // Simulate AI response
      setTimeout(() => {
        const nextIndex = currentQuestionIndex + 1;
        if (nextIndex < mockQuestions.length) {
          const aiMessage: Message = {
            id: (Date.now() + 1).toString(),
            sender: 'ai',
            content: `Great answer! Let's move on. ${mockQuestions[nextIndex]}`,
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, aiMessage]);
          setCurrentQuestionIndex(nextIndex);
          setSessionProgress(prev => Math.min(100, prev + 20));
          setCurrentTopic(nextIndex === 1 ? 'Project Experience' : nextIndex === 2 ? 'Problem Solving' : 'Technical Skills');
        } else {
          // Interview complete
          setTimeout(() => onComplete(), 2000);
        }
      }, 2000);
    }
  };

  const handleEndInterview = () => {
    // You could add a confirmation dialog here if needed
    onEndInterview();
  };

  const breadcrumbSteps = [
    'Introduction',
    'Project Experience', 
    'Problem Solving',
    'Technical Skills',
    'Final Questions'
  ];

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="border-b bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-medium">Interview Session</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline">{domain}</Badge>
              <Badge variant="secondary">{currentTopic}</Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Progress: {sessionProgress}%
            </div>
            <Progress value={sessionProgress} className="w-32" />
            
            {/* Interview Control Buttons */}
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={onReturnHome}
                className="flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                Return Home
              </Button>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={handleEndInterview}
                className="flex items-center gap-2"
              >
                <Square className="w-4 h-4" />
                End Interview
              </Button>
            </div>
            
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Adjust Difficulty
            </Button>
          </div>
        </div>

        {/* Progress Breadcrumb */}
        <div className="flex items-center gap-2 mt-3">
          {breadcrumbSteps.map((step, index) => (
            <React.Fragment key={step}>
              <div className={`px-3 py-1 rounded-full text-xs ${
                index <= currentQuestionIndex 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                {step}
              </div>
              {index < breadcrumbSteps.length - 1 && (
                <div className="w-2 h-px bg-border" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left Side - Chat */}
        <div className="flex-1 flex flex-col">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-3xl p-4 rounded-lg ${
                  message.sender === 'ai' 
                    ? 'bg-blue-50 border border-blue-200' 
                    : 'bg-primary text-primary-foreground'
                }`}>
                  <div className="flex items-start gap-3">
                    {message.sender === 'ai' && (
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        AI
                      </div>
                    )}
                    <div className="flex-1">
                      <p>{message.content}</p>
                      <p className={`text-xs mt-2 ${
                        message.sender === 'ai' ? 'text-blue-600' : 'text-primary-foreground/70'
                      }`}>
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                    {message.sender === 'ai' && (
                      <Button variant="ghost" size="sm">
                        <Volume2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="border-t p-6">
            {showTextInput ? (
              <div className="space-y-3">
                <Textarea
                  placeholder="Type your answer here..."
                  value={textResponse}
                  onChange={(e) => setTextResponse(e.target.value)}
                  className="min-h-[100px]"
                />
                <div className="flex gap-2">
                  <Button onClick={handleSendText} disabled={!textResponse.trim()}>
                    Send Answer
                  </Button>
                  <Button variant="outline" onClick={() => setShowTextInput(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-4">
                <Button
                  size="lg"
                  variant={isRecording ? "destructive" : "default"}
                  onClick={handleMicToggle}
                  className="flex items-center gap-2 px-8"
                >
                  {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  {isRecording ? 'Stop Recording' : 'Start Speaking'}
                </Button>
                
                <div className="text-sm text-muted-foreground">or</div>
                
                <Button
                  variant="outline"
                  onClick={() => setShowTextInput(true)}
                  className="flex items-center gap-2"
                >
                  <Type className="w-4 h-4" />
                  Type Answer
                </Button>
              </div>
            )}

            {/* Live Transcription */}
            {isRecording && liveTranscription && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-green-700">Live Transcription</span>
                </div>
                <p className="text-sm text-green-800">{liveTranscription}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Video & Metrics */}
        <div className="w-80 border-l bg-muted/30 p-6 space-y-6">
          {/* Webcam */}
          <Card>
            <CardContent className="p-4">
              <div className="aspect-video bg-gray-900 rounded-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20" />
                <div className="absolute bottom-4 left-4">
                  <Badge variant="secondary" className="bg-black/50 text-white">
                    <Eye className="w-3 h-3 mr-1" />
                    Recording
                  </Badge>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white/60 text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Eye className="w-8 h-8" />
                    </div>
                    <p className="text-sm">Camera Active</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Confidence Meter */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Gauge className="w-5 h-5 text-primary" />
                <h3 className="font-medium">Confidence Level</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Current</span>
                  <span className="text-sm font-medium">{confidenceLevel}%</span>
                </div>
                <Progress value={confidenceLevel} className="h-3" />
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="text-center p-2 bg-blue-50 rounded">
                    <div className="font-medium">Body Language</div>
                    <div className="text-blue-600">Good</div>
                  </div>
                  <div className="text-center p-2 bg-green-50 rounded">
                    <div className="font-medium">Eye Contact</div>
                    <div className="text-green-600">Excellent</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Topic */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium mb-2">Current Focus</h3>
              <div className="space-y-2">
                <Badge variant="outline" className="w-full justify-center py-2">
                  {domain}
                </Badge>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">Topic</div>
                  <div className="font-medium">{currentTopic}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardContent className="p-4 space-y-2">
              <Button variant="outline" size="sm" className="w-full">
                <RotateCcw className="w-4 h-4 mr-2" />
                Repeat Question
              </Button>
              <Button variant="outline" size="sm" className="w-full">
                <Settings className="w-4 h-4 mr-2" />
                Adjust Pace
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
