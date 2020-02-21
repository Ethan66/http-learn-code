const http = require('http')
const fs = require('fs')

http.createServer((request, response) => {
  console.log(request.url)
  if (request.url === '/') {
    const html = fs.readFileSync('index.html')
    response.writeHead(200, {
      'Content-Type': 'text/html'
    })
    response.end(html)
  }
  if (request.url === '/script.js') {
    response.writeHead(200, {
      'Content-Type': 'text/javascript',
      'Cache-Control': 'max-age=200' // 设置缓存，这样浏览器在200s内请求/script.js都会读取缓存的
    })
    response.end('console.log(\'script twice\')')
  } else {
    response.writeHead(200, {
      'Content-Type': 'text/html'
    })
    response.end('1223')
  }

}).listen(8888)

console.log('server listening on 8888')

// 问题：设置了缓存后，浏览器在时间内获取的是缓存的数据，假如数据有修改了，浏览器不能及时发现。
// 解决方案：每次打包前端项目后，script.js添加一个hash值，替换request.url === '/script_hash.js'，这样假如请求的hash值变了，就要重新请求而不是获取缓存。