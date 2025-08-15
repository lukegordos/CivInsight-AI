const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  // Remove query parameters and get clean path
  const urlPath = req.url.split('?')[0];
  
  // Default to index.html for root or any path
  let filePath = path.join(__dirname, 'out', urlPath === '/' ? 'index.html' : urlPath);
  
  // If the file doesn't exist, serve index.html (for client-side routing)
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(__dirname, 'out', 'index.html');
  }
  
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    
    // Set content type based on file extension
    const ext = path.extname(filePath);
    const contentType = {
      '.html': 'text/html',
      '.js': 'text/javascript',
      '.css': 'text/css',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.svg': 'image/svg+xml'
    }[ext] || 'text/plain';
    
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  });
});

const port = 4000;
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
