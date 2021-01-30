<template>
	<div class="message-frame" :class="{'message-right':this.type,'border-color':this.type}">
		<div>{{this.name}}--{{this.time}}</div>
		<div>
			{{this.content}}
		</div>
	</div>
</template>

<script>
	export default {
		name: "Message",
		props: ["name", "time", "content", "type"]
	}
</script>

<style scoped>
	.message-frame {
		width: 75%;
		height: 100%;
		/* border: 1px solid #000000; */
		margin: 2%;
		padding: 2%;
		float: left;
		word-wrap: break-word;
		overflow: hidden;
		background-color: rgb(229,229,229);
		border-radius: 10px;
		/* position: relative; */
	}

	.message-right {
		float: right;
	}

	.border-color {
		/* border-color: red; */
		background-color: rgb(18,193,245);
		color: #FFFFFF;
	}
</style>
