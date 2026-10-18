// 말문 서비스워커
// - 앱 파일(HTML/JS/CSS/JSON): 네트워크 우선, 실패하면 캐시 → 업데이트가 바로 반영되고 오프라인에서도 열림
// - 외부 글꼴(CDN): 캐시 우선, 없으면 네트워크. 실패해도 앱은 동작
// 배포할 때 아래 VERSION만 올리면 옛 캐시가 정리된다.
const VERSION = 'v4';
const CACHE_NAME = `malmun-${VERSION}`;
const CORE_ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './questions-data.js',
  './questions-extra.js',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => Promise.all(CORE_ASSETS.map((url) => cache.add(url).catch(() => null))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k.startsWith('malmun-') && k !== CACHE_NAME).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  let url;
  try { url = new URL(req.url); } catch (_) { return; }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

  if (url.origin === self.location.origin) {
    event.respondWith(networkFirst(req));
  } else if (/(^|.)(jsdelivr.net|googleapis.com|gstatic.com)$/.test(url.hostname) && !/generativelanguage/.test(url.hostname)) {
    // 글꼴 CDN만 캐시. AI 중계 서버 등 다른 외부 요청은 그대로 통과
    event.respondWith(cacheFirst(req));
  }
});

async function networkFirst(req) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const res = await fetch(req);
    if (res && res.ok) cache.put(req, res.clone());
    return res;
  } catch (_) {
    const cached = await cache.match(req, { ignoreSearch: true });
    if (cached) return cached;
    if (req.mode === 'navigate') {
      const index = await cache.match('./index.html');
      if (index) return index;
    }
    return new Response('오프라인 상태예요. 인터넷에 연결한 뒤 다시 열어주세요.', {
      status: 503,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  }
}

async function cacheFirst(req) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(req);
  if (cached) return cached;
  try {
    const res = await fetch(req);
    if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone());
    return res;
  } catch (_) {
    return new Response('', { status: 504 });
  }
}
