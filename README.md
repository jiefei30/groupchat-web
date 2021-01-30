# groupchat-web

#### Introduce
web of groupchat，For learning reference only。（June 2020）

#### Architecture
vue-cli3


#### How to install
1.  import project to VS code/WebStorm/HbuilderX。
2.  install dependences
```cmd
npm install router
npm install axios
npm install uuid

```

#### How to use

1.  Modify  ip,port path in room.vue. Be consistent with the springboot server.
```js
//websocket server url  ws://ip:port/netty_context_path
const ip = "127.0.0.0"      		//server ip
const netty_port = 7000      		//netty port
const server_port = 7084                //server port
const context_path = "/groupchat"       //Be consistent with the springboot server

```
2.  npm run server
#### Sponsor

1.  jiefei30
