import axios from 'axios';

export default async function testOne() {
    const results = [];
    const filename = 'testOne';
    const url = 'https://jsonplaceholder.typicode.com/posts/1';
    const request = { method: 'GET', url };

    const start = Date.now();
    try {
        const stepStart = start;
        const response = await axios.get(url);
        const stepEnd = Date.now();
        const duration = stepEnd - stepStart;

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
            duration,
        });
    } catch (err) {
        const stepEnd = Date.now();
        const duration = stepEnd - start;
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
            duration,
        });
    }
    return results;
}