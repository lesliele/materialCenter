<template>
  <div class="material-list">
    <div class="material-header">
      <material-upload
        v-if="rootControl.canUpload"
        :selected-cat-id="selectedCatId"
        :tabType="tabType"
        @getUploadProgress="handleUploadProgress"
        @uploadSuccess="handleUploadSuccess"/>
      <Input
        class="search"
        v-model="searchq"
        search
        enter-button
        clearable
        :placeholder="searchPlaceHolder"
				@on-search="goSearch"
				@on-clear="goSearch"
				@keydown.native.enter.prevent ="goSearch"/>
    </div>
    <Divider class="common_divider"></Divider>
    <div class="material-content">
      <Row>
        <Col span="4">
          <div class="material-sort">
            <div v-for="(item, index) in catList" :key="item.id" class="material-sort_item" :class="{'current': catIndex === index}" @click="selectCat(index, item)">
              {{item.name}}
              <span class="edit-box" v-if="item.id !== 0">
                <Icon v-if="rootControl.canEditCat" type="md-settings" size="14" title="编辑分类" @click.stop="openCatModal(item)"></Icon>
                <Icon v-if="rootControl.canRemoveCat" type="md-trash" size="14" title="删除分类" @click.stop="onRemoveCat(item)"></Icon>
              </span>
            </div>
            <!--添加分类气泡-->
            <Poptip v-model="showAddCatPop" placement="bottom-start" width="220" transfer v-if="rootControl.canAddCat">
              <div class="create-cat">
                <Icon type="md-add"></Icon>
                <span>创建分类</span>
              </div>
              <div slot="content" class="create-cat-content">
                <Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="60">
                  <FormItem prop="name" label="分类名">
                    <Input v-model="formItem.name" size="small" placeholder="请输入分类名称" @keydown.native.enter.prevent ="handleCreate"></Input>
                  </FormItem>
                  </Form>
                  <div style="text-align: center;">
                    <Button type="default" size="small" @click="handleCancelCreate">取消</Button>
                    <Button type="primary" size="small" @click="handleCreate">保存</Button>
                  </div>
              </div>
            </Poptip>
          </div>
        </Col>
        <Col span="20">
          <div class="material-details">
            <div class="material-inner">
              <div class="list">
                <template v-if="uploadSign">
                  <div v-for="item in uploadList" :key="item.uid" class="progress-bg">
                    <template v-if="item.status !== 'finished'">
                        <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                    </template>
                  </div>
                </template>
                <div v-for="item in list" :key="item.id">
                  <MaterialDetails
                    :cur-item="item"
                    :selected-list="selectedList"
                    :tabType="tabType"
                    :can-edit="rootControl.canEdit"
                    :can-remove="rootControl.canRemove"
                    @handleSingle="handleSingle"
                    @handleMulti="handleMulti"
                    @editRemarkSuccess="handleRemark"
                    @reloadData="handleReload"></MaterialDetails>
                </div>
              </div>
            </div>
          </div>
          <div v-show="pageTotal" class="page">
            <Page :total="pageTotal" :page-size="pageSize" :current="page" @on-change="changePage" show-total></Page>
          </div>
        </Col>
      </Row>
    </div>
    <Modal
      v-model="showEditCat"
      title="编辑分类名称"
      :loading="loading"
      @on-ok="saveEditCat">
      <div>
        <Row style="display: flex; align-items: center;">
          <Col span="4">
            <label class="title">分类名:</label>
          </Col>
          <Col span="20">
            <Input v-model="catValue" style="height: 32px;" placeholder="请输入分类名称" @on-change="handleCatText"></Input>
          </Col>
        </Row>
      </div>
		</Modal>
    <Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>

<script>
import MaterialDetails from './material-details';
import config from '../../config';
import MaterialUpload from './upload';

export default {
  name: 'materialList',
  components: {
    MaterialDetails,
    MaterialUpload
  },
  inject: ['multi', 'selectedData', 'maxSize', 'format'],
  props: {
    tabType: {
      // 图片还是视频类型
      required: true
    }
  },
  data () {
    return {
      searchq: '',
      catList: [],
      catIndex: 0,
      showAddCatPop: false,
      formItem: {
        name: ''
      },
      ruleValidate: {
        name: [{ required: true, message: '分类名称不能为空', trigger: 'blur', max: 40 }]
      },
      showEditCat: false,
      catValue: '',
      catId: 0,
      selectedCatId: 0,
      list: [],
      // 存储选中的数据
      selectedList: [],
      loading: true,
      spinShow: false,
      pageTotal: 0,
      page: config.PAGE_START,
      pageSize: config.PAGE_SIZE_DEF,
      uploadList: [],
      // 是否显示上传进度
      uploadSign: true,
      // 权限控制
      rootControl: {
        canUpload: true,
        // 素材备注信息修改
        canEdit: true,
        // 素材删除
        canRemove: true,
        // 分类添加
        canAddCat: true,
        // 分类编辑
        canEditCat: true,
        // 分类删除
        canRemoveCat: true
      }
    }
  },
  computed: {
    isImageType () {
      return this.tabType === 'image';
    },
    searchPlaceHolder () {
      return this.isImageType ? '搜索图片备注关键词' : '搜索视频备注关键词'
    }
  },
  methods: {
    handleReload () {
      this.loadData();
    },
    loadData () {
      this.spinShow = true;
      return this.$axios.get(this.$api.userMaterialList, 
      {
        params: {
          page: this.page,
          pageSize: this.pageSize,
          type: this.tabType, // image/video
          isInit: 1,
          cat_id: this.selectedCatId
        }
      })
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.data = res.data;
          this.catList = res.data && res.data.userCats;
          this.list = res.data && res.data.items;
          this.pageTotal = res.data && res.data.total;
          this.rootControl = res.data && res.data.can;
          this.spinShow = false;
          // 处理已选择的数据,单选多选结果都为数组
          this.handleSelectedData();
        } else {
          this.$Notice.warning({
            title: this.isImageType ? '获取图片列表失败' : '获取视频列表失败',
            desc: res.message
          });
        }
      });
    },
    handleSelectedData () {
      if (this.multi === 0) {
        if (typeof this.selectedData === 'object') {
          throw new Error('单选模式下请传字符串');
          return false;
        }
        // 单选
        this.list.forEach(item => {
          if (item.img_src_format === this.selectedData) {
            this.selectedList.push({
              src: this.selectedData,
              id: item.id
            });
          }
        });
      } else if (this.multi === 1) {
        if (typeof this.selectedData === 'string') {
          throw new Error('多选模式请传数组');
          return false;
        }
        // 多选
        this.list.forEach(item => {
          this.selectedData.forEach(selectItem => {
            if (item.img_src_format === selectItem) {
              this.selectedList.push({
                src: selectItem,
                id: item.id
              });
            }
          })
        });
      }
    },
    sortData (page = config.PAGE_START) {
      this.spinShow = true;
      return this.$axios.get(this.$api.userMaterialList, 
       {
        params: {
          page: this.page,
          pageSize: this.pageSize,
          type: this.tabType, // image/video
          cat_id: this.selectedCatId,
          searchq: this.searchq
        }
      })
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.data = res.data;
          this.list = res.data && res.data.items;
          this.pageTotal = res.data && res.data.total;

          this.spinShow = false;
          // 处理已选择的数据,单选多选结果都为数组
          this.handleSelectedData();
        } else {
          this.$Notice.warning({
            title: this.isImageType ? '获取图片列表失败' : '获取视频列表失败',
            desc: res.message
          });
        }
      });
    },
    changePage (page) {
      this.page = page;
      this.sortData(page);
    },
    goSearch () {
      this.sortData();
    },
    selectCat (index, item) {
      // 再次选中，不请求数据
      if (item.id === this.selectedCatId) return false;
      this.catIndex = index;
      this.selectedCatId = item.id;
      this.sortData();
    },
    // 创建分类
    handleCreate () {
      if (!this.formItem.name.trim()) {
        this.$Message.error('请输入分类名称');
        this.showAddCatPop = true;
        return false;
      } else {
        this.showAddCatPop = false;
      }
      this.spinShow = true;
      return this.$axios.post(this.$api.userAddCat, {
        name: this.formItem.name,
		    type: this.tabType, // image/video
       })
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.$Message.success(res.message);
          this.catList.push({
            name: res.data.name,
            id: res.data.id,
          });
          // 重置
          this.formItem.name = '';
          this.catIndex = this.catList.length - 1;
          this.selectedCatId = res.data.id;
          this.loadData();
        } else {
          this.$Message.error(res.message);
        }
        this.spinShow = false;
      });
    },
    handleCancelCreate () {
      this.showAddCatPop = false;
    },
    // 编辑分类
    saveEditCat () {
      if (!this.catValue.trim()) {
        this.$Message.error('请输入内容');
        this.loading = true;
        this.showEditCat = true;
        return false;
      } else {
        this.loading = false;
        this.showEditCat = false;
      }
      this.spinShow = true;
      return this.$axios.post(this.$api.userUpdateCat, {
        name: this.catValue,
        id: this.catId,
        type: this.tabType, // image/video
       })
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.$Message.success(res.message);
          const index = this.catList.findIndex(item => item.id === this.catId);
          this.catList[index].name = res.data.name;
        } else {
          this.$Message.error(res.message);
          this.showEditCat = true;
        }
        this.spinShow = false;
      });
    },
    handleCatText (e) {
      let value = e.target.value;
      if (value.trim()) {
        this.loading = false;
      } else {
        this.loading = true;
      }
    },
    openCatModal (item) {
      this.showEditCat = true;
      this.catValue = item.name;
      this.catId = item.id;
    },
    // 删除分类
    onRemoveCat (item) {
      const id = item.id;
      this.$Modal.confirm({
        title: '删除提示',
        content: this.isImageType ? '确定删除素材分类吗？无图片的分类才能删除成功。' : '确定删除素材分类吗？无视频的分类才能删除成功。',
        okText: '确定删除',
        cancelText: '取消',
        onOk: () => {
          this.spinShow = true;
          this.$axios.post(this.$api.userRemoveCat, {
            id,
            type: this.tabType // image/video
          })
          .then((response) => {
            var res = response.data;
            if (res.code) {
              this.$Message.success(res.message);
              const index = this.catList.findIndex(item => item.id === id);
              this.catList.splice(index, 1);
              this.loadData();
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
    handleSingle (item) {
      this.selectedList = [];
      this.selectedList.push({
        src: item.img_src_format,
        id: item.id
      });
    },
    handleMulti (curItem) {
      let delIndex;
      if (this.selectedList.findIndex((item, index) => {
        if (curItem.id === item.id) delIndex = index;
        return curItem.id === item.id;
      }) !== -1) {
        this.selectedList.splice(delIndex, 1);
      } else {
        this.selectedList.push({
          src: curItem.img_src_format,
          id: curItem.id
        });
      }
    },
    handleRemark (remarkItem, remark) {
      const index = this.list.findIndex(item => remarkItem.id === item.id);
      this.list[index].remark = remark;
    },
    handleUploadProgress (uploadList) {
      this.uploadList = uploadList;
    },
    handleUploadSuccess () {
      this.uploadSign = false;
      this.handleReload();
    }
  },
  watch: {
    selectedList (list) {
      this.$emit('getSeletedList', this.multi === 0 ? list[0] : list);
    }
  },
  mounted () {
    this.loadData();
  }
}
</script>

<style lang="less" scoped>
.material-list{
  .material-header{
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 40px;
    .search{
      width: 200px;
    }
  }
  .common_divider{
    margin: 10px 0;
  }
  .material-content{
    .material-sort{
      text-align: left;
      height: 380px;
      overflow-y: auto;
      overflow-x: hidden;
      .material-sort_item, .create-cat{
        position: relative;
        font-size:14px;
    		margin: 5px 5px 5px 0;
		    padding: 8px 20px 8px 10px;
		    cursor: pointer;
		    border-radius: 5px;
		    position: relative;
        background: #efefef;
        &.current{
          color:#fff;
    		  background: #5cadff;
        }
        .edit-box{
          display: none;
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          flex-direction: column;
        }
      }
      .material-sort_item:hover .edit-box{
        display: flex;
      }
      .create-cat{
        background:#2db7f5;
        color:#fff;
        font-size:12px;
        padding:4px 10px;
        margin-left: 10px;
      }
      .create-cat-content{
        padding: 5px;
      }
    }
    .material-details{
      height: 380px;
      overflow-y: auto;
      overflow-x: hidden;
      width:100%;
      border: 1px solid #eee;
      .material-inner{
        .list{
          display: flex;
          align-items: center;
          justify-content: flex-start;
          flex-wrap: wrap;
          .progress-bg{
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 5px;
            border: 2px solid rgba(0, 0, 0, 0.04);
            width: 120px;
            height: 160px;
            margin: 10px;
            border-radius: 3px;
            background: #fff;
            cursor: pointer;
          }
        }
      }
    }
    .page{
      text-align: right;
      margin-top: 10px;
    }
  }
}
</style>
<style lang="less">
.material-list{
  .ivu-input-icon{
      right: 50px;
  }
}
</style>
