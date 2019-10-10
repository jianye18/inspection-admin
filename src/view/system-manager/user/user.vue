<style>
  .ivu-table-cell{
    padding:  0px;
  }
</style>
<template>
  <div>
      <Card>
        <div class="search-con search-con-top">
            <Button @click="handleAddData" class="search-btn" type="primary"><Icon type="md-add"/>&nbsp;&nbsp;新增用户</Button>
            <Input @on-change="handleClear" clearable placeholder="输入用户名搜索" class="search-input" v-model="formData.searchPhrase"/>
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
            <FormItem label="用户名" prop="loginName">
                <Input placeholder="请输入用户名" v-model="formItem.loginName"/>
            </FormItem>
            <FormItem label="性别" prop="gender">
                <RadioGroup v-model="formItem.gender">
                    <Radio label="0">男</Radio>
                    <Radio label="1">女</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="手机号" prop="mobile">
                <Input placeholder="请输入手机号" v-model="formItem.mobile"/>
            </FormItem>
            <FormItem label="邮箱" prop="email">
                <Input type="email" placeholder="请输入邮箱" v-model="formItem.email"/>
            </FormItem>
            <FormItem label="地址" prop="address">
                <Input placeholder="请输入地址" type="textarea" :autosize="{minRows: 2,maxRows: 5}" v-model="formItem.address"/>
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
import {getTableData, saveSysUser, deleteSysUser} from '@/api/data'
export default {
  name: 'tables_page',
  components: {
    Tables
  },
  data () {
    var _ths = this
    const validateMobile = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('手机号不能为空'))
      } else {
        var mobileRegexp = /^1[345789]\d{9}$/
        // 验证手机号码的正确性
        if (!mobileRegexp.test(value)) {
          callback(new Error('手机号不正确'))
        }
        callback()
      }
    }
    return {
      modelShow: false,
      formData: {
        current: 1, // 当前页
        pageSize: 10, // 一页展示数量
        searchPhrase: ''
      },
      columns: [
        {
          title: '用户名',
          align: 'center',
          key: 'loginName'
        },
        {
          title: '性别',
          align: 'center',
          key: 'gender',
          render: function render (h, params) {
            // console.log(params.row)
            var content = ''
            if (params.row.gender === 0) {
              content = '男'
            } else {
              content = '女'
            }
            return h('span', content)
          }
        },
        {
          title: '手机号',
          align: 'center',
          key: 'mobile'
        },
        {
          title: '邮箱',
          align: 'center',
          key: 'email'
        },
        {
          title: '地址',
          align: 'center',
          key: 'address'
        },
        {
          title: '状态',
          align: 'center',
          key: 'status',
          render: function render (h, params) {
            // console.log(params.row)
            var content = ''
            if (params.row.status === 1) {
              content = '正常'
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
        // {
        //     title: '操作',
        //     key: 'handle',
        //     options: ['delete'],
        //     button: [
        //         (h, params, vm) => {
        //             return h('Poptip', {
        //                 props: {
        //                     confirm: true,
        //                     title: '你确定要删除吗?'
        //                 },
        //                 on: {
        //                     'on-ok': () => {
        //                         //vm.$emit('on-delete', params)
        //                         //vm.$emit('input', params.tableData.filter((item, index) => index !== params.row.initRowIndex))
        //                         alert('删除！');
        //                     }
        //                 }
        //             })
        //         }
        //     ]
        // }
      ],
      tableData: {
        list: [],
        pageNum: 1,
        total: 0,
        pages: 0
      },
      formItem: {},
      ruleValidate: {
        loginName: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        gender: [
          { required: true, message: '请选择性别', trigger: 'change' }
        ],
        mobile: [
          { required: true, validator: validateMobile, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '地址不能为空', trigger: 'blur' }
        ]
      },
      modelTitle: '',
      msgTitle: '',
      modelButtonLoading: false
    }
  },
  mounted () {
    this.getTablePageData()
  },
  methods: {
    getTablePageData () {
      getTableData(this.formData).then(res => {
        console.log(res)
        this.tableData.list = res.data.data.records
        this.tableData.pageNum = res.data.data.current
        this.tableData.total = res.data.data.total
        this.tableData.pages = res.data.data.pages
      })
    },
    // 翻页钩子
    changePage (page) {
      this.formData.current = page
      this.getTablePageData()
    },
    handleClear (e) {

    },
    handleSearch () {
      console.log(this.formData.searchPhrase)
      this.getTablePageData()
    },
    handleAddData () {
      this.formItem = {gender: '0'}
      this.modelShow = true
      this.$refs['formItem'].resetFields()
      this.modelTitle = '新增用戶'
      this.msgTitle = '新增用戶信息成功'
    },
    handleEditor (params) {
      this.formItem = {
        id: params.row.id,
        loginName: params.row.loginName,
        gender: '' + params.row.gender,
        mobile: params.row.mobile,
        email: params.row.email,
        address: params.row.address,
        status: params.row.status,
        password: params.row.password
      }
      this.modelShow = true
      this.modelTitle = '编辑用戶'
      this.msgTitle = '修改用戶信息成功'
    },
    handleDelete (params) {
      console.log(params.row.id)
      this.msgTitle = '删除用戶信息成功'
      this.$Modal.confirm({
        title: '删除',
        content: '你确定要删除吗?',
        loading: true,
        onOk: () => {
          this.deleteSysUser(params.row.id)
        }
      })
    },
    modelCancel () {
      this.modelShow = false
      this.$Modal.remove()
    },
    saveFormData () {
      var _this = this
      _this.$refs['formItem'].validate(function (valid) {
        if (valid) {
          // alert('保存用户信息');
          _this.modelButtonLoading = true
          saveSysUser(_this.formItem).then(res => {
            // console.log(res)
            setTimeout(function () {
              _this.modelButtonLoading = false
              if (res.data.code === 0) {
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
          })
        } else {

        }
      })
    },
    deleteSysUser (id) {
      var _this = this
      deleteSysUser({id: id}).then(res => {
        _this.$Modal.remove()
        if (res.data.code === 0) {
          _this.$Message.success(_this.msgTitle)
          _this.getTablePageData()
        } else if (res.data.code === 1003) {
          _this.$Message.error(res.data.msg)
        } else {
          _this.$Message.error('网络异常，请稍后重试')
        }
      })
    }
  }
}
</script>
