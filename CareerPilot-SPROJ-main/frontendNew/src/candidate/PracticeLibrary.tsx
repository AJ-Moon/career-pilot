import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Search,
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
} from "lucide-react";

// ✅ Interfaces
interface Domain {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  questions: number;
}

interface Question {
  title: string;
  domain: string;
  difficulty: string;
  duration: string;
  questions: number;
  rating: number;
  description: string;
  topics: string[];
  link: string;
}

interface Flashcard {
  question: string;
  answer: string;
}

// ✅ Domain list
const domains: Domain[] = [
  {
    id: "software",
    name: "Software Engineering",
    icon: Code,
    color: "bg-blue-500",
    questions: 120,
  },
  {
    id: "data",
    name: "Data Science / ML",
    icon: BarChart3,
    color: "bg-green-500",
    questions: 95,
  },
  {
    id: "research",
    name: "Research/PhD",
    icon: GraduationCap,
    color: "bg-purple-500",
    questions: 75,
  },
  {
    id: "devops",
    name: "DevOps",
    icon: Database,
    color: "bg-orange-500",
    questions: 85,
  },
  {
    id: "security",
    name: "Cybersecurity",
    icon: Shield,
    color: "bg-red-500",
    questions: 90,
  },
  {
    id: "design",
    name: "Design",
    icon: Palette,
    color: "bg-pink-500",
    questions: 70,
  },
  {
    id: "engineering",
    name: "Electrical/Mechanical",
    icon: Cpu,
    color: "bg-yellow-500",
    questions: 80,
  },
];

export default function PracticeLibrary() {
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const BACKEND_URL = "http://localhost:5005";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentCard, setCurrentCard] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const [activeTab, setActiveTab] = useState("questions");

  const flashcardCategories = [
    "Data Analysis",
    "Predictive Modeling",
    "Communication",
    "Probability",
    "Product Metrics",
    "Programming",
    "Statistical Inference",
  ];

  // ------------------ FETCH QUESTIONS ------------------
  const fetchQuestions = async (
    difficulty: string = "all",
    topic: string = "all",
    pageNumber: number = 1,
    pageSize: number = 20
  ) => {
    try {
      setLoading(true);
      setError(null);

      const difficultyParam =
        difficulty === "all" ? ["Easy", "Medium", "Hard"] : [difficulty];
      const query = new URLSearchParams();
      difficultyParam.forEach((d) => query.append("difficulty", d));
      if (topic !== "all") query.append("topic", topic);
      query.append("page", pageNumber.toString());
      query.append("limit", pageSize.toString());

      const res = await fetch(
        `${BACKEND_URL}/api/practice/software?${query.toString()}`
      );
      if (!res.ok) throw new Error("Failed to fetch questions");

      const data = await res.json();

      if (pageNumber === 1) {
        setQuestions(data.questions || []);
      } else {
        setQuestions((prev) => [...prev, ...(data.questions || [])]);
      }

      setTotalCount(data.totalCount || 0);
    } catch (err) {
      console.error(err);
      setError("Could not load questions.");
    } finally {
      setLoading(false);
    }
  };

  // ------------------ EFFECTS ------------------
  useEffect(() => {
    setPage(1);
    fetchQuestions(difficultyFilter, selectedTopic, 1, pageSize);
  }, [difficultyFilter, selectedTopic, searchQuery]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchQuestions(difficultyFilter, selectedTopic, nextPage, pageSize);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-700 border-green-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Hard":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const filteredQuestions = questions.filter(
    (q) =>
      (q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (difficultyFilter === "all" || q.difficulty === difficultyFilter) &&
      (selectedTopic === "all" || q.topics.includes(selectedTopic))
  );

  // ------------------ JSX ------------------
  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-medium mb-2">Practice Library</h1>
        <p className="text-muted-foreground">
          Browse domain-specific question sets and flashcards to enhance your
          interview skills
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList>
          <TabsTrigger value="questions">Question Sets</TabsTrigger>
          <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
          <TabsTrigger value="domains">Browse by Domain</TabsTrigger>
        </TabsList>

        {/* ------------------ QUESTIONS ------------------ */}
        <TabsContent value="questions" className="space-y-6">
          <Card>
            <CardContent className="p-4 flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search question sets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                <option value="all">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>

              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                <option value="all">All Topics</option>
                {Array.from(
                  new Set(
                    questions
                      .flatMap((q) => q.topics)
                      .filter(
                        (topic) => topic && /^[A-Za-z\s]+$/.test(topic.trim())
                      )
                  )
                )
                  .sort()
                  .map((topic) => (
                    <option key={topic} value={topic}>
                      {topic}
                    </option>
                  ))}
              </select>
            </CardContent>
          </Card>

          {loading && (
            <p className="text-center text-muted-foreground">
              Loading questions...
            </p>
          )}
          {error && <p className="text-center text-red-500">{error}</p>}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuestions.map((set, idx) => (
              <Card
                key={idx}
                className="border-l-4 border-l-primary hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{set.title}</CardTitle>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      {set.rating}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {set.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {set.topics.map((topic, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex justify-between">
                    <Badge className={getDifficultyColor(set.difficulty)}>
                      {set.difficulty}
                    </Badge>
                    <Button
                      size="sm"
                      onClick={() => window.open(set.link, "_blank")}
                    >
                      <Play className="w-4 h-4 mr-2" /> Start Practice
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {questions.length < totalCount && (
            <div className="flex justify-center mt-4">
              <Button onClick={handleLoadMore} variant="outline">
                Load More
              </Button>
            </div>
          )}
        </TabsContent>

        {/* ------------------ FLASHCARDS ------------------ */}
        <TabsContent value="flashcards" className="space-y-6">
          {!loading && !error && flashcards.length === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {flashcardCategories.map((category) => (
                <Card key={category}>
                  <CardHeader>
                    <CardTitle className="text-lg">{category}</CardTitle>
                    <CardDescription>Click to study flashcards</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      className="w-full"
                      onClick={async () => {
                        try {
                          setLoading(true);
                          const res = await fetch(
                            `${BACKEND_URL}/api/practice/datascience-flashcards?category=${encodeURIComponent(
                              category
                            )}`
                          );
                          const data = await res.json();
                          setFlashcards(
                            data.flashcards.sort(() => Math.random() - 0.5)
                          );
                          setCurrentCard(0);
                          setShowAnswer(false);
                        } catch {
                          setError("Failed to load flashcards.");
                        } finally {
                          setLoading(false);
                        }
                      }}
                    >
                      <BookOpen className="w-4 h-4 mr-2" /> Study Cards
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {flashcards.length > 0 && (
            <div className="flex flex-col items-center gap-6">
              <Card className="w-full max-w-md p-8 rounded-2xl shadow-xl border border-gray-200 text-center bg-gradient-to-br from-indigo-50 via-white to-pink-50">
                <CardContent>
                  {!showAnswer ? (
                    <>
                      <p className="text-lg md:text-xl text-gray-800 font-medium whitespace-pre-line">
                        {flashcards[currentCard].question}
                      </p>
                      <Button
                        className="mt-6 w-full md:w-auto bg-indigo-500 text-white"
                        onClick={() => setShowAnswer(true)}
                      >
                        Reveal Answer
                      </Button>
                    </>
                  ) : (
                    <>
                      <p className="text-lg md:text-xl font-semibold text-pink-600 whitespace-pre-line mb-4">
                        {flashcards[currentCard].answer}
                      </p>
                      <Button
                        className="mt-2 w-full md:w-auto bg-pink-500 text-white"
                        onClick={() => setShowAnswer(false)}
                      >
                        Hide Answer
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>

              <div className="flex gap-2 flex-wrap justify-center">
                <Button
                  variant="outline"
                  disabled={currentCard === 0}
                  onClick={() => {
                    setCurrentCard((p) => Math.max(p - 1, 0));
                    setShowAnswer(false);
                  }}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    if (currentCard < flashcards.length - 1) {
                      setCurrentCard((p) => p + 1);
                      setShowAnswer(false);
                    } else {
                      setFlashcards([]);
                    }
                  }}
                >
                  {currentCard < flashcards.length - 1 ? "Next" : "Finish"}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setFlashcards([]);
                    setCurrentCard(0);
                    setShowAnswer(false);
                  }}
                >
                  Back to Categories
                </Button>
              </div>
            </div>
          )}

          {loading && (
            <p className="text-center text-muted-foreground">
              Loading flashcards...
            </p>
          )}
          {error && <p className="text-center text-red-500">{error}</p>}
        </TabsContent>

        {/* ------------------ DOMAINS ------------------ */}
        <TabsContent value="domains" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {domains.map((domain) => {
              const Icon = domain.icon;
              return (
                <Card
                  key={domain.id}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div
                        className={`w-12 h-12 rounded-lg ${domain.color} flex items-center justify-center`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium">{domain.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {domain.questions} questions available
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        if (domain.id === "software") setActiveTab("questions");
                        else if (domain.id === "data")
                          setActiveTab("flashcards");
                      }}
                    >
                      Explore Domain <ChevronRight className="w-4 h-4 ml-2" />
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
