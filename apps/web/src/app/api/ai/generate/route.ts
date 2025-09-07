import { NextRequest, NextResponse } from 'next/server';
import { geminiService } from '@/services/gemini';
import { z } from 'zod';

// Request validation schema
const codeGenerationSchema = z.object({
  stack: z.object({
    frontend: z.array(z.string()),
    backend: z.string(),
    database: z.string(),
    orm: z.string(),
    auth: z.string(),
    addons: z.array(z.string()),
  }),
  fileName: z.string().min(1).max(100),
  description: z.string().min(10).max(500),
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
    const { stack, fileName, description } = codeGenerationSchema.parse(body);

    // Generate code using Gemini
    const generatedCode = await geminiService.generateCode(
      {
        ...stack,
        reasoning: '',
      },
      fileName,
      description
    );

    // Return the generated code
    return NextResponse.json({
      success: true,
      data: {
        fileName,
        code: generatedCode,
        language: detectLanguage(fileName),
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Code Generation API Error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to generate code' },
      { status: 500 }
    );
  }
}

// Helper function to detect language from filename
function detectLanguage(fileName: string): string {
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  const languageMap: Record<string, string> = {
    js: 'javascript',
    jsx: 'javascript',
    ts: 'typescript',
    tsx: 'typescript',
    py: 'python',
    rb: 'ruby',
    go: 'go',
    rs: 'rust',
    java: 'java',
    cpp: 'cpp',
    c: 'c',
    cs: 'csharp',
    php: 'php',
    swift: 'swift',
    kt: 'kotlin',
    dart: 'dart',
    sql: 'sql',
    html: 'html',
    css: 'css',
    scss: 'scss',
    sass: 'sass',
    less: 'less',
    json: 'json',
    xml: 'xml',
    yaml: 'yaml',
    yml: 'yaml',
    md: 'markdown',
    sh: 'shell',
    bash: 'bash',
    ps1: 'powershell',
    dockerfile: 'dockerfile',
    makefile: 'makefile',
  };

  return languageMap[extension || ''] || 'plaintext';
}
