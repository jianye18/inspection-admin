<style>
  .ivu-table-cell{
    padding:  0px;
  }
  .ivu-select{
    margin-left: 2px;
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
                <Select v-model="formData.institution" style="width:200px" placeholder="请选择公布机构" clearable>
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
      width="680px">
      <Form ref="formItem" :model="formItem" :label-width="180" action="">
        <FormItem label="标称委托企业" prop="company">
          <Input v-model="formItem.company" placeholder="请输入标称委托企业"/>
        </FormItem>
        <FormItem label="标称生产企业/进口代理商名称" prop="producer">
          <Input v-model="formItem.producer" placeholder="请输入标称生产企业/进口代理商名称"/>
        </FormItem>
        <FormItem label="被采样单位名称" prop="unit">
          <Input v-model="formItem.unit" placeholder="请输入被采样单位名称"/>
        </FormItem>
        <FormItem label="样品名称" prop="sample">
          <Input v-model="formItem.sample" placeholder="请输入样品名称"/>
        </FormItem>
        <FormItem label="包装规格" prop="specification">
          <Input v-model="formItem.specification" placeholder="请输入包装规格"/>
        </FormItem>
        <FormItem label="产品分类" prop="productType">
          <Select v-model="formItem.productType" style="width:200px" placeholder="请选择产品分类" clearable>
            <Option v-for="item in productTypeList" :value="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="产地" prop="location">
          <Input v-model="formItem.location" placeholder="请输入产地"/>
        </FormItem>
        <FormItem label="抽检结果" prop="checkResult">
          <Select v-model="formItem.checkResult" style="width:200px" placeholder="请选择抽检结果" clearable>
            <Option v-for="item in checkResultList" :value="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="不合格项目" prop="subject">
          <Input v-model="formItem.subject" placeholder="请输入不合格项目"/>
        </FormItem>
        <FormItem label="公布机构" prop="institution">
          <Input v-model="formItem.institution" placeholder="请输入公布机构"/>
        </FormItem>
        <FormItem label="公布日期" prop="publishDate">
          <DatePicker type="date" format="yyyy-MM-dd" @on-change="formItem.publishDate=$event"
                      placeholder="请选择发布日期" :value="formItem.publishDate" style="width:200px"></DatePicker>
        </FormItem>
        <FormItem label="涉嫌假冒" prop="isFake">
          <Select v-model="formItem.isFake" style="width:200px" placeholder="请选择是否涉嫌假冒" clearable>
            <Option value="是">是</Option>
            <Option value="否">否</Option>
          </Select>
        </FormItem>
        <FormItem label="来源链接" prop="sourceLink">
          <Input v-model="formItem.sourceLink" placeholder="请输入来源链接"/>
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
import Global from '@/store/global'
export default {
  name: 'SpotCheck',
  components: {
    Tables
  },
  data () {
    const _ths = this
    return {
      typeCode: 'ZJ_productType',
      modelShow: false,
      modelTitle: '查看抽检数据',
      formData: {
        pageNum: 1, // 当前页
        pageSize: 10, // 一页展示数量
        searchPhrase: '',
        productType: '',
        institution: '',
        checkResult: ''
      },
      checkResultList: Global.spotCheckStatusList,
      productTypeList: [],
      institutionList: [],
      columns: [
        {
          title: '标称委托企业',
          align: 'center',
          key: 'company',
          tooltip: true
        },
        {
          title: '标称生产企业/进口代理商名称',
          align: 'center',
          key: 'producer',
          tooltip: true
        },
        {
          title: '被采样单位名称',
          align: 'center',
          key: 'unit',
          tooltip: true
        },
        {
          title: '样品名称',
          align: 'center',
          key: 'sample',
          tooltip: true
        },
        {
          title: '包装规格',
          align: 'center',
          key: 'specification'
        },
        {
          title: '产品分类',
          align: 'center',
          key: 'productType',
          width: 80
        },
        {
          title: '产地',
          align: 'center',
          key: 'location'
        },
        {
          title: '抽检结果',
          align: 'center',
          key: 'checkResult',
          width: 80,
          render: function render (h, params) {
            let content = params.row.checkResult
            return h('span', {
              style: {
                color: content === '不合格' ? 'red' : ''
              }
            }, content)
          }
        },
        {
          title: '公布机构',
          align: 'center',
          key: 'institution'
        },
        {
          title: '公布日期',
          align: 'center',
          key: 'publishDate',
          width: 100
        },
        {
          title: '操作',
          align: 'center',
          key: 'operation',
          width: 160,
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
      msgTitle: '',
      formItem: {},
      uploadLoading: false,
      modelButtonLoading: false
    }
  },
  mounted () {
    this.getTablePageData()
    this.getAllProductType()
    this.getAllInstitution()
  },
  methods: {
    handleBeforeUpload (file) {
      const _this = this
      const fileExt = file.name.split('.').pop().toLocaleLowerCase()
      if (fileExt === 'xlsx' || fileExt === 'xls') {
        let fileFormData = new FormData()
        fileFormData.append('file', file)
        const option = {
          url: '/api/spotCheck/upload',
          data: fileFormData,
          method: 'post',
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
        axios.request(option).then(res => {
          _this.$Message.success('导入抽检数据成功')
          _this.getTablePageData()
        }).catch(res => {
          _this.uploadLoading = false
        })
      } else {
        _this.uploadLoading = false
        this.$Notice.warning({
          title: '文件类型错误',
          desc: '文件：' + file.name + '不是EXCEL文件，请选择后缀为.xlsx或者.xls的EXCEL文件。'
        })
      }
      return false
    },
    handleUploadFile () {
      this.getTablePageData()
    },
    getAllProductType () {
      const option = {
        url: '/api/spotCheck/getAllProductType',
        method: 'get'
      }
      axios.request(option).then(res => {
        this.productTypeList = res.data.data
      })
    },
    getAllInstitution () {
      const option = {
        url: '/api/spotCheck/getAllInstitution',
        method: 'get'
      }
      axios.request(option).then(res => {
        this.institutionList = res.data.data
      })
    },
    getTablePageData () {
      const option = {
        url: '/api/spotCheck/getSpotCheckPageList',
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
            url: '/api/spotCheck/saveSpotCheck',
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
    handleEditor (params) {
      this.formItem = JSON.parse(JSON.stringify(params.row))
      this.modelShow = true
      this.modelTitle = '编辑抽检'
      this.msgTitle = '修改抽检数据成功'
    },
    handleDelete (params) {
      this.msgTitle = '删除抽检数据成功'
      this.$Modal.confirm({
        title: '删除',
        content: '你确定要删除吗?',
        loading: true,
        onOk: () => {
          this.deleteData(params.row.id)
        }
      })
    },
    deleteData (id) {
      const _this = this
      const option = {
        url: '/api/spotCheck/deleteSpotCheck/' + id,
        method: 'delete'
      }
      axios.request(option).then(res => {
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
