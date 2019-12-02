<style>
  .ivu-table-cell{
    padding:  0px;
  }
</style>
<template>
  <div>
      <Card>
        <div class="search-con search-con-top">
          <Select v-model="formData.type" style="width:200px" placeholder="请选择类型" clearable>
            <Option v-for="item in typeList" :value="item.value">{{item.label}}</Option>
          </Select>
          <Input @on-change="handleClear" clearable placeholder="输入用户名或描述搜索" class="search-input" v-model="formData.searchPhrase"/>
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
  </div>
</template>
<script>
import Tables from '_c/tables'
import axios from '@/libs/api.request'
export default {
  name: 'UserLog',
  components: {
    Tables
  },
  data () {
    return {
      formData: {
        pageNum: 1, // 当前页
        pageSize: 10, // 一页展示数量
        searchPhrase: ''
      },
      typeList:[
        {
          value: '登录',
          label: '登录'
        },
        {
          value: '保存',
          label: '保存'
        },
        {
          value: '修改',
          label: '修改'
        },
        {
          value: '查询',
          label: '查询'
        },
        {
          value: '删除',
          label: '删除'
        }
      ],
      columns: [
        {
          title: '操作人',
          align: 'center',
          key: 'userName'
        },
        {
          title: '描述',
          align: 'center',
          key: 'description'
        },
        {
          title: 'IP',
          align: 'center',
          key: 'ip'
        },
        {
          title: '类型',
          align: 'center',
          key: 'type'
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
  },
  methods: {
    getTablePageData () {
      const option = {
        url: '/userLog/getUserLogPageList',
        data: this.formData,
        method: 'post'
      }
      axios.request(option).then(res => {
        console.log(res)
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
