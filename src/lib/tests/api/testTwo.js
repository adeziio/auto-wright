import axios from 'axios';

export default async function testTwo() {
    const results = [];
    const filename = 'testTwo';

    const start = Date.now();

    // First test: /posts/2
    const url2 = 'https://jsonplaceholder.typicode.com/posts/2';
    const request2 = { method: 'GET', url: url2 };

    try {
        const stepStart = start;
        const response2 = await axios.get(url2);
        const stepEnd = Date.now();
        const duration = stepEnd - stepStart;

        results.push({
            test: filename,
            url: url2,
            request: request2,
            response: {
                status: response2.status,
                data: response2.data,
                headers: response2.headers,
            },
            description: "Validate that GET /posts/2 returns a post with id = 2",
            expected: 2,
            actual: response2.data.id,
            pass: response2.data.id === 2,
            type: 'API',
            duration,
        });
    } catch (err) {
        const stepEnd = Date.now();
        const duration = stepEnd - start;
        results.push({
            test: filename,
            url: url2,
            request: request2,
            response: err.response
                ? {
                    status: err.response.status,
                    data: err.response.data,
                    headers: err.response.headers,
                }
                : { error: err.message },
            description: "API call to /posts/2 failed",
            expected: 2,
            actual: err.message,
            pass: false,
            type: 'API',
            duration,
        });
    }

    // Second test: /posts/3
    const url3 = 'https://jsonplaceholder.typicode.com/posts/3';
    const request3 = { method: 'GET', url: url3 };

    try {
        const stepStart = Date.now();
        const response3 = await axios.get(url3);
        const stepEnd = Date.now();
        const duration = stepEnd - stepStart;

        results.push({
            test: filename,
            url: url3,
            request: request3,
            response: {
                status: response3.status,
                data: response3.data,
                headers: response3.headers,
            },
            description: "Validate that GET /posts/3 returns a post with id = 3",
            expected: 3,
            actual: response3.data.id,
            pass: response3.data.id === 3,
            type: 'API',
            duration,
        });
    } catch (err) {
        const stepEnd = Date.now();
        const duration = stepEnd - start;
        results.push({
            test: filename,
            url: url3,
            request: request3,
            response: err.response
                ? {
                    status: err.response.status,
                    data: err.response.data,
                    headers: err.response.headers,
                }
                : { error: err.message },
            description: "API call to /posts/3 failed",
            expected: 3,
            actual: err.message,
            pass: false,
            type: 'API',
            duration,
        });
    }

    return results;
}