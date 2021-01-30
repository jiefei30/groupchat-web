<template>
	<div id="frame">
		<div id="chat" ref="chatbox">
			<div class="head">
				<h1 align="center"> 欢迎加入聊天室 </h1>
			</div>
			<div class="message-body">
				<Message v-for="message in messages" :key="message.id" :name="message.name" :time="message.time" :content="message.content"
				 :type="message.type"></Message>
			</div>
		</div>
		<div id="danmu-frame" ref="danmuref">
			<div style="position: relative;z-index: 10;">
				<Danmu v-for="dan in danmus" :key="dan.id" :id="dan.id" :content="dan.content" :color="dan.color" :bold="dan.bold"
				 :position="dan.position" :size="dan.size" :italic="dan.italic" :width="dan.width" :height="dan.height" :type="dan.type"
				 @deletedan='deleteDanmu'></Danmu>
			</div>
			<div class="input">
				<div style="width: 100%;">
					<form action="" style="display: flex;justify-content: space-around;font-size: 17px;">
						<div>
							<span>字体大小：</span>
							<select v-model="message.size">
								<option value="30" checked="checked">小</option>
								<option value="50">中</option>
								<option value="80">大</option>
							</select>
						</div>
						
						<div>
							<span>字体颜色：</span>
							<select v-model="message.color">
								<option value="#000" checked="checked">黑</option>
								<option value="red">红</option>
								<option value="yellow">黄</option>
								<option value="blue">蓝</option>
								<option value="green">绿</option>
							</select>
						</div>
						
						<div>
							<span>弹幕位置：</span>
							<select v-model="message.position">
								<option value="0" checked="checked">随机</option>
								<option value="1">顶端</option>
								<option value="2">底部</option>
							</select>
						</div>
						
						<div>
							<span>加粗：</span>
							<input type="checkbox" v-model="message.bold" />
						</div>
						
						<div>
							<span>斜体：</span>
							<input type="checkbox" v-model="message.italic" />
						</div>
						
						<div>
							<span>昵称：</span>
							<input class="form-input" @keyup.enter="send()" v-model="message.name" type="text" maxlength="6" />
						</div>
						
						<div>
							<span>内容：</span>
							<input class="form-input" @keyup.enter="send()" v-model="message.content" type="text" maxlength="32" />
						</div>
						
						<div>
							<input class="form-input" @click="send()" type="button" value="发送" required="required" />
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	var socket;
	var time = new Date()
	import Message from './Message.vue'
	import Danmu from './Danmu.vue'
	const uuid = require('uuid')
	//websocket服务器的地址  ws://ip:端口/netty_context_path
	const ip = "127.0.0.0"      		//后端ip地址
	const netty_port = 7000      		//和后端保持一致
	const server_port = 7084  			//和后端保持一致
	const context_path = "/groupchat"   //和后端保持一致

	export default {
		name: "Room",
		components: {
			Message,
			Danmu
		},
		data() {
			return {
				message: {
					'content': "",
					'size': '30',
					'color': '#000',
					'bold': false,
					'italic': false,
					'position': 0,
					'ip': '127.0.0.0',
					'name': "童鞋",
					'time': '',
					'available': 1
				},
				sendnum: 0,
				messages: [],
				danmus: []
			}
		},
		created() {
			var _self = this
			//判断当前的浏览器是否支持 websocket
			if (window.WebSocket) {
				//go on
				socket = new WebSocket("ws://"+ip+":"+netty_port+context_path)

				//相当于channelRead0，ev收到服务器端回送的消息
				socket.onmessage = function(ev) {
					var data = JSON.parse(ev.data)
					_self.addMessage(data, 0)
					_self.addDanmu(data, 0)
				}
				//相当于连接开启
				socket.onopen = function(ev) {
					console.log("连接开启了...");
					//rt.value = "连接开启了..."
				}

				//感知到连接关闭
				socket.onclose = function(ev) {
					console.log("连接关闭了...");
					// rt.value = rt.value + "\n" + "连接关闭了..."
				}
			} else {
				alert("当前的浏览器不支持websocket");
			}
		},
		methods: {
			//消息框滑轮触底
			scrollToBottom() {
				var _self = this
				window.setTimeout(function() {
					_self.$refs.chatbox.scrollTop = 100000000
				}, 100);
			},
			send() {
				var _self = this
				if (socket.readyState == WebSocket.OPEN) {
					this.message.content = this.message.content.replace(/^\s*|\s*$/g,"");  //内容去首尾空格
					this.message.name = this.message.name.replace(/^\s*|\s*$/g,"");    //昵称去首尾空格
					if (this.message.content != '' && this.message.name !='') {
						this.message.time = this.getTime()
						//后端springboot存储弹幕接口地址
						this.$http.post("http://"+ip+":"+server_port+context_path+"/message/save", this.message).then(res => {
							this.message.content = ""
						});
						this.addMessage(this.message, 1)
						this.addDanmu(this.message, 1)
						//通过socket 发送消息
						socket.send(JSON.stringify(this.message))
					}
				} else {
					alert("连接没有开启")
				}
			},
			//添加消息
			addMessage(message, type) {
				var msg = new Object();
				msg.id = uuid.v4()
				msg.name = message.name;
				msg.content = message.content
				msg.time = message.time
				msg.type = type
				this.messages.push(msg)
				this.scrollToBottom()
			},
			//添加弹幕
			addDanmu(data, type) {
				var danmu = new Object();
				danmu.id = uuid.v4()
				danmu.content = data.content;
				danmu.color = data.color;
				danmu.position = data.position
				danmu.size = data.size
				danmu.type = type
				// console.log(this.$refs.danmuref)
				danmu.width = this.$refs.danmuref.offsetWidth
				danmu.height = this.$refs.danmuref.offsetHeight
				if (data.bold) danmu.bold = 'bolder'
				else danmu.bold = 'normal'
				if (data.italic) danmu.italic = 'italic'
				else danmu.italic = 'normal'
				this.danmus.push(danmu)
			},
			//删除弹幕
			deleteDanmu(ids) {
				this.danmus = this.danmus.filter(danmu => danmu.id != ids)
			},
			//时间格式
			getTime() {
				var t = time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate() +
					" " + time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds();
				return t;
			}
		}
	}
</script>
<style scoped>
	#frame {
		width: 100%;
		height: 100%;
		margin: 0 auto;
		position: absolute;
	}

	#chat {
		float: left;
		width: 25%;
		height: 100%;
		background-image: url(../assets/bg1.jpg);
		background-repeat: no-repeat;
		background-size: cover;
		overflow-y: scroll;
	}

	#danmu-frame {
		float: left;
		width: 75%;
		height: 100%;
		background-color: #FFF;
		overflow: hidden;
		background-image: url(../assets/bg2.jpg);
		background-repeat: no-repeat;
		background-size: cover;
	}

	.head {
		width: 25%;
		height: 50px;
		overflow: hidden;
		border-bottom: 1px solid #000000;
		background-color: #FAFAD2;
		position: fixed;
	}

	.head-text {
		position: sticky;
	}

	.input {
		position: absolute;
		width: 75%;
		height: auto;
		min-height: 50px;
		bottom: 0;
		background-color: pink;
		overflow: hidden;
		padding: 1%;
		z-index: 20;
	}

	.form-input {
		/* float: left; */
	}

	.message-body {
		padding-top: 10%;
	}
</style>
