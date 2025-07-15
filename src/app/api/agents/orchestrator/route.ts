import * as admin from 'firebase-admin';
import OpenAI from 'openai';
if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.applicationDefault() });
}
const db = admin.firestore();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, project: process.env.OPENAI_PROJECT_ID });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'system', content: 'Orchestrate KlinkyLinks agents.' }, { role: 'user', content: body.prompt || 'Test' }],
    });
    await db.collection('learningLibrary').add({ action: 'orchestrate', result: response.choices[0].message.content });
    return new Response(JSON.stringify({ success: true, data: response }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Internal failure—check logs' }), { status: 500 });
  }
}
