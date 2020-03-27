<template>
  <div class="material-center">
    <Modal
        v-model="isVisible"
        :title="title"
        :width="defaultWidth"
        :mask-closable="false">
        <Tabs :value="currTabName">
          <TabPane name="image" label="我的图片" v-if="showImageTab">
		        <!--我的图片列表-->
			      <material-list
              :tab-type="currTabName"
              @getSeletedList="getSeletedList"></material-list>
			    </TabPane>
			    <TabPane name="video" label="我的视频" v-if="showVideoTab">
		        <!--我的视频列表-->
			      <material-list
              :tab-type="currTabName"
              @getSeletedList="getSeletedList"></material-list>
			    </TabPane>
        </Tabs>
        <div slot="footer">
            <Button type="text" size="large" @click.native="onCancel">取消</Button>
				    <Button type="primary" size="large" @click.native="onOk">确定</Button>
        </div>
    </Modal>
  </div>
</template>

<script>
import MaterialList from './material-list';

export default {
  name: 'MaterialCenter',
  components: {
    MaterialList
  },
  provide () {
    return {
      multi: this.multi,
      selectedData: this.selectedData,
      maxSize: this.maxSize,
      format: this.format
    }
  },
  props: {
    multi: {
      type: [Number, String, Boolean],
      default: 0
    },
    type: {
      validator (value) {
        return ['image', 'video'].findIndex(item => item === value) !== -1;
      },
      required: true
    },
    selectedData: {
      type: [String, Array],
      required: true,
      default: ''
    },
    maxSize: {
      type: Number,
      default () {
        return this.type === 'image' ? 2048 : 20480;
      }
    },
    format: {
      type: Array,
      default () {
        return this.type === 'image' ? ['jpg', 'png', 'gif', 'jpeg'] : ['mp4'];
      },
      validator (value) {
        return value.length > 0;
      }
    }
  },
  data () {
    return {
      isVisible: false,
      defaultWidth: 900,
      resultData: null
    }
  },
  computed: {
    title () {
      return this.multi ? '选择素材-多选模式' : '选择素材-单选模式';
    },
    showImageTab () {
      return this.type === 'image';
    },
    showVideoTab () {
      return this.type === 'video';
    },
    currTabName () {
      return this.type;
    }
  },
  methods: {
    onOk () {
      if (!this.resultData || this.resultData.length === 0) {
        this.$Message.error('请选择素材！');
        this.isVisible = true;
        return false;
      } else {
        this.isVisible = false;
      }
      this.$emit('handleList', this.resultData);
    },
    onCancel () {
      this.isVisible = false;
    },
    getSeletedList (list) {
      this.resultData = list;
    }
  }
}
</script>
