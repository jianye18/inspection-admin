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
  .close {
    position: absolute;
    /*right: 32px;*/
    top: 5px;
    width: 5px;
    height: 5px;
  }
  .close:before, .close:after {
    position: absolute;
    left: 5px;
    content: ' ';
    height: 10px;
    width: 2px;
    background-color: #f54040;
  }
  .close:before {
    transform: rotate(45deg);
  }
  .close:after {
    transform: rotate(-45deg);
  }
</style>
<template>
  <div>
      <Card>
        <div class="search-con search-con-top">
          <Button @click="handleAddData" class="search-btn" type="primary"><Icon type="md-add"/>&nbsp;&nbsp;新增法规</Button>
          <Input @on-change="handleClear" clearable placeholder="输入法规名称搜索"
                 class="search-input" v-model="formData.searchPhrase"/>
          <Select v-model="formData.category" style="width:140px" placeholder="请选择法规分类" clearable>
            <Option v-for="item in categoryList" :value="item.value">{{ item.label }}</Option>
          </Select>
          <Select v-if="formData.category" v-model="formData.type" style="width:140px" placeholder="请选择法规类别" clearable>
            <Option v-for="item in typeList" :value="item.value">{{ item.label }}</Option>
          </Select>
          <Select v-model="formData.publishUnit" style="width:140px" placeholder="请选择发布单位" clearable>
            <Option v-for="item in publishUnitList" :value="item.value">{{ item.label }}</Option>
          </Select>
          <Select v-model="formData.status" style="width:140px" placeholder="请选择状态" clearable>
            <Option v-for="item in statusList" :value="item.value" >{{item.label}}</Option>
          </Select>
          <DatePicker @on-change="formData.publishDate=$event" type="daterange" placement="bottom-end"
                      format="yyyy-MM-dd" placeholder="请选择发布日期" style="width: 180px"></DatePicker>
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
      :mask-closable="false"
      width="820px">
      <Form ref="formItem" :model="formItem" :rules="ruleValidate" :label-width="80" action="">
        <FormItem label="名称" prop="name">
          <Input placeholder="请输入角色名" v-model="formItem.name" style="width:200px"/>
        </FormItem>
        <FormItem label="文号" prop="codeNumber">
          <Input placeholder="请输入文号" v-model="formItem.codeNumber" style="width:200px"/>
        </FormItem>
        <FormItem label="分类" prop="category">
          <Select v-model="formItem.category" style="width:200px" placeholder="请选择法规分类" clearable>
            <Option v-for="item in categoryList" :value="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="类别" prop="type" v-if="formItem.category">
          <Select v-model="formItem.type" style="width:200px" placeholder="请选择法规类别" clearable>
            <Option v-for="item in typeList" :value="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="状态" prop="status">
          <Select v-model="formItem.status" style="width:200px" placeholder="请选择状态" clearable>
            <Option v-for="item in statusList" :value="item.value">{{item.label}}</Option>
          </Select>
        </FormItem>
        <FormItem label="发布单位" prop="publishUnit">
          <Select v-model="formItem.publishUnit" style="width:200px" placeholder="请选择发布单位" clearable transfer>
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
        <!--<FormItem label="来源" prop="source">
          <Select v-model="formItem.source" style="width:200px" placeholder="请选择来源" clearable transfer>
            <Option v-for="item in sourceList" :value="item.value">{{item.label}}</Option>
          </Select>
        </FormItem>-->
        <!--<FormItem label="环节" prop="process">-->
          <!--<Select v-model="formItem.process" style="width:200px" placeholder="请选择环节" clearable>-->
            <!--<Option value="">全部</Option>-->
          <!--</Select>-->
        <!--</FormItem>-->
        <FormItem label="内容" prop="content">
          <editor ref="editor" :value="formItem.content" @on-change="handleChange"/>
        </FormItem>
        <FormItem label="附件">
          <span v-if="formItem.annexList" v-for="item in formItem.annexList" :key="item.name" style="margin-right: 15px;">
            {{item.name}}
            <a href="#" class="close" @click="deleteAnnex(item.name)"></a>
          </span>
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
import Global from '@/store/global'
export default {
  name: 'LawData',
  components: {
    Tables,
    Editor
  },
  data () {
    var _ths = this
    return {
      typeCode: 'FG_category,FG_publishUnit,FG_status', // ,FG_source
      modelShow: false,
      formData: {
        pageNum: 1, // 当前页
        pageSize: 10, // 一页展示数量
        searchPhrase: '',
        kind: []
      },
      categoryList: [],
      typeList: [],
      publishUnitList: [],
      // sourceList: [],
      statusList: [],
      processList: [],
      columns: [
        {
          title: '名称',
          align: 'center',
          key: 'name',
          tooltip: true
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
          width: 120,
          render: function render (h, params) {
            var content = ''
            if (params.row.typeName) {
              content = params.row.typeName
            } else {
              content = '-'
            }
            return h('span', content)
          }
        },
        {
          title: '发布单位',
          align: 'center',
          key: 'publishUnitName',
          width: 180
        },
        {
          title: '发布日期',
          align: 'center',
          key: 'publishDate',
          width: 100
        },
        {
          title: '实施日期',
          align: 'center',
          key: 'implementDate',
          width: 100
        },
        /*{
          title: '来源',
          align: 'center',
          key: 'sourceName',
          render: function render (h, params) {
            var content = ''
            if (params.row.sourceName) {
              content = params.row.sourceName
            } else {
              content = '-'
            }
            return h('span', content)
          }
        },*/
        {
          title: '状态',
          align: 'center',
          key: 'status',
          width: 100,
          render: function render (h, params) {
            let status = params.row.status + ''
            let content = Global.getLabelByVal(status, _ths.statusList)
            return h('span', content)
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
      formItem: {
        annexList: []
      },
      uploadLoading: false,
      ruleValidate: {
        name: [
          { required: true, message: '法规名称不能为空', trigger: 'blur' }
        ],
        category: [
          { required: true, message: '法规分类不能为空', trigger: 'change' }
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
      modelButtonLoading: false
    }
  },
  created: function () {
    this.getAllSystemDataTypeList()
  },
  mounted () {
    this.getTablePageData()
  },
  watch: {
    'formData.category': function (val) {
      if (val) {
        this.getLawTypeListByCode(val)
      }
    },
    'formItem.category': function (val) {
      if (val) {
        this.getLawTypeListByCode(val)
      }
    }
  },
  methods: {
    getAllSystemDataTypeList () {
      const option = {
        url: '/api/system/getSystemDataByTypeCode/' + this.typeCode,
        method: 'get'
      }
      axios.request(option).then(res => {
        // console.log(res.data)
        this.categoryList = res.data.data['FG_category']
        this.publishUnitList = res.data.data['FG_publishUnit']
        this.statusList = res.data.data['FG_status']
        // this.sourceList = res.data.data['FG_source']
      })
    },
    getLawTypeListByCode (code) {
      const option = {
        url: '/api/law/getLawTypeListByCode/' + code,
        method: 'get'
      }
      axios.request(option).then(res => {
        this.typeList = res.data.data
      })
    },
    getTablePageData () {
      if (this.formData.publishDate && this.formData.publishDate.length > 0) {
        this.formData.startDate = this.formData.publishDate[0]
        this.formData.endDate = this.formData.publishDate[1]
      }
      const option = {
        url: '/api/law/getLawPageList',
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
        url: '/api/common/uploadSingleFile',
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
          let annex = {name: res.data.data}
          if (_this.formItem.annexList) {
            _this.formItem.annexList.push(annex)
          } else {
            _this.formItem.annexList = [annex]
          }
          console.log(_this.formItem.annexList)
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
      this.$refs.editor.setHtml('')
      this.modelShow = true
      this.$refs['formItem'].resetFields()
      this.modelTitle = '新增法规'
      this.msgTitle = '新增法规数据成功'
      console.log(this.formItem)
    },
    handleEditor (params) {
      this.formItem = JSON.parse(JSON.stringify(params.row))
      this.formItem.type = this.formItem.type + ''
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
    },
    saveFormData () {
      const _this = this
      _this.$refs['formItem'].validate(function (valid) {
        if (valid) {
          _this.modelButtonLoading = true
          axios.request({
            url: '/api/law/saveLaw',
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
        url: '/api/law/deleteLaw/' + id,
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
    },
    deleteAnnex (fileName) {
      const _this = this
      axios.request({
        url: '/api/common/deleteFile/' + fileName,
        method: 'delete'
      }).then(res => {
        if (res.data.code === 200) {
          _this.formItem.annexList.forEach(function (item, index) {
            if (fileName === item.name) {
              _this.formItem.annexList.splice(index, 1)
            }
          })
          console.log(_this.formItem.annexList)
        } else {
          _this.$Message.error('网络异常，请稍后重试')
        }
      })
    }
  }
}
</script>
