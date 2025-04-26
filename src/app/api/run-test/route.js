import runPlaywrightTest from '../../../lib/playwrightTest';

export async function POST() {
  const results = await runPlaywrightTest();
  return new Response(JSON.stringify(results), { status: 200 });
}
