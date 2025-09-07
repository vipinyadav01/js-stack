import { NextRequest, NextResponse } from 'next/server';
import { geminiService } from '@/services/gemini';
import { z } from 'zod';

// Request validation schema
const requestSchema = z.object({
  description: z.string().min(10).max(1000),
  projectType: z.string().optional(),
  features: z.array(z.string()).optional(),
  scalability: z.enum(['small', 'medium', 'large']).optional(),
  teamSize: z.number().min(1).max(100).optional(),
  experience: z.enum(['beginner', 'intermediate', 'expert']).optional(),
  deployment: z.array(z.string()).optional(),
  budget: z.enum(['low', 'medium', 'high']).optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Check if Gemini API key is configured
    if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 503 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = requestSchema.parse(body);

    // Analyze requirements if only description is provided
    let requirements;
    if (!validatedData.projectType) {
      requirements = await geminiService.analyzeRequirements(validatedData.description);
      // Merge with any provided data
      requirements = {
        ...requirements,
        ...validatedData,
      };
    } else {
      requirements = {
        description: validatedData.description,
        projectType: validatedData.projectType,
        features: validatedData.features,
        scalability: validatedData.scalability,
        teamSize: validatedData.teamSize,
        experience: validatedData.experience,
        deployment: validatedData.deployment,
        budget: validatedData.budget,
      };
    }

    // Get AI suggestions
    const suggestions = await geminiService.getSuggestions(requirements);

    // Get additional insights
    const [explanation, optimizations] = await Promise.all([
      geminiService.explainStack(suggestions),
      geminiService.optimizeStack(suggestions),
    ]);

    // Return comprehensive response
    return NextResponse.json({
      success: true,
      data: {
        requirements,
        suggestions,
        explanation,
        optimizations,
      },
    });
  } catch (error) {
    console.error('AI Suggestion API Error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to generate suggestions' },
      { status: 500 }
    );
  }
}

// GET endpoint to check API status
export async function GET() {
  const isConfigured = !!process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  
  return NextResponse.json({
    status: isConfigured ? 'ready' : 'not_configured',
    provider: 'Google Gemini',
    model: 'gemini-1.5-pro',
    features: [
      'stack_suggestions',
      'requirement_analysis',
      'code_generation',
      'stack_explanation',
      'optimization_tips',
    ],
  });
}
