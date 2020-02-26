const http = require('http')
const fs = require('fs')

// 第一步：Chrome-Network-勾选Disable cache-Fast 3G
// 可以观察到：localhost和test1.png的Connection ID一致，因为只有localhost接口返回了才会请求第二个。
// test1.png--text6.png的Connection ID都是不一样的，waterfall是并行的。
// test7.png又回到了test1.png的Connection ID，waterfall

http.createServer((request, response) => {
  console.log('request come:', request.url)
  const url = request.url
  if (url === '/') {
    const html = fs.readFileSync('index.html')
    response.writeHead(200, {
      'Content-Type': 'text/html'
    })
    response.end(html)
  } else if (url.includes('test')) {
    const img = fs.readFileSync('img.jpg')
    response.writeHead(200, {
      'Content-Type': 'text/img'
    })
    response.end(img)
  } else {
    response.end('123')
  }

}).listen(8888)