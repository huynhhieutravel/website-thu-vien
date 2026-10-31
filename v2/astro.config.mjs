import { defineConfig } from 'astro/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function nextImageOptimizerMiddleware() {
  return {
    name: 'next-image-optimizer-shim',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url && req.url.startsWith('/_next/image')) {
          try {
            const parsed = new URL(req.url, 'http://localhost:4328');
            const target = parsed.searchParams.get('url');
            if (target) {
              const rel = decodeURIComponent(target).replace(/^\/+/, '');
              const filePath = path.resolve(__dirname, 'public', rel);
              if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
                const ext = path.extname(filePath).toLowerCase();
                const mimes = {
                  '.jpg': 'image/jpeg',
                  '.jpeg': 'image/jpeg',
                  '.png': 'image/png',
                  '.webp': 'image/webp',
                  '.svg': 'image/svg+xml',
                  '.gif': 'image/gif',
                  '.woff2': 'font/woff2'
                };
                res.writeHead(200, {
                  'Content-Type': mimes[ext] || 'application/octet-stream',
                  'Cache-Control': 'public, max-age=31536000, immutable'
                });
                fs.createReadStream(filePath).pipe(res);
                return;
              }
            }
          } catch (e) {
            console.error('Next image shim error:', e);
          }
        }
        next();
      });
    }
  };
}

// https://astro.build/config
export default defineConfig({
  server: {
    port: 4328,
    host: true,
  },
  vite: {
    plugins: [nextImageOptimizerMiddleware()]
  }
});
