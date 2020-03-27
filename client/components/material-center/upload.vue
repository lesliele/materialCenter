<template>
  <div class="material-upload">
    <Upload
        ref="upload"
        :name="uploadParams"
        :data="uploadExtData"
        :action="posterUploadUrl"
        :show-upload-list="false"
        :max-size="maxSize"
        :format="format"
        :on-format-error="handleFormatError"
        :on-exceeded-size="handleMaxSize"
        :on-progress="handleProgress"
        :on-success="handleUploadSuccess">
        <Button type="info" icon="md-add">{{isImageType ? '上传图片' : '上传视频'}}</Button>
      </Upload>
  </div>
</template>

<script>
import config from '../../config';

export default {
  name: 'MaterialUpload',
  inject: ['multi', 'selectedData', 'maxSize', 'format'],
  props: {
    selectedCatId: {
      required: true
    },
    tabType: {
      // 图片还是视频类型
      required: true
    }
  },
  data () {
    return {
      posterUploadUrl: config.baseURL + this.$api.uploadFile,
      uploadList: [],
      uploadParams: 'fileContent'
    }
  },
  computed: {
    isImageType () {
      return this.tabType === 'image';
    },
    // 用户素材分类（选中分类ID）
    uploadExtData () {
      return {
        cat_id: this.selectedCatId,
        type: this.tabType
      }
    }
  },
  methods: {
    handleFormatError (file) {
      const formatStr = this.format.join('/');
      this.$Notice.warning({
        title: this.isImageType ? '图片格式错误' : '视频格式错误',
        desc: `文件 ${file.name} 格式不正确, 请选择 ${formatStr} 格式文件`
      });
    },
    handleMaxSize (file) {
      this.$Notice.warning({
        title: '超过了最大文件限制',
        desc: `文件  ${file.name} 超过了 ${this.maxSize}Kb，请控制在${this.maxSize}Kb以内.`
      });
    },
    handleProgress (event, file, fileList) {
      this.uploadList = fileList;
      this.$emit('getUploadProgress', this.uploadList);
    },
    handleUploadSuccess () {
      this.$emit('uploadSuccess');
    }
  }
}
</script>
