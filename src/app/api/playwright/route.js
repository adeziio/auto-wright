import { NextResponse } from 'next/server';
import runPlaywrightTests from '../../../lib/playwrightRunner';

export async function POST(request) {
  try {
    const body = await request.json();
    const headless = body?.headless ?? true;
    const results = await runPlaywrightTests({ headless });
    return NextResponse.json({ success: true, results });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
