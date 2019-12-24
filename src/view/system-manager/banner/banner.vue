<style>
  .ivu-table-cell{
    padding:  0px;
  }
  .ivu-table-body {
    overflow: hidden !important;
  }
</style>
<template>
  <div>
      <Card>
        <div class="search-con search-con-top">
          <Button @click="handleAddData" class="search-btn" type="primary"><Icon type="md-add"/>&nbsp;&nbsp;新增轮播图</Button>
          <Input @on-change="handleClear" clearable placeholder="输入名称搜索" class="search-input" v-model="formData.searchPhrase"/>
          <Button @click="handleSearch" class="search-btn" type="primary"><Icon type="md-search"/>&nbsp;&nbsp;搜索</Button>
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
      <Form ref="formItem" :model="formItem" :label-width="80" action="">
        <FormItem label="链接地址" prop="link">
          <Input placeholder="请输入链接地址" v-model="formItem.link"/>
        </FormItem>
        <FormItem label="轮播图" prop="path">
          <Upload action="" :before-upload="handleBeforeUpload" accept=".jpg, .png, .gif">
            <Button icon="ios-cloud-upload-outline" :loading="uploadLoading" @click="handleUploadFile">上传文件</Button>
          </Upload>
          <img v-if="viewUrl" :src="viewUrl"/>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="default" size="large" @click="modelCancel">取消</Button>
        <Button type="primary" size="large" @click="saveFormData" :loading="modelButtonLoading">確定</Button>
      </div>
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
          width: 80,
          key: 'path'
        },
        {
          title: '类型',
          align: 'center',
          width: 100,
          key: 'type'
        },
        {
          title: '大小',
          align: 'center',
          key: 'size',
          width: 80,
          render: function render (h, params) {
            // console.log(params.row)
            let content = params.row.size + ' KB'
            return h('span', content)
          }
        },
        {
          title: '链接地址',
          align: 'center',
          key: 'link',
          render: function render (h, params) {
            // console.log(params.row)
            let content = ''
            let link = params.row.link
            if (link) {
              content = link
            } else {
              content = '-'
            }
            return h('span', content)
          }
        },
        {
          title: '备注',
          align: 'center',
          key: 'remark',
          render: function render (h, params) {
            // console.log(params.row)
            let content = ''
            let remark = params.row.remark
            if (remark) {
              content = remark
            } else {
              content = '-'
            }
            return h('span', content)
          }
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
          width: 180,
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
                  _ths.handleView(params.row)
                  // window.open(params.row.viewUrl)
                }
              }
            }, '编辑')])
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
          _this.formItem.oldBannerName = _this.formItem.name ? res.data.data.name : ''
          _this.formItem.name = res.data.data.name
          _this.formItem.path = res.data.data.path
          _this.formItem.size = res.data.data.size
          _this.formItem.type = res.data.data.type
          // _this.getTablePageData()
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
    handleAddData () {
      this.formItem = {}
      this.modelShow = true
      this.modelTitle = '新增轮播图'
      this.msgTitle = '新增轮播图成功'
    },
    handleUploadFile () {
      // this.getTablePageData()
    },
    saveFormData () {
      const _this = this
      _this.modelButtonLoading = true
      let postForm = JSON.parse(JSON.stringify(_this.formItem))
      axios.request({
        url: '/banner/saveBanner',
        data: postForm,
        method: 'post'
      }).then(res => {
        // console.log(res)
        setTimeout(function () {
          _this.modelButtonLoading = false
          if (res.data.code === 200) {
            _this.$Message.success(_this.msgTitle)
            _this.modelShow = false
            _this.getTablePageData()
          } else {
            _this.$Message.error('网络异常，请稍后重试')
          }
        }, 1500)
      }).catch(res => {
        _this.modelButtonLoading = false
      })
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
      this.formData.pageNum = 1
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
    handleView (row) {
      this.formItem = JSON.parse(JSON.stringify(row))
      console.log(this.formItem)
      this.modelShow = true
      this.modelTitle = '编辑轮播图'
      this.viewUrl = Global.resourcesBasePath + this.formItem.path + this.formItem.name
    },
    handleDelete (params) {
      this.msgTitle = '删除轮播图成功'
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
