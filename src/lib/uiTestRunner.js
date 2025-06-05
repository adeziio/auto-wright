import { chromium } from 'playwright';
import testOne from './tests/ui/testOne.js';
import testTwo from './tests/ui/testTwo.js';
// Add or remove imports above as you add/remove UI test files

const testMap = {
  testOne,
  testTwo,
  // Add or remove entries as you add/remove UI test files
};

export function getUiTestNames() {
  return Object.keys(testMap);
}

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
