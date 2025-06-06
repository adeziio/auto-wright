import fs from 'fs/promises';
import path from 'path';

const queueFile = path.join(process.cwd(), 'queue.json');

export async function addJob(job) {
    let jobs = [];
    try {
        const data = await fs.readFile(queueFile, 'utf-8');
        jobs = JSON.parse(data);
    } catch { }
    jobs.push(job);
    await fs.writeFile(queueFile, JSON.stringify(jobs, null, 2));
    return job.id;
}

export async function getJobs() {
    try {
        const data = await fs.readFile(queueFile, 'utf-8');
        return JSON.parse(data);
    } catch {
        return [];
    }
}

export async function removeJob(id) {
    const jobs = await getJobs();
    const filtered = jobs.filter(j => j.id !== id);
    await fs.writeFile(queueFile, JSON.stringify(filtered, null, 2));
}