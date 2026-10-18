const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = Number(process.env.PORT) || 4173;
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent(req.url.split('?')[0]);
  const safeUrl = pathname === '/' ? '/index.html' : pathname;
  const filePath = path.join(__dirname, safeUrl);
  const ext = path.extname(filePath).toLowerCase();

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('File Not Found');
      return;
    }
    res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
    res.end(content);
  });
});

// IPv4(127.0.0.1) 및 IPv6(::1 / localhost) 모두 허용하도록 호스트 생략
server.listen(PORT, () => {
  const url = `http://127.0.0.1:${PORT}`;
  console.log(`\n==================================================`);
  console.log(` Blue OPIc (speaking practice) server is running!`);
  console.log(` URL: ${url} (or http://localhost:${PORT})`);
  console.log(`==================================================\n`);

  // 서버가 준비된 직후 자동으로 Edge 앱 창 열기
  if (!process.env.NO_OPEN) {
    exec(`start msedge --app=${url}`, (err) => {
      if (err) {
        exec(`start ${url}`);
      }
    });
  }
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    const url = `http://127.0.0.1:${PORT}`;
    exec(`start msedge --app=${url}`);
    process.exit(0);
  }
});
