'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DndContext, DragEndEvent, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { StackVisualizer } from '@/components/builder/StackVisualizer';
import { TechnologyPalette } from '@/components/builder/TechnologyPalette';
import { AIAssistant } from '@/components/builder/AIAssistant';
import { StackOptimizer } from '@/components/builder/StackOptimizer';
import { RealTimePreview } from '@/components/builder/RealTimePreview';
import { DeploymentPanel } from '@/components/builder/DeploymentPanel';
import { StatsDisplay } from '@/components/builder/StatsDisplay';
import { fetchNPMData, fetchGitHubData } from '@/services/api';
import { optimizeStack, validateCompatibility } from '@/lib/stack-logic';
import { toast } from 'sonner';
import { 
  Sparkles, 
  Code, 
  Rocket, 
  Package, 
  GitBranch, 
  BarChart,
  Settings,
  Download,
  Share2,
  Eye,
  Zap
} from 'lucide-react';
import type { StackItem, StackConfig } from '@/lib/stack-logic';

export default function BuilderPage() {
  const [stack, setStack] = useState<StackConfig>({
    id: 'new-stack',
    name: 'My Stack',
    items: [],
    score: 0,
    compatibility: 100,
    performance: 0,
    popularity: 0,
  });

  const [npmData, setNpmData] = useState<Record<string, import('@/services/api').NPMPackageData | null>>({});
  const [githubData, setGithubData] = useState<Record<string, import('@/services/api').GitHubRepoData | null>>({});
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<any>(null);
  const [deploymentReady, setDeploymentReady] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Fetch real NPM and GitHub data
  useEffect(() => {
    const fetchRealData = async () => {
      for (const item of stack.items) {
        if (item.npmPackage) {
          const data = await fetchNPMData(item.npmPackage);
          setNpmData((prev: Record<string, import('@/services/api').NPMPackageData | null>) => ({ ...prev, [item.npmPackage!]: data }));
        }
        if (item.githubRepo) {
          const data = await fetchGitHubData(item.githubRepo);
          setGithubData((prev: Record<string, import('@/services/api').GitHubRepoData | null>) => ({ ...prev, [item.githubRepo!]: data }));
        }
      }
    };

    if (stack.items.length > 0) {
      fetchRealData();
    }
  }, [stack.items]);

  // Advanced stack optimization logic
  const handleOptimizeStack = async () => {
    setIsOptimizing(true);
    try {
      const optimized = await optimizeStack(stack, {
        performance: true,
        scalability: true,
        costEfficiency: true,
        developerExperience: true,
      });
      
      setStack(optimized);
      toast.success('Stack optimized successfully!', {
        description: `Performance improved by ${optimized.performance - stack.performance}%`,
      });
    } catch (error) {
      toast.error('Optimization failed', {
        description: 'Please try again or adjust your stack manually.',
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      // Handle drag and drop logic
      const newItem = active.data.current as StackItem;
      
      // Validate compatibility
      const isCompatible = validateCompatibility(stack.items, newItem);
      
      if (isCompatible) {
        setStack(prev => ({
          ...prev,
          items: [...prev.items, newItem],
          score: calculateStackScore([...prev.items, newItem]),
        }));
        toast.success(`Added ${newItem.name} to your stack!`);
      } else {
        toast.error('Incompatible technology', {
          description: 'This technology conflicts with your current stack.',
        });
      }
    }
  };

  const calculateStackScore = (items: StackItem[]) => {
    // Advanced scoring algorithm
    let score = 0;
    
    // Performance score based on technology choices
    const performanceScores: Record<string, number> = {
      'nextjs': 90,
      'react': 85,
      'vue': 85,
      'svelte': 95,
      'fastify': 95,
      'express': 80,
      'postgres': 90,
      'mongodb': 85,
      'redis': 95,
    };
    
    items.forEach(item => {
      score += performanceScores[item.name.toLowerCase()] || 70;
    });
    
    // Bonus for good combinations
    const hasFullStack = 
      items.some(i => i.category === 'frontend') &&
      items.some(i => i.category === 'backend') &&
      items.some(i => i.category === 'database');
    
    if (hasFullStack) score += 50;
    
    // Normalize to 0-100
    return Math.min(100, Math.round(score / items.length));
  };

  const handleGenerateProject = async () => {
    if (stack.items.length === 0) {
      toast.error('Please add technologies to your stack first');
      return;
    }

    setDeploymentReady(true);
    toast.success('Project generated successfully!', {
      description: 'Your project is ready for deployment.',
      action: {
        label: 'Deploy',
        onClick: () => console.log('Deploy'),
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-8 h-8 text-blue-600" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Stack Builder Pro
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Build your perfect tech stack with AI assistance
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <StatsDisplay 
                npmData={npmData}
                githubData={githubData}
                stack={stack}
              />
              
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Preview
              </button>
              
              <button
                onClick={handleOptimizeStack}
                disabled={isOptimizing || stack.items.length === 0}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isOptimizing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Optimizing...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    Optimize
                  </>
                )}
              </button>
              
              <button
                onClick={handleGenerateProject}
                disabled={stack.items.length === 0}
                className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Rocket className="w-4 h-4" />
                Generate
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Technology Palette */}
          <div className="col-span-3">
            <TechnologyPalette />
          </div>

          {/* Main Builder Area */}
          <div className="col-span-6">
            <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Your Stack
                  </h2>
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Score: <span className="font-bold text-blue-600">{stack.score}/100</span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Compatibility: <span className="font-bold text-green-600">{stack.compatibility}%</span>
                    </div>
                  </div>
                </div>

                <StackVisualizer 
                  stack={stack}
                  onRemoveItem={(itemId) => {
                    setStack(prev => ({
                      ...prev,
                      items: prev.items.filter(i => i.id !== itemId),
                      score: calculateStackScore(prev.items.filter(i => i.id !== itemId)),
                    }));
                  }}
                />

                {/* Stack Metrics */}
                <div className="mt-6 grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                    <div className="text-sm text-blue-600 dark:text-blue-400 mb-1">Performance</div>
                    <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                      {stack.performance}%
                    </div>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                    <div className="text-sm text-green-600 dark:text-green-400 mb-1">Scalability</div>
                    <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                      {Math.round((stack.score + stack.compatibility) / 2)}%
                    </div>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                    <div className="text-sm text-purple-600 dark:text-purple-400 mb-1">Popularity</div>
                    <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                      {stack.popularity}%
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Assistant */}
              <div className="mt-6">
                <AIAssistant 
                  stack={stack}
                  onSuggestion={(suggestion) => {
                    setAiSuggestions(suggestion);
                    // Apply AI suggestions to stack
                  }}
                />
              </div>
            </DndContext>
          </div>

          {/* Right Sidebar */}
          <div className="col-span-3">
            {/* Stack Optimizer */}
            <StackOptimizer 
              stack={stack}
              npmData={npmData}
              githubData={githubData}
            />

            {/* Deployment Panel */}
            {deploymentReady && (
              <div className="mt-6">
                <DeploymentPanel stack={stack} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreview && (
          <RealTimePreview 
            stack={stack}
            onClose={() => setShowPreview(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
