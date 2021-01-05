<template>
	<view class="wrap">
            <u-toast ref="uToast" />
		<view style="display: flex;flex-direction: row;justify-content: center;">
			<u-upload v-show='false'></u-upload>
			<uni-view data-v-0d33af60="" class="u-list-item u-add-wrap" style="width: 106px; height: 106px;">
				<uni-view data-v-6e20bb40="" data-v-0d33af60="" class="u-icon u-add-btn u-icon--right">
					<uni-text data-v-6e20bb40="" hover-class="" class="u-icon__icon uicon-plus u-iconfont" style="font-size: 21px; font-weight: normal; top: 0px;"><span></span>
					</uni-text>
					<!---->
				</uni-view>
				<uni-view data-v-0d33af60="" class="u-add-tips" @click="openFile">选择影片</uni-view>
			</uni-view>
		</view>
		<view>

			<u-line-progress v-show="showPro" :percent="prercent" :round="false" active-color="green"></u-line-progress>

		</view>


	</view>

</template>

<script>
	import API from "../../common/resource.js"
	export default {
		data() {
			return {

				showPro: false,
				prercent: 0

			}

		},
		methods: {
			openFile() {
				let vm = this;
				uni.chooseVideo({
					count: 1,
					compressed: false,
					sourceType: ['camera', 'album'],
					success: function(res) {
						let file = res.tempFile;
						vm.initChunkUpload(file)
					}
				});
			},
			initChunkUpload(file){
			let bytesPerPiece = 2 * 1024 * 1024;
			//计算文件切片总数
			let filesize = file.size;
			let totalPieces = Math.ceil(filesize / bytesPerPiece);	
			let s=this.vuex_user.userInfo.name+":"+file.name+file.size+file.type+file.lastModified;
			this.$u.post(API.initUpload,{
				sign:s,
				name:file.name,
				user:this.vuex_user.userInfo.name,
				userId:this.vuex_user.userInfo.id,
				pageSize:totalPieces
			}).then(res => {
			  
			  let data=  res.data;
			  this.uploadChunck(data,totalPieces,file,bytesPerPiece)
			  this.queryProcess(data,totalPieces)
			  
			});
				
			},
			queryProcess(data,t){
				
			  let uploadId=data.uploadId;
			  let key=data.key;
				
              let task=setInterval(()=>{
				  
				  this.$u.post(API.searchProcess,data).then(res => {
				    let p=  res.data;
					if(p==t){
						clearInterval(task);
						  this.$u.post(API.completeUpload,{
							  ...data,
							  userId:this.vuex_user.userInfo.id
							  }).then(res2=>{
							this.$refs.uToast.show({
								   title: '上传成功',
								   type: 'success'				
							})
							this.showPro=false;
							this.$ppsUtil.log("合成成功！")
							this.prercent=0;
						  },err=>{
							this.showPro=false;
							this.$ppsUtil.log("合成失败！")
							this.prercent=0;
						  })
					}
				    this.prercent = Math.round(( p/ t) * 100, 2);
				  },err=>{
					  this.$ppsUtil.log("请求进度失败！")
					  clearInterval(task);
					  this.showPro=false;
				  });
				  
			  },3000);
				
		
			},
			uploadChunck(data,totalPieces,file,bytesPerPiece){
				this.prercent=0;
				this.showPro=true;
				let startPage=data.pageNumber;
				let uploadId=data.uploadId;
				let key=data.key;
				let blob = file
				let start = 0+(startPage-1)*bytesPerPiece;
				let end;
				let index = startPage;
				let filesize = file.size;
				while (start < filesize) {
					end = start + bytesPerPiece;
					if (end > filesize) {
						end = filesize;
					}
					var chunk = blob.slice(start, end); //切割文件    
					let param={
						"pageNumber":index,
						"fileName":file.name,
						"uploadId":uploadId,
						"key":key,
						"size":end-start
					}
					
					this.httpUpload(param,chunk);
					this.$ppsUtil.log("分块上传：块"+index);
					start = end;
					index++;
				}
			},
		     httpUpload(form,chunk){
			
			 uni.uploadFile({
			            url: this.$u.http.config.baseUrl+"/"+API.uploadChunck, //仅为示例，非真实的接口地址
						file:chunk,
			            name: 'file',
						timeout:600000,
			            formData:form,
						header:{
							'authorization':this.vuex_token
						},
			            success: (res) => {
														   
			            },
						complete:(e)=>{
							console.log(e)
						}
			       });
			},
		},
		onReady() {





		}
	}
</script>

<style lang="scss">
	.wrap {
		padding: 24rpx;
		justify-content: center;
		flex-direction: column;
		display: flex;
	}

	.slot-btn {
		width: 341rpx;
		height: 140rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		background: rgb(244, 245, 246);
		border-radius: 10rpx;
	}

	.slot-btn__hover {
		background-color: rgb(235, 236, 238);
	}

	.pre-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
	}

	.pre-item {
		flex: 0 0 48.5%;
		border-radius: 10rpx;
		height: 140rpx;
		overflow: hidden;
		position: relative;
		margin-bottom: 20rpx;
	}

	.pre-item-image {
		width: 100%;
		height: 140rpx;
	}
</style>
