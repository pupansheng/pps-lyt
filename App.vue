
<script>
	import API from "./common/resource.js"
	export default {
		onLaunch: function() {
			
			if(!this.isLogin){
				 
				if(this.vuex_token){
					this.$u.post(API.getLoginInfo).then(res => {
					    this.$u.vuex('vuex_user',res.data);
						this.$u.vuex('isLogin',true);
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
