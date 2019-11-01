<template>
  <div style="padding: 24px 24px 60px 24px; background: #fff">
    <div style="font-size: 16px; height: 16px; line-height: 16px; padding-left: 5px; font-weight: bold;border-left: 9px solid #1788bc;">
      搜索抽检结果
    </div>
    <div class="search-con search-con-top">
      <Select v-model="formData.institution" style="width:200px" placeholder="请选择公布机构" clearable>
        <Option v-for="item in institutionList" :value="item.label" :key="item.value">{{ item.label }}</Option>
      </Select>
      <Select v-model="formData.checkResult" style="width:200px" placeholder="请选择抽检结果" clearable>
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
      search-place="top" v-model="tableData.list" :columns="columns" no-data-text="暂无相关内容，建议您检查输入内容是否正确"/>
    <div style="padding-top: 15px; float: right">
      <Page :total="tableData.total" :current="tableData.pageNum" :page-size="formData.pageSize" @on-change="changePage" show-total></Page>
    </div>
  </div>
</template>
<script>
import Tables from '_c/tables'
import axios from '@/libs/api.request'
import './list.less'
export default {
  name: 'SpotCheck',
  components: {
    Tables
  },
  data () {
    const _this = this
    return {
      modelShow: false,
      formData: {
        pageNum: 1, // 当前页
        pageSize: 20, // 一页展示数量
        searchPhrase: '',
        productType: 0,
        institution: '',
        checkResult: ''
      },
      institutionList: [],
      columns: [
        {
          title: '标称生产企业/进口代理商名称',
          key: 'producer',
          width: 400,
          tooltip: true,
          render: function render (h, params) {
            var content = params.row.producer
            return h('span', {
              class: 'table-span',
              on: {
                click: () => {
                  _this.$router.push({
                    name: 'spotCheckDetail',
                    query: {id: params.row.id}
                  })
                }
              }
            }, content)
          }
        },
        {
          title: '样品名称',
          key: 'sample',
          tooltip: true
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
          width: 120,
          key: 'publishDate'
        }
      ],
      tableData: {
        list: [],
        pageNum: 1,
        total: 0,
        pages: 0
      }
    }
  },
  mounted () {
    if (JSON.stringify(this.$route.params) !== '{}') {
      if (!this.$route.params.type) {
        this.formData.searchPhrase = this.$route.params.searchPhrase
        this.formData.productType = this.$route.params.productType
        this.formData.institution = this.$route.params.institution
        this.formData.checkResult = this.$route.params.checkResult
      }
    }
    this.getTablePageData()
    this.getAllSystemDataTypeList()
  },
  watch: {
    '$store.getters.productType': function (val) {
      console.log(val)
      this.formData.productType = val
      this.getTablePageData()
    }
  },
  methods: {
    handleUploadFile () {
      this.getTablePageData()
    },
    getAllSystemDataTypeList () {
      const option = {
        url: '/system/getAllSystemDataTypeList/1',
        method: 'get'
      }
      axios.request(option).then(res => {
        this.institutionList = res.data.data.institutionList
      })
    },
    getTablePageData () {
      // console.log(this.formData)
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
    }
  }
}
</script>
