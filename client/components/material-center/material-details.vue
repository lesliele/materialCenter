<template>
  <div class="item" :class="className" @click="selectItem(curItem)">
    <div class="content">
      <div class="img_wrapper">
        <div class="img_mask"></div>
        <img :src="curItem.src" class="img" v-viewer v-if="isImageType"/>
        <div class="img video_default" v-else></div>
      </div>
      <div class="edit_remark_wrapper">
        <span v-if="createRemarkTip" class="create_remark_tip">
          <Icon type="md-create" color="#ddd" size="16" title="修改备注信息" @click.stop="handleEdit"/>
          <Tooltip placement="top" transfer>
            <span @click.stop>{{curItem.remark ? curItem.remark : '点击修改备注'}}</span>
            <span slot="content">{{curItem.remark ? curItem.remark : '点击修改备注'}}</span>
          </Tooltip>
        </span>
        <div v-show="editRemark" class="edit_remark" v-if="canEdit">
          <Input size="small" v-model="remark" placeholder="备注" @keydown.native.enter.prevent ="saveRemark"/>
          <Button type="text" size="small" @click.stop="saveRemark" class="common_btn">
            <Icon type="md-checkmark" color="#2d8cf0" size="18" />
          </Button>
          <Button type="text" size="small" @click.stop="cancelRemark" class="common_btn">
            <Icon type="md-close" color="#ff9900" size="18" />
          </Button>
        </div>
      </div>
    </div>
    <div class="mask">
      <Icon type="md-close-circle" class="close" :title="removeTitle" @click.stop="removeItem" v-if="canRemove"></Icon>
      <Icon type="md-alert" class="view" title="查看图片信息" @click.stop="viewInfo" v-if="isImageType"/>
      <Icon type="md-arrow-dropright-circle" class="play" title="播放视频" @click.stop="playVideo" v-else></Icon>
    </div>
    <Modal
			v-model="modalPlayShow"
      title="视频播放"
      footer-hide>
			<!--视频播放器-->
			<video-player ref="videoPlayer" :options="playerOptions"></video-player>
		</Modal>
    <Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>

<script>
// 载入videojs 组件
import 'video.js/dist/video-js.css';
import { videoPlayer } from 'vue-video-player';

export default {
  name: 'materialDetails',
  components: {
    videoPlayer
  },
  props: {
    tabType: {
      // 图片还是视频类型
      required: true
    },
    curItem: {
      required: true
    },
    selectedList: {
      type: Array,
      required:true
    },
    canEdit: {
      type: Boolean
    },
    canRemove: {
      type: Boolean
    }
  },
  inject: ['multi', 'selectedData', 'maxSize', 'format'],
  data () {
    return {
      editRemark: false,
      remark: '',
      spinShow: false,
      modalPlayShow: false,
      removeTitle: this.isImageType ? '删除图片' : '删除视频',
      playerOptions: {
        playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
        aspectRatio: '16:9',
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        autoplay: false,
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true  //全屏按钮
        },
        notSupportedMessage: '此视频暂无法播放，请稍后再试'
      }
    }
  },
  computed: {
    isImageType () {
      return this.tabType === 'image';
    },
    createRemarkTip () {
      return !this.editRemark;
    },
    isUnselected () {
      if (this.isImageType) {
        return parseInt(this.curItem.img_size / 1024) > this.maxSize || this.format.findIndex(item => this.curItem.mime.replace('image/', '') === item) === -1;
      } else {
        return parseInt(this.curItem.img_size / 1024) > this.maxSize || this.format.findIndex(item => this.curItem.mime.replace('video/', '') === item) === -1;
      }
    },
    className () {
      return {
        'select_item': this.selectedList.findIndex(item => this.curItem.id === item.id) !== -1,
        // "mime": "image/jpeg"/"video/jpeg"
        'disabled': this.isUnselected
      }
    }
  },
  methods: {
    handleEdit () {
      this.editRemark = true;
    },
    saveRemark () {
      if (!this.remark.trim()) {
        this.$Message.error('请输入备注信息');
        this.editRemark = true;
        return false;
      } else {
        this.editRemark = false;
      }
      this.spinShow = true;
      return this.$axios.post(this.$api.userUpdateRemark, {
        type: this.tabType,
        id: this.curItem.id,
 				remark: this.remark
       })
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.$Message.success(res.message);
          this.$emit('editRemarkSuccess', this.curItem, this.remark);
        } else {
          this.$Message.error(res.message);
        }
        this.spinShow = false;
      });
    },
    cancelRemark () {
      this.editRemark = false;
    },
    removeItem () {
      this.$Modal.confirm({
        title: '删除提示',
        content: this.isImageType ? '如果图片在使用中，删除图片会影响到使用中的项目，确定无使用再删除，删除吗？' : '如果视频在使用中，删除视频会影响到使用中的项目，确定无使用再删除，删除吗？',
        onOk: () => {
          this.spinShow = true;
          this.$axios.post(this.$api.userMaterialRemove, {
            type: this.tabType,
            id: this.curItem.id
          })
          .then((response) => {
            var res = response.data;
            if (res.code) {
              this.$Message.success(res.message);
              this.$emit('reloadData');
            } else {
              this.$Message.error(res.message);
            }
            this.spinShow = false;
          });
        },
        onCancel () {
          this.spinShow = false;
        }
      });
    },
    viewInfo () {
      const viewer = this.$el.querySelector('.img').$viewer;
      viewer.show();
    },
    playVideo () {
      this.modalPlayShow = true;
    },
    selectItem (curItem) {
      if (this.isUnselected) {
        this.$Message.error('无法选择该图片');
        return false;
      }
      if (this.multi === 0) {
        // 单选
        this.$emit('handleSingle', curItem);
      } else if (this.multi === 1) {
        // 多选
        this.$emit('handleMulti', curItem);
      }
    }
  },
  watch: {
    'curItem.remark': {
      handler (newVal) {
        if (!newVal) return false;
        this.remark = newVal;
      },
      immediate: true
    },
    'curItem.src': {
      handler (newVal) {
        // 处理视频的路径
        if (this.isImageType || !newVal) return false;
        const formatList = this.format.map(item => {
          return {
            type: `video/${item}`,
            src: newVal
          }
        });
        this.playerOptions.sources = formatList;
      },
      immediate: true
    }
  }
}
</script>

<style lang="less" scoped>
.item{
  position: relative;
  border: 2px solid rgba(0, 0, 0, 0.04);
  width: 120px;
  height: 160px;
  margin: 10px;
  border-radius: 3px;
  background: #fff;
  cursor: pointer;
  &.select_item{
    border: 2px solid red;
  }
  &.disabled{
    cursor: not-allowed;
  }
  &.select_item::before{
    content: '\2713';
    position: absolute;
    bottom: -3px;
    right: 1px;
    font-size: 14px;
    font-weight: bold;
    color: #fff;
    z-index: 3;
  }
  &.select_item::after{
    content: '';
    position: absolute;
    bottom: -16px;
    right: -16px;
    width: 0;
    height: 0;
    border-width: 16px;
    border-color: transparent transparent transparent red;
    border-style: solid;
    transform: rotate(45deg)
  }
  .content{
    .img_wrapper{
      position: relative;
      height: 120px;
      .img_mask{
        position: absolute;
        width: 100%;
        height: 120px;
        left: 0;
        top: 0;
        background: transparent;
        z-index: 2;
      }
      .img{
        position: absolute;
        left: 0;
        top: 0;
        display: block;
        width: 116px;
        height: 120px;
        object-fit: cover;
        z-index: 1;
      }
      .video_default{
        background: #000;
      }
    }
    .edit_remark_wrapper{
      text-align: center;
      padding: 4px;
      height: 30px;
      line-height: 30px;
      .create_remark_tip{
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .edit_remark{
        display: flex;
      }
    }
  }
  .mask{
    position: absolute;
    top: -10px;
    right: -12px;
    display: flex;
    flex-direction: column;
    z-index: 3;
    .close{
      cursor: pointer;
      display: none;
      font-size: 24px;
      color: orangered;
      background: #fff;
      border-radius: 100%;
      margin-bottom: 10px;
    }
    .view, .play{
      cursor: pointer;
      display: none;
      font-size: 24px;
      color: #2db7f5;
      background: #fff;
      border-radius: 100%;
    }
    .checked-icon{
      color:#ddd;
      display:block;
    }
  }
  &:hover .close{
    display: inline-block;
  }
  &:hover .view{
    display: inline-block;
  }
  &:hover .play{
    display: inline-block;
  }
  &:hover{
    box-shadow: 0 0 3px 4px rgba(0,0,0,.05);
  }
}
</style>
<style lang="less">
.item{
  .common_btn{
    padding: 0;
  }
  .ivu-tooltip-rel{
    display: inline-block;
    width: 80px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .ivu-icon-md-create{
    padding-bottom: 8px;
  }
}
.video-js .vjs-big-play-button {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
