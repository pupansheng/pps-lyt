<template>
	<view class="content">
		
		
		  <view>
		        <view class="uni-padding-wrap uni-common-mt">
		            <view>
		                <video id="myVideo" :title="video.fileName" :src="video.url" :controls="master" :show-center-play-btn="master"
		                    @error="videoErrorCallback" :danmu-list="danmuList"
							@play="videoEvent('play',$event)" 
							@ended="videoEvent('ended',$event)"
							@timeupdate="videoEvent('timeUpdate',$event)"
							@fullscreenchange="videoEvent('full',$event)"
							@waiting="videoEvent('waiting',$event)"
							@progress="videoEvent('progress',$event)"
							@ontimeupdate="videoEvent('h5timeUpdate',$event)"
							@pause="videoEvent('pause',$event)" enable-danmu danmu-btn controls></video>
							
		            </view>
				<!-- 	@timeupdate="videoEvent('timeUpdate',$event)" -->
		            <!-- #ifndef MP-ALIPAY -->
		            <view class="uni-list uni-common-mt">
		                <view class="uni-list-cell">
		                    <view>
		                        <view class="uni-label">弹幕内容</view>
		                    </view>
		                    <view class="uni-list-cell-db">
		                        <input v-model="danmuValue" class="uni-input" type="text" placeholder="在此处输入弹幕内容" />
		                    </view>
		                </view>
		            </view>
		            <view class="uni-btn-v">
		                <button @click="sendDanmu" class="page-body-button">发送弹幕</button>
		            </view>
		            <!-- #endif -->
		        </view>
		    </view>
		
		
		
	</view>
</template>

<script>
	const time_distance=30*60;
	import API from "../../common/resource.js"
	export default {
		
		  data() {
		        return {
		            src: '',
					video:{
						url:'https://img.cdn.aliyun.dcloud.net.cn/guide/uniapp/%E7%AC%AC1%E8%AE%B2%EF%BC%88uni-app%E4%BA%A7%E5%93%81%E4%BB%8B%E7%BB%8D%EF%BC%89-%20DCloud%E5%AE%98%E6%96%B9%E8%A7%86%E9%A2%91%E6%95%99%E7%A8%8B@20200317.mp4',
						name:'test'
					},
		            danmuList: [{
		                    text: '卢玉婷是猪',
		                    color: '#ff0000',
		                    time: 1
		                },
		                {
		                    text: '爱猪猪',
		                    color: '#ff00ff',
		                    time: 3
		                }
		            ],
		            danmuValue: '',
					toUser:{},
					ready:false,
					master:false,
					videoContext:null,
					
		        }
		    },
		  
		    methods: {
				videoEvent(type,event){
					
					//邀请者
					if(this.master){
						
					if(type=='play'){
						
						if(!this.ready){
							this.$ppsUtil.errorToast("邀请人还未到！")
							this.videoContext.pause();
							return;
						}
						this.$im.sendMsgForText('play',this.toUser.name,11,1); 
						
					}else if(type=='timeUpdate'){
						
					/* let time=event.detail.currentTime;
					if(time-time_distance){
						
						
					} */
					 
						
					}else if(type=='pause'){
						
						 this.$im.sendMsgForText('pause',this.toUser.name,11,1); 
						
					}
					
					//被已邀请者
					}else{
						
					 
						
					}
					
					
				},
		        sendDanmu: function() {
					let d={
		                text: this.danmuValue,
		                color: this.getRandomColor()
		            };
					this.$im.sendMsgForText(
					JSON.stringify(d),
					this.toUser.name,
					'8',
					this.$im.msgAction.sendToSingle
					);
		            this.videoContext.sendDanmu(d);
		            this.danmuValue = '';
		        },
		        videoErrorCallback: function(e) {
		            uni.showModal({
		                content: e.target.errMsg,
		                showCancel: false
		            })
		        },
		        getRandomColor: function() {
		            const rgb = []
		            for (let i = 0; i < 3; ++i) {
		                let color = Math.floor(Math.random() * 256).toString(16)
		                color = color.length == 1 ? '0' + color : color
		                rgb.push(color)
		            }
		            return '#' + rgb.join('')
		        }
		    },
		   onLoad(option) {
			 const vm=this;  
		     this.toUser=JSON.parse(option.item);
			 this.video=JSON.parse(option.video);
			 this.master=option.master=='true'?true:false;
			 console.log(this.master)
			 uni.$once('video-controller',function(data){
			 				 
						if(data=='play'){
							
						 vm.videoContext.play();
						}else if(data=='pause'){
							
						  vm.videoContext.pause();	
						}	 
			 				   
			  })
			 uni.$once('danmu',function(data){
				   vm.$ppsUtil.log("收到弹幕："+data)
				   vm.videoContext.sendDanmu(data);
			  })
			uni.$once('invite-response',function(data){
				  if(data=='0'){
					  vm.$ppsUtil.errorToast(this.toUser.name+":该用户拒绝了你的邀请!")
				  }else if(data=='1'){
					 let d={
					          text: vm.toUser.name+':已加入!',
					          color: '#ff0000',
					          time: 1
					      }
					  vm.danmuList.push(d)
					  vm.ready=true;
				  }
			 })  
		   },
		   onReady: function (res) {
		       this.videoContext = uni.createVideoContext('myVideo')
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
