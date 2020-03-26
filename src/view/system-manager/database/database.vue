<style>
  .ivu-table-cell{
    padding:  0px;
  }
  .ivu-modal-footer {
    display: none;
  }
</style>
<template>
  <div>
    <Card>
      <div class="search-con search-con-top">
        <Button @click="backUp" class="search-btn" type="primary"><Icon type="md-arrow-forward"/>&nbsp;&nbsp;备份数据</Button>
        <Button @click="recover" class="search-btn" type="primary"><Icon type="md-arrow-back"/>&nbsp;&nbsp;恢复数据</Button>
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
      title="恢复数据库"
      :mask-closable="false"
      width="600px">
      <Form ref="formItem" :model="formItem" :label-width="80" action="">
        <FormItem label="恢复文件" prop="path">
          <Upload action="" :before-upload="handleBeforeUpload" accept=".sql">
            <Button icon="ios-cloud-upload-outline" :loading="uploadLoading" @click="handleUploadFile">上传文件</Button>
          </Upload>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import Tables from '_c/tables'
import axios from '@/libs/api.request'
import dateUtil from '@/utils/dateUtil'
export default {
  name: 'Database',
  components: {
    Tables,
    dateUtil
  },
  data () {
    return {
      modelShow: false,
      formItem: {},
      uploadLoading: false,
      formData: {
        pageNum: 1, // 当前页
        pageSize: 10, // 一页展示数量
        searchPhrase: ''
      },
      columns: [
        {
          title: '名称',
          align: 'center',
          key: 'name',
          width: 200
        },
        {
          title: '备注',
          align: 'center',
          key: 'remark'
        },
        {
          title: '类型',
          align: 'center',
          key: 'type',
          width: 120,
          render: function render (h, params) {
            // console.log(params.row)
            let content = ''
            let roleStatus = params.row.type + ''
            if (roleStatus === '1') {
              content = '备份'
            } else {
              content = '恢复'
            }
            return h('span', content)
          }
        },
        {
          title: '操作时间',
          align: 'center',
          key: 'createTime',
          width: 180
        }
      ],
      tableData: {
        list: [],
        pageNum: 1,
        total: 0,
        pages: 0
      },
      msgTitle: ''
    }
  },
  mounted () {
    this.getTablePageData()
  },
  methods: {
    backUp () {
      const _ths = this
      const option = {
        url: '/database/backUp',
        method: 'post',
        responseType: 'blob'
      }
      axios.request(option).then(res => {
        console.log(res)
        const content = res.data
        const blob = new Blob([content])
        const fileName = 'inspection-' + dateUtil.getCurrentFormatDate() + '-bak.sql'
        if ('download' in document.createElement('a')) { // 非IE下载
          const elink = document.createElement('a')
          elink.download = fileName
          elink.style.display = 'none'
          elink.href = URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()
          URL.revokeObjectURL(elink.href) // 释放URL 对象
          document.body.removeChild(elink)
        } else { // IE10+下载
          navigator.msSaveBlob(blob, fileName)
        }
      }).finally(res => {
        _ths.getTablePageData()
      })
    },
    getTablePageData () {
      const option = {
        url: '/database/getDatabaseBakPageList',
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
    changePage () {
      this.formData.pageNum = page
      this.getTablePageData()
    },
    recover () {
      this.formItem = {}
      this.modelShow = true
      this.msgTitle = '恢复数据库成功'
    },
    handleBeforeUpload (file) {
      const _this = this
      const fileExt = file.name.split('.').pop().toLocaleLowerCase()
      if (fileExt === 'sql') {
        let fileFormData = new FormData()
        fileFormData.append('file', file)
        const option = {
          url: '/database/recover',
          data: fileFormData,
          method: 'post',
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
        axios.request(option).then(res => {
          _this.modelShow = false
          _this.$Message.success(_this.msgTitle)
          _this.getTablePageData()
        }).catch(res => {
          _this.$Message.error('恢复数据库失败')
          _this.uploadLoading = false
        })
      } else {
        _this.uploadLoading = false
        this.$Notice.warning({
          title: '文件类型错误',
          desc: '文件：' + file.name + '不是数据库脚本。'
        })
      }
      return false
    },
    handleUploadFile () {
      // this.getTablePageData()
    }
  }
}
</script>
