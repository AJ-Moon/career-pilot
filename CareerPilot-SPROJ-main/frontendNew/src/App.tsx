

import React, { useState } from 'react';
import { Bell, User, ChevronDown } from 'lucide-react';
import { Button } from './components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from './components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './components/ui/dropdown-menu';
import { Badge } from './components/ui/badge';

// Import page components
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import PreInterviewModal from './components/PreInterviewModal';
import InterviewSession from './components/InterviewSession';
import FeedbackPage from './components/FeedbackPage';
import PracticeLibrary from './components/PracticeLibrary';
import SettingsPage from './components/SettingsPage';

type PageType = 'login' | 'dashboard' | 'pre-interview' | 'interview' | 'feedback' | 'practice' | 'settings';

interface User {
  name: string;
  email: string;
  avatar?: string;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('login');
  const [user, setUser] = useState<User | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<string>('');
  const [showPreInterview, setShowPreInterview] = useState(false);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('login');
  };

  const handleStartInterview = () => {
    setShowPreInterview(true);
  };

  const handlePreInterviewComplete = (config: any) => {
    setShowPreInterview(false);
    setCurrentPage('interview');
  };

  const handleInterviewComplete = () => {
    setCurrentPage('feedback');
  };

  const handleEndInterview = () => {
    setCurrentPage('feedback');
  };

  const handleReturnHome = () => {
    setCurrentPage('dashboard');
  };

  // Navigation component
  const Navigation = () => (
    <nav className="bg-white border-b border-border px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-medium">CP</span>
            </div>
            <span className="text-lg font-medium">CareerPilot</span>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                {selectedDomain || 'Select Domain'}
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSelectedDomain('Software Engineering')}>
                Software Engineering
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedDomain('Data Science')}>
                Data Science / ML
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedDomain('Research/PhD')}>
                Research/PhD
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedDomain('DevOps')}>
                DevOps
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedDomain('Cybersecurity')}>
                Cybersecurity
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedDomain('Design')}>
                Design
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedDomain('Engineering')}>
                Electrical/Mechanical
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentPage('dashboard')}
            className={currentPage === 'dashboard' ? 'bg-accent' : ''}
          >
            Dashboard
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentPage('practice')}
            className={currentPage === 'practice' ? 'bg-accent' : ''}
          >
            Practice
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentPage('settings')}
            className={currentPage === 'settings' ? 'bg-accent' : ''}
          >
            Settings
          </Button>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-4 h-4" />
              <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-destructive text-xs">
                2
              </Badge>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span>{user?.name}</span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setCurrentPage('settings')}>
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );

  // Render current page
  const renderPage = () => {
    if (!user) {
      return <LoginPage onLogin={handleLogin} />;
    }

    switch (currentPage) {
      case 'dashboard':
        return (
          <Dashboard 
            onStartInterview={handleStartInterview}
            selectedDomain={selectedDomain}
            setSelectedDomain={setSelectedDomain}
          />
        );
      case 'interview':
        return (
          <InterviewSession 
            onComplete={handleInterviewComplete}
            onEndInterview={handleEndInterview}
            onReturnHome={handleReturnHome}
            domain={selectedDomain} 
          />
        );
      case 'feedback':
        return <FeedbackPage domain={selectedDomain} onBackToDashboard={() => setCurrentPage('dashboard')} />;
      case 'practice':
        return <PracticeLibrary />;
      case 'settings':
        return <SettingsPage user={user} />;
      default:
        return <Dashboard onStartInterview={handleStartInterview} selectedDomain={selectedDomain} setSelectedDomain={setSelectedDomain} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {user && <Navigation />}
      
      <main className="flex-1">
        {renderPage()}
      </main>

      {showPreInterview && (
        <PreInterviewModal
          open={showPreInterview}
          onClose={() => setShowPreInterview(false)}
          onComplete={handlePreInterviewComplete}
          selectedDomain={selectedDomain}
        />
      )}
    </div>
  );
}