<style>
  .ivu-table-cell{
    padding:  0px;
  }
  .ivu-select{
    margin-left: 2px;
  }
  .ivu-modal-footer {
    display: none;
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
      :mask-closable="false">
      <Form ref="formItem" :model="formItem" :label-width="180" action="">
        <FormItem label="标称委托企业" prop="company">
          <Input v-model="formItem.company" readonly/>
        </FormItem>
        <FormItem label="标称生产企业/进口代理商名称" prop="producer">
          <Input v-model="formItem.producer" readonly/>
        </FormItem>
        <FormItem label="被采样单位名称" prop="unit">
          <Input v-model="formItem.unit" readonly/>
        </FormItem>
        <FormItem label="样品名称" prop="sample">
          <Input v-model="formItem.sample" readonly/>
        </FormItem>
        <FormItem label="包装规格" prop="specification">
          <Input v-model="formItem.specification" readonly/>
        </FormItem>
        <FormItem label="产品分类" prop="productTypeName">
          <Input v-model="formItem.productTypeName" readonly/>
        </FormItem>
        <FormItem label="产地" prop="location">
          <Input v-model="formItem.location" readonly/>
        </FormItem>
        <FormItem label="抽检结果" prop="checkResultName">
          <Input v-model="formItem.checkResultName" readonly/>
        </FormItem>
        <FormItem label="不合格项目" prop="subject">
          <Input v-model="formItem.subject" readonly/>
        </FormItem>
        <FormItem label="公布机构" prop="institution">
          <Input v-model="formItem.institution" readonly/>
        </FormItem>
        <FormItem label="公布日期" prop="publishDate">
          <Input v-model="formItem.publishDate" readonly/>
        </FormItem>
        <FormItem label="涉嫌假冒" prop="isFakeName">
          <Input v-model="formItem.isFakeName" readonly/>
        </FormItem>
        <FormItem label="来源链接" prop="sourceLink">
          <Input v-model="formItem.sourceLink" readonly/>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import Tables from '_c/tables'
import axios from '@/libs/api.request'
import Global from '@/store/global'
export default {
  name: 'spot_check',
  components: {
    Tables
  },
  data () {
    const _ths = this
    return {
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
          key: 'productTypeName',
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
            let checkResult = params.row.checkResult + ''
            let content = Global.getLabelByVal(checkResult, _ths.checkResultList)
            return h('span', {
              style: {
                color: checkResult !== '1' ? 'red' : ''
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
          width: 120,
          render: function render (h, params) {
            return h('div', [h('Button', {
              props: {
                type: 'primary',
                icon: 'ios-clipboard',
                disabled: false,
                size: 'small'
              },
              style: {
                marginLeft: '10px',
                marginBottom: '5px'
              },
              on: {
                click: () => {
                  _ths.handleView(params.row)
                }
              }
            }, '查看详情')])
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
      uploadLoading: false
    }
  },
  mounted () {
    this.getTablePageData()
    this.getAllSystemDataTypeList()
  },
  methods: {
    handleBeforeUpload (file) {
      const _this = this
      const fileExt = file.name.split('.').pop().toLocaleLowerCase()
      if (fileExt === 'xlsx' || fileExt === 'xls') {
        let fileFormData = new FormData()
        fileFormData.append('file', file)
        const option = {
          url: '/spotCheck/upload',
          data: fileFormData,
          method: 'post',
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
        axios.request(option).then(res => {
          console.log(res)
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
    getAllSystemDataTypeList () {
      const option = {
        url: '/system/getAllSystemDataTypeList/1',
        method: 'get'
      }
      axios.request(option).then(res => {
        this.productTypeList = res.data.data.productTypeList
        this.institutionList = res.data.data.institutionList
      })
    },
    getTablePageData () {
      const option = {
        url: '/show/getSpotCheckPageList',
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
    handleView (data) {
      this.formItem = data
      this.formItem.isFakeName = Number(this.formItem.isFake) === 1 ? '是' : '否'
      this.formItem.checkResultName = Number(this.formItem.checkResult) === 1 ? '合格' : '不合格'
      this.modelShow = true
    }
  }
}
</script>
