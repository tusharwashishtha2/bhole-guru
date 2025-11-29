const API_URL = 'https://bhole-guru.onrender.com/api/auth/forgotpassword';
const email = 'tusharwashishtha2@gmail.com';

async function testReset() {
    console.log(`Testing ${API_URL} with email: ${email}`);
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        console.log(`Status: ${response.status} ${response.statusText}`);
        const text = await response.text();
        console.log('Response Body:', text);
    } catch (error) {
        console.error('Fetch Error:', error);
    }
}

testReset();
