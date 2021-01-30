<template>
	<div id="danmu" :class="{'transition':(this.position==0)}" :style="{'left':this.left+'px','top':this.top+'px'}" ref="dan">
		<div style="position: relative;width: 100%;">
			<span :class="{'decoration':this.type}" :style="{color:this.color,'font-size':this.size+'px',
			'font-weight':this.bold,'font-style':this.italic}">
				{{this.content}}</span>
		</div>
	</div>
</template>

<script>
	export default {
		props: ["id", "content", "color", "bold", "italic", "position", "size", "type", "width", "height"],
		data() {
			return {
				'left': this.width,
				'top': this.height
			}
		},
		created() {
			// console.log(this.position)
			var _self = this;
			var danWidth;
			var danHeight;
			//弹幕生成速度需时间，以免ref获取为undefined
			window.setTimeout(function() {
				danWidth = _self.$refs.dan.offsetWidth    //弹幕的宽
				danHeight = _self.$refs.dan.offsetHeight  //弹幕的高
				//0指弹幕位置随机
				if (_self.position == 0) {
					_self.top = Math.ceil(Math.random() * (_self.top - 60 - danHeight));
					_self.left = - danWidth
				} else if (_self.position == 1) {    //1为固定顶部居中
					_self.top = 5
					_self.left = (_self.width-danWidth)/2     //居中
				} else {  //2为固定底部居中
					_self.top = _self.top - 60 - danHeight
					_self.left = (_self.width-danWidth)/2     //居中
				}
			}, 100);
			
			window.setTimeout(function() {
				_self.$emit('deletedan', _self.id)  //调用父级方法去除该弹幕
			}, 7000);
		}
	}
</script>

<style scoped>
	#danmu {
		width: auto;
		height: auto;
		float: left;
		position: absolute;
		white-space:nowrap;
	}

	.bold {}

	.decoration {
		text-decoration-line: underline;
	}

	.transition {
		transition-property: left;
		transition-duration: 6s;
		transition-timing-function: linear;
	}
</style>
