<style>
  .ivu-table-cell{
    padding:  0px;
  }
  .search-btn{
    margin-right: 10px;
  }
  .form_span{
    display: inline-block;
    max-width: 120px;
    padding-right: 10px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .close {
    position: absolute;
    top: 37px;
    width: 5px;
    height: 5px;
  }
  .close:before, .close:after {
    position: absolute;
    left: 5px;
    content: ' ';
    height: 10px;
    width: 2px;
    background-color: #f54040;
  }
  .close:before {
    transform: rotate(45deg);
  }
  .close:after {
    transform: rotate(-45deg);
  }
</style>
<template>
  <div>
      <Card>
        <div class="search-con search-con-top">
          <Button @click="handleAddData" class="search-btn" type="primary"><Icon type="md-add"/>&nbsp;&nbsp;新增文章</Button>
          <Select v-model="formData.typeCode" style="width:200px" placeholder="请选择文章类型" clearable>
            <Option v-for="item in typeList" :value="item.value">{{ item.label }}</Option>
          </Select>
          <Select v-model="formData.isPublish" style="width:200px" placeholder="请选择状态" clearable>
            <Option v-for="item in publishList" :value="item.value">{{item.label}}</Option>
          </Select>
          <Input @on-change="handleClear" clearable placeholder="输入文章标题搜索" class="search-input" v-model="formData.searchPhrase"/>
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
        width="820px">
        <Form ref="formItem" :model="formItem" :rules="ruleValidate" :label-width="80" action="">
            <FormItem label="标题" prop="title">
                <Input placeholder="请输入文章标题" v-model="formItem.title"/>
            </FormItem>
            <FormItem label="来源" prop="author">
              <Input placeholder="请输入文章来源" v-model="formItem.author"/>
            </FormItem>
            <FormItem label="类型" prop="typeCode">
              <Select v-model="formItem.typeCode" style="width:200px" placeholder="请选择文章分类" clearable>
                <Option v-for="item in typeList" :value="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
            <FormItem label="关键词" prop="subject" style="word-wrap: break-word">
              <Input placeholder="请输入文章关键词" v-model="subject" @on-enter="changeSubject"/>
              <span v-if="formItem.subject" v-for="item in formItem.subject" class="form_span" :title="item" style="margin-left: 5px;">
                {{item}}
                <a href="#" class="close" @click="deleteArticleSubject(item)"></a>
              </span>
            </FormItem>
            <FormItem label="发布时间" prop="publishTime">
              <DatePicker type="date" format="yyyy-MM-dd" @on-change="formItem.publishTime=$event"
                          placeholder="请选择发布时间" :value="formItem.publishTime" transfer style="width:200px"></DatePicker>
            </FormItem>
            <FormItem label="文章内容" prop="content">
              <editor ref="editor" :value="formItem.content" @on-change="handleChange"/>
            </FormItem>
            <FormItem label="相关链接" prop="link" style="word-wrap: break-word">
              <Input placeholder="请输入文章相关链接" v-model="link" @on-enter="changeLinks"/>
              <span v-if="formItem.links" v-for="item in formItem.links" class="form_span" :title="item" style="max-width: 600px;">
                {{item}}
                <a href="#" class="close" @click="deleteArticleLinks(item)" style="left: 600px;"></a>
              </span>
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
import Editor from '_c/editor'
import Global from '@/store/global'
export default {
  name: 'ArticleData',
  components: {
    Tables,
    Editor
  },
  data () {
    const _ths = this
    return {
      typeCode: 'WZ_typeCode',
      modelShow: false,
      formData: {
        pageNum: 1, // 当前页
        pageSize: 10, // 一页展示数量
        searchPhrase: '',
        isPublish: null
      },
      typeList: [],
      publishList: Global.publishList,
      columns: [
        {
          title: '标题',
          align: 'center',
          key: 'title',
          tooltip: true
        },
        {
          title: '分类',
          align: 'center',
          key: 'typeName',
          width: 80
        },
        {
          title: '作者',
          align: 'center',
          key: 'author',
          width: 120
        },
        {
          title: '阅读量',
          align: 'center',
          key: 'readCount',
          width: 100
        },
        {
          title: '发布时间',
          align: 'center',
          key: 'publishTime',
          width: 120,
          render: function render (h, params) {
            let publishTime = params.row.publishTime
            return h('span', publishTime)
          }
        },
        {
          title: '状态',
          align: 'center',
          key: 'isPublish',
          width: 80,
          render: function render (h, params) {
            let isPublish = params.row.isPublish + ''
            let content = Global.getLabelByVal(isPublish, _ths.publishList)
            return h('span', content)
          }
        },
        {
          title: '操作',
          align: 'center',
          key: 'operation',
          width: 220,
          render: function render (h, params) {
            let isPublish = params.row.isPublish + ''
            return h('div', [h('Button', {
              props: {
                type: 'error',
                icon: 'ios-trash-outline',
                disabled: false,
                size: 'small'
              },
              style: {
                marginLeft: '10px',
                marginBottom: '5px',
                display: isPublish === '1' ? 'none' : ''
              },
              on: {
                click: () => {
                  _ths.handleDelete(params)
                }
              }
            }, '删除'), h('Button', {
              props: {
                type: 'primary',
                icon: 'ios-create-outline',
                disabled: false,
                size: 'small'
              },
              style: {
                marginLeft: '10px',
                marginBottom: '5px',
                display: isPublish === '1' ? 'none' : ''
              },
              on: {
                click: () => {
                  _ths.handleEditor(params.row.id)
                }
              }
            }, '编辑'), h('Button', {
              props: {
                type: 'primary',
                icon: isPublish === '1' ? 'ios-undo-outline' : 'ios-share-alt-outline',
                disabled: false,
                size: 'small'
              },
              style: {
                marginLeft: '10px',
                marginBottom: '5px'
              },
              on: {
                click: () => {
                  _ths.handlePublish(isPublish, params.row.id)
                }
              }
            }, isPublish === '1' ? '取消发布' : '发布')])
          }
        }
      ],
      tableData: {
        list: [],
        pageNum: 1,
        total: 0,
        pages: 0
      },
      subject: '',
      link: '',
      formItem: {
        subject: [],
        links: []
      },
      uploadLoading: false,
      ruleValidate: {
        title: [
          { required: true, message: '文章标题不能为空', trigger: 'blur' }
        ],
        typeCode: [
          { required: true, message: '文章分类不能为空', trigger: 'change' }
        ],
        publishTime: [
          { required: true, message: '发布时间不能为空', trigger: 'change' }
        ],
        content: [
          { required: true, message: '文章内容不能为空', trigger: 'change' }
        ]
      },
      modelTitle: '',
      msgTitle: '',
      modelButtonLoading: false,
      currentCriterionId: 0
    }
  },
  mounted () {
    this.getAllSystemDataTypeList()
    this.getTablePageData()
  },
  methods: {
    getAllSystemDataTypeList () {
      const option = {
        url: '/api/system/getSystemDataByTypeCode/' + this.typeCode,
        method: 'get'
      }
      axios.request(option).then(res => {
        this.typeList = res.data.data['WZ_typeCode']
      })
    },
    getTablePageData () {
      const option = {
        url: '/api/article/getArticlePageList',
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
      this.formData.pageNum = 1
      this.getTablePageData()
    },
    handleChange (html, text) {
      this.formItem.content = html
    },
    changeSubject () {
      if (this.formItem.subject) {
        this.formItem.subject.push(this.subject)
      } else {
        this.formItem.subject = [this.subject]
      }
      this.subject = ''
    },
    changeLinks () {
      if (this.formItem.links) {
        this.formItem.links.push(this.link)
      } else {
        this.formItem.links = [this.link]
      }
      this.link = ''
    },
    handleAddData () {
      this.clearData();
      this.modelShow = true;
      this.$refs['formItem'].resetFields();
      this.modelTitle = '新增文章';
      this.msgTitle = '新增文章成功'
    },
    clearData () {
      this.formItem = {};
      this.$refs.editor.setHtml('')
    },
    handleEditor (id) {
      this.clearData();
      const _this = this;
      const option = {
        url: '/api/article/getArticleById/' + id,
        method: 'get'
      }
      axios.request(option).then(res => {
        if (res.data.code === 200) {
          _this.formItem = JSON.parse(JSON.stringify(res.data.data))
          _this.formItem.subject = JSON.parse(_this.formItem.subject)
          _this.formItem.links = JSON.parse(_this.formItem.links)
          _this.$refs.editor.setHtml(_this.formItem.content)
          _this.modelShow = true
          _this.modelTitle = '编辑文章'
          _this.msgTitle = '修改文章成功'
        }
      })
    },
    handleDelete (params) {
      this.msgTitle = '删除文章成功'
      this.$Modal.confirm({
        title: '删除',
        content: '你确定要删除吗?',
        loading: true,
        onOk: () => {
          this.deleteData(params.row.id)
        }
      })
    },
    handlePublish (isPublish, articleId) {
      let title = isPublish === '1' ? '取消发布' : '发布'
      let content = isPublish === '1' ? '你确定要取消发布吗?' : '你确定要发布吗?'
      let msg = isPublish === '1' ? '取消发布成功' : '发布成功'
      this.msgTitle = msg
      this.$Modal.confirm({
        title: title,
        content: content,
        loading: true,
        onOk: () => {
          this.publishArticle(articleId, isPublish === '1' ? 0 : 1)
        }
      })
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
          let postForm = JSON.parse(JSON.stringify(_this.formItem))
          postForm.subject = JSON.stringify(postForm.subject)
          postForm.links = JSON.stringify(postForm.links)
          axios.request({
            url: '/api/article/saveArticle',
            data: postForm,
            method: 'post'
          }).then(res => {
            // console.log(res)
            setTimeout(function () {
              _this.modelButtonLoading = false
              if (res.data.code === 200) {
                _this.$Message.success(_this.msgTitle)
                _this.modelShow = false
                _this.getTablePageData()
              } else {
                _this.$Message.error('网络异常，请稍后重试')
              }
            }, 1500)
          }).catch(res => {
            _this.modelButtonLoading = false
          })
        }
      })
    },
    deleteData (id) {
      const _this = this
      axios.request({
        url: '/api/article/deleteArticle/' + id,
        method: 'delete'
      }).then(res => {
        _this.$Modal.remove()
        if (res.data.code === 200) {
          _this.$Message.success(_this.msgTitle)
          _this.getTablePageData()
        } else {
          _this.$Message.error('网络异常，请稍后重试')
        }
      })
    },
    publishArticle (articleId, isPublish) {
      const _this = this
      axios.request({
        url: '/api/article/publishArticle',
        data: {
          articleId: articleId,
          isPublish: isPublish
        },
        method: 'post'
      }).then(res => {
        _this.$Modal.remove()
        if (res.data.code === 200) {
          _this.$Message.success(_this.msgTitle)
          _this.getTablePageData()
        } else {
          _this.$Message.error('网络异常，请稍后重试')
        }
      })
    },
    deleteArticleSubject (subject) {
      const _this = this
      _this.formItem.subject.forEach(function (item, index) {
        if (item === subject) {
          _this.formItem.subject.splice(index, 1)
        }
      })
    },
    deleteArticleLinks (link) {
      const _this = this
      _this.formItem.links.forEach(function (item, index) {
        if (item === link) {
          _this.formItem.links.splice(index, 1)
        }
      })
    }
  }
}
</script>
