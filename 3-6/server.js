const http = require('http')
const fs = require('fs')

http.createServer((request, response) => {
  console.log('request come: ', request.url)
  const html = fs.readFileSync('index.html')
  response.writeHead(200, {
    'Content-Type': 'text/html',
    // 'Set-Cookie': ['id=123', 'abc=345'] // 设置cookie
    // 'Set-Cookie': ['id=123', 'abc=345;max-age=2'] // 设置cookie时效
    'Set-Cookie': ['id=123', 'abc=345;HttpOnly'] // 设置HttpOnly: 禁止js访问cookie
  })
  response.end(html)
}).listen(8888)

console.log('server listening on 8888')