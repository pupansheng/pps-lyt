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

				showPro: true,
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
						vm.upload(file)
					}
				});
			},
			upload(file) {
				this.showPro=true;
				var blob = file
				var start = 0;
				var end;
				var index = 0;
				var filesize = file.size;
				var filename = file.name;
				let bytesPerPiece = 2 * 1024 * 1024;
				//计算文件切片总数
				let totalPieces = Math.ceil(filesize / bytesPerPiece);
				while (start < filesize) {
					end = start + bytesPerPiece;
					if (end > filesize) {
						end = filesize;
					}
					var chunk = blob.slice(start, end); //切割文件    
					var sliceIndex = blob.name + index;
					var formData = new FormData();
					formData.append("file", chunk, filename);
					//上传文件
					start = end;
					index++;
					this.prercent = Math.round((index / totalPieces) * 100, 2);
				}
				this.prercent = 100;
				this.$refs.uToast.show({
				 title: '上传成功',
				 type: 'success'				
				})
				this.showPro=false;
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
