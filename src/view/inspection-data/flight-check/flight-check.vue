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
          <Row>
            <Col span="2">
              <Upload action="" :before-upload="handleBeforeUpload" accept=".xls, .xlsx">
                <Button icon="ios-cloud-upload-outline" :loading="uploadLoading" @click="handleUploadFile">上传文件</Button>
              </Upload>
            </Col>
            <Col span="22">
              <Select v-model="formData.productType" style="width:200px" placeholder="请选择产品分类" clearable>
                <Option v-for="item in productTypeList" :value="item.value">{{ item.label }}</Option>
              </Select>
              <Select v-model="formData.institution" style="width:200px" placeholder="请选择发布单位" clearable>
                <Option v-for="item in institutionList" :value="item.value">{{ item.label }}</Option>
              </Select>
              <Select v-model="formData.checkResult" style="width:200px" placeholder="请选择抽检结果" clearable>
                <Option v-for="item in checkResultList" :value="item.value" :key="item.value">{{item.label}}</Option>
              </Select>
              <Input @on-change="handleClear" clearable placeholder="输入代理商或被采样单位名称搜索"
                     class="search-input" v-model="formData.searchPhrase"/>
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

    <Modal
      v-model="modelShow"
      :title="modelTitle"
      :mask-closable="false"
      width="820px"
      @on-visible-change="initData">
      <Form ref="formItem" :model="formItem" :rules="ruleValidate" :label-width="80" action="">
        <FormItem label="名称" prop="businessName">
          <Input placeholder="请输入企业名称" v-model="formItem.businessName" style="width:200px"/>
        </FormItem>
        <FormItem label="类型" prop="type">
          <Select v-model="formItem.type" style="width:200px" placeholder="请选择飞检类型" clearable>
            <Option v-for="item in typeList" :value="item.value">{{item.label}}</Option>
          </Select>
        </FormItem>
        <FormItem label="状态" prop="status">
          <Select v-model="formItem.status" style="width:200px" placeholder="请选择状态" clearable>
            <Option v-for="item in statusList" :value="item.value">{{item.label}}</Option>
          </Select>
        </FormItem>
        <FormItem label="发布单位" prop="publishUnit">
          <Select v-model="formItem.publishUnit" style="width:200px" placeholder="请选择发布单位" clearable>
            <Option v-for="item in publishUnitList" :value="item.value">{{item.label}}</Option>
          </Select>
        </FormItem>
        <FormItem label="发布日期" prop="publishDate">
          <DatePicker type="date" format="yyyy-MM-dd" @on-change="formItem.publishDate=$event"
                      placeholder="请选择发布日期" :value="formItem.publishDate" transfer style="width:200px"></DatePicker>
        </FormItem>
        <FormItem label="实施日期" prop="implementDate">
          <DatePicker type="date" format="yyyy-MM-dd" @on-change="formItem.implementDate=$event"
                      placeholder="请选择实施日期" :value="formItem.implementDate" transfer style="width:200px"></DatePicker>
        </FormItem>
        <FormItem label="来源链接" prop="source">
          <Select v-model="formItem.source" style="width:200px" placeholder="请选择来源" clearable transfer>
            <Option v-for="item in sourceList" :value="item.value">{{item.label}}</Option>
          </Select>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import Tables from '_c/tables'
import axios from '@/libs/api.request'
import Editor from '_c/editor'
import Global from '@/store/global'
export default {
  name: 'law_page',
  components: {
    Tables,
    Editor
  },
  data () {
    const _ths = this
    return {
      modelShow: false,
      formData: {
        pageNum: 1, // 当前页
        pageSize: 10, // 一页展示数量
        searchPhrase: '',
        kind: []
      },
      publishUnitList: [],
      typeList: ['', '国家飞检', '地方飞检'],
      columns: [
        {
          title: '企业名称',
          align: 'center',
          key: 'businessName'
        },
        {
          title: '处理措施',
          align: 'center',
          key: 'precautionsName'
        },
        {
          title: '飞检类型',
          align: 'center',
          key: 'typeName',
          render: function render (h, params) {
            let content = typeList[Number(params.row.id)]
            return h('span', content)
          }
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
          width: 100
        },
        {
          title: '来源链接',
          align: 'center',
          key: 'sourceLink'
        },
        {
          title: '操作',
          align: 'center',
          key: 'operation',
          width: 150,
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
        kind: [
          { required: true, type: 'array', message: '法规分类不能为空', trigger: 'change' }
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
  watch: {
    'formData.kind': function (val) {
      if (val) {
        if (val.length === 0) {
          this.formData.category = ''
          this.formData.type = ''
        }
        if (val.length === 1) {
          this.formData.category = val[0]
        }
        if (val.length === 2) {
          this.formData.category = val[0]
          this.formData.type = val[1]
        }
      }
    }
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
        this.sourceList = res.data.data.sourceList
      })
    },
    getTablePageData () {
      const option = {
        url: '/show/getFlightCheckPageList',
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
    changeCategory (value, selectedData) {
      console.log(value)
      console.log(selectedData)
    },
    handleAddData () {
      this.$refs.editor.setHtml('')
      this.modelShow = true
      this.$refs['formItem'].resetFields()
      this.modelTitle = '新增法规'
      this.msgTitle = '新增法规数据成功'
    },
    handleEditor (params) {
      this.formItem = params.row
      if (this.formItem.annexList.length > 0) {
        const _this = this
        _this.formItem.annexList.forEach(function (item) {
          _this.annexs.push(item.name)
        })
      }
      if (this.formItem.type) {
        this.formItem.kind = [this.formItem.category + '', this.formItem.type + '']
      } else {
        this.formItem.kind = [this.formItem.category + '']
      }
      this.formItem.publishUnit = this.formItem.publishUnit + ''
      this.formItem.status = this.formItem.status + ''
      this.formItem.source = this.formItem.source + ''
      this.$refs.editor.setHtml(this.formItem.content)
      this.modelShow = true
      this.modelTitle = '编辑法规'
      this.msgTitle = '修改法规数据成功'
    },
    handleDelete (params) {
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
      this.initData(false)
    },
    initData (flag) {
      if (!flag) {
        this.annexs = []
        this.formItem.kind = []
        this.$refs.editor.setHtml('')
      }
    },
    saveFormData () {
      const _this = this
      _this.$refs['formItem'].validate(function (valid) {
        if (valid) {
          _this.modelButtonLoading = true
          if (_this.annexs.length > 0) {
            _this.formItem.annexs = JSON.stringify(_this.annexs)
          }
          if (_this.formItem.kind.length === 1) {
            _this.formItem.category = _this.formItem.kind[0]
          }
          if (_this.formItem.kind.length === 2) {
            _this.formItem.category = _this.formItem.kind[0]
            _this.formItem.type = _this.formItem.kind[1]
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
