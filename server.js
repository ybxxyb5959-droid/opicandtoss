const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec, spawnSync } = require('child_process');

// 브라우저(Edge 앱 창) 열기. 실패하면 기본 브라우저로.
function openBrowser(url) {
  if (process.env.NO_OPEN) return;
  if (process.platform !== 'win32') { exec(`open "${url}" || xdg-open "${url}"`); return; }
  const r = spawnSync('cmd.exe', ['/c', 'start', '""', 'msedge', `--app=${url}`], { stdio: 'ignore', windowsHide: true });
  if (r.status !== 0) spawnSync('cmd.exe', ['/c', 'start', '""', url], { stdio: 'ignore', windowsHide: true });
}

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
  openBrowser(url);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    // 이미 같은 포트에 앱 서버가 떠 있음(다른 창에서 켠 경우) → 그 주소로 브라우저만 연다
    const url = `http://127.0.0.1:${PORT}`;
    console.log(`\n[안내] 앱 서버가 이미 켜져 있어요 (포트 ${PORT}). 그 서버로 브라우저를 열게요: ${url}`);
    console.log('       이 창은 닫아도 돼요. 앱을 완전히 끄려면 먼저 켜둔 다른 검은 창을 닫으세요.\n');
    openBrowser(url);
    setTimeout(() => process.exit(0), 300);
    return;
  }
  console.error('서버 오류:', err.message);
  setTimeout(() => process.exit(1), 300);
});
