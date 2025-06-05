import { NextResponse } from 'next/server';
import runApiTestByName from '../../../lib/apiTestRunner.js';

export async function POST(request) {
    try {
        const body = await request.json();
        const testName = body?.testName;
        if (!testName) {
            return NextResponse.json({ success: false, error: 'Missing testName' }, { status: 400 });
        }
        const results = await runApiTestByName({ testName });
        return NextResponse.json({ success: true, results });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}