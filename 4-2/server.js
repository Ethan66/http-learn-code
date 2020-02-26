const http = require('http')
const fs = require('fs')

function wait(second) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, second * 1000)
  })
}

http.createServer((request, response) => {
  console.log('request come:', request.headers.host)
  if (request.url === '/') {
    const html = fs.readFileSync('index.html')
    response.writeHead(200, {
      'Content-Type': 'text/html'
    })
    response.end(html)
  } else if (request.url === '/data') {
    response.writeHead(200, {
      'Content-Type': 'text/javascript',
      // 'Cache-Control': 'max-age=200', // 浏览器和代理都缓存200秒
      // 'Cache-Control': 'max-age=5 s-maxage=200', // 浏览器缓存5秒，代理缓存200秒
      // 'Cache-Control': 'max-age=5 s-maxage=200 no-store', // 都不缓存
      'Cache-Control': 's-maxage=200',
      'Vary': 'X-Test-Cache'
    })
    wait(2).then(() => {
      response.end('success')
    })
  } else {
    response.writeHead(200, {
      'Content-Type': 'text/javascript'
    })
    response.end('123')
  }
}).listen(8888)

console.log('server listening on 8888')