// import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Slider } from './ui/slider';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { 
  Code, 
  Database, 
  Shield, 
  Palette, 
  Cpu, 
  BarChart3, 
  GraduationCap,
  MessageSquare,
  Terminal,
  FolderOpen,
  Globe,
  Accessibility
} from 'lucide-react';

interface PreInterviewModalProps {
  open: boolean;
  onClose: () => void;
  onComplete: (config: InterviewConfig) => void;
  selectedDomain: string;
}

interface InterviewConfig {
  domain: string;
  difficulty: number;
  track: string;
  language: string;
  personalAdjustments: boolean;
}

const domains = [
  { id: 'software', name: 'Software Engineering', icon: Code, color: 'bg-blue-500' },
  { id: 'data', name: 'Data Science / ML', icon: BarChart3, color: 'bg-green-500' },
  { id: 'research', name: 'Research/PhD', icon: GraduationCap, color: 'bg-purple-500' },
  { id: 'devops', name: 'DevOps', icon: Database, color: 'bg-orange-500' },
  { id: 'security', name: 'Cybersecurity', icon: Shield, color: 'bg-red-500' },
  { id: 'design', name: 'Design', icon: Palette, color: 'bg-pink-500' },
  { id: 'engineering', name: 'Electrical/Mechanical', icon: Cpu, color: 'bg-yellow-500' },
];

const tracks = [
  { id: 'behavioral', name: 'Behavioral', icon: MessageSquare, description: 'STAR method, leadership, teamwork' },
  { id: 'technical', name: 'Technical', icon: Terminal, description: 'Coding, algorithms, system design' },
  { id: 'project', name: 'Project-based', icon: FolderOpen, description: 'Portfolio review, case studies' },
];

export default function PreInterviewModal({ open, onClose, onComplete, selectedDomain }: PreInterviewModalProps) {
  const [config, setConfig] = useState<InterviewConfig>({
    domain: selectedDomain,
    difficulty: 2, // 1: Beginner, 2: Intermediate, 3: Advanced
    track: 'behavioral',
    language: 'english',
    personalAdjustments: false,
  });

  const handleComplete = () => {
    onComplete(config);
  };

  const getDifficultyLabel = (value: number) => {
    switch (value) {
      case 1: return 'Beginner';
      case 2: return 'Intermediate';
      case 3: return 'Advanced';
      default: return 'Intermediate';
    }
  };

  const getDifficultyColor = (value: number) => {
    switch (value) {
      case 1: return 'bg-green-500';
      case 2: return 'bg-yellow-500';
      case 3: return 'bg-red-500';
      default: return 'bg-yellow-500';
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configure Your Interview</DialogTitle>
          <DialogDescription>
            Customize your interview experience for optimal practice
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Domain Selection */}
          <div>
            <h3 className="font-medium mb-3">Select Domain</h3>
            <div className="grid grid-cols-2 gap-3">
              {domains.map((domain) => {
                const Icon = domain.icon;
                const isSelected = config.domain === domain.name;
                return (
                  <Card
                    key={domain.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      isSelected ? 'ring-2 ring-primary bg-accent' : ''
                    }`}
                    onClick={() => setConfig(prev => ({ ...prev, domain: domain.name }))}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg ${domain.color} flex items-center justify-center`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-medium">{domain.name}</span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Difficulty Slider */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">Difficulty Level</h3>
              <Badge variant="outline" className={`${getDifficultyColor(config.difficulty)} text-white`}>
                {getDifficultyLabel(config.difficulty)}
              </Badge>
            </div>
            <div className="px-3">
              <Slider
                value={[config.difficulty]}
                onValueChange={(value) => setConfig(prev => ({ ...prev, difficulty: value[0] }))}
                max={3}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>Beginner</span>
                <span>Intermediate</span>
                <span>Advanced</span>
              </div>
            </div>
          </div>

          {/* Interview Track */}
          <div>
            <h3 className="font-medium mb-3">Interview Track</h3>
            <RadioGroup value={config.track} onValueChange={(value) => setConfig(prev => ({ ...prev, track: value }))}>
              <div className="space-y-3">
                {tracks.map((track) => {
                  const Icon = track.icon;
                  return (
                    <div key={track.id} className="flex items-start space-x-3">
                      <RadioGroupItem value={track.id} id={track.id} className="mt-1" />
                      <Label htmlFor={track.id} className="cursor-pointer flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <Icon className="w-5 h-5 text-primary" />
                          <span className="font-medium">{track.name}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{track.description}</p>
                      </Label>
                    </div>
                  );
                })}
              </div>
            </RadioGroup>
          </div>

          {/* Language Toggle */}
          <div>
            <h3 className="font-medium mb-3">Language Preference</h3>
            <RadioGroup value={config.language} onValueChange={(value) => setConfig(prev => ({ ...prev, language: value }))}>
              <div className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="english" id="english" />
                  <Label htmlFor="english" className="cursor-pointer flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    English
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="urdu" id="urdu" />
                  <Label htmlFor="urdu" className="cursor-pointer flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Urdu
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Personal Adjustments */}
          <div className="p-4 border rounded-lg bg-muted/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Accessibility className="w-5 h-5 text-primary" />
                <div>
                  <Label htmlFor="adjustments" className="font-medium">
                    Include Personal Adjustments
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Accommodations for neurodiversity, stuttering, or other needs
                  </p>
                </div>
              </div>
              <Switch
                id="adjustments"
                checked={config.personalAdjustments}
                onCheckedChange={(checked) => setConfig(prev => ({ ...prev, personalAdjustments: checked }))}
              />
            </div>
            
            {config.personalAdjustments && (
              <div className="mt-3 p-3 bg-blue-50 rounded-lg border">
                <p className="text-sm text-blue-700">
                  ✓ Extended thinking time enabled<br />
                  ✓ Reduced pressure scoring<br />
                  ✓ Alternative communication methods accepted
                </p>
              </div>
            )}
          </div>

          {/* Estimated Time */}
          <div className="p-4 bg-accent rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Estimated Duration</h4>
                <p className="text-sm text-muted-foreground">
                  Based on your selections
                </p>
              </div>
              <Badge variant="secondary" className="text-lg px-3 py-1">
                {config.track === 'behavioral' ? '20-25' : config.track === 'technical' ? '45-60' : '30-40'} min
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleComplete} className="flex-1">
            Start Interview
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
