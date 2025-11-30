import fs from 'fs';

try {
    // Read as UTF-16LE
    const content = fs.readFileSync('output_v3.txt', 'utf16le');
    // Find the JSON part
    const jsonStart = content.indexOf('Response: {');
    if (jsonStart !== -1) {
        const jsonStr = content.substring(jsonStart + 10).trim();
        try {
            const data = JSON.parse(jsonStr);
            console.log('--- ERROR DETAILS ---');
            console.log('Message:', data.message);
            console.log('Error:', data.error);
            console.log('Stack:', data.stack);
            console.log('Config:', data.config);
            console.log('---------------------');
        } catch (e) {
            console.log('Failed to parse JSON:', e.message);
            console.log('Raw string:', jsonStr.substring(0, 100) + '...');
        }
    } else {
        console.log('No JSON response found in output.txt');
        console.log('Content:', content);
    }
} catch (e) {
    console.error('Read Error:', e);
}
