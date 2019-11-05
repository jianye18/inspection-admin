<template>
  <div style="padding: 24px 24px 60px 24px; background: #fff">
    <div style="font-size: 16px; height: 16px; line-height: 16px; padding-left: 5px; font-weight: bold;border-left: 9px solid #1788bc;">
      搜索标准结果
    </div>
    <div class="search-con search-con-top">
      <Select v-model="formData.publishUnit" style="width:200px" placeholder="请选择发布机构" clearable>
        <Option v-for="item in publishUnitList" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
      <Select v-model="formData.status" style="width:200px" placeholder="请选择状态" clearable>
        <Option v-for="item in statusList" :value="item.value">{{item.label}}</Option>
      </Select>
      <Input @on-change="handleClear" clearable placeholder="输入标准名称搜索" class="search-input" v-model="formData.searchPhrase"/>
      <Button @click="handleSearch" class="search-btn" type="primary"><Icon type="md-search"/>&nbsp;&nbsp;搜索</Button>
    </div>
    <tables
      ref="tables"
      editable
      search-place="top" v-model="tableData.list" :columns="columns" no-data-text="暂无相关内容，建议您检查输入内容是否正确"/>
    <div style="padding-top: 15px; float: right">
      <Page :total="tableData.total" :current="tableData.pageNum" :page-size="formData.pageSize" @on-change="changePage" show-total></Page>
    </div>
  </div>
</template>
<script>
import Tables from '_c/tables'
import axios from '@/libs/api.request'
import Global from '@/store/global'
import './list.less'
export default {
  name: 'Criterion',
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
        publishUnit: 0,
        category: '',
        type: '',
        status: ''
      },
      publishUnitList: [],
      statusList: Global.criterionStatusList,
      columns: [
        {
          title: '标准名称',
          key: 'name',
          width: 400,
          tooltip: true,
          render: function render (h, params) {
            let content = params.row.name
            return h('span', {
              class: 'table-span',
              on: {
                click: () => {
                  _this.$router.push({
                    name: 'criterionDetail',
                    query: { id: params.row.id }
                  })
                }
              }
            }, content)
          }
        },
        {
          title: '发布单位',
          key: 'publishUnitName',
          tooltip: true
        },
        {
          title: '状态',
          align: 'center',
          key: 'status',
          width: 120,
          render: function render (h, params) {
            let status = params.row.status + ''
            let content = Global.getLabelByVal(status, _this.statusList)
            return h('span', content)
          }
        },
        {
          title: '实施日期',
          align: 'center',
          width: 140,
          key: 'implementDate'
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
      this.formData.type = this.$route.params.type
      if (!this.$route.params.type) {
        this.formData.searchPhrase = this.$route.params.searchPhrase
        this.formData.publishUnit = this.$route.params.publishUnit
        this.formData.category = this.$route.params.category
        this.formData.status = this.$route.params.status
      } else {
        if (this.$route.params.category) {
          this.formData.category = this.$route.params.category
        }
      }
    }
    this.getTablePageData()
    this.getAllSystemDataTypeList()
  },
  watch: {
    '$store.getters.criterionCategory': function (val) {
      this.formData.category = val
      this.getTablePageData()
    },
    '$store.getters.criterionType': function (val) {
      this.formData.type = val
      this.getTablePageData()
    }
  },
  methods: {
    handleUploadFile () {
      this.getTablePageData()
    },
    getAllSystemDataTypeList () {
      const option = {
        url: '/system/getAllSystemDataTypeList/2',
        method: 'get'
      }
      axios.request(option).then(res => {
        this.publishUnitList = res.data.data.publishUnitList
      })
    },
    getTablePageData () {
      // console.log(this.formData)
      const option = {
        url: '/show/getCriterionPageList',
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
