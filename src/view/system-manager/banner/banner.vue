<style>
  .ivu-table-cell{
    padding:  0px;
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
  </div>
</template>
<script>
import Tables from '_c/tables'
import axios from '@/libs/api.request'
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
          width: 160,
          render: function render (h, params) {
            return h('div', [h('Button', {
              props: {
                type: 'error',
                icon: 'ios-trash-outline',
                disabled: false,
                size: 'small'
              },
              style: {
                marginLeft: '10px',
                marginBottom: '5px'
              },
              on: {
                click: () => {
                  _ths.handleDelete(params)
                }
              }
            }, '删除'), h('Button', {
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
                  _ths.handleEditor(params)
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
      msgTitle: '',
      uploadLoading: false
    }
  },
  mounted () {
    this.getTablePageData()
    this.getPermissionWithPageType()
  },
  methods: {
    handleBeforeUpload (file) {
      const _this = this
      const fileExt = file.name.split('.').pop().toLocaleLowerCase()
      if (fileExt === 'jpg' || fileExt === 'png' || fileExt === 'gif') {
        let fileFormData = new FormData()
        fileFormData.append('file', file)
        const option = {
          url: '/api/banner/upload',
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
        url: '/permission/getPermissionPageList',
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
    handleAddData () {
      this.modelShow = true
      this.$refs['formItem'].resetFields()
      this.modelTitle = '新增权限'
      this.msgTitle = '新增权限信息成功'
    },
    handleEditor (params) {
      this.formItem = JSON.parse(JSON.stringify(params.row))
      this.formItem.status = this.formItem.status + ''
      this.formItem.parentId = this.formItem.parentId + ''
      this.formItem.type = this.formItem.type + ''
      this.modelShow = true
      this.modelTitle = '编辑权限'
      this.msgTitle = '修改权限信息成功'
    },
    handleDelete (params) {
      console.log(params.row.id)
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
    saveFormData () {
      const _this = this
      _this.$refs['formItem'].validate(function (valid) {
        if (valid) {
          _this.modelButtonLoading = true
          console.log(_this.formItem)
          axios.request({
            url: '/permission/savePermission',
            data: _this.formItem,
            method: 'post'
          }).then(res => {
            // console.log(res)
            setTimeout(function () {
              _this.modelButtonLoading = false
              if (res.data.code === 200) {
                _this.$Message.success(_this.msgTitle)
                _this.modelShow = false
                // _this.$Modal.remove();
                _this.getTablePageData()
              } else if (res.data.code === 1002) {
                _this.$Message.error(res.data.msg)
              } else {
                _this.$Message.error('网络异常，请稍后重试')
              }
            }, 1500)
          }).catch(res => {
            _this.modelButtonLoading = false
          })
        }
      })
    },
    deleteData (id) {
      const _this = this
      axios.request({
        url: '/permission/deletePermission/' + id,
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
