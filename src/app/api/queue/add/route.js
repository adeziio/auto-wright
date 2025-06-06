import { NextResponse } from 'next/server';
import { addJob } from '@/lib/queue';
import { randomUUID } from 'crypto';

export async function POST(request) {
    const body = await request.json();
    const { testNames, runId, queued, ...options } = body; // <-- FIXED
    if (!Array.isArray(testNames)) {
        return NextResponse.json({ error: 'testNames must be an array' }, { status: 400 });
    }
    const ids = [];
    for (const testName of testNames) {
        const id = randomUUID();
        await addJob({ id, runId, testName, options, status: 'pending', created: Date.now(), queued });
        ids.push(id);
    }
    return NextResponse.json({ ids, runId });
}