import { NextResponse } from 'next/server';
import runPlaywrightTests from '../../../lib/playwrightRunner';

export async function POST() {
  try {
    const results = await runPlaywrightTests();
    return NextResponse.json({ success: true, results });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
