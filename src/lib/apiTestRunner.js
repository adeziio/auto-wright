import getPostOne from './tests/api/getPostOne.js';
import getPostTwo from './tests/api/getPostTwo.js';
// Add or remove imports above as you add/remove API test files

const testMap = {
  getPostOne,
  getPostTwo,
  // Add or remove entries as you add/remove API test files
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
