import testOne from './tests/api/testOne.js';
import testTwo from './tests/api/testTwo.js';
// Add or remove imports above as you add/remove test files

const testMap = {
  testOne,
  testTwo,
  // Add or remove entries as you add/remove test files
};

export function getApiTestNames() {
  return Object.keys(testMap);
}

export default async function runApiTestByName({ testName }) {
  const testFn = testMap[testName];
  if (!testFn) throw new Error(`Test "${testName}" not found`);
  try {
    const result = await testFn();
    return Array.isArray(result) ? result : [result];
  } catch (err) {
    return [{
      test: testFn.name,
      expected: 'Success',
      actual: err.message,
      pass: false,
      type: 'API',
    }];
  }
}
