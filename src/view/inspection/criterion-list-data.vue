<style>
  .ivu-table-cell{
    padding:  0px;
  }
  .ivu-select{
    margin-left: 2px;
  }
  .ivu-table-cell {
    padding-left: 10px !important;
  }
  .ivu-table-column-center .ivu-table-cell {
    padding-left: 0px !important;
  }
  .ivu-table-cell span.table-span:hover{
    color: #0b81bf;
    cursor: pointer;
  }
</style>
<template>
  <div style="padding: 24px 24px 60px 24px; background: #fff">
    <div style="font-size: 16px; height: 16px; line-height: 16px; padding-left: 5px; font-weight: bold;border-left: 9px solid #1788bc;">
      搜索标准结果
    </div>
    <div class="search-con search-con-top">
      <Select v-model="formData.publishUnit" style="width:200px" placeholder="请选择发布机构" clearable>
        <Option value="" key="">全部</Option>
        <Option v-for="item in publishUnitList" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
      <Select v-model="formData.status" style="width:200px" placeholder="请选择状态" clearable>
        <Option value="" key="">全部</Option>
        <Option v-for="item in statusList" :value="item.value">{{item.label}}</Option>
      </Select>
      <Input @on-change="handleClear" clearable placeholder="输入标准名称搜索" class="search-input" v-model="formData.searchPhrase"/>
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
export default {
  name: 'spot_check_list_data_page',
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
      publishUnitList: [],
      statusList: [
        {value: '1', label: '现行有效'},
        {value: '2', label: '即将实施'},
        {value: '3', label: '已经作废'}
      ],
      columns: [
        {
          title: '标准名称',
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
                    name: 'criterion-detail-data',
                    params: params.row
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
              content = '即将实施'
            } else {
              content = '已经作废'
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
    this.getTablePageData()
    this.getAllSystemDataTypeList()
  },
  watch: {
    '$store.getters.productType': function (val) {
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
        url: '/system/getAllSystemDataTypeList/2',
        method: 'get'
      }
      axios.request(option).then(res => {
        this.publishUnitList = res.data.data.publishUnitList
      })
    },
    getTablePageData () {
      console.log(this.formData)
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
