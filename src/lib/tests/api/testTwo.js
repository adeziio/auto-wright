import axios from 'axios';

export default async function testTwo() {
    try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/posts/2');
        return {
            test: 'GET /posts/2 returns post with ID 2',
            expected: 2,
            actual: response.data.id,
            pass: response.data.id === 2,
            type: 'API',
        };
    } catch (err) {
        return {
            test: 'GET /posts/2 returns post with ID 2',
            expected: 2,
            actual: err.message,
            pass: false,
            type: 'API',
        };
    }
}