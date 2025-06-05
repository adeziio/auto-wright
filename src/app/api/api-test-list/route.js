import { getApiTestNames } from '@/lib/apiTestRunner.js';

export async function GET() {
    const testNames = getApiTestNames();
    return Response.json({ testNames });
}