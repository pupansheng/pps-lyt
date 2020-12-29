
const install = (Vue, vm) => {
	
	var ppsUtil = {
	
	 log:(info)=>{
		 
		 if(Vue.prototype.log){
		  console.log(info)
		  }
		  
	 },
	 goLoginPage:()=>{
		 
	  	 let forcedLogin=true;
		 uni.showModal({
		 	title: '未登录',
		 	content: '您未登录，需要登录后才能继续',
		 	/**
		 	 * 如果需要强制登录，不显示取消按钮
		 	 */
		 	showCancel: !forcedLogin,
		 	success: res => {
		 		if (res.confirm) {
		 			/**
		 			 * 如果需要强制登录，使用reLaunch方式
		 			 */
		 			if (forcedLogin) {
		 				uni.reLaunch({
		 					url: '/pages/login/index'
		 				});
		 			} else {
		 				uni.navigateTo({
		 					url: '/pages/login/index'
		 				});
		 			}
		 		}
		 	}
		 });
			  
	 },
	 clearData:()=>{
		 
		 vm.$u.vuex('vuex_token','');
		 vm.$u.vuex('vuex_user',null);
		 vm.$u.vuex('isLogin',false);
		 
	 },
	 delayMethodExecute(fun,t){
		
		if(t==null){
			t=200;
		} 
		setTimeout(fun,t);
		 
	 },
	 successToast:(info)=>{
		 
		 uni.showToast({
		     title: info,
			 icon:'success',
		     duration: 2000
		 });
		 
	 },
	 errorToast:(info)=>{
	 		 
	 	uni.showToast({
	 	    title: info,
	 		icon:'none',
	 	    duration: 2000
	 	});
	 		 
	 }

	 
	
	
	
	}
	
	
	Vue.prototype.$ppsUtil= ppsUtil;
}

export default {
	install
}


