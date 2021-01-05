
<script>
	import API from "./common/resource.js"
	export default {
		onLaunch: function() {
			let vm=this;
			uni.$once('loginSuccess',function(data){
				    console.log("登录Im服务器--------------------------")
			        vm.$im.loginWithToken(vm.vuex_token);
			 })
			 uni.$on('invite',function(data){
			 	     vm.$ppsUtil.log("收到邀请："+data)
					 let inviter= data.inviter;
					 let video=data.video;
					 uni.showModal({
					    title: '邀请提示',
					    content: inviter.name+"邀请你看电影《"+video.fileName+"》是否同意？",
					    success: function (res) {
					        if (res.confirm) {
                              vm.$im.sendMsgForText('1',inviter.name,10,1); 
							  let s="item="+JSON.stringify(inviter)+"&video="+JSON.stringify(video);
							  uni.navigateTo({
							     url: '/pages/video/index?'+s+"&master=false"
							  });
					        } else if (res.cancel) {
								 vm.$im.sendMsgForText('0',inviter.name,10,1);
					        }
					    }
					});
									 
			  })
			  
			if(!this.isLogin){
				if(this.vuex_token){
					this.$u.post(API.getLoginInfo).then(res => {
					    this.$u.vuex('vuex_user',res.data);
						this.$u.vuex('isLogin',true);
						uni.$emit('loginSuccess',{msg:'登陆成功'})
					},err=>{
						this.$ppsUtil.log("请求个人页面出现错误  进入登陆页面")
				     	this.$ppsUtil.goLoginPage();	
					});
				}else{
					this.$ppsUtil.log("未登录 进入登陆页面")
					this.$ppsUtil.goLoginPage();
				}
			}
		//注册事件
		
		//文本事件
		vm.$im.fireTextEvent((text)=>{
			
		})
		//收到弹幕事件
		vm.$im.fireEvent('8',(res=>{
			uni.$emit('danmu',JSON.parse(res.data))
		}))
		//收到邀请事件
		vm.$im.fireEvent('9',(res=>{
			console.log(res)
			uni.$emit('invite',JSON.parse(res.data))
		}))		 
		//收到邀请回复事件
		vm.$im.fireEvent('10',(res=>{
			uni.$emit('invite-response',res.data)
		}))		
		//收到视频控制事件
		vm.$im.fireEvent('11',(res=>{
			console.log("视频控制：")
			console.log(res)
			uni.$emit('video-controller',res.data)
		}))	
				 
				 
		},
		onShow: function() {
			
		},
		onHide: function() {
		
		}
	}
</script>

<style lang="scss">
	@import "uview-ui/index.scss";
	/*每个页面公共css */
</style>
