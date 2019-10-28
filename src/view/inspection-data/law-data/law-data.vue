<style>
  .ivu-table-cell{
    padding:  0px;
  }
  .ivu-select{
    margin-left: 2px;
  }
  .ivu-input-small{
    height: 32px !important;
  }
</style>
<template>
  <div>
      <Card>
        <div class="search-con search-con-top">
          <Button @click="handleAddData" class="search-btn" type="primary"><Icon type="md-add"/>&nbsp;&nbsp;新增法规</Button>
          <Cascader :data="cascaderData" trigger="hover" placeholder="请选择法规类别" size="small" transfer
                    style="display: inline-block; margin-left: 5px;"></Cascader>
          <Select v-model="formData.publishUnit" style="width:200px" placeholder="请选择发布单位" clearable>
            <Option value="">全部</Option>
            <Option v-for="item in publishUnitList" :value="item.value">{{ item.label }}</Option>
          </Select>
          <Select v-model="formData.status" style="width:200px" placeholder="请选择状态" clearable>
            <Option value="">全部</Option>
            <Option v-for="item in statusList" :value="item.value" >{{item.label}}</Option>
          </Select>
          <Input @on-change="handleClear" clearable placeholder="输入法规名称搜索"
                 class="search-input" v-model="formData.searchPhrase"/>
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
      :mask-closable="false"
      width="820px"
      @on-visible-change="initData">
      <Form ref="formItem" :model="formItem" :rules="ruleValidate" :label-width="80" action="">
        <FormItem label="名称" prop="name">
          <Input placeholder="请输入角色名" v-model="formItem.name" style="width:200px"/>
        </FormItem>
        <FormItem label="分类" prop="category">
          <Cascader v-model="formItem.category" :data="cascaderData" trigger="hover" placeholder="请选择法规类别" size="small" transfer
                    style="display: inline-block; width: 200px;"></Cascader>
        </FormItem>
        <FormItem label="状态" prop="status">
          <Select v-model="formItem.status" style="width:200px" placeholder="请选择状态" clearable>
            <Option v-for="item in statusList" :value="item.value">{{item.label}}</Option>
          </Select>
        </FormItem>
        <FormItem label="发布单位" prop="publishUnit">
          <Select v-model="formItem.publishUnit" style="width:200px" placeholder="请选择发布单位" clearable>
            <Option v-for="item in publishUnitList" :value="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="发布日期" prop="publishDate">
          <DatePicker type="date" format="yyyy-MM-dd" @on-change="formItem.publishDate=$event"
                      placeholder="请选择发布日期" :value="formItem.publishDate" transfer></DatePicker>
        </FormItem>
        <FormItem label="实施日期" prop="implementDate">
          <DatePicker type="date" format="yyyy-MM-dd" @on-change="formItem.implementDate=$event"
                      placeholder="请选择实施日期" :value="formItem.implementDate" transfer></DatePicker>
        </FormItem>
        <FormItem label="内容" prop="content">
          <editor ref="editor" :value="formItem.content" @on-change="handleChange"/>
        </FormItem>
        <FormItem label="附件">
          <span v-if="annexs" v-for="item in annexs" :key="item">{{item}}&nbsp;</span>
          <Upload action="" :before-upload="handleBeforeUpload" accept=".xls, .xlsx, .doc, .docx, .pdf, .txt">
            <Button :loading="uploadLoading" @click="handleUploadFile">上传文件</Button>
          </Upload>
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
  name: 'law_page',
  components: {
    Tables,
    Editor
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
      cascaderData: [],
      publishUnitList: [],
      statusList: [
        {value: '1', label: '现行有效'},
        {value: '2', label: '征求意见'},
        {value: '3', label: '已经废止'},
        {value: '4', label: '未知状态'}
      ],
      columns: [
        {
          title: '名称',
          align: 'center',
          key: 'name'
        },
        {
          title: '一级分类',
          align: 'center',
          key: 'categoryName',
          width: 120
        },
        {
          title: '二级分类',
          align: 'center',
          key: 'typeName',
          width: 120
        },
        {
          title: '发布单位',
          align: 'center',
          key: 'publishUnitName'
        },
        {
          title: '发布日期',
          align: 'center',
          key: 'publishDate',
          width: 120
        },
        {
          title: '实施日期',
          align: 'center',
          key: 'implementDate',
          width: 120
        },
        {
          title: '状态',
          align: 'center',
          key: 'status',
          width: 120,
          render: function render (h, params) {
            // console.log(params.row)
            var content = ''
            if (params.row.status === 1) {
              content = '现行有效'
            } else if (params.row.status === 2) {
              content = '即将实施'
            } else {
              content = '已经作废'
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
      uploadLoading: false,
      ruleValidate: {
        name: [
          { required: true, message: '法规名称不能为空', trigger: 'blur' }
        ],
        category: [
          { required: true,type: 'array', message: '法规分类不能为空', trigger: 'change' }
        ],
        status: [
          { required: true, message: '状态不能为空', trigger: 'change' }
        ],
        publishUnit: [
          { required: true, message: '发布单位为空', trigger: 'change' }
        ],
        publishDate: [
          { required: true, message: '发布日期不能为空', trigger: 'change' }
        ],
        implementDate: [
          { required: true, message: '实施日期不能为空', trigger: 'change' }
        ],
        content: [
          { required: true, message: '法律内容不能为空', trigger: 'change' }
        ]
      },
      modelTitle: '',
      msgTitle: '',
      modelButtonLoading: false,
      annexs: []
    }
  },
  created: function () {
    this.getAllSystemDataTypeList()
  },
  mounted () {
    this.getTablePageData()
  },
  methods: {
    getAllSystemDataTypeList () {
      const option = {
        url: '/system/getAllSystemDataTypeList/3',
        method: 'get'
      }
      axios.request(option).then(res => {
        this.cascaderData = res.data.data.categoryList
        this.publishUnitList = res.data.data.publishUnitList
      })
    },
    getTablePageData () {
      const option = {
        url: '/law/getLawPageList',
        data: this.formData,
        method: 'post'
      }
      axios.request(option).then(res => {
        this.tableData.list = res.data.data.list
        this.tableData.pageNum = res.data.data.pageNum
        this.tableData.total = res.data.data.total
        this.tableData.pages = res.data.data.pages
      })
    },
    handleBeforeUpload (file) {
      const _this = this
      let fileFormData = new FormData()
      fileFormData.append('file', file)
      const option = {
        url: '/common/uploadSingleFile',
        data: fileFormData,
        method: 'post',
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      axios.request(option).then(res => {
        _this.uploadLoading = false
        if (res.data.code === 200) {
          _this.$Message.success('上传成功！')
          _this.annexs.push(res.data.data)
          console.log(_this.annexs)
        } else {
          _this.$Message.error('上传失败，请稍后重试')
        }
      }).catch(res => {
        _this.uploadLoading = false
      })
      return false
    },
    handleUploadFile () {
      this.getTablePageData()
    },
    // 翻页钩子
    changePage (page) {
      this.formData.current = page
      this.getTablePageData()
    },
    handleClear (e) {

    },
    handleSearch () {
      this.getTablePageData()
    },
    handleChange (html, text) {
      this.formItem.content = html
    },
    handleAddData () {
      this.modelShow = true
      this.$refs['formItem'].resetFields()
      this.modelTitle = '新增法规'
      this.msgTitle = '新增法规数据成功'
    },
    handleEditor (params) {
      this.formItem = params.row
      this.formItem.category = this.formItem.category + ''
      this.formItem.type = this.formItem.type + ''
      this.formItem.publishUnit = this.formItem.publishUnit + ''
      this.formItem.status = this.formItem.status + ''
      this.modelShow = true
      this.modelTitle = '编辑法规'
      this.msgTitle = '修改法规数据成功'
    },
    handleDelete (params) {
      console.log(params.row.id)
      this.msgTitle = '删除标准数据成功'
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
    initData (flag) {
      if (!flag) {
        this.annexs = []
        this.$refs.editor.setHtml('')
      }
    },
    saveFormData () {
      const _this = this
      _this.$refs['formItem'].validate(function (valid) {
        console.log(_this.formItem)
        if (valid) {
          _this.modelButtonLoading = true
          let postData = _this.formItem
          postData.annexs = JSON.stringify(postData.annexs)
          if (_this.formItem.category.length === 1) {
            postData.category = postData.category[0]
          }
          if (_this.formItem.category.length === 2) {
            postData.category = postData.category[0]
            postData.type = postData.category[1]
          }
          axios.request({
            url: '/law/saveLaw',
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
        url: '/criterion/deleteCriterion/' + id,
        method: 'delete'
      }).then(res => {
        _this.$Modal.remove()
        if (res.data.code === 200) {
          _this.$Message.success(_this.msgTitle)
          _this.getTablePageData()
        } else {
          _this.$Message.error('网络异常，请稍后重试')
        }
      })
    }
  }
}
</script>
