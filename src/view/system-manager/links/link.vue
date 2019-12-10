<style>
  .ivu-table-cell{
    padding:  0px;
  }
</style>
<template>
  <div>
      <Card>
        <div class="search-con search-con-top">
          <Button @click="handleAddData" class="search-btn" type="primary"><Icon type="md-add"/>&nbsp;&nbsp;新增友情链接</Button>
          <Input @on-change="handleClear" clearable placeholder="输入常量名搜索" class="search-input" v-model="formData.searchPhrase"/>
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
        <FormItem label="名称" prop="name">
          <Input placeholder="请输入名称" v-model="formItem.name"/>
        </FormItem>
        <FormItem label="路径" prop="path">
          <Input placeholder="请输入名称" v-model="formItem.path"/>
        </FormItem>
        <FormItem label="排序" prop="sort">
          <Select v-model="formItem.sort">
            <Option v-for="item in 10" :value="item">{{item}}</Option>
          </Select>
        </FormItem>
        <FormItem label="展示" prop="isView">
          <RadioGroup v-model="formItem.isView">
            <Radio label="1">是</Radio>
            <Radio label="0">否</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="备注" prop="remark">
          <Input placeholder="请输入常量说明" v-model="formItem.remark"/>
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
          width: 220,
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
                  _ths.handleDelete(params.row.id)
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
                  _ths.handleEditor(params.row)
                }
              }
            }, '编辑')])
          }
        }
      ],
      ruleValidate: {
        name: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ],
        path: [
          { required: true, message: '链接不能为空', trigger: 'blur' }
        ]
      },
      tableData: {
        list: [],
        pageNum: 1,
        total: 0,
        pages: 0
      },
      formItem: {
        isView: '1'
      },
      modelShow: false,
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
      const option = {
        url: '/link/getLinkPageList',
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
    handleAddData () {
      this.modelShow = true
      this.$refs['formItem'].resetFields()
      this.modelTitle = '新增友情链接'
      this.msgTitle = '新增友情链接成功'
    },
    handleEditor (row) {
      this.modelShow = true
      this.modelTitle = '编辑友情链接'
      this.formItem = JSON.parse(JSON.stringify(row))
      this.formItem.isView = this.formItem.isView + ''
    },
    handleDelete (id) {
      this.msgTitle = '删除友情链接成功'
      this.$Modal.confirm({
        title: '删除',
        content: '你确定要删除吗?',
        loading: true,
        onOk: () => {
          this.deleteData(id)
        }
      })
    },
    saveFormData () {
      const _this = this
      _this.$refs['formItem'].validate(function (valid) {
        if (valid) {
          _this.modelButtonLoading = true
          console.log(_this.formItem)
          axios.request({
            url: '/link/saveLink',
            data: _this.formItem,
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
        }
      })
    },
    modelCancel () {
      this.modelShow = false
      this.$Modal.remove()
    },
    deleteData (id) {
      const _this = this
      axios.request({
        url: '/link/deleteLink/' + id,
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
