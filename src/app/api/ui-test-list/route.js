import { getUiTestNames } from '@/lib/uiTestRunner.js';

export async function GET() {
    return Response.json({ testNames: getUiTestNames() });
}