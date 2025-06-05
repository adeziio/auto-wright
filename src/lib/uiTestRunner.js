import { chromium } from 'playwright';
import testOne from './tests/ui/testOne.js';
import testTwo from './tests/ui/testTwo.js';

const testMap = {
  testOne,
  testTwo,
};

export default async function runTestByName({ headless, testName }) {
  const testFn = testMap[testName];
  if (!testFn) throw new Error(`Test "${testName}" not found`);

  const browser = await chromium.launch({
    headless,
    slowMo: headless ? 0 : 500,
    channel: 'msedge',
  });

  const results = await testFn(browser);
  await browser.close();
  return Array.isArray(results) ? results : [results];
}
