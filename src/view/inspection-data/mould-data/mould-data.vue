<style>
  .ivu-table-cell{
    padding:  0px;
  }
  .search-btn{
    margin-right: 10px;
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
          <Button @click="handleAddData" class="search-btn" type="primary"><Icon type="md-add"/>&nbsp;&nbsp;新增标准</Button>
          <Input @on-change="handleClear" clearable placeholder="输入标准数据名称搜索" class="search-input" v-model="formData.searchPhrase"/>
          <Select v-model="formData.category" style="width:200px" placeholder="请选择一级分类" clearable>
            <Option v-for="item in categoryList" :value="item.value">{{ item.label }}</Option>
          </Select>
          <Select v-model="formData.type" style="width:200px" placeholder="请选择二级分类" clearable>
            <Option v-for="item in typeList" :value="item.value">{{ item.label }}</Option>
          </Select>
          <Select v-model="formData.publishUnit" style="width:200px" placeholder="请选择发布单位" clearable>
            <Option v-for="item in publishUnitList" :value="item.value">{{ item.label }}</Option>
          </Select>
          <Select v-model="formData.status" style="width:200px" placeholder="请选择状态" clearable>
            <Option v-for="item in statusList" :value="item.value">{{item.label}}</Option>
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
        :mask-closable="false">
        <Form ref="formItem" :model="formItem" :rules="ruleValidate" :label-width="80" action="">
            <FormItem label="名称" prop="name">
                <Input placeholder="请输入标准名称" v-model="formItem.name"/>
            </FormItem>
            <FormItem label="一级分类" prop="category">
              <Select v-model="formItem.category" style="width:200px" placeholder="请选择一级分类" clearable>
                <Option v-for="item in categoryList" :value="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
            <FormItem label="二级分类" prop="type">
              <Select v-model="formItem.type" style="width:200px" placeholder="请选择二级分类" clearable>
                <Option v-for="item in typeList" :value="item.value">{{ item.label }}</Option>
              </Select>
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
                          placeholder="请选择发布日期" :value="formItem.publishDate" style="width:200px"></DatePicker>
            </FormItem>
            <FormItem label="实施日期" prop="implementDate">
              <DatePicker type="date" format="yyyy-MM-dd" @on-change="formItem.implementDate=$event"
                          placeholder="请选择实施日期" :value="formItem.implementDate" style="width:200px"></DatePicker>
            </FormItem>
            <FormItem label="摘要" prop="summary">
              <Input placeholder="请输入标准摘要" v-model="formItem.summary" type="textarea" :autosize="{minRows: 3,maxRows: 5}"/>
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
export default {
  name: 'MouldData',
  components: {
    Tables
  },
  data () {
    var _ths = this
    const validateName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('标准数据名称不能为空'))
      } else {
        axios.request({
          url: '/api/criterion/judgeCriterionNameIsExist?name=' + value + '&criterionId=' + _ths.currentCriterionId,
          method: 'get'
        }).then(res => {
          if (res.data.code === 200) {
            callback(new Error('标准数据名称已存在'))
          } else {
            callback()
          }
        })
      }
    }
    return {
      typeCode: "BZ_category,BZ_type,BZ_publishUnit,BZ_status",
      modelShow: false,
      formData: {
        pageNum: 1, // 当前页
        pageSize: 10, // 一页展示数量
        searchPhrase: ''
      },
      categoryList: [],
      typeList: [],
      publishUnitList: [],
      statusList: [],
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
          key: 'statusName',
          width: 120
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
      formItem: {
        annexList: []
      },
      uploadLoading: false,
      ruleValidate: {
        name: [
          { required: true, validator: validateName, trigger: 'blur' }
        ],
        category: [
          { required: true, message: '一级分类不能为空', trigger: 'change' }
        ],
        type: [
          { required: true, message: '二级分类不能为空', trigger: 'change' }
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
        ]
      },
      modelTitle: '',
      msgTitle: '',
      modelButtonLoading: false,
      currentCriterionId: 0
    }
  },
  mounted () {
    this.getAllSystemDataTypeList()
    this.getTablePageData()
  },
  methods: {
    getAllSystemDataTypeList () {
      const option = {
        url: '/api/system/getSystemDataByTypeCode/' + this.typeCode,
        method: 'get'
      }
      axios.request(option).then(res => {
        this.categoryList = res.data.data["BZ_category"]
        this.typeList = res.data.data["BZ_type"]
        this.publishUnitList = res.data.data["BZ_publishUnit"]
        this.statusList = res.data.data["BZ_status"]
      })
    },
    getTablePageData () {
      if (this.formData.publishDate && this.formData.publishDate.length > 0) {
        this.formData.startDate = this.formData.publishDate[0]
        this.formData.endDate = this.formData.publishDate[1]
      }
      const option = {
        url: '/api/criterion/getCriterionPageList',
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
    handleAddData () {
      this.formItem = {
        annexList: []
      }
      this.currentCriterionId = 0
      this.modelShow = true
      this.$refs['formItem'].resetFields()
      this.modelTitle = '新增标准'
      this.msgTitle = '新增标准数据成功'
    },
    handleEditor (params) {
      this.formItem = JSON.parse(JSON.stringify(params.row))
      this.formItem.summary = this.formItem.summary.replace(/<br\/>/g, "\r\n")
      this.currentCriterionId = params.row.id
      this.modelShow = true
      this.modelTitle = '编辑标准'
      this.msgTitle = '修改标准数据成功'
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
          console.log(_this.formItem)
          axios.request({
            url: '/api/criterion/saveCriterion',
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
    deleteData (id) {
      const _this = this
      axios.request({
        url: '/api/criterion/deleteCriterion/' + id,
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
