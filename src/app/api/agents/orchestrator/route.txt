import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { db } from '@/lib/firebase'; // Modular import from Phase 2
import { collection, addDoc } from 'firebase/firestore';

// Production-ready OpenAI client (secure, server-side only; sk-proj compatible per tools)
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, project: process.env.OPENAI_PROJECT_ID });

// Scorecard stub (self-scoring; expands in Phase 5 with live data)
async function calculateScore(domain: string, metrics: any) {
  // Real calc example (Override Governance formula from blueprint)
  const score = 10; // Stub—replace with (loggedActions / totalActions * 5) + (successfulRollbacks / tests * 5) in Phase 5
  await addDoc(collection(db, 'scorecard_logs'), { domain, score, timestamp: new Date() });
  return score;
}

export async function POST(request: Request) {
  try {
    const { task } = await request.json(); // e.g., { task: 'Test orchestration' }
    
    // Cognitive reasoning (real OpenAI call, gpt-4o valid per tools)
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'system', content: 'You are a master orchestrator for KlinkyLinks. Reason, decide, and act autonomously.' }, { role: 'user', content: task }],
    });
    
    const decision = completion.choices[0].message.content;
    
    // Act & Log (audit/trust, Firebase for continuity)
    await addDoc(collection(db, 'agent_logs'), { agent: 'orchestrator', decision, timestamp: new Date() });
    
    // Self-score (Scorecard gov)
    const score = await calculateScore('Override Governance', { actions: 1 });
    
    return NextResponse.json({ decision, score }, { status: 200 });
  } catch (error) {
    console.error(error); // Auditable log
    return NextResponse.json({ error: 'Agent error' }, { status: 500 }); // Graceful, user-trust response
  }
}