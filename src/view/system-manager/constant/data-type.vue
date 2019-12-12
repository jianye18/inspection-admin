<style>
  .ivu-table-cell{
    padding:  0px;
  }
</style>
<template>
  <div>
      <Card>
        <div class="search-con search-con-top">
            <Button @click="handleAddData" class="search-btn" type="primary"><Icon type="md-add"/>&nbsp;&nbsp;新增常量</Button>
            <Select v-model="formData.typeCode" style="width:200px; margin-left: 5px;" placeholder="请选择常量类别" clearable>
              <Option v-for="item in typeCodeList" :value="item.value">{{item.label}}</Option>
            </Select>
            <Input @on-change="handleClear" clearable placeholder="输入常量名搜索" class="search-input" v-model="formData.searchPhrase"/>
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
        :mask-closable="false"
        @on-visible-change="changeModalStatus">
        <Form ref="formItem" :model="formItem" :rules="ruleValidate" :label-width="80" action="">
            <FormItem label="名称" prop="name">
                <Input placeholder="请输入名称" v-model="formItem.name"/>
            </FormItem>
            <FormItem label="编码" prop="code">
              <Input placeholder="请输入名称" v-model="formItem.code"/>
            </FormItem>
            <FormItem label="类型" prop="typeCode">
              <Select v-model="formItem.typeCode">
                <Option v-for="item in typeCodeList" :value="item.value">{{item.label}}</Option>
              </Select>
            </FormItem>
            <FormItem label="排序" prop="sort">
              <Select v-model="formItem.sort">
                <Option v-for="item in 20" :value="item">{{item}}</Option>
              </Select>
            </FormItem>
            <FormItem label="首页展示" prop="isView">
              <RadioGroup v-model="formItem.isView">
                <Radio label="1">是</Radio>
                <Radio label="0">否</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="说明" prop="remark">
                <Input placeholder="请输入常量说明" v-model="formItem.remark"/>
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
  name: 'DataType',
  components: {
    Tables
  },
  data () {
    var _ths = this
    return {
      modelShow: false,
      formData: {
        pageNum: 1, // 当前页
        pageSize: 10, // 一页展示数量
        searchPhrase: '',
        typeCode: ''
      },
      typeCodeList: [],
      lawCategoryList: [],
      columns: [
        {
          title: '编码',
          align: 'center',
          key: 'code'
        },
        {
          title: '名称',
          align: 'center',
          key: 'name'
        },
        {
          title: '排序',
          align: 'center',
          key: 'sort'
        },
        {
          title: '父级',
          align: 'center',
          key: 'typeName'
        },
        {
          title: '说明',
          align: 'center',
          key: 'remark'
        },
        {
          title: '操作',
          align: 'center',
          key: 'operation',
          width: 160,
          render: function render (h, params) {
            return h('div', [h('Button', {
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
        isView: '1'
      },
      ruleValidate: {
        typeCode: [
          { required: true, message: '类型不能为空', trigger: 'blur' }
        ]
      },
      modelTitle: '',
      msgTitle: '',
      modelButtonLoading: false,
      member: '0'
    }
  },
  mounted () {
    this.getAllSystemType()
    this.getTablePageData()
  },
  watch: {
    "formItem.type": function (val) {
      let code = ''
      if (Number(val) === 1) {
        code = 'spot_check'
      }
      if (Number(val) === 2) {
        code = 'criterion'
      }
      if (Number(val) === 3) {
        code = 'law'
      }
      this.formItem.code = code
    }
  },
  methods: {
    getTablePageData () {
      const option = {
        url: '/api/system/getSystemDataPageList',
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
    getAllSystemType () {
      const option = {
        url: '/api/system/getAllSystemType',
        method: 'get'
      }
      axios.request(option).then(res => {
        this.typeCodeList = res.data.data
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
    },
    handleAddData () {
      this.formItem = {
        isView: '1'
      }
      this.modelShow = true
      this.$refs['formItem'].resetFields()
      this.modelTitle = '新增常量'
      this.msgTitle = '新增常量成功'
    },
    handleEditor (params) {
      this.formItem = JSON.parse(JSON.stringify(params.row))
      this.formItem.isView = this.formItem.isView + ''
      this.modelShow = true
      this.modelTitle = '编辑常量'
      this.msgTitle = '修改常量成功'
    },
    changeModalStatus (flag) {
      if (flag) {
        // this.getLawCategoryData()
      }
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
            url: '/api/system/saveSystemData',
            data: _this.formItem,
            method: 'post'
          }).then(res => {
            // console.log(res)
            setTimeout(function () {
              _this.modelButtonLoading = false
              if (res.data.code === 200) {
                _this.$Message.success(_this.msgTitle)
                _this.modelShow = false
                // _this.$Modal.remove();
                _this.getTablePageData()
              } else if (res.data.code === 1002) {
                _this.$Message.error(res.data.msg)
              } else {
                _this.$Message.error('网络异常，请稍后重试')
              }
            }, 1500)
          }).catch(res => {
            _this.modelButtonLoading = false
          })
        }
      })
    }
  }
}
</script>
