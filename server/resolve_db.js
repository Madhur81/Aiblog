const dns = require('dns');

const srvHostname = '_mongodb._tcp.aiblog-cluster.o4mzeib.mongodb.net';

console.log(`Resolving SRV for: ${srvHostname}`);

dns.resolveSrv(srvHostname, (err, addresses) => {
  if (err) {
    console.error('DNS SRV Resolution Error:', err);
    // Fallback: try A record for expected shard 00
    const shard00 = 'aiblog-cluster-shard-00-00.o4mzeib.mongodb.net';
    console.log(`Attempting to resolve A record for: ${shard00}`);
    dns.resolve4(shard00, (err2, ipv4) => {
      if (err2) console.error('A Record Resolution Error:', err2);
      else console.log('Shard 00 A Record:', ipv4);
    });
    return;
  }
  console.log('SRV Records:', addresses);
});
