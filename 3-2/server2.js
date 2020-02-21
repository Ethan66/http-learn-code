// 第三步：浏览器发送了请求，服务端也返回了123
// 只是浏览器在接到到数据返回的时候，没有看到Access-Control-Allow-Origin设置为允许，所以内容被忽略了，并在命令行里报错。
const http = require('http')

http.createServer((request, response) => {
  console.log('request come:', request.url)
  // 第五步：怎么允许多个域名，通过JS进行判断，然后再进行设置
  response.writeHead(200, {
    // 'Access-Control-Allow-Origin': '*' // 第四步：设置允许跨域
    'Access-Control-Allow-Origin': 'http://127.0.0.1:8888' // 第四步：设置允许跨域
  })
  response.end('123')
}).listen(8887)
console.log('server listening on 8887')