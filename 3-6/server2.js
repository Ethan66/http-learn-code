// 需要开启hostAdmin App，设置127.0.0.1映射到a.test.com和b.test.com
const http = require('http')
const fs = require('fs')

http.createServer((request, response) => {
  console.log('request come: ', request.url)
  const host = request.headers.host

  if (request.url === '/') {
    const html = fs.readFileSync('index.html')
    if (host === 'test.com:8888') {
      response.writeHead(200, {
        'Content-Type': 'text/html',
        'Set-Cookie': ['id=123', 'abc=456;domain=test.com'] // 让test.com下所有的域名都有cookie
      })
    }
    if (host === 'a.test.com:8888') {
      response.writeHead(200, {
        'Content-Type': 'text/html',
        // 'Set-Cookie': ['id=123', 'abc=456'] // 只有a.test.com有cookie
      })
    } else if (host === 'b.test.com:8888') {
      response.writeHead(200, {
        'Content-Type': 'text/html'
      })
    }
    response.end(html)
  }
}).listen(8888)