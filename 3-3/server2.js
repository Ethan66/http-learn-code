// 第三步：浏览器跨域允许的请求头没有包含X-Test-Cors，所以要先进行一次预请求OPTIONS，预请求返回了123但是没有返回Access-Control-Allow-Headers,所以进行设置
const http = require('http')

http.createServer((request, response) => {
  console.log('request come:', request.url)
  response.writeHead(200, {
    'Access-Control-Allow-Origin': 'http://127.0.0.1:8888',
    'Access-Control-Allow-Headers': 'X-Test-Cors', // 第四步：预请求返回浏览器允许headers为X-Test-Cors
    'Access-Control-Allow-Methods': 'POST, PUT, Delete', // 第六步：预请求返回浏览器允许Methods为 'POST, PUT, Delete'
    'Access-Control-Max-Age': '500' // 设置为1000秒，1000秒以内不用发送预请求。去掉Chrome的network的Disable cache
  })
  response.end('123')
}).listen(8887)
console.log('server listening on 8887')