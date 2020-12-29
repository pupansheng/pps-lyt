<template>
	<view class="content">
	  主页
	</view>
</template>

<script>
	import API from "../../common/resource.js"
	export default {
		data() {
			return {
				
			}
		},
		onLoad() {
          
				if(!this.isLogin){
					
					if(this.vuex_token){
						this.$u.post(API.getLoginInfo).then(res => {
						    this.$u.vuex('vuex_user',res);
							this.$u.vuex('isLogin',true);
						},err=>{
					     	this.$ppsUtil.goLoginPage();	
						});
					}else{
						this.$ppsUtil.goLoginPage();
					}
				}	 



		},
		methods: {

        
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 40rpx;
	}
</style>
