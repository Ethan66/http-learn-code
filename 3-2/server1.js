// 第一步：浏览器打开127.0.0.1:8888, 浏览器发送请求，获取html文件
const http = require('http')
const fs = require('fs')

http.createServer((request, response) => {
  console.log('requset come：', request.url)
  const html = fs.readFileSync('index.html')
  response.writeHead(200, {
    'Content-Type': 'text/html' // 告诉浏览器我返回的是html，浏览器才会用html去展示
  })
  response.end(html)
}).listen(8888)

console.log('server listening on 8888')