import OpenAI from 'openai';
import { config } from '../config';

const openai = new OpenAI({
  apiKey: config.OPENAI_API_KEY,
});

export interface ContentAnalysis {
  description: string;
  tags: string[];
  category: 'image' | 'video' | 'document' | 'other';
  sensitivityScore: number; // 0-1, higher = more sensitive content
  fingerprint: string;
}

export interface SimilarityMatch {
  url: string;
  title: string;
  platform: string;
  similarityScore: number; // 0-1, higher = more similar
  thumbnailUrl?: string;
}

export async function analyzeContent(fileBuffer: Buffer, fileName: string): Promise<ContentAnalysis> {
  try {
    const base64Data = fileBuffer.toString('base64');
    const mimeType = fileName.endsWith('.jpg') || fileName.endsWith('.jpeg') ? 'image/jpeg' : 
                     fileName.endsWith('.png') ? 'image/png' : 
                     fileName.endsWith('.mp4') ? 'video/mp4' : 'application/octet-stream';

    if (mimeType.startsWith('image/')) {
      return await analyzeImage(base64Data, fileName);
    } else if (mimeType.startsWith('video/')) {
      return await analyzeVideo(base64Data, fileName);
    } else {
      return await analyzeGenericFile(fileName);
    }
  } catch (error) {
    console.error('[AI] Content analysis failed:', error);
    throw new Error('Failed to analyze content');
  }
}

async function analyzeImage(base64Data: string, fileName: string): Promise<ContentAnalysis> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o", // Latest model for vision
    messages: [
      {
        role: "system",
        content: `You are a content analysis expert. Analyze the image and provide:
1. A detailed description
2. Relevant tags (max 10)
3. Sensitivity score (0-1, where 1 = highly sensitive/adult content)
4. Generate a unique fingerprint string

Respond in JSON format: {
  "description": "detailed description",
  "tags": ["tag1", "tag2"],
  "sensitivityScore": 0.0,
  "fingerprint": "unique_string"
}`
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Analyze this image file: ${fileName}`
          },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${base64Data}`
            }
          }
        ]
      }
    ],
    response_format: { type: "json_object" },
    max_tokens: 500,
  });

  const analysis = JSON.parse(response.choices[0].message.content!);
  
  return {
    description: analysis.description,
    tags: analysis.tags,
    category: 'image',
    sensitivityScore: analysis.sensitivityScore,
    fingerprint: analysis.fingerprint,
  };
}

async function analyzeVideo(base64Data: string, fileName: string): Promise<ContentAnalysis> {
  // For video analysis, we'll analyze the filename and metadata since video analysis is complex
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `Analyze the video filename and provide content categorization.
Respond in JSON format: {
  "description": "description based on filename",
  "tags": ["tag1", "tag2"],
  "sensitivityScore": 0.0,
  "fingerprint": "unique_string_based_on_filename"
}`
      },
      {
        role: "user",
        content: `Analyze this video file: ${fileName}`
      }
    ],
    response_format: { type: "json_object" },
  });

  const analysis = JSON.parse(response.choices[0].message.content!);
  
  return {
    description: analysis.description,
    tags: analysis.tags,
    category: 'video',
    sensitivityScore: analysis.sensitivityScore,
    fingerprint: analysis.fingerprint,
  };
}

async function analyzeGenericFile(fileName: string): Promise<ContentAnalysis> {
  const fileExt = fileName.split('.').pop()?.toLowerCase() || 'unknown';
  const fingerprint = `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  return {
    description: `Generic file: ${fileName}`,
    tags: [fileExt, 'document', 'file'],
    category: 'document',
    sensitivityScore: 0.1,
    fingerprint,
  };
}

export async function findSimilarContent(
  description: string, 
  tags: string[], 
  platforms: string[] = ['google', 'bing']
): Promise<SimilarityMatch[]> {
  try {
    const searchQuery = `${description} ${tags.join(' ')}`;
    
    // Simulate similarity matching - in production, this would call search APIs
    const mockMatches: SimilarityMatch[] = [
      {
        url: 'https://example.com/similar-content-1',
        title: `Similar content to: ${description.substring(0, 50)}...`,
        platform: 'google',
        similarityScore: 0.85,
        thumbnailUrl: 'https://example.com/thumb1.jpg'
      },
      {
        url: 'https://example.com/similar-content-2',
        title: `Related content: ${tags.join(', ')}`,
        platform: 'bing',
        similarityScore: 0.72,
        thumbnailUrl: 'https://example.com/thumb2.jpg'
      }
    ];

    // Filter by similarity threshold
    return mockMatches.filter(match => match.similarityScore > 0.7);
  } catch (error) {
    console.error('[AI] Similarity search failed:', error);
    return [];
  }
}

export async function generateDMCANotice(infringement: {
  platform: string;
  infringingUrl: string;
  originalContent: string;
  userEmail: string;
  userName: string;
}): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a legal document generator specializing in DMCA takedown notices. 
Generate a professional DMCA takedown notice template that includes:
1. Proper legal language and structure
2. Platform-specific formatting when possible
3. Required DMCA elements under 17 U.S.C. §512(c)(3)
4. Clear identification of copyrighted work
5. Good faith belief statement
6. Accuracy statement under penalty of perjury
7. Electronic signature line

IMPORTANT: This is a TEMPLATE that requires user completion. Mark sections that need user input with [USER MUST COMPLETE] placeholders.`
        },
        {
          role: "user",
          content: `Generate a DMCA takedown notice template for:
Platform: ${infringement.platform}
Infringing URL: ${infringement.infringingUrl}
Content Description: ${infringement.originalContent}
Copyright Owner: ${infringement.userName} (${infringement.userEmail})`
        }
      ],
      max_tokens: 1000,
    });

    return response.choices[0].message.content!;
  } catch (error) {
    console.error('[AI] DMCA notice generation failed:', error);
    throw new Error('Failed to generate DMCA notice template');
  }
}