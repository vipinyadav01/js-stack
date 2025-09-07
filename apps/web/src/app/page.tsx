'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Code2, Rocket, Cpu, Users, Zap, GitBranch, Shield } from 'lucide-react';
import { Hero } from '@/components/sections/Hero';
import { StackBuilder } from '@/components/stack-builder/StackBuilder';
import { AIAssistant } from '@/components/ai/AIAssistant';
import { LivePreview } from '@/components/preview/LivePreview';
import { Features } from '@/components/sections/Features';
import { Stats } from '@/components/sections/Stats';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const features = [
  {
    icon: Sparkles,
    title: 'AI-Powered Stack Selection',
    description: 'Get intelligent recommendations based on your project requirements and preferences.',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: Code2,
    title: 'Visual Stack Builder',
    description: 'Drag and drop interface to build your perfect tech stack visually.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Rocket,
    title: 'One-Click Deploy',
    description: 'Deploy to Vercel, Netlify, or Railway with a single click.',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    icon: Cpu,
    title: 'Real-Time Code Generation',
    description: 'Watch your project come to life with live code generation.',
    gradient: 'from-orange-500 to-red-500',
  },
  {
    icon: Users,
    title: 'Collaborative Workspace',
    description: 'Share and collaborate on stack configurations with your team.',
    gradient: 'from-indigo-500 to-purple-500',
  },
  {
    icon: Zap,
    title: 'Performance Optimized',
    description: 'Every stack is optimized for maximum performance out of the box.',
    gradient: 'from-yellow-500 to-orange-500',
  },
  {
    icon: GitBranch,
    title: 'Version Control Ready',
    description: 'Git integration with conventional commits and automated workflows.',
    gradient: 'from-teal-500 to-green-500',
  },
  {
    icon: Shield,
    title: 'Security First',
    description: 'Built-in security best practices and dependency scanning.',
    gradient: 'from-red-500 to-pink-500',
  },
];

const stats = [
  { value: '50K+', label: 'Projects Created', trend: '+12%' },
  { value: '200+', label: 'Stack Combinations', trend: '+25%' },
  { value: '98%', label: 'Success Rate', trend: '+2%' },
  { value: '15s', label: 'Avg. Build Time', trend: '-30%' },
];

export default function HomePage() {
  const [showBuilder, setShowBuilder] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [selectedStack, setSelectedStack] = useState(null);

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <Hero 
        onStartBuilding={() => setShowBuilder(true)}
        onAIAssist={() => setShowAI(true)}
      />

      {/* Interactive Builder Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="py-20 px-4"
      >
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold gradient-text mb-4">
              Build Your Stack Visually
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Choose your technologies, see the code generate in real-time, 
              and deploy with confidence.
            </p>
          </div>

          {/* Stack Builder Interface */}
          {showBuilder && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="grid lg:grid-cols-2 gap-8"
            >
              <div className="space-y-6">
                <StackBuilder 
                  onStackChange={setSelectedStack}
                  showAIAssist={showAI}
                />
                {showAI && (
                  <AIAssistant 
                    onSuggestion={(stack) => setSelectedStack(stack)}
                  />
                )}
              </div>
              <div>
                <LivePreview stack={selectedStack} />
              </div>
            </motion.div>
          )}

          {!showBuilder && (
            <div className="flex justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowBuilder(true)}
                className="px-8 py-4 bg-gradient-to-r from-gradient-start to-gradient-end text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
              >
                Open Visual Builder
              </motion.button>
            </div>
          )}
        </div>
      </motion.section>

      {/* Features Grid */}
      <Features features={features} />

      {/* Stats Section */}
      <Stats stats={stats} />

      {/* Call to Action */}
      <section className="py-20 px-4 bg-gradient-to-r from-gradient-start/10 to-gradient-end/10">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-4xl font-bold">
              Ready to Build Something Amazing?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of developers who are building faster and smarter with JS Stack.
            </p>
            <div className="flex gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Get Started Free
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border border-border rounded-lg font-semibold hover:bg-accent transition-all"
              >
                View Documentation
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
