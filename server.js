import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.join(__dirname, 'dist');
const port = process.env.PORT || 10000;

const app = express();

// Cache static assets aggressively
app.use('/assets', express.static(path.join(distPath, 'assets'), {
  maxAge: '1y',
  immutable: true,
}));

// Sitemap + robots
app.get('/sitemap.xml', (_req, res) => {
  res.type('application/xml');
  res.sendFile(path.join(distPath, 'sitemap.xml'));
});
app.get('/robots.txt', (_req, res) => {
  res.type('text/plain');
  res.sendFile(path.join(distPath, 'robots.txt'));
});

// Health
app.get('/healthz', (_req, res) => res.send('ok'));

// SPA fallback — serve index.html for any non-asset route
app.get(/^(?!\/assets|\/healthz).*/, (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(port, () => {
  console.log(`Grease Trappers web listening on :${port}`);
});