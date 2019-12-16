<style scoped>
  .layout{
    /*border: 1px solid #d7dde4;*/
    background: #f5f7f9;
    position: relative;
    /*border-radius: 4px;*/
    overflow: hidden;
    max-height: calc(100vh);
    overflow-y: auto
  }
  .layout-logo{
    width: 300px;
    height: 30px;
    /*background: #5b6270;*/
    border-radius: 3px;
    float: left;
    position: relative;
    /*top: 4px;*/
    left: 110px;
    font-size: 36px;
    color: #ffffff;
  }
  .layout-logo:hover{
    cursor: pointer;
  }
  .layout-nav{
    /*width: 500px;*/
    margin-left: 480px;
  }
  .layout-nav ul{
    list-style: none;
  }
  .layout-nav ul li{
    text-align: center;
    color: #ffffff;
    font-size: 14px;
    width: 105px;
    line-height: 70px;
    float: left;
  }
  .layout-nav ul li:hover{
    background-color: #0b81bf;
    cursor: pointer;
  }
  .layout-nav ul li.active_class{
    background-color: #0b81bf;
  }
  .layout-footer-center{
    margin-top: 20px;
    background: #fff;
    /*text-align: center;*/
    height: 200px;
    /*margin-bottom: 50px;*/
    border-top: 1px solid #f2f2f2;
    padding: 15px 180px 0px 180px;
  }
  .footer-link{
    height: 40px;
    line-height: 40px;
    background-color: #f2f2f2;
  }
  .footer-link-title{
    margin-left: 10px;
    font-weight: bold;
  }
  .footer-link-content{
    margin-left: 20px;
    color: #4a4a4a;
  }
  .footer-link-content:hover{
    color: #2d8cf0;
  }
  .web-about{
    width: 100%;
    height: 140px;
  }
  .footer_content{
    border-left: 1px ridge #e5e5e5;
    border-right: 1px ridge #e5e5e5;
    height: 140px;
  }
  .footer_content p{
    padding: 15px 0 0 10px;
  }
</style>
<template>
  <div class="layout">
    <Layout>
      <Header style="background-color: #2c96cd; height: 70px;">
        <div class="layout-logo" @click="toHome">
          <img src="../../assets/images/logo.png" style="width: 200px; margin-top: 10px;"/>
        </div>
        <div class="layout-nav">
          <ul>
            <li v-for="(item, idx) in menuList"
                :key="item.value"
                :class="idx === activeIdx ? 'active_class' : ''"
                @click="changeMenu(item.value, item.path, idx)">
              {{item.label}}
            </li>
          </ul>
        </div>
      </Header>
      <Content>
        <router-view :key="key"></router-view>
      </Content>
      <Footer class="layout-footer-center">
        <div class="footer-link">
          <span class="footer-link-title"><Icon type="ios-link" />友情链接：</span>
          <a class="footer-link-content" target="view_window" v-for="item in linkList" :key="item.id" :href="item.path" >{{item.name}}</a>
        </div>
        <div class="web-about">
          <Row>
            <Col span="18" class="footer_content">
              <p><Icon type="logo-windows" />Copyright©叶竹洪博客︱苏ICP备17037083号</p>
              <p><Icon type="md-contact" />手机 / 微信：15850584156 | 网站纠错请邮件：22521453@qq.com</p>
              <p><Icon type="md-funnel" />您是本站第{{personalNum}}位访客</p>
            </Col>
            <Col span="6" style="border-right: 1px ridge #e5e5e5;">
              <p style="margin-left: 30px; margin-top: 15px;">欢迎关注我们</p>
              <img src="../../assets/images/gongzhonghao.jpg" style="margin-left: 25px; width: 102px; height: 102px;" />
            </Col>
          </Row>
        </div>
      </Footer>
    </Layout>
  </div>
</template>
<script>
import axios from '@/libs/api.request'
export default {
  data () {
    return {
      menuList: [
        { value: 'main', label: '首页', path: 'main' },
        { value: 'LW', label: '法规', path: 'law' },
        { value: 'CC', label: '标准', path: 'criterion' },
        { value: 'SC', label: '抽检数据', path: 'spotCheck' },
        { value: 'FC', label: '监督检查', path: 'flightCheck' },
        { value: 'AC', label: '文章', path: 'article' }
      ],
      activeIdx: 0,
      linkList: [],
      personalNum: 0
    }
  },
  computed: {
    key() {
      return this.$route.name !== undefined? this.$route.name +new Date(): this.$route +new Date()
    }
  },
  created () {
    this.getVisitorCount()
    this.getLinkViewList()
    const path = this.$route.path
    if (path.indexOf('main') !== -1) {
      this.activeIdx = 0
    }
    if (path.indexOf('law') !== -1) {
      this.activeIdx = 1
    }
    if (path.indexOf('criterion') !== -1) {
      this.activeIdx = 2
    }
    if (path.indexOf('spotCheck') !== -1) {
      this.activeIdx = 3
    }
    if (path.indexOf('flightCheck') !== -1) {
      this.activeIdx = 4
    }
    if (path.indexOf('article') !== -1) {
      this.activeIdx = 5
    }
  },
  watch: {
    '$store.getters.type': function (val) {
      if (val) {
        if (val === 'main') {
          this.activeIdx = 0
        }
        if (val === 'LW') {
          this.activeIdx = 1
        }
        if (val === 'CC') {
          this.activeIdx = 2
        }
        if (val === 'SC') {
          this.activeIdx = 3
        }
        if (val === 'FC') {
          this.activeIdx = 4
        }
        if (val === 'AC') {
          this.activeIdx = 5
        }
      }
    }
  },
  methods: {
    changeMenu (val, path, idx) {
      let _this = this
      if (_this.activeIdx !== idx) {
        this.$store.dispatch('CreateType', val)
        _this.activeIdx = idx
      } else {
        let queryArr = []
        if (val === 'LW') {
          queryArr = [{key: 'category', value: ''}, {key: 'type', value: ''}]
        }
        if (val === 'CC') {
          queryArr = [{key: 'category', value: ''}]
        }
        if (val === 'SC') {
          queryArr = [{key: 'productType', value: ''}]
        }
        if (val === 'FC') {
          queryArr = [{key: 'type', value: ''}]
        }
        if (val === 'AC') {
          queryArr = [{key: 'typeCode', value: ''}]
        }
        this.$store.dispatch('CreateParam', {type: val, query: queryArr})
      }
      setTimeout(function () {
        _this.$router.push({
          name: path
        })
      }, 300)
    },
    getLinkViewList () {
      let _this = this
      const option = {
        url: '/api/show/getLinkViewList',
        method: 'get'
      }
      axios.request(option).then(res => {
        _this.linkList = res.data.data
      })
    },
    toHome () {
      this.activeIdx = 0
      this.$store.dispatch('CreateType', 'main')
      this.$router.push({
        name: 'main'
      })
    },
    getVisitorCount () {
      const _this = this
      const option = {
        url: '/api/visitor/getVisitorCount/2',
        method: 'get'
      }
      axios.request(option).then(res => {
        if (res.data.code === 200) {
          _this.personalNum = res.data.data
        }
      })
    }
  }
}
</script>
