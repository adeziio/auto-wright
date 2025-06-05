import testOne from './tests/ui/testOne.js';
import testTwo from './tests/ui/testTwo.js';
// Add or remove imports above as you add/remove test files

const testMap = {
  testOne,
  testTwo,
  // Add or remove entries as you add/remove test files
};

export function getUiTestNames() {
  return Object.keys(testMap);
}

export default async function runTestByName({ headless, testName }) {
  const testFn = testMap[testName];
  if (!testFn) throw new Error(`Test "${testName}" not found`);
  try {
    const configs = {
      headless,
      slowMo: headless ? 0 : 500,
    }
    const result = await testFn(configs);
    return Array.isArray(result) ? result : [result];
  } catch (err) {
    return [{
      test: testFn.name,
      expected: 'Success',
      actual: err.message,
      pass: false,
      type: 'UI',
    }];
  }
}
