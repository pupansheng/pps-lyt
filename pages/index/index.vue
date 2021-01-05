<template>
	<view class="content">
		<u-notice-bar style="width:100%;" mode="horizontal" :list="list"></u-notice-bar>
		
		<view style="width:100%;">
		<u-cell-group >
				<u-cell-item icon="star-fill" :title="v.fileName" :key="v.id" @click="slelectPerson(v)" v-for="v in videoList" ></u-cell-item>
		</u-cell-group>
		</view>
		       <view >
				<u-popup v-model="show" >
					
					<view style="width: 400rpx;"><u-icon name="man-add-fill"></u-icon>添加观看人员</view>
					<u-divider color="#fa3534" half-width="200" border-color="#6d6d6d">------------</u-divider>
					<view>
						
						<u-cell-group>
							<u-cell-item :key="k" v-for="(v,k) in userList" :title="v.name" @click="gotoMovie(v)">
								<view  v-slot="icon">
									<u-avatar  :src="v.userInfo==null?'':v.userInfo.headIImage" size="mini"></u-avatar>
								</view>
							</u-cell-item>
						</u-cell-group>
						
						
					</view>
					
					
				</u-popup>
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
				videoList:[],
				userList:[],
			    show:false	,
				video:{}
				
			}
		},
		onLoad() {
          
			if(!this.isLogin){
				 
				if(this.vuex_token){
					this.$u.post(API.getLoginInfo).then(res => {
					    this.$u.vuex('vuex_user',res.data);
						this.$u.vuex('isLogin',true);
						uni.$emit('loginSuccess',{msg:'登陆成功'})
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
			 
		 },
		 slelectPerson(v){
			 this.video=v;
			 this.show=true;
			 this.$u.post(API.getOnile).then(res=>{
				 this.userList=res.data;
			 })
			 
			 
		 },
		 gotoMovie(u){
			 let s="item="+JSON.stringify(u)+"&video="+JSON.stringify(this.video);
			 let send={
				 video:this.video,
				 inviter:{
					 id: this.vuex_user.userInfo.id,
					 name:this.vuex_user.userInfo.name
				 }
			 }
			 this.$im.sendMsgForText(JSON.stringify(send),u.name,9,1);
			 uni.navigateTo({
			    url: '/pages/video/index?'+s+"&master=true"
			 });
			 
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