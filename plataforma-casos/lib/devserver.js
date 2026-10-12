// Servidor local: node lib/devserver.js  (http://localhost:3000)
const http = require("http"), fs = require("fs"), path = require("path");
const { handle } = require("./app");
const PUB = path.join(__dirname, "..", "public");
const MIME = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".svg": "image/svg+xml", ".ico": "image/x-icon" };
const server = http.createServer((req, res) => {
  const p = new URL(req.url, "http://x").pathname;
  if (p.startsWith("/api/")) return handle(req, res);
  let f = path.normalize(path.join(PUB, p === "/" ? "index.html" : p));
  if (!f.startsWith(PUB)) { res.writeHead(403); return res.end(); }
  if (!path.extname(f)) f += ".html";
  fs.readFile(f, (err, buf) => {
    if (err) { res.writeHead(404, { "content-type": "text/plain" }); return res.end("Não encontrado"); }
    res.writeHead(200, { "content-type": MIME[path.extname(f)] || "application/octet-stream" }); res.end(buf);
  });
});
if (require.main === module) server.listen(process.env.PORT || 3000, () => console.log("http://localhost:" + (process.env.PORT || 3000)));
module.exports = server;
