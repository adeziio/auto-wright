import { getApiTestNames } from '@/lib/apiTestRunner.js';

export async function GET() {
    return Response.json({ testNames: getApiTestNames() });
}