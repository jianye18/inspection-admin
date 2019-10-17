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
    <div class="search-con search-con-top">
      <Select v-model="formData.productType" style="width:200px" placeholder="请选择产品分类" clearable>
        <Option value="" key="">全部</Option>
        <Option v-for="item in productTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
      <Select v-model="formData.institution" style="width:200px" placeholder="请选择公布机构" clearable>
        <Option value="" key="">全部</Option>
        <Option v-for="item in institutionList" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
      <Select v-model="formData.checkResult" style="width:200px" placeholder="请选择抽检结果" clearable>
        <Option value="" key="">全部</Option>
        <Option value="1" key="1">合格</Option>
        <Option value="0" key="0">不合格</Option>
      </Select>
      <Input @on-change="handleClear" clearable placeholder="输入标称生产企业/进口代理商名称/样品名称搜索" class="search-input" v-model="formData.searchPhrase"/>
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
    return {
      modelShow: false,
      formData: {
        pageNum: 1, // 当前页
        pageSize: 10, // 一页展示数量
        searchPhrase: '',
        productType: '',
        institution: '',
        checkResult: ''
      },
      productTypeList: [],
      institutionList: [],
      columns: [
        {
          title: '标称生产企业/进口代理商名称',
          align: 'center',
          key: 'producer'
        },
        {
          title: '样品名称',
          align: 'center',
          key: 'sample'
        },
        {
          title: '抽检结果',
          align: 'center',
          key: 'checkResult',
          width: 80,
          render: function render (h, params) {
            var content = ''
            if (params.row.checkResult === 1) {
              content = '合格'
            } else {
              content = '不合格'
            }
            return h('span', {
              style: {
                color: params.row.checkResult !== 1 ? 'red' : ''
              }
            }, content)
          }
        },
        {
          title: '公布日期',
          align: 'center',
          key: 'publishDate'
        }
      ],
      tableData: {
        list: [],
        pageNum: 1,
        total: 0,
        pages: 0
      },
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
        url: '/system/getAllSystemDataTypeList',
        method: 'get'
      }
      axios.request(option).then(res => {
        this.productTypeList = res.data.data.productTypeList
        this.institutionList = res.data.data.institutionList
      })
    },
    getTablePageData () {
      const option = {
        url: '/spotCheck/getSpotCheckPageList',
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
    }
  }
}
</script>
