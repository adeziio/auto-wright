import axios from 'axios';

export default async function testTwo() {
    const filename = 'testTwo'; // No .js extension
    const url = 'https://jsonplaceholder.typicode.com/posts/2';
    const request = { method: 'GET', url };

    try {
        const response = await axios.get(url);
        return {
            test: filename,
            url,
            request,
            response: {
                status: response.status,
                data: response.data,
                headers: response.headers,
            },
            expected: 2,
            actual: response.data.id,
            pass: response.data.id === 2,
            type: 'API',
        };
    } catch (err) {
        return {
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
            expected: 2,
            actual: err.message,
            pass: false,
            type: 'API',
        };
    }
}