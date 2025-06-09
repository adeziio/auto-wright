import axios from 'axios';

export default async function testOne() {
    try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/posts/1');
        return {
            test: 'GET /posts/1 returns post with ID 1',
            expected: 1,
            actual: response.data.id,
            pass: response.data.id === 1,
            type: 'API',
        };
    } catch (err) {
        return {
            test: 'GET /posts/1 returns post with ID 1',
            expected: 1,
            actual: err.message,
            pass: false,
            type: 'API',
        };
    }
}