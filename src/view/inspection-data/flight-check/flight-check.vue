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
              <Upload multiple action="/api/flightCheck/uploadFlightCheck" :before-upload="handleBeforeUpload" accept=".xls, .xlsx">
                <Button icon="ios-cloud-upload-outline" :loading="uploadLoading">上传文件</Button>
              </Upload>
            </Col>
            <Col span="22">
              <Button @click="handleAddData" class="search-btn" type="primary"><Icon type="md-add"/>&nbsp;&nbsp;新增</Button>
              <Input @on-change="handleClear" clearable placeholder="输入代理商或被采样单位名称搜索"
                     class="search-input" v-model="formData.searchPhrase"/>
              <Select v-model="formData.type" style="width:200px" placeholder="请选择飞检类型" clearable>
                <Option v-for="item in typeList" :value="item.value">{{ item.label }}</Option>
              </Select>
              <Select v-model="formData.publishUnit" style="width:200px" placeholder="请选择发布单位" clearable>
                <Option v-for="item in publishUnitList" :value="item.value">{{ item.label }}</Option>
              </Select>
              <Select v-model="formData.isDefect" style="width:200px" placeholder="是否有缺陷" clearable>
                <Option v-for="item in defectList" :value="item.value" :key="item.value">{{item.label}}</Option>
              </Select>
              <DatePicker @on-change="formData.publishDate=$event" type="daterange" placement="bottom-end"
                          format="yyyy-MM-dd" placeholder="请选择发布日期" style="width: 180px"></DatePicker>
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
      :mask-closable="false">
      <Form ref="formItem" :model="formItem" :rules="ruleValidate" :label-width="90" action="">
        <FormItem label="企业名称" prop="businessName">
          <Input placeholder="请输入企业名称" v-model="formItem.businessName"/>
        </FormItem>
        <FormItem label="缺陷问题" prop="problem">
          <Input placeholder="请输入缺陷问题" v-model="formItem.problem" type="textarea" :autosize="{minRows: 3,maxRows: 5}"/>
        </FormItem>
        <FormItem label="处理措施" prop="precautions">
          <Select v-model="formItem.precautions" style="width:200px" placeholder="请选择处理措施" clearable>
            <Option v-for="item in precautionsList" :value="item.value">{{item.label}}</Option>
          </Select>
        </FormItem>
        <FormItem label="飞检类型" prop="type">
          <Select v-model="formItem.type" style="width:200px" placeholder="请选择状态" clearable>
            <Option v-for="item in typeList" :value="item.value">{{item.label}}</Option>
          </Select>
        </FormItem>
        <FormItem label="发布单位" prop="publishUnit">
          <Input placeholder="请输入发布单位" v-model="formItem.publishUnit"/>
        </FormItem>
        <FormItem label="发布日期" prop="publishDate">
          <DatePicker type="date" format="yyyy-MM-dd" @on-change="formItem.publishDate=$event"
                      placeholder="请选择发布日期" :value="formItem.publishDate" transfer style="width:200px"></DatePicker>
        </FormItem>
        <FormItem label="是否有缺陷" prop="isDefect">
          <Select v-model="formItem.isDefect" style="width:200px" placeholder="请选择来源" clearable transfer>
            <Option v-for="item in defectList" :value="item.value">{{item.label}}</Option>
          </Select>
        </FormItem>
        <FormItem label="来源链接" prop="sourceLink">
          <Input placeholder="请输入来源链接" v-model="formItem.sourceLink"/>
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
import Global from '@/store/global'
export default {
  name: 'FlightCheck',
  components: {
    Tables,
    Editor
  },
  data () {
    const _ths = this
    return {
      typeCode: 'FJ_type,FJ_precautions',
      modelShow: false,
      formData: {
        pageNum: 1, // 当前页
        pageSize: 10, // 一页展示数量
        searchPhrase: ''
      },
      publishUnitList: [],
      typeList: [],
      precautionsList: [],
      defectList: Global.defectList,
      columns: [
        {
          title: '企业名称',
          align: 'center',
          key: 'businessName',
          tooltip: true
        },
        {
          title: '处理措施',
          align: 'center',
          key: 'precautions',
          width: 100,
          render: function render (h, params) {
            let content = params.row.precautions
            return h('span', {
              style: {
                color: content === '停产整改' ? 'red' : ''
              }
            }, content)
          }
        },
        {
          title: '飞检类型',
          align: 'center',
          key: 'type',
          width: 100
        },
        {
          title: '发布单位',
          align: 'center',
          key: 'publishUnit',
          tooltip: true
        },
        {
          title: '发布日期',
          align: 'center',
          key: 'publishDate',
          width: 100
        },
        {
          title: '是否缺陷',
          align: 'center',
          key: 'isDefect',
          width: 80
        },
        {
          title: '来源链接',
          align: 'center',
          key: 'sourceLink',
          tooltip: true,
          render: function render (h, params) {
            let content = params.row.sourceLink ? params.row.sourceLink : '—'
            return h('span', {
              class: 'table-span',
              style: {
                width: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              },
              domProps: {title: content}
            }, content)
          }
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
                  _ths.handleEditor(params.row.id)
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
      formItem: {
        annexList: []
      },
      uploadLoading: false,
      ruleValidate: {
        businessName: [
          { required: true, message: '企业名称不能为空', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '飞检类型不能为空', trigger: 'change' }
        ],
        publishUnit: [
          { required: true, message: '发布单位为空', trigger: 'blur' }
        ],
        publishDate: [
          { required: true, message: '发布日期不能为空', trigger: 'change' }
        ],
        isDefect: [
          { required: true, message: '是否有缺陷不能为空', trigger: 'change' }
        ]
      },
      modelTitle: '',
      msgTitle: '',
      modelButtonLoading: false
    }
  },
  created: function () {
    this.getTypeList()
    this.getPrecautionsList()
    this.getAllPublishUnit()
  },
  mounted () {
    this.getTablePageData()
  },
  watch: {

  },
  methods: {
    getTypeList () {
      const option = {
        url: '/api/flightCheck/getTypeList',
        method: 'get'
      }
      axios.request(option).then(res => {
        this.typeList = res.data.data
      })
    },
    getPrecautionsList () {
      const option = {
        url: '/api/flightCheck/getPrecautionsList',
        method: 'get'
      }
      axios.request(option).then(res => {
        this.precautionsList = res.data.data
      })
    },
    getAllPublishUnit () {
      const option = {
        url: '/api/flightCheck/getAllPublishUnit',
        method: 'get'
      }
      axios.request(option).then(res => {
        console.log(res.data)
        this.publishUnitList = res.data.data
      })
    },
    getTablePageData () {
      if (this.formData.publishDate && this.formData.publishDate.length > 0) {
        this.formData.startDate = this.formData.publishDate[0]
        this.formData.endDate = this.formData.publishDate[1]
      }
      const option = {
        url: '/api/flightCheck/getFlightCheckPageList',
        data: this.formData,
        method: 'post'
      }
      axios.request(option).then(res => {
        console.log(res.data)
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
        url: '/api/flightCheck/uploadFlightCheck',
        data: fileFormData,
        method: 'post',
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      axios.request(option).then(res => {
        _this.$Message.success('导入飞检数据成功')
        _this.getTablePageData()
        _this.getTypeList()
        _this.getPrecautionsList()
        _this.getAllPublishUnit()
      }).catch(res => {
        _this.uploadLoading = false
      })
      return false
    },
    handleUploadFile () {
      // this.getTablePageData()
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
    handleChange (html, text) {
      this.formItem.content = html
    },
    changeCategory (value, selectedData) {
      console.log(value)
      console.log(selectedData)
    },
    handleAddData () {
      this.formItem = {
        annexList: []
      }
      this.modelShow = true
      this.$refs['formItem'].resetFields()
      this.modelTitle = '新增飞检'
      this.msgTitle = '新增飞检数据成功'
    },
    clearData () {
      this.formItem = {}
    },
    handleEditor (id) {
      // this.clearData()
      const _this = this
      const option = {
        url: '/api/flightCheck/getFlightCheckById/' + id,
        method: 'get'
      }
      axios.request(option).then(res => {
        if (res.data.code === 200) {
          _this.formItem = JSON.parse(JSON.stringify(res.data.data))
          let problem = _this.formItem.problem.replace(/<br\/>/g, "\r\n")
          _this.formItem.problem = problem
          _this.modelShow = true
          _this.modelTitle = '编辑飞检'
          _this.msgTitle = '修改飞检数据成功'
        }
      })
    },
    handleDelete (params) {
      this.msgTitle = '删除飞检数据成功'
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
          axios.request({
            url: '/api/flightCheck/saveFlightCheck',
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
        url: '/api/flightCheck/deleteFlightCheck/' + id,
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
