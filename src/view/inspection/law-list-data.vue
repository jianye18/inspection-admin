<template>
  <div style="padding: 24px 24px 60px 24px; background: #fff">
    <div style="font-size: 16px; height: 16px; line-height: 16px; padding-left: 5px; font-weight: bold;border-left: 9px solid #1788bc;">
      搜索法规结果
    </div>
    <div class="search-con search-con-top">
      <Select v-model="formData.publishUnit" style="width:200px" placeholder="请选择发布机构" clearable>
        <Option v-for="item in publishUnitList" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
      <Select v-model="formData.source" style="width:200px" placeholder="请选择法规来源" clearable>
        <Option v-for="item in sourceList" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
      <Select v-model="formData.status" style="width:200px" placeholder="请选择状态" clearable>
        <Option v-for="item in statusList" :value="item.value">{{item.label}}</Option>
      </Select>
      <Input @on-change="handleClear" clearable placeholder="输入法规名称搜索" class="search-input" v-model="formData.searchPhrase"/>
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
  name: 'Law',
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
      sourceList: [],
      statusList: [
        {value: '1', label: '现行有效'},
        {value: '2', label: '征求意见'},
        {value: '3', label: '已经废止'},
        {value: '4', label: '未知状态'}
      ],
      columns: [
        {
          title: '法规名称',
          key: 'name',
          width: 400,
          tooltip: true,
          render: function render (h, params) {
            var content = params.row.name
            return h('span', {
              class: 'table-span',
              on: {
                click: () => {
                  _this.$router.push({
                    name: 'lawDetail',
                    query: {id: params.row.id}
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
            var content = ''
            let status = params.row.status + ''
            if (status === '1') {
              content = '现行有效'
            } else if (status === '2') {
              content = '征求意见'
            }  else if (status === '3') {
              content = '已经废止'
            } else {
              content = '未知状态'
            }
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
      if (!this.$route.params.type) {
        this.formData.searchPhrase = this.$route.params.searchPhrase
        this.formData.publishUnit = this.$route.params.publishUnit
        this.formData.category = this.$route.params.category
        this.formData.type = this.$route.params.type
        this.formData.status = this.$route.params.status
      }
    }
    this.getTablePageData()
    this.getAllSystemDataTypeList()
  },
  watch: {
    '$store.getters.lawCategory': function (val) {
      this.formData.category = val
      this.getTablePageData()
    },
    '$store.getters.lawType': function (val) {
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
        url: '/system/getAllSystemDataTypeList/3',
        method: 'get'
      }
      axios.request(option).then(res => {
        this.publishUnitList = res.data.data.publishUnitList
        this.sourceList = res.data.data.sourceList
      })
    },
    getTablePageData () {
      // console.log(this.formData)
      const option = {
        url: '/show/getLawPageList',
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
