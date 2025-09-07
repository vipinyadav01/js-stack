import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { StackSuggestion, ProjectRequirements } from '@/services/gemini';

interface UseGeminiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
  showToasts?: boolean;
}

interface SuggestResponse {
  success: boolean;
  data: {
    requirements: ProjectRequirements;
    suggestions: StackSuggestion;
    explanation: string;
    optimizations: string[];
  };
}

interface GenerateResponse {
  success: boolean;
  data: {
    fileName: string;
    code: string;
    language: string;
    timestamp: string;
  };
}

export function useGemini(options: UseGeminiOptions = {}) {
  const { onSuccess, onError, showToasts = true } = options;
  const [isConfigured, setIsConfigured] = useState<boolean | null>(null);

  // Check if Gemini is configured
  const checkConfiguration = useCallback(async () => {
    try {
      const response = await fetch('/api/ai/suggest');
      const data = await response.json();
      const configured = data.status === 'ready';
      setIsConfigured(configured);
      return configured;
    } catch (error) {
      setIsConfigured(false);
      return false;
    }
  }, []);

  // Get stack suggestions
  const suggestStack = useMutation<SuggestResponse, Error, Partial<ProjectRequirements>>({
    mutationFn: async (requirements) => {
      const response = await fetch('/api/ai/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requirements),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to get suggestions');
      }

      return response.json();
    },
    onSuccess: (data) => {
      if (showToasts) {
        toast.success('Stack recommendation generated!', {
          description: 'Review your personalized technology stack',
        });
      }
      onSuccess?.(data);
    },
    onError: (error) => {
      if (showToasts) {
        toast.error('Failed to generate recommendations', {
          description: error.message,
        });
      }
      onError?.(error);
    },
  });

  // Generate code
  const generateCode = useMutation<GenerateResponse, Error, {
    stack: Partial<StackSuggestion>;
    fileName: string;
    description: string;
  }>({
    mutationFn: async ({ stack, fileName, description }) => {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stack, fileName, description }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate code');
      }

      return response.json();
    },
    onSuccess: (data) => {
      if (showToasts) {
        toast.success('Code generated successfully!', {
          description: `Generated ${data.data.fileName}`,
        });
      }
      onSuccess?.(data);
    },
    onError: (error) => {
      if (showToasts) {
        toast.error('Failed to generate code', {
          description: error.message,
        });
      }
      onError?.(error);
    },
  });

  // Get suggestions with natural language
  const askGemini = useCallback(
    async (query: string) => {
      return suggestStack.mutateAsync({
        description: query,
      });
    },
    [suggestStack]
  );

  // Get suggestions with detailed requirements
  const getSuggestions = useCallback(
    async (requirements: Partial<ProjectRequirements>) => {
      return suggestStack.mutateAsync(requirements);
    },
    [suggestStack]
  );

  // Generate specific file
  const generateFile = useCallback(
    async (
      fileName: string,
      description: string,
      stack?: Partial<StackSuggestion>
    ) => {
      const defaultStack: Partial<StackSuggestion> = {
        frontend: ['react'],
        backend: 'express',
        database: 'postgres',
        orm: 'prisma',
        auth: 'jwt',
        addons: ['eslint', 'prettier'],
      };

      return generateCode.mutateAsync({
        stack: stack || defaultStack,
        fileName,
        description,
      });
    },
    [generateCode]
  );

  return {
    // State
    isConfigured,
    isLoading: suggestStack.isLoading || generateCode.isLoading,
    isSuggesting: suggestStack.isLoading,
    isGenerating: generateCode.isLoading,
    error: suggestStack.error || generateCode.error,

    // Methods
    checkConfiguration,
    askGemini,
    getSuggestions,
    generateFile,
    
    // Mutations (for advanced usage)
    suggestStack,
    generateCode,
  };
}

// Export specific hooks for common use cases
export function useStackSuggestions(options?: UseGeminiOptions) {
  const { suggestStack, isLoading, error } = useGemini(options);
  
  return {
    suggest: suggestStack.mutateAsync,
    isLoading,
    error,
    data: suggestStack.data,
  };
}

export function useCodeGeneration(options?: UseGeminiOptions) {
  const { generateCode, isLoading, error } = useGemini(options);
  
  return {
    generate: generateCode.mutateAsync,
    isLoading,
    error,
    data: generateCode.data,
  };
}
