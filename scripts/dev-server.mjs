import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { dirname, extname, join, normalize, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const host = '127.0.0.1';
const port = Number(process.env.RELINK_FRONTEND_PORT || 7754);

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.jsx': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif'
};

function send(res, status, body) {
  res.writeHead(status, { 'content-type': 'text/plain; charset=utf-8' });
  res.end(body);
}

function resolveRequestPath(url) {
  const parsedUrl = new URL(url, `http://${host}:${port}`);
  const rawPath = parsedUrl.pathname === '/' ? '/index.html' : parsedUrl.pathname;
  const decodedPath = decodeURIComponent(rawPath).replace(/^\/+/, '');
  const filePath = resolve(projectRoot, normalize(decodedPath));
  const rel = relative(projectRoot, filePath);

  if (rel.startsWith('..') || rel === '..' || resolve(filePath) === projectRoot) {
    return null;
  }

  return filePath;
}

const server = createServer(async (req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    send(res, 405, 'Method not allowed');
    return;
  }

  const filePath = resolveRequestPath(req.url ?? '/');
  if (!filePath) {
    send(res, 403, 'Forbidden');
    return;
  }

  try {
    const fileStat = await stat(filePath);
    if (!fileStat.isFile()) {
      send(res, 404, 'Not found');
      return;
    }

    res.writeHead(200, {
      'content-type': mimeTypes[extname(filePath).toLowerCase()] ?? 'application/octet-stream',
      'content-length': fileStat.size,
      'cache-control': 'no-store'
    });

    if (req.method === 'HEAD') {
      res.end();
      return;
    }

    createReadStream(filePath).pipe(res);
  } catch {
    send(res, 404, 'Not found');
  }
});

server.listen(port, host, () => {
  console.log(`Re:Link AI MVP dev server running at http://${host}:${port}/`);
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use. The dev frontend may already be running.`);
    process.exit(0);
  }

  throw error;
});
