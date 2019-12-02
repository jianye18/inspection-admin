<style>
  .detail-data{
    border: 1px solid #e5e5e5;
    background-color: #ffffff;
    padding: 20px;
    margin-top: 10px;
  }
  .detail-con{
    padding-top: 30px;
  }
  .detail-data-title{
    font-size: 16px;
    font-weight: bold;
    text-align: center;
  }
  .detail-data .ivu-col{
    padding: 5px 0;
  }
</style>
<template>
  <div>
    <div class="detail-data detail-title">
      <div style="font-size: 16px; height: 16px; line-height: 16px; padding-left: 5px; font-weight: bold;border-left: 9px solid #1788bc;">
        搜索文章数据
      </div>
      <div class="search-con search-con-top">
        <Input @on-change="handleClear" clearable placeholder="输入文章标题搜索" class="search-input" v-model="formData.searchPhrase"/>
        <Button @click="handleSearch" class="search-btn" type="primary"><Icon type="md-search"/>&nbsp;&nbsp;搜索</Button>
      </div>
    </div>
    <div class="detail-data detail-con">
      <Row>
        <Col span="20" offset="2" class="detail-data-title">{{articleData.title}}</Col>
      </Row>
      <Row>
        <Col span="4" offset="2">文章类型：{{articleData.typeName}}</Col>
        <Col span="4" offset="6">阅读量：{{articleData.readCount}}</Col>
      </Row>
      <Row>
        <Col span="4" offset="2">作者：{{articleData.author}}</Col>
        <Col span="4" offset="6">发布时间：{{articleData.publishTime}}</Col>
      </Row>
      <Row>
        <Col span="20" offset="2" class="detail-data-content" v-html="articleData.content"></Col>
      </Row>
    </div>
  </div>
</template>
<script>
import axios from '@/libs/api.request'
import './search.less'
export default {
  name: 'ArticleView',
  data () {
    return {
      modelShow: false,
      formData: {
        searchPhrase: '',
        type: ''
      },
      currentId: 0,
      articleData: {}
    }
  },
  mounted () {
    this.currentId = this.$route.query.id
    this.getArticleById()
  },
  methods: {
    getArticleById () {
      const _this = this
      const option = {
        url: '/api/article/getArticleById/' + this.currentId,
        method: 'get'
      }
      axios.request(option).then(res => {
        if (res.data.code === 200) {
          _this.articleData = JSON.parse(JSON.stringify(res.data.data))
        }
      })
    },
    handleClear (e) {

    },
    handleSearch () {
      this.$router.push({
        name: 'article',
        params: this.formData
      })
    }
  }
}
</script>
