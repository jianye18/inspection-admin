<style>
  .ivu-table-cell{
    padding:  0px;
  }
</style>
<template>
  <div>
      <Card>
        <div class="search-con search-con-top">
            <Select v-model="formData.type" style="width:200px" placeholder="请选择常量类别" clearable>
              <Option v-for="item in typeList" :value="item.value">{{item.label}}</Option>
            </Select>
            <Button @click="handleAddData" class="search-btn" type="primary"><Icon type="md-add"/>&nbsp;&nbsp;新增常量</Button>
            <Input @on-change="handleClear" clearable placeholder="输入常量名搜索" class="search-input" v-model="formData.searchPhrase"/>
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
            <FormItem label="名称" prop="name">
                <Input placeholder="请输入名称" v-model="formItem.name"/>
            </FormItem>
            <FormItem label="值" prop="value">
                <Input placeholder="请输入值" v-model="formItem.value"/>
            </FormItem>
            <FormItem label="编码" prop="code">
                <Input placeholder="请输入编码" v-model="formItem.code"/>
            </FormItem>
            <FormItem label="参数" prop="param">
                <Input placeholder="请输入编码" v-model="formItem.param"/>
            </FormItem>
            <FormItem label="类型" prop="type">
              <Select v-model="formItem.type">
                <Option v-for="item in typeList" :value="item.value">{{item.label}}</Option>
              </Select>
            </FormItem>
            <FormItem label="描述" prop="description">
                <Input placeholder="请输入权限描述" v-model="formItem.description"/>
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
        searchPhrase: '',
        type: null
      },
      typeList: [
        {value: '1', label:'抽检'},
        {value: '2', label:'标准'},
        {value: '3', label:'法规'}
      ],
      columns: [
        {
          title: '名称',
          align: 'center',
          key: 'name'
        },
        {
          title: '值',
          align: 'center',
          key: 'value'
        },
        {
          title: '编码',
          align: 'center',
          key: 'code'
        },
        {
          title: '参数',
          align: 'center',
          key: 'param'
        },
        {
          title: '类型',
          align: 'center',
          key: 'type',
          render: function render (h, params) {
            var content = ''
            let type = params.row.type + ''
            if (type === '1') {
              content = '抽检'
            } else if (type === '2') {
              content = '标准'
            } else {
              content = '法规'
            }
            return h('span', content)
          }
        },
        {
          title: '描述',
          align: 'center',
          key: 'description'
        },
        {
          title: '父级',
          align: 'center',
          key: 'parentName'
        },
        {
          title: '操作',
          align: 'center',
          key: 'operation',
          width: 160,
          render: function render (h, params) {
            return h('div', [h('Button', {
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
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '编码不能为空', trigger: 'blur' }
        ],
        value: [
          { required: true, message: '值不能为空', trigger: 'blur' }
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
    getTablePageData () {
      const option = {
        url: '/system/getSystemDataTypePageList',
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
        name: '常量',
        code: 'user_add',
        description: '测试',
        type: '1'
      }
      this.modelShow = true
      this.$refs['formItem'].resetFields()
      this.modelTitle = '新增常量'
      this.msgTitle = '新增常量成功'
    },
    handleEditor (params) {
      this.formItem = params.row
      this.formItem.status = this.formItem.status + ''
      this.formItem.parentId = this.formItem.parentId + ''
      this.formItem.type = this.formItem.type + ''
      this.modelShow = true
      this.modelTitle = '编辑常量'
      this.msgTitle = '修改常量成功'
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
            url: '/system/saveSystemDataType',
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
    }
  }
}
</script>
