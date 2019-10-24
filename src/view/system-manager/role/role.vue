<style>
  .ivu-table-cell{
    padding:  0px;
  }
</style>
<template>
  <div>
      <Card>
        <div class="search-con search-con-top">
            <Button @click="handleAddData" class="search-btn" type="primary"><Icon type="md-add"/>&nbsp;&nbsp;新增角色</Button>
            <Input @on-change="handleClear" clearable placeholder="输入角色名搜索" class="search-input" v-model="formData.searchPhrase"/>
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
            <FormItem label="角色名" prop="roleName">
                <Input placeholder="请输入角色名" v-model="formItem.roleName"/>
            </FormItem>
            <FormItem label="角色编码" prop="roleCode">
                <Input placeholder="请输入登录名" v-model="formItem.roleCode"/>
            </FormItem>
            <FormItem label="描述" prop="description">
                <Input placeholder="请输入角色描述" v-model="formItem.description"/>
            </FormItem>
            <FormItem label="状态" prop="roleStatus">
              <RadioGroup v-model="formItem.roleStatus">
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
      <Modal
        v-model="permissionModelShow"
        title="绑定权限"
        :mask-closable="false"
        width="280">
        <div style="text-align: center">
          <Tree :data="permissionTreeData" @on-check-change="initPermissionData" show-checkbox multiple></Tree>
        </div>
        <div slot="footer">
          <Button type="default" size="large" @click="modelCancel">取消</Button>
          <Button type="primary" size="large" @click="saveRolePermission" :loading="modelButtonLoading">確定</Button>
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
      columns: [
        {
          title: '角色名',
          align: 'center',
          key: 'roleName',
          width: 100
        },
        {
          title: '角色编码',
          align: 'center',
          key: 'roleCode',
          width: 120
        },
        {
          title: '描述',
          align: 'center',
          key: 'description'
        },
        {
          title: '状态',
          align: 'center',
          key: 'roleStatus',
          width: 120,
          render: function render (h, params) {
            // console.log(params.row)
            var content = ''
            let roleStatus = params.row.roleStatus + ''
            if (roleStatus === '1') {
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
          width: 240,
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
            }, '编辑'), h('Button', {
              props: {
                type: 'primary',
                icon: 'ios-construct',
                disabled: false,
                size: 'small'
              },
              style: {
                marginLeft: '10px',
                marginBottom: '5px'
              },
              on: {
                click: () => {
                  _ths.handlePermission(params.row.id)
                }
              }
            }, '权限')])
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
        roleName: [
          { required: true, message: '角色名不能为空', trigger: 'blur' }
        ],
        roleCode: [
          { required: true, message: '角色编码不能为空', trigger: 'blur' }
        ]
      },
      modelTitle: '',
      msgTitle: '',
      modelButtonLoading: false,
      member: '0',
      currentRoleId: null,
      permissionModelShow: false,
      permissionTreeData: [],
      permissionIds: ''
    }
  },
  mounted () {
    this.getTablePageData()
  },
  methods: {
    getTablePageData () {
      const option = {
        url: '/role/getRolePageList',
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
        roleName: '管理员',
        roleCode: 'sys-admin',
        description: '测试',
        roleStatus: '1'
      }
      this.modelShow = true
      this.$refs['formItem'].resetFields()
      this.modelTitle = '新增角色'
      this.msgTitle = '新增角色信息成功'
    },
    handleEditor (params) {
      this.formItem = params.row
      this.formItem.roleStatus = this.formItem.roleStatus + ''
      this.modelShow = true
      this.modelTitle = '编辑角色'
      this.msgTitle = '修改角色信息成功'
    },
    handleDelete (params) {
      console.log(params.row.id)
      this.msgTitle = '删除角色信息成功'
      this.$Modal.confirm({
        title: '删除',
        content: '你确定要删除吗?',
        loading: true,
        onOk: () => {
          this.deleteData(params.row.id)
        }
      })
    },
    handlePermission (roleId) {
      this.currentRoleId = roleId
      this.permissionIds = ''
      this.permissionTreeData = []
      this.getPermissionTreeData()
      this.permissionModelShow = true
    },
    modelCancel () {
      this.modelShow = false
      this.permissionModelShow = false
      this.$Modal.remove()
    },
    saveFormData () {
      const _this = this
      _this.$refs['formItem'].validate(function (valid) {
        if (valid) {
          _this.modelButtonLoading = true
          console.log(_this.formItem)
          axios.request({
            url: '/role/saveRole',
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
        url: '/role/deleteRole/' + id,
        method: 'delete'
      }).then(res => {
        _this.$Modal.remove()
        if (res.data.code === 200) {
          _this.$Message.success(_this.msgTitle)
          _this.getTablePageData()
        } else if (res.data.code === 301) {
          _this.$Message.error(res.data.msg)
        } else {
          _this.$Message.error('网络异常，请稍后重试')
        }
      })
    },
    getPermissionTreeData () {
      const _this = this
      axios.request({
        url: '/permission/getPermissionTreeData/' + _this.currentRoleId,
        method: 'get'
      }).then(res => {
        if (res.data.code === 200) {
          _this.permissionTreeData = res.data.data
          console.log(_this.permissionTreeData)
        } else {
          _this.$Message.error('网络异常，请稍后重试')
        }
      })
    },
    initPermissionData (nodes) {
      const _this = this
      // console.log(nodes)
      // 循环执行所有选中的节点链，放到arr1数组里
      let arr = []
      for (let i = 0; i < nodes.length; i++) {
        // 单条数据链
        let aData = _this.getTreeParentData(_this.permissionTreeData, [], nodes[i].id) // 方法入口在这里
        // console.log(aData)
        for (let y = 0; y < aData.length; y++) {
          // 拆分成单个json数组放到arr1里
          arr.push(aData[y])
        }
      }
      console.log(Array.from(new Set(arr)))
      _this.permissionIds = Array.from(new Set(arr)).join(',')
    },
    getTreeParentData (array, childs, ids) {
      const _this = this
      for (let i = 0; i < array.length; i++) {
        let item = array[i]
        if (Number(item.id) === Number(ids)) {
          childs.push(item.id)
          return childs
        }
        if (item.children && item.children.length > 0) {
          childs.push(item.id)
          let rs = _this.getTreeParentData(item.children, childs, ids)
          if (rs) return rs
          // else childs.remove(item.id)
        }
      }
      return false
    },
    saveRolePermission () {
      const _this = this
      axios.request({
        url: '/role/saveRolePermission',
        params: {roleId: _this.currentRoleId, permissionIds: _this.permissionIds},
        method: 'post'
      }).then(res => {
        if (res.data.code === 200) {
          setTimeout(function () {
            _this.modelButtonLoading = false
            if (res.data.code === 200) {
              _this.$Message.success('角色绑定权限成功')
              _this.permissionModelShow = false
              // _this.$Modal.remove();
              _this.getTablePageData()
            } else {
              _this.$Message.error('网络异常，请稍后重试')
            }
          }, 1500)
        } else {
          _this.$Message.error('网络异常，请稍后重试')
        }
      }).catch(res => {
        _this.modelButtonLoading = false
      })
    }
  }
}
</script>
