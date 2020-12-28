// 这里的vm，就是我们在vue文件里面的this，所以我们能在这里获取vuex的变量，比如存放在里面的token
// 同时，我们也可以在此使用getApp().globalData，如果你把token放在getApp().globalData的话，也是可以使用的
const install = (Vue, vm) => {
	Vue.prototype.$u.http.setConfig({
		baseUrl: 'http://localhost:20000/pps',
			method: 'POST',
			// 设置为json，返回后会对数据进行一次JSON.parse()
			showLoading: true, // 是否显示请求中的loading
			loadingText: '请求中...', // 请求loading中的文字提示
			loadingTime: 800, // 在此时间内，请求还没回来的话，就显示加载中动画，单位ms
			originalData: false, // 是否在拦截器中返回服务端的原始数据
			loadingMask: true, // 展示loading的时候，是否给一个透明的蒙层，防止触摸穿透
		 header: {
			'authorization': vm.vuex_token,
			'content-type': 'application/json;charset=UTF-8',
		 }
	});
	// 请求拦截，配置Token等参数
	Vue.prototype.$u.http.interceptor.request = (config) => {
		

		return config; 
	}
	// 响应拦截，判断状态码是否通过
	Vue.prototype.$u.http.interceptor.response = (res) => {
		    let data=res;
			if(data.code!=200){
				uni.showToast({
					icon: 'none',
					title: '请求失败:'+data.error
				});
				return false;
			}else{
				// 如果把originalData设置为了true，这里return回什么，this.$u.post的then回调中就会得到什么
				return data;  
			}
		
	}
}

export default {
	install
}