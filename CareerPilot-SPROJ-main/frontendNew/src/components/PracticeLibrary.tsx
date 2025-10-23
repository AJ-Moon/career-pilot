import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Search, 
  Filter, 
  Clock, 
  Play, 
  BookOpen, 
  Star,
  Code,
  Database,
  Shield,
  Palette,
  Cpu,
  BarChart3,
  GraduationCap,
  ChevronRight,
  Target
} from 'lucide-react';

const domains = [
  { id: 'software', name: 'Software Engineering', icon: Code, color: 'bg-blue-500', questions: 120 },
  { id: 'data', name: 'Data Science / ML', icon: BarChart3, color: 'bg-green-500', questions: 95 },
  { id: 'research', name: 'Research/PhD', icon: GraduationCap, color: 'bg-purple-500', questions: 75 },
  { id: 'devops', name: 'DevOps', icon: Database, color: 'bg-orange-500', questions: 85 },
  { id: 'security', name: 'Cybersecurity', icon: Shield, color: 'bg-red-500', questions: 90 },
  { id: 'design', name: 'Design', icon: Palette, color: 'bg-pink-500', questions: 70 },
  { id: 'engineering', name: 'Electrical/Mechanical', icon: Cpu, color: 'bg-yellow-500', questions: 80 },
];

const questionSets = [
  {
    id: 1,
    title: "System Design Basics",
    domain: "Software Engineering",
    difficulty: "Intermediate",
    duration: "45 min",
    questions: 15,
    rating: 4.8,
    description: "Learn fundamental concepts of distributed systems and scalability",
    topics: ["Load Balancing", "Caching", "Database Design"],
    subtopic: "System Design"
  },
  {
    id: 2,
    title: "Machine Learning Algorithms",
    domain: "Data Science / ML",
    difficulty: "Advanced",
    duration: "60 min", 
    questions: 20,
    rating: 4.9,
    description: "Deep dive into ML algorithms and their implementations",
    topics: ["Supervised Learning", "Neural Networks", "Feature Engineering"],
    subtopic: "Algorithms"
  },
  {
    id: 3,
    title: "React Development Patterns",
    domain: "Software Engineering",
    difficulty: "Beginner",
    duration: "30 min",
    questions: 12,
    rating: 4.7,
    description: "Master React patterns and best practices",
    topics: ["Hooks", "Context API", "State Management"],
    subtopic: "Frontend Development"
  },
  {
    id: 4,
    title: "Network Security Fundamentals",
    domain: "Cybersecurity",
    difficulty: "Intermediate",
    duration: "40 min",
    questions: 18,
    rating: 4.6,
    description: "Essential network security concepts and practices",
    topics: ["Encryption", "Firewalls", "Threat Detection"],
    subtopic: "Network Security"
  },
  {
    id: 5,
    title: "UI/UX Design Principles",
    domain: "Design",
    difficulty: "Beginner",
    duration: "25 min",
    questions: 10,
    rating: 4.8,
    description: "Core principles of user interface and experience design",
    topics: ["User Research", "Prototyping", "Accessibility"],
    subtopic: "Design Systems"
  }
];

const flashcardSets = [
  {
    id: 1,
    title: "Data Structures Quick Review",
    cards: 50,
    difficulty: "Intermediate",
    lastReviewed: "2 days ago"
  },
  {
    id: 2,
    title: "Behavioral Interview Questions",
    cards: 30,
    difficulty: "Beginner", 
    lastReviewed: "1 week ago"
  },
  {
    id: 3,
    title: "System Design Concepts",
    cards: 75,
    difficulty: "Advanced",
    lastReviewed: "Never"
  }
];

export default function PracticeLibrary() {
  const [selectedDomain, setSelectedDomain] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');

  const filteredQuestions = questionSets.filter(set => {
    const matchesDomain = selectedDomain === 'all' || set.domain === domains.find(d => d.id === selectedDomain)?.name;
    const matchesSearch = set.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         set.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = difficultyFilter === 'all' || set.difficulty === difficultyFilter;
    return matchesDomain && matchesSearch && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-700 border-green-200';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Advanced': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-medium mb-2">Practice Library</h1>
        <p className="text-muted-foreground">
          Browse domain-specific question sets and flashcards to enhance your interview skills
        </p>
      </div>

      <Tabs defaultValue="questions" className="space-y-6">
        <TabsList>
          <TabsTrigger value="questions">Question Sets</TabsTrigger>
          <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
          <TabsTrigger value="domains">Browse by Domain</TabsTrigger>
        </TabsList>

        <TabsContent value="questions" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search question sets..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <select
                  value={selectedDomain}
                  onChange={(e) => setSelectedDomain(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                >
                  <option value="all">All Domains</option>
                  {domains.map(domain => (
                    <option key={domain.id} value={domain.id}>{domain.name}</option>
                  ))}
                </select>
                
                <select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                >
                  <option value="all">All Difficulties</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Question Sets Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuestions.map((set) => (
              <Card key={set.id} className="border-l-4 border-l-primary hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{set.title}</CardTitle>
                      <CardDescription className="mt-1">{set.domain}</CardDescription>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      {set.rating}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{set.description}</p>
                  
                  <div className="flex flex-wrap gap-1">
                    {set.topics.map((topic) => (
                      <Badge key={topic} variant="secondary" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {set.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        {set.questions} questions
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Badge className={getDifficultyColor(set.difficulty)}>
                      {set.difficulty}
                    </Badge>
                    <Button size="sm">
                      <Play className="w-4 h-4 mr-2" />
                      Start Practice
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="flashcards" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {flashcardSets.map((set) => (
              <Card key={set.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{set.title}</CardTitle>
                  <CardDescription>{set.cards} cards</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge className={getDifficultyColor(set.difficulty)}>
                      {set.difficulty}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Last reviewed: {set.lastReviewed}
                    </span>
                  </div>
                  
                  <Button className="w-full">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Study Cards
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="domains" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {domains.map((domain) => {
              const Icon = domain.icon;
              return (
                <Card key={domain.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-12 h-12 rounded-lg ${domain.color} flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium">{domain.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {domain.questions} questions available
                        </p>
                      </div>
                    </div>
                    
                    <Button variant="outline" className="w-full">
                      Explore Domain
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}