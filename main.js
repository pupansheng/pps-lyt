import Vue from 'vue'
import App from './App'
// 此处为演示vuex使用，非uView的功能部分
import store from '@/store';

import SocketIm from  "./common/pps-uni-im-socket-jdk.js"

SocketIm.initWsUrl("ws://localhost:9090/pps")
Vue.prototype.$im=SocketIm;

// 引入uView提供的对vuex的简写法文件
let vuexStore = require('@/store/$u.mixin.js');
Vue.mixin(vuexStore);
// 引入uView对小程序分享的mixin封装
let mpShare = require('uview-ui/libs/mixin/mpShare.js');
Vue.mixin(mpShare);
import Im from 'common/pps-uni-im-socket-jdk.js'
Vue.config.productionTip = false
Vue.prototype.log=true;
App.mpType = 'app'

// 引入全局uView
import uView from 'uview-ui'
Vue.use(uView);

const app = new Vue({
	store,
    ...App
})

// http拦截器，将此部分放在new Vue()和app.$mount()之间，才能App.vue中正常使用
import httpInterceptor from '@/common/http.interceptor.js';
Vue.use(httpInterceptor, app);
Vue.use(Im,app)
// http接口API抽离，免于写url或者一些固定的参数
import httpApi from '@/common/http.api.js';
Vue.use(httpApi, app);

import ppsUtil from '@/common/ppsUtil.js'
Vue.use(ppsUtil,app);


app.$mount()
