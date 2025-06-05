// Add or remove imports above as you add/remove API test files
import getPostOne from './tests/api/getPostOne.js';
import getPostTwo from './tests/api/getPostTwo.js';

const testMap = {
  getPostOne,
  getPostTwo,
};

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
