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

#### 3-5 验证资源能否使用缓存

![浏览器发起请求查找缓存判断逻辑](https://i.loli.net/2020/02/21/nyBEd8VATW6jLPz.png)

1、last-modified: 上一次修改时间。浏览器发起请求，服务器带上last-modified传给浏览器。浏览器下一次请求的时候带上If-Modified-Since，然后服务器进行这次修改时间和If-Modified-Since对比，以验证资源是否需要更新。
2、Etag: 数据签名。每次生成的签名都不一样。浏览器下一次请求的时候带上If-None-Match，服务器进行对比验证是否需要更新。

#### 3-6 cookie和session
1. 设置cookie。Set-Cookie: ['id=123', 'id2=123;max-age=20', 'id3=123;expires=20300102', 'id4=123;Secure', 'id5=123;HttpOnly']。max-age:时间长度。expires:时间截止日期。Secure:只能在https里发送Cookie。HttpOnly:js不能获取cookie

#### 3-7 TCP的长连接

1. 为什么TCP需要长连接？
HTTP发送请求是基于TCP的连接的，TCP连接需要3次握手。假如HTTP发送请求后就马上断了TCP连接，下次请求就会重新连接TCP，这就耗费了时间。所以Http1.1的时候，默认都是TCP长连接。

2. Http1.1支持了长连接，但是是串行的，怎么办？
Http1.1的长连接是串行的，就是一个TCP连接可以发送多个http请求，但是有先后顺序的。这样还是耗费了时间。所以Chrome支持了并行创建6个TCP，只要有一个TCP的http发送成功了，就发送下一个HTTP请求。这样就节约了时间。

3. 怎么验证？
Chrome--Network--Name右键显示Connection ID，就是查看TCP创建的id,每个请求都复用了TCP，而且最多超过6个TCP