import { NextResponse } from 'next/server';
import { collection, addDoc } from 'firebase/firestore';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, project: process.env.OPENAI_PROJECT_ID });

async function calculateScore(domain: string, metrics: any) {
  const score = 10;
  await addDoc(collection(db, 'scorecard_logs'), { domain, score, timestamp: new Date() });
  return score;
}

export async function POST(request: Request) {
  try {
    const { task } = await request.json();
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'system', content: 'You are a master orchestrator for KlinkyLinks. Reason, decide, and act autonomously.' }, { role: 'user', content: task }]
    });
    
    const decision = completion.choices[0].message.content;
    
    await addDoc(collection(db, 'agent_logs'), { agent: 'orchestrator', decision, timestamp: new Date() });
    
    const score = await calculateScore('Override Governance', { actions: 1 });
    
    return NextResponse.json({ decision, score }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Agent error' }, { status: 500 });
  }
}
