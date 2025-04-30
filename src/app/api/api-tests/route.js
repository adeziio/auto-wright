import { NextResponse } from 'next/server';
import runApiTests from '../../../lib/apiTestRunner';

export async function POST() {
  try {
    const results = await runApiTests();
    return NextResponse.json({ success: true, results });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
