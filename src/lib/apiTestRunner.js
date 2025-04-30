import axios from 'axios';

export default async function runApiTests() {
  const results = [];

  try {
    const response = await axios.get('https://jsonplaceholder.typicode.com/posts/1');
    results.push({
      test: 'GET /posts/1 returns post with ID 1',
      expected: 1,
      actual: response.data.id,
      pass: response.data.id === 1,
      type: 'API', // Added field to indicate API test
    });
  } catch (err) {
    results.push({
      test: 'GET /posts/1 returns post with ID 1',
      expected: "No Error",
      actual: err.message,
      pass: false,
      type: 'API', // Added field to indicate API test
    });
  }

  return results;
}
