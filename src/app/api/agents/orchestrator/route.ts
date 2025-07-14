import { NextResponse } from 'next/server';

// Secure OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, project: process.env.OPENAI_PROJECT_ID });

// Scorecard stub
async function calculateScore(domain: string, metrics: any) {
  const score = 10; // Stub formula
  await addDoc(collection(db, 'scorecard_logs'), { domain, score, timestamp: new Date() });
  return score;
}

export async function POST(request: Request) {
  try {
    const { task } = await request.json();
    
    // Cognitive OpenAI call (fixed syntax)
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'system', content: 'You are a master orchestrator for KlinkyLinks. Reason, decide, and act autonomously.' }, { role: 'user', content: task }]
    });
    
    const decision = completion.choices[0].message.content;
    await addDoc(collection(db, 'agent_logs'), { agent: 'orchestrator', decision, timestamp: new Date() });
    console.error(error);
    return NextResponse.json({ error: 'Agent error' }, { status: 500 });

