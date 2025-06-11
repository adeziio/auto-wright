import axios from 'axios';

export default async function testOne() {
    const results = [];
    const filename = 'testOne'; // No .js extension
    const url = 'https://jsonplaceholder.typicode.com/posts/1';
    const request = { method: 'GET', url };

    try {
        const response = await axios.get(url);

        results.push({
            test: filename,
            url,
            request,
            response: {
                status: response.status,
                data: response.data,
                headers: response.headers,
            },
            description: "Validate that GET /posts/1 returns a post with id = 1",
            expected: 1,
            actual: response.data.id,
            pass: response.data.id === 1,
            type: 'API',
        });
    } catch (err) {
        results.push({
            test: filename,
            url,
            request,
            response: err.response
                ? {
                    status: err.response.status,
                    data: err.response.data,
                    headers: err.response.headers,
                }
                : { error: err.message },
            description: "API call to /posts/1 failed",
            expected: 1,
            actual: err.message,
            pass: false,
            type: 'API',
        });
    }
    return results;
}