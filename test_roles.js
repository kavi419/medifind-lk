const fetch = require('node-fetch');

const API_URL = 'http://localhost:3000/api/auth/register';

async function testRegistration(name, email, password, role) {
    console.log(`Testing registration for role: ${role}`);
    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, role })
        });
        const data = await res.json();
        if (res.ok) {
            console.log(`PASS: Registered ${data.user.email} as ${data.user.role}`);
            if (data.user.role === role) {
                console.log('PASS: Role matches requested role.');
            } else {
                console.error(`FAIL: Role mismatch. Expected ${role}, got ${data.user.role}`);
            }
        } else {
            console.error(`FAIL: Registration failed - ${data.msg}`);
        }
    } catch (err) {
        console.error('FAIL: Network error', err.message);
    }
    console.log('---');
}

async function runTests() {
    // Unique emails
    const timestamp = Date.now();
    await testRegistration('Owner Test', `owner${timestamp}@test.com`, 'password123', 'owner');
    await testRegistration('User Test', `user${timestamp}@test.com`, 'password123', 'user');
}

runTests();
