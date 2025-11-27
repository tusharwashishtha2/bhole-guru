const dns = require('dns');

const hostname = '_mongodb._tcp.cluster0.pdmopz.mongodb.net';

console.log(`Attempting to resolve SRV record for: ${hostname}`);

dns.resolveSrv(hostname, (err, addresses) => {
    if (err) {
        console.error('❌ DNS Resolution Failed:');
        console.error(err);
    } else {
        console.log('✅ DNS Resolution Successful:');
        console.log(addresses);
    }
});
