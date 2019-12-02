<style>
  .ivu-table-cell{
    padding:  0px;
  }
  .ivu-modal-footer {
    display: none;
  }
  .ivu-modal-body {
    text-align: center
  }
</style>
<template>
  <div>
      <Card>
        <div class="search-con search-con-top">
          <Row>
            <Col span="2">
              <Upload action="" :before-upload="handleBeforeUpload" accept=".jpg, .png, .gif">
                <Button icon="ios-cloud-upload-outline" :loading="uploadLoading" @click="handleUploadFile">上传文件</Button>
              </Upload>
            </Col>
            <Col span="22">
              <Input @on-change="handleClear" clearable placeholder="输入名称搜索" class="search-input" v-model="formData.searchPhrase"/>
              <Button @click="handleSearch" class="search-btn" type="primary"><Icon type="md-search"/>&nbsp;&nbsp;搜索</Button>
            </Col>
          </Row>

        </div>
        <tables
        ref="tables"
        editable
        search-place="top" v-model="tableData.list" :columns="columns"/>
        <div style="padding-top: 15px;">
            <Page :total="tableData.total" :current="tableData.pageNum" :page-size="formData.pageSize" @on-change="changePage" show-total></Page>
        </div>
      </Card>

    <Modal
      v-model="modelShow"
      :title="modelTitle"
      :mask-closable="false">
      <img :src="viewUrl">

    </Modal>
  </div>
</template>
<script>
import Tables from '_c/tables'
import axios from '@/libs/api.request'
import Global from '@/store/global'
export default {
  name: 'Banner',
  components: {
    Tables
  },
  data () {
    let _ths = this
    return {
      formData: {
        pageNum: 1, // 当前页
        pageSize: 10, // 一页展示数量
        searchPhrase: ''
      },
      columns: [
        {
          title: '名称',
          align: 'center',
          key: 'name'
        },
        {
          title: '地址',
          align: 'center',
          key: 'path'
        },
        {
          title: '类型',
          align: 'center',
          key: 'type'
        },
        {
          title: '大小',
          align: 'center',
          key: 'size',
          render: function render (h, params) {
            // console.log(params.row)
            let content = params.row.size + ' KB'
            return h('span', content)
          }
        },
        {
          title: '备注',
          align: 'center',
          key: 'remark'
        },
        {
          title: '状态',
          align: 'center',
          key: 'isView',
          width: 80,
          render: function render (h, params) {
            // console.log(params.row)
            let content = ''
            let isView = params.row.isView + ''
            if (isView === '1') {
              content = '展示'
            } else {
              content = '不展示'
            }
            return h('span', content)
          }
        },
        {
          title: '操作',
          align: 'center',
          key: 'operation',
          width: 220,
          render: function render (h, params) {
            let isView = params.row.isView
            return h('div', [h('Button', {
              props: {
                type: 'error',
                icon: 'ios-trash-outline',
                disabled: false,
                size: 'small'
              },
              style: {
                marginLeft: '10px',
                marginBottom: '5px',
                display: isView === 1 ? 'none' : ''
              },
              on: {
                click: () => {
                  _ths.handleDelete(params)
                }
              }
            }, '删除'), h('Button', {
              props: {
                type: 'primary',
                icon: isView === 1 ? 'ios-arrow-dropdown' : 'ios-arrow-dropup',
                disabled: false,
                size: 'small'
              },
              style: {
                marginLeft: '10px',
                marginBottom: '5px'
              },
              on: {
                click: () => {
                  _ths.handleIsView(params.row.id, isView === 1 ? 0 : 1)
                }
              }
            }, isView === 1 ? '隐藏' : '展示'), h('Button', {
              props: {
                type: 'primary',
                icon: 'ios-create-outline',
                disabled: false,
                size: 'small'
              },
              style: {
                marginLeft: '10px',
                marginBottom: '5px'
              },
              on: {
                click: () => {
                  _ths.handleView(params.row.path, params.row.name)
                  // window.open(params.row.viewUrl)
                }
              }
            }, '查看')])
          }
        }
      ],
      tableData: {
        list: [],
        pageNum: 1,
        total: 0,
        pages: 0
      },
      formItem: {},
      modelShow: false,
      modelTitle: '',
      msgTitle: '',
      viewUrl: '',
      uploadLoading: false
    }
  },
  mounted () {
    this.getTablePageData()
  },
  methods: {
    handleBeforeUpload (file) {
      const _this = this
      const fileExt = file.name.split('.').pop().toLocaleLowerCase()
      if (fileExt === 'jpg' || fileExt === 'png' || fileExt === 'gif') {
        let fileFormData = new FormData()
        fileFormData.append('file', file)
        const option = {
          url: '/banner/uploadBanner',
          data: fileFormData,
          method: 'post',
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
        axios.request(option).then(res => {
          console.log(res)
          _this.getTablePageData()
        }).catch(res => {
          _this.uploadLoading = false
        })
      } else {
        _this.uploadLoading = false
        this.$Notice.warning({
          title: '文件类型错误',
          desc: '文件：' + file.name + '不是图片。'
        })
      }
      return false
    },
    handleUploadFile () {
      this.getTablePageData()
    },
    getTablePageData () {
      const option = {
        url: '/banner/getBannerPageList',
        data: this.formData,
        method: 'post'
      }
      axios.request(option).then(res => {
        console.log(res)
        this.tableData.list = res.data.data.list
        this.tableData.pageNum = res.data.data.pageNum
        this.tableData.total = res.data.data.total
        this.tableData.pages = res.data.data.pages
      })
    },
    // 翻页钩子
    changePage (page) {
      this.formData.pageNum = page
      this.getTablePageData()
    },
    handleClear (e) {

    },
    handleSearch () {
      this.getTablePageData()
    },
    handleIsView (bannerId, isView) {

      this.msgTitle = isView === 1 ? '展示轮播图成功' : '隐藏轮播图成功'
      this.$Modal.confirm({
        title: isView === 1 ? '展示' : '隐藏',
        content: isView === 1 ? '你确定要展示吗?' : '你确定要隐藏吗?',
        loading: true,
        onOk: () => {
          this.viewData(bannerId, isView)
        }
      })
    },
    handleView (path, name) {
      this.modelShow = true
      this.modelTitle = '查看轮播图'
      this.viewUrl = Global.resourcesBasePath + path + name
    },
    handleDelete (params) {
      this.msgTitle = '删除权限信息成功'
      this.$Modal.confirm({
        title: '删除',
        content: '你确定要删除吗?',
        loading: true,
        onOk: () => {
          this.deleteData(params.row.id)
        }
      })
    },
    modelCancel () {
      this.modelShow = false
      this.$Modal.remove()
    },
    viewData (bannerId, isView) {
      const _this = this
      axios.request({
        url: '/banner/viewBanner?bannerId=' + bannerId + '&isView=' + isView,
        method: 'get'
      }).then(res => {
        _this.$Modal.remove()
        if (res.data.code === 200) {
          _this.$Message.success(_this.msgTitle)
          _this.getTablePageData()
        } else if (res.data.code === 302) {
          _this.$Message.error(res.data.msg)
        } else {
          _this.$Message.error('网络异常，请稍后重试')
        }
      })
    },
    deleteData (id) {
      const _this = this
      axios.request({
        url: '/banner/deleteBanner/' + id,
        method: 'delete'
      }).then(res => {
        _this.$Modal.remove()
        if (res.data.code === 200) {
          _this.$Message.success(_this.msgTitle)
          _this.getTablePageData()
        } else if (res.data.code === 302) {
          _this.$Message.error(res.data.msg)
        } else {
          _this.$Message.error('网络异常，请稍后重试')
        }
      })
    }
  }
}
</script>
