'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, Loader2, Bot, User, Lightbulb, Code, Zap, AlertCircle } from 'lucide-react';
import { geminiService, type StackSuggestion, type ProjectRequirements } from '@/services/gemini';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

interface AIAssistantProps {
  onSuggestion?: (stack: StackSuggestion) => void;
  initialQuery?: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  stack?: StackSuggestion;
  timestamp: Date;
}

export function AIAssistant({ onSuggestion, initialQuery = '' }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(false);
  const [requirements, setRequirements] = useState<ProjectRequirements | null>(null);
  const [currentStack, setCurrentStack] = useState<StackSuggestion | null>(null);
  const [explanation, setExplanation] = useState<string>('');
  const [optimizations, setOptimizations] = useState<string[]>([]);

  // Example prompts
  const examplePrompts = [
    "I need an e-commerce platform with real-time inventory",
    "Build a SaaS dashboard with team collaboration",
    "Create a high-performance API for mobile app",
    "Simple blog with SEO and markdown support",
    "Enterprise app with microservices architecture",
  ];

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // First, analyze the requirements
      const analyzed = await geminiService.analyzeRequirements(input);
      setRequirements(analyzed);

      // Get stack suggestions
      const suggestion = await geminiService.getSuggestions(analyzed);
      setCurrentStack(suggestion);

      // Get explanation
      const stackExplanation = await geminiService.explainStack(suggestion);
      setExplanation(stackExplanation);

      // Get optimizations
      const stackOptimizations = await geminiService.optimizeStack(suggestion);
      setOptimizations(stackOptimizations);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Based on your requirements for **${analyzed.projectType}**, I recommend this technology stack:\n\n${suggestion.reasoning}`,
        stack: suggestion,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Notify parent component
      if (onSuggestion) {
        onSuggestion(suggestion);
      }

      toast.success('Stack recommendation generated!', {
        description: 'Review the suggested technologies below',
      });
    } catch (error) {
      console.error('AI Assistant error:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I encountered an error while processing your request. Please try again or rephrase your requirements.',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
      
      toast.error('Failed to generate recommendation', {
        description: 'Please check your Gemini API key and try again',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExampleClick = (prompt: string) => {
    setInput(prompt);
  };

  const generateCode = async (fileName: string, description: string) => {
    if (!currentStack) return;

    setIsLoading(true);
    try {
      const code = await geminiService.generateCode(currentStack, fileName, description);
      
      // You can display the code in a modal or code editor
      toast.success('Code generated successfully!');
      
      // For now, just log it
      console.log('Generated code:', code);
    } catch (error) {
      toast.error('Failed to generate code');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Main AI Assistant Card */}
      <Card className="border-gradient-start/20 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-gradient-start to-gradient-end">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="gradient-text">Gemini AI Assistant</span>
          </CardTitle>
          <CardDescription>
            Describe your project and get intelligent stack recommendations powered by Google Gemini
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Example Prompts */}
          {messages.length === 0 && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Try an example:</p>
              <div className="flex flex-wrap gap-2">
                {examplePrompts.map((prompt, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    size="sm"
                    onClick={() => handleExampleClick(prompt)}
                    className="text-xs hover:border-primary transition-colors"
                  >
                    {prompt}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.length > 0 && (
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-4">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`flex gap-3 ${
                        message.role === 'assistant' ? 'flex-row' : 'flex-row-reverse'
                      }`}
                    >
                      <div
                        className={`p-2 rounded-full ${
                          message.role === 'assistant'
                            ? 'bg-gradient-to-br from-gradient-start to-gradient-end'
                            : 'bg-primary'
                        }`}
                      >
                        {message.role === 'assistant' ? (
                          <Bot className="h-4 w-4 text-white" />
                        ) : (
                          <User className="h-4 w-4 text-white" />
                        )}
                      </div>
                      <div
                        className={`flex-1 rounded-lg p-3 ${
                          message.role === 'assistant'
                            ? 'bg-muted'
                            : 'bg-primary/10'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        
                        {/* Display stack if available */}
                        {message.stack && (
                          <div className="mt-3 space-y-2">
                            <div className="flex flex-wrap gap-2">
                              <Badge variant="secondary">
                                Frontend: {message.stack.frontend.join(', ')}
                              </Badge>
                              <Badge variant="secondary">
                                Backend: {message.stack.backend}
                              </Badge>
                              <Badge variant="secondary">
                                Database: {message.stack.database}
                              </Badge>
                              <Badge variant="secondary">
                                Auth: {message.stack.auth}
                              </Badge>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </ScrollArea>
          )}

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="space-y-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe your project requirements... (e.g., 'I need a social media platform with real-time chat and video streaming')"
              className="min-h-[80px] resize-none"
              disabled={isLoading}
            />
            <Button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="w-full bg-gradient-to-r from-gradient-start to-gradient-end hover:opacity-90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing with Gemini...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Get AI Recommendations
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Additional Insights */}
      {currentStack && (
        <Tabs defaultValue="explanation" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="explanation">
              <Lightbulb className="mr-2 h-4 w-4" />
              Explanation
            </TabsTrigger>
            <TabsTrigger value="alternatives">
              <Code className="mr-2 h-4 w-4" />
              Alternatives
            </TabsTrigger>
            <TabsTrigger value="optimizations">
              <Zap className="mr-2 h-4 w-4" />
              Optimizations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="explanation" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Why This Stack?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {explanation || currentStack.reasoning}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alternatives" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Alternative Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {currentStack.alternatives?.frontend && (
                  <div>
                    <p className="text-sm font-medium mb-2">Frontend Alternatives:</p>
                    <div className="flex gap-2">
                      {currentStack.alternatives.frontend.map((alt) => (
                        <Badge key={alt} variant="outline">
                          {alt}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {currentStack.alternatives?.backend && (
                  <div>
                    <p className="text-sm font-medium mb-2">Backend Alternatives:</p>
                    <div className="flex gap-2">
                      {currentStack.alternatives.backend.map((alt) => (
                        <Badge key={alt} variant="outline">
                          {alt}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {currentStack.alternatives?.database && (
                  <div>
                    <p className="text-sm font-medium mb-2">Database Alternatives:</p>
                    <div className="flex gap-2">
                      {currentStack.alternatives.database.map((alt) => (
                        <Badge key={alt} variant="outline">
                          {alt}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="optimizations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Optimization Tips</CardTitle>
                <CardDescription>
                  AI-powered suggestions to improve your stack
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {optimizations.length > 0 ? (
                    optimizations.map((tip, idx) => (
                      <Alert key={idx}>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{tip}</AlertDescription>
                      </Alert>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No specific optimizations available yet. Try analyzing your stack first.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Requirements Analysis */}
      {requirements && (
        <Card>
          <CardHeader>
            <CardTitle>Project Analysis</CardTitle>
            <CardDescription>
              Gemini AI's understanding of your requirements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Project Type</p>
                <p className="text-sm text-muted-foreground capitalize">
                  {requirements.projectType}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Scale</p>
                <p className="text-sm text-muted-foreground capitalize">
                  {requirements.scalability || 'Medium'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Team Size</p>
                <p className="text-sm text-muted-foreground">
                  {requirements.teamSize || 1} developer(s)
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Experience Level</p>
                <p className="text-sm text-muted-foreground capitalize">
                  {requirements.experience || 'Intermediate'}
                </p>
              </div>
            </div>
            {requirements.features && requirements.features.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Key Features</p>
                <div className="flex flex-wrap gap-2">
                  {requirements.features.map((feature, idx) => (
                    <Badge key={idx} variant="secondary">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
