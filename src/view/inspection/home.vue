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
    text-align: center;
    height: 110px;
    /*margin-bottom: 50px;*/
    border-top: 1px solid #f2f2f2;
    padding: 15px 180px;
  }
</style>
<template>
  <div class="layout">
    <Layout>
      <Header style="background-color: #2c96cd; height: 70px;">
        <div class="layout-logo">
          <img src="../../assets/images/logo.png" />
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
        <router-view></router-view>
      </Content>
      <Footer class="layout-footer-center">
        <div style="font-size: 18px; height: 50px; line-height: 50px;">
          <span style="padding-right: 10px;">关于我们</span>
          <span style="padding-left: 10px; border-left: 1px dashed #c0c0c0;">联系我们</span>
        </div>
        <div style="font-size: 12px; color: #e5e5e5; height: 30px; line-height: 30px;">
          版权所有  2002-2019  ICP证: 苏A2-20090288-1   苏公网安备 33010602000113号
        </div>
      </Footer>
    </Layout>
  </div>
</template>
<script>
export default {
  data () {
    return {
      menuList: [
        { value: 'main', label: '首页', path: 'main' },
        { value: 'SC', label: '抽检结果', path: 'spotCheck' },
        { value: 'CC', label: '具体标准', path: 'criterion' },
        { value: 'LW', label: '法律法规', path: 'law' },
        { value: 'FC', label: '飞检结果', path: 'flightCheck' },
        { value: 'AC', label: '文章', path: 'article' }
      ],
      activeIdx: 0
    }
  },
  created () {
    const path = this.$route.path
    if (path.indexOf('main') !== -1) {
      this.activeIdx = 0
    }
    if (path.indexOf('spotCheck') !== -1) {
      this.activeIdx = 1
    }
    if (path.indexOf('criterion') !== -1) {
      this.activeIdx = 2
    }
    if (path.indexOf('law') !== -1) {
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
        if (val === 'SC') {
          this.activeIdx = 1
        }
        if (val === 'CC') {
          this.activeIdx = 2
        }
        if (val === 'LW') {
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
        setTimeout(function () {
          _this.$router.push({
            name: path
          })
        }, 300)
      }
    }
  }
}
</script>
