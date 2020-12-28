<template>
	<view class="wrap">
		<view class="top"></view>
		<view class="content">
			<view class="title">欢迎登录蒲蒲和猪猪的个人影院</view>
			
			<u-toast ref="uToast" />
			<view v-if="loginType=='phone'">
				<input class="u-border-bottom" type="number" v-model="tel" placeholder="请输入手机号" />
				<view class="tips">未注册的手机号验证后自动创建账号</view>
				<button @tap="submit" :style="[inputStyle]" class="getCaptcha">获取短信验证码</button>
				<view class="alternative">
					<view class="password" @click="changeLoginType('user')">密码登录</view>
					<view class="issue">遇到问题</view>
				</view>
			</view>
			
			
			
			<view v-if="loginType=='user'">
			
				<!-- <input class="u-border-bottom" type="text" v-model="user.username" placeholder="请输入账号" />
					<input class="u-border-bottom" type="password" v-model="user.password" placeholder="请输入密码" />
				<view class="alternative">
					<view class="password" @click="loginType='phone'">手机号登录</view>
					<view class="issue">遇到问题</view>
				</view> -->
				
				<u-form :model="user" ref="uForm" :error-type="['message']">
						<u-form-item label="账号"><u-input v-model="user.username" /></u-form-item>
						<u-form-item label="密码"><u-input v-model="user.password" type="password" /></u-form-item>
				</u-form>
				<button @click="login"  class="loginBtn">登录</button>
				<view class="alternative">
					<view class="password" @click="changeLoginType('phone')">手机号登录</view>
					<view class="issue">遇到问题</view>
				</view>
				
			</view>
			
			
		</view>
		
		
		
		
		
		<view class="buttom">
			<view class="loginType">
				<view class="wechat item">
					<view class="icon">
						<u-icon size="70" name="weixin-fill" color="rgb(83,194,64)"></u-icon>
					</view>
					微信
				</view>
				<view class="QQ item">
					<view class="icon">
						<u-icon size="70" name="qq-fill" color="rgb(17,183,233)"></u-icon>
					</view>
					QQ
				</view>
			</view>
			<view class="hint">
				登录代表同意
				<text class="link">蒲蒲和猪猪的个人影院用户协议、隐私政策，</text>
				并授权使用您的账号信息（如昵称、头像）以便您统一管理
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tel: '',
				loginType:'phone',
				user:{
					username:'',
					password:''
				},
				rules: {
					username: [
						// 对name字段进行必填验证
						{
							required: true,
							message: '请填写姓名',
							trigger: ['change','blur']
						},
					],
					password: [
						// 对name字段进行必填验证
						{
							required: true,
							message: '请填写密码',
							trigger: ['change','blur']
						},
					]
				}
			}
		},
		computed: {
			inputStyle() {
				let style = {};
				if (this.tel) {
					style.color = "#fff";
					style.backgroundColor = this.$u.color['warning'];
				}
				return style;
			}
		},
		methods: {
			changeLoginType(type){
				this.loginType=type;
				if(type=='user'){
					setTimeout(()=>{
					this.$refs.uForm.setRules(this.rules);
					},200)
				}
			},
			login(){
				if(!this.user.username||!this.user.password){
					this.$refs.uToast.show({
					          title: '请填写完整',
							  type: 'error'			
					})
					return;
				}
				this.$u.post('login',this.user,{
					'content-type':'application/x-www-form-urlencoded'
				}).then(res => {
				  let token=	res.token;
				  this.$u.vuex('vuex_token', token);
				  this.$refs.uToast.show({
				  title: '登录成功',
				  type: 'success'				
				 })
				 uni.switchTab({
				     url: '/pages/index/index'
				 });
				
				});
				
				
			},
			submit() {
				console.log(this.$u.test.mobile(this.tel))
				if (this.$u.test.mobile(this.tel)) {
					this.$u.route({
						url: 'pages/login/code'
					})
				}
			}
		},
		onReady() {
				
	    }
	};
</script>

<style lang="scss" scoped>
	.wrap {
		font-size: 28rpx;

		.content {
			width: 600rpx;
			margin: 80rpx auto 0;

			.title {
				text-align: left;
				font-size: 60rpx;
				font-weight: 500;
				margin-bottom: 100rpx;
			}

			input {
				text-align: left;
				margin-bottom: 10rpx;
				padding-bottom: 6rpx;
			}

			.tips {
				color: $u-type-info;
				margin-bottom: 60rpx;
				margin-top: 8rpx;
			}

			.getCaptcha {
				background-color: rgb(253, 243, 208);
				color: $u-tips-color;
				border: none;
				font-size: 30rpx;
				padding: 12rpx 0;

				&::after {
					border: none;
				}
			}
            .loginBtn {
            	background-color: rgb(253, 243, 208);
            	color: #FF9900;
            	border: none;
            	font-size: 30rpx;
            	padding: 12rpx 0;
            
            	&::after {
            		border: none;
            	}
            }
			.alternative {
				color: $u-tips-color;
				display: flex;
				justify-content: space-between;
				margin-top: 30rpx;
			}
		}

		.buttom {
			.loginType {
				display: flex;
				padding: 350rpx 150rpx 150rpx 150rpx;
				justify-content: space-between;

				.item {
					display: flex;
					flex-direction: column;
					align-items: center;
					color: $u-content-color;
					font-size: 28rpx;
				}
			}

			.hint {
				padding: 20rpx 40rpx;
				font-size: 20rpx;
				color: $u-tips-color;

				.link {
					color: $u-type-warning;
				}
			}
		}
	}
</style>
