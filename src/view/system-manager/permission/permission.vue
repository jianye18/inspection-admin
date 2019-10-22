<style>
  .ivu-table-cell{
    padding:  0px;
  }
</style>
<template>
  <div>
      <Card>
        <div class="search-con search-con-top">
            <Button @click="handleAddData" class="search-btn" type="primary"><Icon type="md-add"/>&nbsp;&nbsp;新增权限</Button>
            <Input @on-change="handleClear" clearable placeholder="输入权限名搜索" class="search-input" v-model="formData.searchPhrase"/>
            <Button @click="handleSearch" class="search-btn" type="primary"><Icon type="md-search"/>&nbsp;&nbsp;搜索</Button>
        </div>
        <tables
        ref="tables"
        editable
        searchable: false
        search-place="top" v-model="tableData.list" :columns="columns"/>
        <div style="padding-top: 15px;">
            <Page :total="tableData.total" :current="tableData.pageNum" :page-size="formData.pageSize" @on-change="changePage" show-total></Page>
        </div>
      </Card>
      <Modal
        v-model="modelShow"
        :title="modelTitle"
        :mask-closable="false">
        <Form ref="formItem" :model="formItem" :rules="ruleValidate" :label-width="80" action="">
            <FormItem label="权限名" prop="name">
                <Input placeholder="请输入权限名" v-model="formItem.name"/>
            </FormItem>
            <FormItem label="权限编码" prop="code">
                <Input placeholder="请输入权限编码" v-model="formItem.code"/>
            </FormItem>
            <FormItem label="描述" prop="description">
                <Input placeholder="请输入权限描述" v-model="formItem.description"/>
            </FormItem>
            <FormItem label="上级" prop="parentId">
              <Select v-model="formItem.parentId">
                <Option value="" key="">请选择</Option>
                <Option v-for="item in parentList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
            <FormItem label="类型" prop="type">
              <Select v-model="formItem.type">
                <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
            <FormItem label="请求地址" prop="requestUrl">
              <Input placeholder="请输入请求地址" v-model="formItem.requestUrl"/>
            </FormItem>
            <FormItem label="请求类型" prop="requestType">
              <Select v-model="formItem.requestType">
                <Option v-for="item in requestTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
            <FormItem label="图标" prop="iconClass">
              <Input placeholder="请输入图标样式" v-model="formItem.iconClass"/>
            </FormItem>
            <FormItem label="排序" prop="sort">
              <Select v-model="formItem.sort">
                <Option v-for="item in 10" :value="item" :key="item">{{ item }}</Option>
              </Select>
            </FormItem>
            <FormItem label="状态" prop="status">
              <RadioGroup v-model="formItem.status">
                <Radio label="1">启用</Radio>
                <Radio label="2">禁用</Radio>
              </RadioGroup>
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
export default {
  name: 'tables_page',
  components: {
    Tables
  },
  data () {
    var _ths = this
    return {
      modelShow: false,
      formData: {
        pageNum: 1, // 当前页
        pageSize: 10, // 一页展示数量
        searchPhrase: ''
      },
      parentList: [],
      typeList: [
        {
          value: '',
          label: '请选择'
        },
        {
          value: '1',
          label: 'page'
        },
        {
          value: '2',
          label: 'link'
        },
        {
          value: '3',
          label: 'button'
        }
      ],
      requestTypeList: [
        {
          value: '',
          label: '请选择'
        },
        {
          value: 'POST',
          label: 'POST'
        },
        {
          value: 'GET',
          label: 'GET'
        },
        {
          value: 'PUT',
          label: 'PUT'
        },
        {
          value: 'DELETE',
          label: 'DELETE'
        }
      ],
      columns: [
        {
          title: '权限名',
          align: 'center',
          key: 'name'
        },
        {
          title: '权限编码',
          align: 'center',
          key: 'code'
        },
        {
          title: '上级菜单',
          align: 'center',
          key: 'parentId',
          render: function render (h, params) {
            // console.log(params.row)
            var content = ''
            if (params.row.parentId === 2) {
              content = '用户管理'
            } else if (params.row.parentId === 3) {
              content = '角色管理'
            } else if (params.row.parentId === 4) {
              content = '权限管理'
            } else {
              content = '——'
            }
            return h('span', content)
          }
        },
        {
          title: '权限类型',
          align: 'center',
          key: 'type',
          width: 110,
          render: function render (h, params) {
            // console.log(params.row)
            var content = ''
            if (params.row.type === 1) {
              content = 'page'
            } else if (params.row.type === 2) {
              content = 'link'
            } else {
              content = 'button'
            }
            return h('span', content)
          }
        },
        {
          title: '请求地址',
          align: 'center',
          key: 'requestUrl',
          width: 320
        },
        {
          title: '请求类型',
          align: 'center',
          key: 'requestType',
          width: 100,
          render: function render (h, params) {
            // console.log(params.row)
            var content = ''
            if (params.row.requestType === null) {
              content = '——'
            } else {
              content = params.row.requestType
            }
            return h('span', content)
          }
        },
        {
          title: '图标',
          align: 'center',
          key: 'iconClass'
        },
        {
          title: '描述',
          align: 'center',
          key: 'description'
        },
        {
          title: '排序',
          align: 'center',
          key: 'sort',
          width: 60
        },
        {
          title: '状态',
          align: 'center',
          key: 'status',
          width: 80,
          render: function render (h, params) {
            // console.log(params.row)
            var content = ''
            if (params.row.status === 1) {
              content = '启用'
            } else {
              content = '禁用'
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
      ruleValidate: {
        name: [
          { required: true, message: '权限名不能为空', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '权限编码不能为空', trigger: 'blur' }
        ],
        parentId: [
          { required: true, message: '上级权限不能为空', trigger: 'change' }
        ]
      },
      modelTitle: '',
      msgTitle: '',
      modelButtonLoading: false,
      member: '0'
    }
  },
  mounted () {
    this.getTablePageData()
    this.getPermissionWithPageType()
  },
  methods: {
    getPermissionWithPageType () {
      const option = {
        url: '/permission/getPermissionWithPageType',
        method: 'get'
      }
      axios.request(option).then(res => {
        this.parentList = res.data.data
      })
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
      this.formItem = {
        name: '用户新增',
        code: 'user_add',
        description: '测试',
        parentId: '',
        type: '',
        requestUrl: '/user/saveUser',
        requestType: '',
        iconClass: 'md-contact',
        sort: '1',
        status: '1'
      }
      this.modelShow = true
      this.$refs['formItem'].resetFields()
      this.modelTitle = '新增权限'
      this.msgTitle = '新增权限信息成功'
    },
    handleEditor (params) {
      this.formItem = params.row
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
