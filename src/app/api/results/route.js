import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
    const resultsDir = path.join(process.cwd(), 'results');
    const queueFile = path.join(process.cwd(), 'queue.json');
    let allJobs = [];

    // Get finished results
    try {
        const files = await fs.readdir(resultsDir);
        for (const file of files) {
            if (file.endsWith('.json')) {
                const data = await fs.readFile(path.join(resultsDir, file), 'utf-8');
                const parsed = JSON.parse(data);
                allJobs.push({
                    runId: parsed.runId,
                    timestamp: parsed.finished,
                    results: parsed.results,
                    status: 'finished',
                });
            }
        }
    } catch { }

    // Get pending jobs
    try {
        const queue = JSON.parse(await fs.readFile(queueFile, 'utf-8'));
        for (const job of queue) {
            if (job.status === 'pending' || job.status === 'processing') {
                allJobs.push({
                    runId: job.runId,
                    timestamp: job.created,
                    results: [
                        {
                            test: job.testName,
                            expected: 'Success',
                            actual: 'Pending...',
                            pass: null,
                            type: job.testName.startsWith('getPost') ? 'API' : 'UI',
                            status: 'pending',
                        },
                    ],
                    status: 'pending',
                });
            }
        }
    } catch { }

    // Group by runId
    const grouped = {};
    for (const job of allJobs) {
        if (!job.runId) continue;
        if (!grouped[job.runId]) {
            grouped[job.runId] = {
                runId: job.runId,
                timestamp: job.timestamp,
                results: [],
                pendingCount: 0,
                finishedCount: 0,
            };
        }
        grouped[job.runId].results.push(...job.results);
        if (job.status === 'pending') grouped[job.runId].pendingCount += 1;
        if (job.status === 'finished') grouped[job.runId].finishedCount += 1;
        // Use the latest timestamp
        if (job.timestamp > grouped[job.runId].timestamp) grouped[job.runId].timestamp = job.timestamp;
    }

    // Set status: pending if any pending jobs remain, else finished
    const all = Object.values(grouped)
        .map(run => ({
            ...run,
            status: run.pendingCount > 0 ? 'pending' : 'finished',
            // Optionally remove the counts from the final output
            pendingCount: undefined,
            finishedCount: undefined,
        }))
        .sort((a, b) => b.timestamp - a.timestamp);

    return NextResponse.json(all);
}