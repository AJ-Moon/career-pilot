// import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  BookOpen, 
  Play, 
  Share2,
  Download,
  //Star,
  AlertCircle,
  CheckCircle,
  ArrowLeft
} from 'lucide-react';

interface FeedbackPageProps {
  domain: string;
  onBackToDashboard: () => void;
}

const overallScore = 85;
const scores = {
  confidence: 78,
  technical: 92,
  communication: 88,
  problemSolving: 81,
};

const strengths = [
  {
    title: "Technical Knowledge",
    description: "Demonstrated strong understanding of algorithms and data structures",
    score: 92,
    icon: CheckCircle,
    color: "text-green-500"
  },
  {
    title: "Communication Clarity",
    description: "Explained complex concepts in a clear and structured manner", 
    score: 88,
    icon: CheckCircle,
    color: "text-green-500"
  },
  {
    title: "Problem Decomposition",
    description: "Effectively broke down complex problems into manageable parts",
    score: 85,
    icon: CheckCircle,
    color: "text-green-500"
  }
];

const improvements = [
  {
    title: "Confidence & Pacing",
    description: "Consider taking more time to think before answering",
    score: 78,
    icon: AlertCircle,
    color: "text-yellow-500",
    tips: ["Practice deep breathing techniques", "Use the pause effectively", "Maintain steady eye contact"]
  },
  {
    title: "Edge Case Handling",
    description: "Spend more time considering edge cases in solutions",
    score: 75,
    icon: AlertCircle,
    color: "text-yellow-500",
    tips: ["Always ask clarifying questions", "Consider null/empty inputs", "Think about performance limits"]
  }
];

const followUpQuestions = [
  "How would you optimize this solution for very large datasets?",
  "What trade-offs would you consider between memory and time complexity?",
  "How would you handle this in a distributed system?",
  "What testing strategy would you implement for this solution?"
];

const practiceModules = [
  {
    title: "System Design Fundamentals",
    duration: "45 min",
    difficulty: "Intermediate",
    topics: ["Scalability", "Load Balancing", "Caching"],
    progress: 0
  },
  {
    title: "Dynamic Programming Deep Dive", 
    duration: "60 min",
    difficulty: "Advanced",
    topics: ["Memoization", "Tabulation", "Optimization"],
    progress: 30
  },
  {
    title: "Behavioral Interview Mastery",
    duration: "30 min", 
    difficulty: "Beginner",
    topics: ["STAR Method", "Leadership", "Conflict Resolution"],
    progress: 80
  }
];

export default function FeedbackPage({ domain, onBackToDashboard }: FeedbackPageProps) {
  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onBackToDashboard}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-medium">Interview Feedback</h1>
            <p className="text-muted-foreground">{domain} • Completed {new Date().toLocaleDateString()}</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            Share Results
          </Button>
        </div>
      </div>

      {/* Overall Score */}
      <Card className="mb-8 border-l-4 border-l-primary">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Overall Performance</CardTitle>
              <CardDescription>Your comprehensive interview score</CardDescription>
            </div>
            <div className="text-right">
              <div className="text-4xl font-medium text-primary">{overallScore}%</div>
              <Badge variant="secondary" className="mt-1">
                Strong Performance
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="breakdown" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="breakdown">Score Breakdown</TabsTrigger>
          <TabsTrigger value="strengths">Strengths</TabsTrigger>
          <TabsTrigger value="improvements">Areas to Improve</TabsTrigger>
          <TabsTrigger value="practice">Practice Modules</TabsTrigger>
        </TabsList>

        <TabsContent value="breakdown">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(scores).map(([category, score]) => (
              <Card key={category}>
                <CardHeader className="pb-3">
                  <CardTitle className="capitalize text-lg">{category.replace(/([A-Z])/g, ' $1').trim()}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Score</span>
                    <span className="font-medium">{score}%</span>
                  </div>
                  <Progress value={score} className="h-3 mb-4" />
                  
                  <div className="flex items-center gap-2 text-sm">
                    {score >= 85 ? (
                      <>
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span className="text-green-600">Excellent</span>
                      </>
                    ) : score >= 70 ? (
                      <>
                        <Target className="w-4 h-4 text-blue-500" />
                        <span className="text-blue-600">Good</span>
                      </>
                    ) : (
                      <>
                        <TrendingDown className="w-4 h-4 text-yellow-500" />
                        <span className="text-yellow-600">Needs Work</span>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="strengths">
          <div className="space-y-4">
            {strengths.map((strength, index) => {
              const Icon = strength.icon;
              return (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Icon className={`w-6 h-6 ${strength.color} mt-1`} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">{strength.title}</h3>
                          <Badge variant="secondary">{strength.score}%</Badge>
                        </div>
                        <p className="text-muted-foreground">{strength.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="improvements">
          <div className="space-y-6">
            {improvements.map((improvement, index) => {
              const Icon = improvement.icon;
              return (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Icon className={`w-6 h-6 ${improvement.color} mt-1`} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">{improvement.title}</h3>
                          <Badge variant="outline">{improvement.score}%</Badge>
                        </div>
                        <p className="text-muted-foreground mb-4">{improvement.description}</p>
                        
                        <div className="bg-muted/50 rounded-lg p-4">
                          <h4 className="font-medium mb-2">Recommended Actions</h4>
                          <ul className="space-y-1">
                            {improvement.tips?.map((tip, tipIndex) => (
                              <li key={tipIndex} className="text-sm text-muted-foreground flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {/* Follow-up Questions */}
            <Card>
              <CardHeader>
                <CardTitle>Suggested Follow-up Questions</CardTitle>
                <CardDescription>
                  Practice these questions to deepen your understanding
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {followUpQuestions.map((question, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-primary">{index + 1}</span>
                      </div>
                      <span className="flex-1">{question}</span>
                      <Button variant="outline" size="sm">
                        <Play className="w-3 h-3 mr-1" />
                        Practice
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="practice">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {practiceModules.map((module, index) => (
              <Card key={index} className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{module.title}</CardTitle>
                    <Badge variant="outline">{module.difficulty}</Badge>
                  </div>
                  <CardDescription>Duration: {module.duration}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-1">
                      {module.topics.map((topic) => (
                        <Badge key={topic} variant="secondary" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                    
                    {module.progress > 0 && (
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{module.progress}%</span>
                        </div>
                        <Progress value={module.progress} className="h-2" />
                      </div>
                    )}
                    
                    <Button className="w-full" variant={module.progress > 0 ? "outline" : "default"}>
                      <BookOpen className="w-4 h-4 mr-2" />
                      {module.progress > 0 ? 'Continue' : 'Start Module'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
