import { createServer } from 'http';
import { POST } from './api/contact';

const PORT = 3001;

const server = createServer(async (req, res) => {
  const url = req.url ?? '/';

  if (req.method === 'POST' && url === '/api/contact') {
    const chunks: Buffer[] = [];
    for await (const chunk of req) chunks.push(Buffer.from(chunk));
    const body = Buffer.concat(chunks).toString();

    const headers: Record<string, string> = {};
    for (const [k, v] of Object.entries(req.headers)) {
      if (v !== undefined) headers[k] = Array.isArray(v) ? v.join(', ') : v;
    }

    const request = new Request(`http://localhost:${PORT}${url}`, {
      method: 'POST',
      headers,
      body,
    });

    const response = await POST(request);
    const text = await response.text();
    res.writeHead(response.status, { 'Content-Type': 'application/json' });
    res.end(text);
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});
