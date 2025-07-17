import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY environment variable is required");
}

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface DmcaNoticeParams {
  platform: string;
  infringingUrl: string;
  contentDescription: string;
  copyrightOwner?: string;
  contactEmail?: string;
}

export async function generateDmcaNotice(params: DmcaNoticeParams): Promise<string> {
  const { platform, infringingUrl, contentDescription, copyrightOwner = "Content Creator", contactEmail = "support@klinkylinks.com" } = params;

  const prompt = `Generate a professional DMCA takedown notice for ${platform}. Use the following details:

Platform: ${platform}
Infringing URL: ${infringingUrl}
Content Description: ${contentDescription}
Copyright Owner: ${copyrightOwner}
Contact Email: ${contactEmail}

The notice should be legally compliant, professional, and include:
1. Identification of the copyrighted work
2. Identification of the infringing material and its location
3. Statement of good faith belief that use is unauthorized
4. Statement that the information is accurate and under penalty of perjury
5. Signature line for the copyright owner or authorized agent

Format it as a complete email that can be sent directly to the platform's abuse team.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a legal assistant specializing in DMCA takedown notices. Generate professional, legally compliant DMCA notices."
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 1000,
      temperature: 0.3,
    });

    return response.choices[0].message.content || "Failed to generate DMCA notice";
  } catch (error) {
    console.error("Error generating DMCA notice:", error);
    throw new Error("Failed to generate DMCA notice using OpenAI");
  }
}

export interface ContentAnalysisResult {
  description: string;
  tags: string[];
  contentType: 'image' | 'video' | 'document';
  suggestedTitle?: string;
}

export async function analyzeContent(base64Data: string, contentType: string): Promise<ContentAnalysisResult> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Analyze the provided content and return a JSON object with description, tags, contentType, and suggestedTitle. Focus on identifying key visual elements, themes, and potential copyright-relevant aspects."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this ${contentType} content and provide a detailed description, relevant tags, and suggested title for content protection monitoring.`
            },
            {
              type: "image_url",
              image_url: {
                url: `data:${contentType};base64,${base64Data}`
              }
            }
          ],
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 500,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      description: result.description || "Content analysis unavailable",
      tags: result.tags || [],
      contentType: contentType.startsWith('image/') ? 'image' : contentType.startsWith('video/') ? 'video' : 'document',
      suggestedTitle: result.suggestedTitle,
    };
  } catch (error) {
    console.error("Error analyzing content:", error);
    return {
      description: "Content analysis failed",
      tags: [],
      contentType: contentType.startsWith('image/') ? 'image' : contentType.startsWith('video/') ? 'video' : 'document',
    };
  }
}

export async function generateFingerprint(base64Data: string): Promise<string> {
  // This is a simplified fingerprint - in production, you'd use specialized libraries
  // like pHash for perceptual hashing
  const crypto = await import('crypto');
  const hash = crypto.createHash('sha256');
  hash.update(base64Data);
  return hash.digest('hex').substring(0, 16);
}