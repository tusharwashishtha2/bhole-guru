const ROOT_URL = 'https://bhole-guru.onrender.com/';
const TEST_URL = 'https://bhole-guru.onrender.com/api/auth/test-email';

async function checkServer() {
    console.log('1. Checking Server Health...');
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);
        const res = await fetch(ROOT_URL, { signal: controller.signal });
        clearTimeout(timeout);
        console.log(`Server is UP: ${res.status} ${res.statusText}`);
    } catch (e) {
        console.log('Server Health Check Failed:', e.message);
        return; // Stop if server is down
    }

    console.log('\n2. Checking Email Endpoint...');
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout
        const res = await fetch(TEST_URL, { signal: controller.signal });
        clearTimeout(timeout);
        console.log(`Email Endpoint Status: ${res.status} ${res.statusText}`);
        const text = await res.text();
        console.log('Response:', text);
    } catch (e) {
        console.log('Email Endpoint Failed (Likely Timeout):', e.message);
    }
}

checkServer();
