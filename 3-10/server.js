const http = require('http')
const fs = require('fs')

http.createServer((request, response) => {
  console.log('request come:', request.headers)
  if (request.url === '/') {
    const html = fs.readFileSync('index.html')
    response.writeHead(200, {
      'Content-Type': 'text/html',
      // 'Content-Security-Policy': 'default-src http: https:' // 用来防止XSS攻击：不能通过html内置的所有src进行执行，只能用http和https外链的方式获取
      // 'Content-Security-Policy': 'default-src \'self\'' // 限制不能是外链的链接
      // 'Content-Security-Policy': 'default-src \'self\' https://cdn.bootcss.com' // 限制除了自身和https://cdn.bootcss.com，其他外链都不行
      // 'Content-Security-Policy': 'default-src \'self\'; form-action \'self\'' // 限制不能是外链，也限制form表单不能请求外链
      // 'Content-Security-Policy': 'script-src \'self\'' // 限制script链接外链，比如img-src都允许
      // 'Content-Security-Policy': 'script-src \'self\'; report-uri /report' // 限制script链接外链，并发送报告
      // 'Content-Security-Policy-Report-Only': 'script-src \'self\'; report-uri /report' // 允许发送请求，但是会报告
    })
    response.end(html)
  } else if (request.url === '/script.js') {
    response.end('console.log(123)')
  }
}).listen(8888)

console.log('server listening on 8888')
