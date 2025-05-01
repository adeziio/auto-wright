import axios from 'axios';

export default async function runApiTests() {
  const tests = [
    {
      test: 'GET /posts/1 returns post with ID 1',
      url: 'https://jsonplaceholder.typicode.com/posts/1',
      expected: 1,
      validate: (response) => response.data.id === 1,
    },
    {
      test: 'GET /posts/2 returns post with ID 2',
      url: 'https://jsonplaceholder.typicode.com/posts/2',
      expected: 2,
      validate: (response) => response.data.id === 2,
    },
    {
      test: 'GET /users/1 returns user with ID 1',
      url: 'https://jsonplaceholder.typicode.com/users/1',
      expected: 1,
      validate: (response) => response.data.id === 1,
    },
    {
      test: 'GET /users/2 returns user with ID 2',
      url: 'https://jsonplaceholder.typicode.com/users/2',
      expected: 2,
      validate: (response) => response.data.id === 2,
    },
    {
      test: 'GET /comments/1 returns comment with ID 1',
      url: 'https://jsonplaceholder.typicode.com/comments/1',
      expected: 1,
      validate: (response) => response.data.id === 1,
    },
    {
      test: 'GET /comments/2 returns comment with ID 2',
      url: 'https://jsonplaceholder.typicode.com/comments/2',
      expected: 2,
      validate: (response) => response.data.id === 2,
    },
    {
      test: 'GET /albums/1 returns album with ID 1',
      url: 'https://jsonplaceholder.typicode.com/albums/1',
      expected: 1,
      validate: (response) => response.data.id === 1,
    },
    {
      test: 'GET /albums/2 returns album with ID 2',
      url: 'https://jsonplaceholder.typicode.com/albums/2',
      expected: 2,
      validate: (response) => response.data.id === 2,
    },
    {
      test: 'GET /todos/1 returns todo with ID 1',
      url: 'https://jsonplaceholder.typicode.com/todos/1',
      expected: 1,
      validate: (response) => response.data.id === 1,
    },
    {
      test: 'GET /todos/2 returns todo with ID 2',
      url: 'https://jsonplaceholder.typicode.com/todos/2',
      expected: 2,
      validate: (response) => response.data.id === 2,
    },
    {
      test: 'GET /todos/2 returns todo with ID 2',
      url: 'https://jsonplaceholder.typicode.com/todos/2',
      expected: 2,
      validate: (response) => response.data.id === 2,
    },
    {
      test: 'GET /todos/2 returns todo with ID 2',
      url: 'https://jsonplaceholder.typicode.com/todos/2',
      expected: 2,
      validate: (response) => response.data.id === 2,
    },
  ];

  const results = await Promise.all(
    tests.map(async (test) => {
      try {
        const response = await axios.get(test.url);
        return {
          test: test.test,
          expected: test.expected,
          actual: response.data.id,
          pass: test.validate(response),
          type: 'API', // Added field to indicate API test
        };
      } catch (err) {
        return {
          test: test.test,
          expected: test.expected,
          actual: err.message,
          pass: false,
          type: 'API', // Added field to indicate API test
        };
      }
    })
  );

  return results;
}
