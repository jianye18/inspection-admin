<style>
  .ivu-table-cell{
    padding:  0px;
  }
</style>
<template>
  <div>
      <Card>
        <div class="search-con search-con-top">
          <Button @click="handleAddData" class="search-btn" type="primary"><Icon type="md-add"/>&nbsp;&nbsp;新增声明</Button>
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
      :mask-closable="false"
      width="820px">
      <Form ref="formItem" :model="formItem" :rules="ruleValidate" :label-width="80" action="">
        <FormItem label="内容" prop="content">
          <editor ref="editor" :value="formItem.content" @on-change="handleChange"/>
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
import Editor from '_c/editor'
export default {
  name: 'Statement',
  components: {
    Tables,
    Editor
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
          title: '内容',
          align: 'center',
          key: 'content',
          render: function render (h, params) {
            return h('div', {
              style: {
                textAlign: 'left',
                paddingLeft: '10px'
              },
              domProps: {
                innerHTML: params.row.content
              }
            })
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
        content: [
          { required: true, message: '内容不能为空', trigger: 'blur' }
        ]
      },
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
      modelButtonLoading: false
    }
  },
  mounted () {
    this.getTablePageData()
  },
  methods: {
    getTablePageData () {
      const option = {
        url: '/statement/getStatementPageList',
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
    handleChange (html, text) {
      this.formItem.content = html
    },
    handleAddData () {
      this.$refs.editor.setHtml('')
      this.modelShow = true
      this.$refs['formItem'].resetFields()
      this.modelTitle = '新增声明'
      this.msgTitle = '新增声明成功'
    },
    handleEditor (row) {
      this.modelShow = true
      this.modelTitle = '编辑声明'
      this.msgTitle = '编辑声明成功'
      this.formItem = JSON.parse(JSON.stringify(row))
      this.$refs.editor.setHtml(this.formItem.content)
    },
    handleDelete (id) {
      this.msgTitle = '删除声明成功'
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
            url: '/statement/saveStatement',
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
        url: '/statement/deleteStatement/' + id,
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
