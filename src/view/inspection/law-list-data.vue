<style>
  .ivu-table-cell .ivu-icon-ios-search-outline:hover{
    cursor: pointer;
  }
</style>
<template>
  <div style="padding: 24px 24px 60px 24px; background: #fff">
    <div style="font-size: 16px; height: 16px; line-height: 16px; padding-left: 5px; font-weight: bold;border-left: 9px solid #1788bc;">
      搜索法规结果
    </div>
    <div class="search-con search-con-top">
      <Input @on-change="handleClear" clearable placeholder="输入法规名称搜索" class="search-input" v-model="formData.searchPhrase"/>
      <Select v-model="formData.type" style="width:120px" placeholder="请选择二级分类" clearable>
        <Option v-for="item in typeList" :value="item.value">{{ item.label }}</Option>
      </Select>
      <Select v-model="formData.publishUnit" style="width:120px" placeholder="请选择发布机构" clearable>
        <Option v-for="item in publishUnitList" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
      <Select v-model="formData.status" style="width:120px" placeholder="请选择状态" clearable>
        <Option v-for="item in statusList" :value="item.value" :key="item.value">{{item.label}}</Option>
      </Select>
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
        publishUnit: '',
        category: '',
        type: '',
        status: ''
      },
      publishUnitList: [],
      statusList: [],
      typeList: [],
      columns: [
        {
          title: '法规名称',
          key: 'name',
          render: function render (h, params) {
            let content = params.row.name
            return h('span', {
              class: 'table-span',
              style: {
                width: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              },
              domProps: {title: content},
              on: {
                click: () => {
                  _this.$router.push({
                    name: 'lawDetail',
                    query: { id: params.row.id, category: _this.formData.category }
                  })
                }
              }
            }, content)
          }
        },
        /*{
          title: '一级分类',
          align: 'center',
          width: 120,
          key: 'categoryName'
        },
        {
          title: '二级分类',
          align: 'center',
          key: 'typeName',
          width: 120,
          render: function render (h, params) {
            let typeName = params.row.typeName
            let content = '-'
            if (typeName) {
              content = typeName
            }
            return h('span', content)
          }
        },*/
        {
          title: '发布单位',
          key: 'publishUnitName',
          tooltip: true,
          width: 120
        },
        {
          title: '状态',
          align: 'center',
          key: 'statusName',
          width: 100
        },
        {
          title: '实施日期',
          align: 'center',
          width: 100,
          key: 'implementDate'
        }/*,
        {
          title: '操作',
          align: 'center',
          width: 80,
          key: 'operation',
          render: function render (h, params) {
            return h('div', [h('Icon', {
              props: {
                type: 'ios-search-outline'
              },
              on: {
                click: () => {
                  _this.$router.push({
                    name: 'lawView',
                    query: { id: params.row.id }
                  })
                }
              }
            }, '')])
          }
        } */
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
      let params = this.$route.params
      if (Number(params['mold']) === 1) {
        this.formData[params['key']] = params['value']
      } else {
        this.formData.searchPhrase = params['searchPhrase']
        this.formData.publishUnit = params['publishUnit']
        this.formData.category = params['category']
        this.formData.type = params['type']
        this.formData.status = params['status']
      }
    }
    this.getTablePageData()
    this.getAllSystemDataTypeList()
    this.getLawTypeList(this.formData.category)
  },
  watch: {
    '$store.getters.param': function (params) {
      const _this = this
      if (params['type'] === 'LW') {
        let query = params.query
        if (query.length > 0) {
          query.forEach(function (item) {
            if (item['key'] === 'category') {
              _this.getLawTypeList(item['value'])
            }
            _this.formData[item['key']] = item['value']
          })
        }
        _this.getTablePageData()
      }
    }
  },
  methods: {
    handleUploadFile () {
      this.getTablePageData()
    },
    getAllSystemDataTypeList () {
      const option = {
        url: '/api/system/getSystemDataByTypeCode/FG_publishUnit,FG_status',
        method: 'get'
      }
      axios.request(option).then(res => {
        this.publishUnitList = res.data.data['FG_publishUnit']
        this.statusList = res.data.data['FG_status']
      })
    },
    getTablePageData () {
      // console.log(this.formData)
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
    getLawTypeList (code) {
      let url = ''
      if (code) {
        url = '/api/law/getLawTypeListByCode/' + code
      } else {
        url = '/api/law/getAllLawType/'
      }
      const option = {
        url: url,
        method: 'get'
      }
      axios.request(option).then(res => {
        this.typeList = res.data.data
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
      this.formData.pageNum = 1
      this.getTablePageData()
    }
  }
}
</script>
