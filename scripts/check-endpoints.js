async function check() {
  const eps = [
    '/',
    '/api/config',
    '/api/admin/accounts',
    '/robots.txt',
    '/sitemap.xml',
    '/llms.txt',
    '/favicon.ico',
    '/logo.png',
    '/how-to-play',
    '/blog',
    '/faq',
    '/sitemap',
    '/admin'
  ];
  console.log('Testing server endpoints on http://localhost:3001 ...');
  let failures = 0;
  for (const ep of eps) {
    try {
      const res = await fetch('http://localhost:3001' + ep);
      const ct = res.headers.get('content-type') || 'none';
      const text = await res.text();
      console.log(`[${res.status}] ${ep.padEnd(22)} (${ct.split(';')[0]}) - ${text.length} bytes`);
      if (res.status >= 400 && ep !== '/favicon.ico' && ep !== '/logo.png') {
        failures++;
      }
    } catch (e) {
      console.error(`[FAIL] ${ep}: ${e.message}`);
      failures++;
    }
  }
  console.log(`\nEndpoint check complete. Failures: ${failures}`);
}
check();
