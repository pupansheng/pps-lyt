<template>
	<view class="content">
		<u-notice-bar style="width:100%;" mode="horizontal" :list="list"></u-notice-bar>
		
		<view style="width:100%;">
		<u-cell-group >
				<u-cell-item icon="star-fill" title="花木兰" ></u-cell-item>
				<u-cell-item icon="star-fill" title="花木兰"  ></u-cell-item>
				<u-cell-item icon="star-fill" :title="v.fileName" :key="v.id" v-for="v in videoList" ></u-cell-item>
		</u-cell-group>
		</view>
	</view>
</template>

<script>
	import API from "../../common/resource.js"
	export default {
		data() {
			return {
				list: [
									'蒲蒲',
									'深爱',
									'猪猪'
									
					 ],
				videoList:[]	 
				
			}
		},
		onLoad() {
          
			if(!this.isLogin){
				 
				if(this.vuex_token){
					this.$u.post(API.getLoginInfo).then(res => {
					    this.$u.vuex('vuex_user',res.data);
						this.$u.vuex('isLogin',true);
						this.getList();
					},err=>{
						this.$ppsUtil.log("请求个人页面出现错误  进入登陆页面")
				     	this.$ppsUtil.goLoginPage();	
					});
				}else{
					this.$ppsUtil.log("未登录 进入登陆页面")
					this.$ppsUtil.goLoginPage();
				}
			}	 	


		},
		methods: {
			
         getList(){
			 this.$ppsUtil.log("获取影片")
			 this.$u.post(API.getVideoList).then(res=>{
				 this.videoList=res.data;
			 })
			 
		 }
        
		},
		onReady() {
			if(this.isLogin){
			  this.getList();
			}
			
		},
		 onPullDownRefresh() {
		       
			    this.getList();
		        setTimeout(function () {
		            uni.stopPullDownRefresh();
		        }, 1000);
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
	.wrap {
			padding: 40rpx;
		}
</style>
