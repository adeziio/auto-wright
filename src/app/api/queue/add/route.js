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
        // If testNames is an array of objects: { name, type }
        // Otherwise, determine type based on user selection in frontend
        const type = options.type || 'UI'; // Default to UI if not provided
        await addJob({ id, runId, testName, type, options, status: 'pending', created: Date.now(), queued });
        ids.push(id);
    }
    return NextResponse.json({ ids, runId });
}