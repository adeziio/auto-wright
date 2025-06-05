import { NextResponse } from 'next/server';
import runTestByName from '../../../lib/uiTestRunner.js';

export async function POST(request) {
    try {
        const body = await request.json();
        const headless = body?.headless ?? true;
        const testName = body?.testName;
        if (!testName) {
            return NextResponse.json({ success: false, error: 'Missing testName' }, { status: 400 });
        }
        const results = await runTestByName({ headless, testName });
        return NextResponse.json({ success: true, results });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}