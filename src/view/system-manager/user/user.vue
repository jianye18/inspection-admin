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
            <FormItem label="用户名" prop="userName">
                <Input placeholder="请输入用户名" v-model="formItem.userName"/>
            </FormItem>
            <FormItem label="昵称" prop="nickName">
                <Input placeholder="请输入登录名" v-model="formItem.nickName"/>
            </FormItem>
            <FormItem label="性别" prop="gender">
                <RadioGroup v-model="formItem.gender">
                    <Radio label="1">男</Radio>
                    <Radio label="2">女</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="手机号" prop="mobile">
                <Input placeholder="请输入手机号" v-model="formItem.mobile"/>
            </FormItem>
            <FormItem label="邮箱" prop="email">
                <Input type="email" placeholder="请输入邮箱" v-model="formItem.email"/>
            </FormItem>
            <FormItem label="工作单位" prop="workPlace">
                <Input placeholder="请输入工作单位" v-model="formItem.workPlace"/>
            </FormItem>
            <FormItem label="职务" prop="job">
                <Input placeholder="请输入职务" v-model="formItem.job"/>
            </FormItem>
            <FormItem label="角色" prop="roleId">
              <Select v-model="roleIds" multiple>
                <Option v-for="item in roleList" :value="item.id" :key="item.id">{{ item.roleName }}</Option>
              </Select>
            </FormItem>
            <FormItem label="会员" prop="member">
              <RadioGroup v-model="member">
                <Radio label="1">是</Radio>
                <Radio label="0">否</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="到期时间" prop="expireTime" v-if="member == 1">
              <DatePicker type="date" format="yyyy-MM-dd" placeholder="请选择会员到期时间" v-model="formItem.expireTime" style="width:200px"></DatePicker>
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
import {getTableData, saveUser, deleteUser, getUser, getAllRoleList, getUserRoleListByUserId} from '@/api/user'
import { getDate, judgeDataIsEmpty } from '@/libs/tools'
export default {
  name: 'tables_page',
  components: {
    Tables
  },
  data () {
    const _ths = this
    const validateMobile = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('手机号不能为空'))
      } else {
        let mobileRegexp = /^1[345789]\d{9}$/
        // 验证手机号码的正确性
        if (!mobileRegexp.test(value)) {
          callback(new Error('手机号不正确'))
        }
        callback()
      }
    }
    const validateNickName = (rule, value, callback) => {
      console.log(rule)
      if (value === '') {
        callback(new Error('昵称不能为空'))
      } else {
        getUser(value, _ths.currentUerId).then(res => {
          if (res.data.code === 200) {
            callback(new Error('用户名已存在'))
          } else {
            callback()
          }
        })
      }
    }
    return {
      modelShow: false,
      formData: {
        pageNum: 1, // 当前页
        pageSize: 10, // 一页展示数量
        searchPhrase: ''
      },
      columns: [
        {
          title: '用户名',
          align: 'center',
          key: 'userName'
        },
        {
          title: '昵称',
          align: 'center',
          key: 'nickName'
        },
        {
          title: '性别',
          align: 'center',
          key: 'gender',
          width: 60,
          render: function render (h, params) {
            // console.log(params.row)
            let content = ''
            let gender = params.row.gender + ''
            if (gender === '1') {
              content = '男'
            } else if (gender === '2') {
              content = '女'
            }
            return h('span', content)
          }
        },
        {
          title: '手机号',
          align: 'center',
          key: 'mobile',
          width: 120
        },
        {
          title: '邮箱',
          align: 'center',
          key: 'email'
        },
        {
          title: '工作单位',
          align: 'center',
          key: 'workPlace'
        },
        {
          title: '职务',
          align: 'center',
          key: 'job'
        },
        {
          title: '会员',
          align: 'center',
          key: 'isMember',
          width: 60,
          render: function render (h, params) {
            // console.log(params.row)
            let content = ''
            if (params.row.isMember === 1) {
              content = '是'
            } else {
              content = '否'
            }
            return h('span', content)
          }
        },
        {
          title: '到期时间',
          align: 'center',
          key: 'expireTime',
          render: function render (h, params) {
            let content = ''
            if (params.row.expireTime == null) {
              content = '——'
            } else {
              content = params.row.expireTime
            }
            return h('span', content)
          }
        },
        {
          title: '角色',
          align: 'center',
          key: 'roleNames'
        },
        {
          title: '状态',
          align: 'center',
          key: 'userStatus',
          width: 80,
          render: function render (h, params) {
            // console.log(params.row)
            let content = ''
            if (params.row.userStatus === 1) {
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
      formItem: {
        gender: '1',
        isMember: '0',
        roleIds: ''
      },
      ruleValidate: {
        userName: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        nickName: [
          { required: true, validator: validateNickName, trigger: 'blur' }
        ],
        gender: [
          { required: true, message: '请选择性别', trigger: 'change' }
        ],
        mobile: [
          { required: true, validator: validateMobile, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' }
        ]
      },
      modelTitle: '',
      msgTitle: '',
      modelButtonLoading: false,
      currentUerId: 0,
      member: '0',
      roleList: [],
      roleIds: []
    }
  },
  mounted () {
    this.getTablePageData()
  },
  watch: {
    member: function (val) {
      this.formItem.isMember = val
      if (val === '1' && (judgeDataIsEmpty(this.formItem.expireTime))) {
        this.formItem.expireTime = getDate(new Date().getTime(), 'year', false) + ' 23:59:59'
      }
      if (val === '0') {
        this.formItem.expireTime = ''
      }
      console.log(this.formItem.expireTime)
    }
  },
  methods: {
    getTablePageData () {
      getTableData(this.formData).then(res => {
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
      this.currentUerId = 0
      this.getAllRoleList()
      this.modelShow = true
      this.$refs['formItem'].resetFields()
      this.modelTitle = '新增用戶'
      this.msgTitle = '新增用戶信息成功'
    },
    handleEditor (params) {
      this.currentUerId = params.row.id
      this.getAllRoleList()
      this.getUserRoleListByUserId()
      this.formItem = JSON.parse(JSON.stringify(params.row))
      this.formItem.gender = this.formItem.gender + ''
      this.formItem.isMember = this.formItem.isMember + ''
      this.member = this.formItem.isMember + ''
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
          // alert('保存用户信息');
          _this.modelButtonLoading = true
          _this.formItem.expireTime = getDate(new Date(_this.formItem.expireTime).getTime(), 'year', true)
          _this.formItem.roleIds = _this.roleIds.join(',')
          console.log(_this.formItem)
          saveUser(_this.formItem).then(res => {
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
      deleteUser(id).then(res => {
        _this.$Modal.remove()
        if (res.data.code === 200) {
          _this.$Message.success(_this.msgTitle)
          _this.getTablePageData()
        } else if (res.data.code === 1003) {
          _this.$Message.error(res.data.msg)
        } else {
          _this.$Message.error('网络异常，请稍后重试')
        }
      })
    },
    getAllRoleList () {
      const _this = this
      _this.roleList = []
      getAllRoleList().then(res => {
        if (res.data.code === 200) {
          _this.roleList = res.data.data
        } else {
          _this.$Message.error('网络异常，请稍后重试')
        }
      })
    },
    getUserRoleListByUserId () {
      const _this = this
      _this.roleIds = []
      getUserRoleListByUserId(_this.currentUerId).then(res => {
        if (res.data.code === 200) {
          res.data.data.forEach(function (item) {
            _this.roleIds.push(item.roleId)
          })
        } else {
          _this.$Message.error('网络异常，请稍后重试')
        }
      })
    }
  }
}
</script>
