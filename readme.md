#### 前言
此为课堂摘要。来自HTTP协议原理+实践。

#### 1-2（重点）

#### 2-1网络协议

网络协议传输过程：
![经典五层模型](https://i.loli.net/2020/02/20/gRZaDBkjYh1pnu6.png)

1. 物理层：定义物理设备如何传输数据，如：电脑的硬件、网卡端口、网线、光缆
2. 数据链路层：在通讯的实体间建立数据链路的连接。理解：物理层把两台机器连接了，需要软件服务可以传输数据，比如01010。
3. 网络层：为数据在结点之间传输创建逻辑链路。逻辑链路理解：比如我的电脑如何访问百度的服务器，我们怎么寻找百度这台服务器的逻辑关系。
4. 传输层：TCP协议（为主）、UDP协议。相当于给应用层创建了传输的通道。一个TCP连接可以发送多个HTTP请求的。创建一个TCP需要进行3次握手。
5. 应用层：为应用软件提供了很多服务。构建于TCP协议之上。如HTTP，只能请求和响应，需要借助TCP传输。

#### 2-2 HTTP历史

1. HTTP0.9：只有一个get命令，没有header，服务器发送完毕，就关闭TCP连接。
2. HTTP1.0：增加了POST，HEADER命令，增加了status code和header。和现在使用的HTTP1.1差不了多少。
3. HTTP1.1: 1、增加了持久连接。（这里的连接指的是TCP的连接，之前版本的HTTP版本HTTP请求到服务器响应后，TCP连接就关闭了。下一个HTTP请求又得创建TCP连接，TCP连接需要经过3次握手，消耗很大。）2、pipeline。（发送的HTTP的请求可以一个链接发送多个的，服务器是按顺序返回的。）3、增加了host和其他命令。
4. HTTP2: 1、所有数据都是以二进制传输的。2、同一个链接发送的多个HTTP请求不再需要按顺序返回了，是并行的。3、头信息压缩来提高效率。4、服务端可以主动发起传输（传统：一个页面先请求html文件，再识别文件里的css, js进行请求。HTTP2可以请求html的文件的同时，直接将css，js推送给浏览器。）

#### 2-3 HTTP的三次握手

![创建TCP的过程](https://i.loli.net/2020/02/20/9aTtwVvcK1ZgpeP.png)
1. 第一次握手（客户端通知服务端我要发起TCP连接）：浏览器发送数据包：SYN=1,Seq=X。1表示第一次发送
2. 第二次握手（服务端同意可以建立TCP连接）：发送数据包：SYN=1,ACK=X+1,Seq=Y。1表示第一次发送，X是上一次传的值
3. 第三次握手：客户端再次发送数据包：ACK=Y+1,Seq=z。

为什么是3次：假如第一次握手，服务端就开启TCP连接。但是客户端第二次握手没有接收到，客户端就重新发起第一次握手。这时候服务端的TCP连接就浪费了。所以需要第三次握手，没收到第三次握手，服务端就可以关闭。

#### 2-4 URI-URL和URN

#### 2-5 HTTP报文
1. 请求报文：首行（method(只是定义，不是一定要执行相关操作，如delete), url(请求资源), HTTP/1.1）, headers
2. 响应报文：首行（HTTP/1.1, 200(status code状态), OK(code的明文)），headers(后面有一个空行，区分bodys), bodys
查看方式：Chrome的network请求和响应报文是做了处理的。git bash的curl工具可以发送HTTP请求
# curl www.baidu.com // 发送请求并返回响应
# curl -v www.baidu.com // 发送请求并展示请求报文和响应报文。

HTTP CODE的定义：
100-199：这个请求要持续进行，接下来要做其他事情才能返回给你。
200-299：请求成功。
300-399：这个请求需要重定向，用别的方式去获取这个数据。
400-499：发送请求有问题。如：401，表示发送请求没有做认证，没有权限获取这数据。
500-599: 服务器出现了错误。

#### 2-6 创建简单的web服务(代码)

#### 3-2 CORS跨域请求示范(代码)
http请求是无状态的，所以http请求不会存在跨域的问题。每次请求都会有响应。只是客户端（浏览器）做了跨域的限制，比如浏览器拦截了不同域名的ajax请求，但是允许了img/script/link的跨域请求。

#### 3-3 CORS跨域限制及请求验证(代码)
1. 浏览器默认允许的跨域请求方法：GET, HEAD, POST。使用其他请求都需要先进行预请求。
2. 浏览器默认允许的跨域Content-Type：text/plain, multipart/form-data, application/x-www-form-urlencoded。其他Content-Type都需要先进行预请求。
3. 请求头如X-Test-Cors也需要进行预请求。

#### 3-4 缓存头Cache-Control设置(代码)
1、可缓存性：在哪里进行缓存。
1. public: 返回的内容经过的任何路径中的代理服务器，客户端浏览器的内容进行缓存。
2. private: 发起请求的浏览器可以进行缓存。
3. no-cache: 需要发送请求给服务器，服务器验证资源是否一致，再告诉浏览器是否使用缓存（3-5）。
4. no-store: 本地和代理服务器都不可以缓存,重新获取数据，不走缓存。

2、max-age
Cache-Control: 'max-age=seconds': 在几秒内是获取缓存内容的，不会向服务器发送请求。
Cache-Control: 's-maxage=seconds': 在代理服务器李里生效的。
Cache-Control: 'max-stale=seconds': 客户端主动添加的，在max-age过期后，有max-stale,还是可以获取过期的缓存的。（浏览器不会添加）

3、重新验证
must-revalidate: max-age过期后，需要重新发起请求重新获取，然后验证缓存是否过期
proxy-revalidate: 缓存服务器中，和must-revalidate一样。

#### 3-5 验证资源能否使用缓存(代码)

![浏览器发起请求查找缓存判断逻辑](https://i.loli.net/2020/02/21/nyBEd8VATW6jLPz.png)

1、last-modified: 上一次修改时间。浏览器发起请求，服务器带上last-modified传给浏览器。浏览器下一次请求的时候带上If-Modified-Since，然后服务器进行这次修改时间和If-Modified-Since对比，以验证资源是否需要更新。
2、Etag: 数据签名。每次生成的签名都不一样。浏览器下一次请求的时候带上If-None-Match，服务器进行对比验证是否需要更新。

#### 3-6 cookie和session(代码)
1. 设置cookie。Set-Cookie: ['id=123', 'id2=123;max-age=20', 'id3=123;expires=20300102', 'id4=123;Secure', 'id5=123;HttpOnly']。max-age:时间长度。expires:时间截止日期。Secure:只能在https里发送Cookie。HttpOnly:js不能获取cookie

#### 3-7 TCP的长连接(代码)

1. 为什么TCP需要长连接？
HTTP发送请求是基于TCP的连接的，TCP连接需要3次握手。假如HTTP发送请求后就马上断了TCP连接，下次请求就会重新连接TCP，这就耗费了时间。所以Http1.1的时候，默认都是TCP长连接。

2. Http1.1支持了长连接，但是是串行的，怎么办？
Http1.1的长连接是串行的，就是一个TCP连接可以发送多个http请求，但是有先后顺序的。这样还是耗费了时间。所以Chrome支持了并行创建6个TCP，只要有一个TCP的http发送成功了，就发送下一个HTTP请求。这样就节约了时间。

3. 怎么验证？
百度，Chrome--Network--Name右键显示Connection ID，就是查看TCP创建的id,每个请求都复用了TCP，而且最多超过6个TCP
谷歌，是HTTP2.0，只有一个TCP，因为2.0支持并行发送http请求，页面上所有的请求都在一个TCP连接上请求的。

#### 3-8 数据协商(对照Chrome-Network, 代码)
数据协商：客户端发送给服务端的时候申明，我应该需要的数据格式，数据相关的限制是什么样的。服务端会针对申明做出一个判断，返回不同类型的数据。

|Request|Response|含义|
|:--:|:--:|:--:|
|Accept|Content-Type|我想要的数据类型|
|Accept-Encoding|Content-Encoding|怎么样的编码方式进行传输，对数据进行压缩|
|Accept-Language|Content-Language|展示的语言，zh-CN,zh;q=0.9, q表示权重，越大权重越重|
|User-Agent||浏览器的相关信息，可以判断PC端和移动端|

User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36
Mozilla/5.0: 浏览器是王景公司出的，为了兼容。
Windows NT 10.0：操作系统。
Win64; x64：是X64平台。
AppleWebKit/537.36：浏览器内核。
KHTML, like Gecko：渲染引擎：KHTML。
Chrome/74.0.3729.169：Chrome版本号。

#### 3-9 重定向(300-399, 代码)
使用场景：当前url连接已停用，变成新的url地址。服务端返回300-399的状态码，浏览器根据Code码和location进行二次请求新的url。

1. 302: 临时重定向，浏览器每次都会向服务端请求老的接口，然后浏览器再根据服务端返回的location请求新的接口
2. 301：永久重定向，浏览器第一次请求老的接口，浏览器拿到code是301,就把location给缓存了，第二次请求老的接口其实是拿缓存的数据，不会向服务端发起请求。所以老接口只请求一遍。

#### 3-10 内容安全策略Content-Security-Policy(代码)
作用：1. 限制资源获取。2. 报告资源获取越权
限制方式：1. default-src限制全局跟链接请求有关的限制资源范围。2. 根据资源类型限制资源范围。
资源类型：connect-src/img-src/style-src/script-src/font-src/media-src/frame-src/mainfest-src

XSS: 在富文本编辑器里添加js脚本，然后渲染页面的时候进行执行攻击，获取用户的信息。阻止(代码)

#### 4-1 Nginx基本配置
```
./conf/nginx.conf
http {
  include server/*.conf; // 将自定义的配置全配在server文件夹下，方便管理，不用和默认配置写一起。
}

./conf/server/test.conf
server {
  listen 80;
  server_name test.com; // 域名，浏览器访问的域名

  location / {
    proxy_pass http://127.0.0.1:8888; // 浏览器发送给nginx，nginx转发给http://127.0.0.1:8888
    proxy_set_header Host $host; // 如果不设置，服务端接收到的host是http://127.0.0.1:8888，就不能区分是哪个域名请求的
  }
}
server {
  listen 80;
  server_name a.test.com; // 域名，浏览器访问的域名

  location / {
    proxy_pass http://127.0.0.1:8000; // 实现不同域名请求不同地址
    proxy_set_header Host $host; 
  }
}
```

#### 4-2 Nginx代理缓存(代码)
因为使用了代理就是浏览器请求代理，代理再请求服务端，使用代理缓存就可以省略了代理请求服务端
使用场景：1、公共资源：如CSS,JS等。2、某个用户已经请求过一次了，再次请求可以直接拿代理缓存。

使用方式：一定要服务端请求头返回Cache-Control: 'max-age=200',是服务端告诉代理服务器，这个接口需要缓存，代理服务器才会缓存。

Cache-Control其他值：
```
Cache-Control: 'max-age=2' // 浏览器和代理都缓存20秒
Cache-Control: 'max-age=2, s-maxage=20' // 浏览器缓存2秒，代理缓存20秒.
Cache-Control: 'max-age=2, s-maxage=20 private' // private表示只有浏览器才能缓存，代理服务器不能缓存.
Cache-Control: 'max-age=2, s-maxage=20 no-store' // 都不缓存。
'Cache-Control': 's-maxage=200',
'Vary': 'X-Test-Cache' // 通过对应的头，只有对应的头一样才有缓存，不一样的还是要请求服务器
```

#### 4-3 HTTPS
HTTP为什么不安全：
HTTP传输是明文传输的，HTTP数据包被拦截了，可以拿到所有的数据。

HTTPS为什么安全：
HTTPS有私钥和公钥的概念。公钥是加密传输的信息的，加密的信息传给服务端后，只有用私钥才能解密出来。私钥是放在服务端的，不会进行传输。公钥是在TCP握手的时候传输的。
![HTTPS的三次握手](https://i.loli.net/2020/02/26/vutAji3hL6MBczs.png)

#### 4-4 使用Nginx部署HTTPS

#### 4-5 使用Nginx部署HTTP2