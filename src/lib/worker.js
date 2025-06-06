import { getJobs, removeJob, setJobStatus } from './queue.js';
import runApiTestByName from './apiTestRunner.js';
import runTestByName from './uiTestRunner.js';
import fs from 'fs/promises';
import path from 'path';

const resultsDir = path.join(process.cwd(), 'results');
await fs.mkdir(resultsDir, { recursive: true });

async function processJobs() {
    const jobs = await getJobs();
    const job = jobs.find(j => j.status === 'pending');
    if (!job) {
        console.log('No jobs in queue.');
        return;
    }
    // Mark as processing to avoid duplicate runs
    await setJobStatus(job.id, 'processing');
    console.log('Processing job:', job);
    try {
        let results;
        if (job.type === 'API') {
            results = await runApiTestByName({ testName: job.testName });
        } else {
            results = await runTestByName({ ...job.options, testName: job.testName });
        }
        console.log('Writing results for job:', job.id);
        await fs.writeFile(
            path.join(resultsDir, `${job.id}.json`),
            JSON.stringify({ results, finished: Date.now(), runId: job.runId, queued: job.queued }, null, 2)
        );
    } catch (err) {
        console.error('Error running job:', job, err);
        await fs.writeFile(
            path.join(resultsDir, `${job.id}.json`),
            JSON.stringify({ error: err.message, finished: Date.now(), runId: job.runId }, null, 2)
        );
    }
    await removeJob(job.id);
}

setInterval(processJobs, 2000);
console.log('Worker started. Watching for jobs...');